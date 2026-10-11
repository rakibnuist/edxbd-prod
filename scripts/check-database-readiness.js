require('dotenv/config');

const fs = require('fs');
const path = require('path');

const databaseUrl = process.env.DATABASE_URL || '';
const production = process.env.NODE_ENV === 'production';
const failures = [];

if (!databaseUrl) failures.push('DATABASE_URL is not configured.');

if (databaseUrl.startsWith('file:')) {
  const configuredPath = databaseUrl.slice('file:'.length);
  const resolved = path.resolve(configuredPath);
  if (production && !path.isAbsolute(configuredPath)) failures.push('Production SQLite must use an absolute path on the persistent volume.');
  if (production && (resolved.startsWith('/tmp/') || resolved.startsWith('/app/.next/'))) failures.push('Production SQLite cannot use a temporary or build directory.');
  const directory = path.dirname(resolved);
  try {
    fs.accessSync(directory, fs.constants.R_OK | fs.constants.W_OK);
  } catch {
    failures.push(`Database directory is not readable and writable: ${directory}`);
  }
}

if (failures.length) {
  console.error(`Database readiness failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Database readiness passed: the configured location is persistent and writable.');
