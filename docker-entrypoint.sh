#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting Next.js Docker Entrypoint..."

# Keep a recoverable copy before any additive schema synchronization. The
# database directory is a persistent host-mounted volume in docker-compose.
DATABASE_FILE="/app/prisma/data/prod.db"
if [ -f "$DATABASE_FILE" ]; then
  BACKUP_DIRECTORY="/app/prisma/data/backups"
  mkdir -p "$BACKUP_DIRECTORY"
  chmod 700 "$BACKUP_DIRECTORY"
  BACKUP_PASS="${BACKUP_ENCRYPTION_KEY:-${SETTINGS_ENCRYPTION_KEY:-${JWT_SECRET:-}}}"
  BACKUP_STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
  if [ -n "$BACKUP_PASS" ]; then
    BACKUP_OUT="$BACKUP_DIRECTORY/prod-${BACKUP_STAMP}.db.enc"
    (
      umask 077
      export BACKUP_PASS
      openssl enc -aes-256-cbc -pbkdf2 -iter 100000 -salt \
        -pass env:BACKUP_PASS -in "$DATABASE_FILE" -out "$BACKUP_OUT"
    )
    echo "Encrypted database backup created."
  else
    BACKUP_OUT="$BACKUP_DIRECTORY/prod-${BACKUP_STAMP}.db"
    (umask 077 && cp "$DATABASE_FILE" "$BACKUP_OUT")
    echo "Database backup created."
  fi
  # Retain only the 5 most recent startup backups to limit sensitive data sprawl.
  ls -1t "$BACKUP_DIRECTORY"/prod-* 2>/dev/null | tail -n +6 | while IFS= read -r old_backup; do
    [ -n "$old_backup" ] && rm -f "$old_backup"
  done
fi

# Apply additive Prisma changes. A destructive change now fails deployment
# instead of being silently accepted.
echo "Deploying Prisma Schema..."
npx prisma db push

echo "Seeding production database..."
node scripts/seed-production-db.mjs

# Provision an independent per-boot revalidation secret when none is
# supplied via .env so cache warming never reuses JWT_SECRET.
if [ -z "${REVALIDATE_SECRET:-}" ]; then
  export REVALIDATE_SECRET="$(openssl rand -base64 36)"
fi

# The image is built without a database, so prerendered pages start empty.
# Once the server is up, re-render them from the live database (background).
node docker-warm-cache.mjs &

echo "Starting Next.js server..."
exec node server.js
