import crypto from 'node:crypto';

const ENVELOPE_PREFIX = 'enc:v1:';
const IV_BYTES = 12;
const TAG_BYTES = 16;
const DEV_FALLBACK_KEY_MATERIAL = 'dev-only-insecure-settings-key-do-not-use-in-production';

function getEncryptionKey(): Buffer {
  const dedicatedKey = process.env.SETTINGS_ENCRYPTION_KEY?.trim();
  if (dedicatedKey && dedicatedKey.length >= 32) {
    return crypto.createHash('sha256').update(`edxbd:settings-key:v1:${dedicatedKey}`).digest();
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length >= 32) {
    return crypto.createHash('sha256').update(`edxbd:settings:v1:${jwtSecret}`).digest();
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'SETTINGS_ENCRYPTION_KEY or JWT_SECRET (32+ chars) is required in production to protect sensitive settings.'
    );
  }

  return crypto.createHash('sha256').update(DEV_FALLBACK_KEY_MATERIAL).digest();
}

export function isEncryptedSecret(value: string): boolean {
  return value.startsWith(ENVELOPE_PREFIX);
}

/**
 * Encrypt sensitive configuration values (e.g., Meta CAPI access token) at rest
 * in SQLite using authenticated AES-256-GCM encryption.
 */
export function encryptSecret(plaintext: string): string {
  const trimmed = plaintext.trim();
  if (!trimmed) return '';
  // Normalize first in case an already-encrypted string is passed back through saveSettings.
  const canonical = isEncryptedSecret(trimmed) ? decryptSecret(trimmed) : trimmed;
  if (!canonical) return '';

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(canonical, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${ENVELOPE_PREFIX}${iv.toString('base64')}:${authTag.toString('base64')}:${ciphertext.toString('base64')}`;
}

/**
 * Decrypt `enc:v1:...` secrets stored in SQLite. Legacy plaintext rows remain
 * readable until next save so existing deployments keep working across upgrades.
 */
export function decryptSecret(stored: string | null | undefined): string {
  if (!stored) return '';
  const trimmed = stored.trim();
  if (!trimmed) return '';
  if (!isEncryptedSecret(trimmed)) {
    return trimmed;
  }

  const parts = trimmed.slice(ENVELOPE_PREFIX.length).split(':');
  if (parts.length !== 3) {
    console.warn('Malformed encrypted setting payload encountered.');
    return '';
  }

  try {
    const [ivB64, tagB64, dataB64] = parts;
    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(tagB64, 'base64');
    const ciphertext = Buffer.from(dataB64, 'base64');
    if (iv.length !== IV_BYTES || authTag.length !== TAG_BYTES || ciphertext.length === 0) {
      console.warn('Invalid encrypted setting envelope lengths.');
      return '';
    }

    const decipher = crypto.createDecipheriv('aes-256-gcm', getEncryptionKey(), iv);
    decipher.setAuthTag(authTag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return plaintext.toString('utf8');
  } catch {
    console.warn('Encrypted setting could not be decrypted with the active server key.');
    return '';
  }
}
