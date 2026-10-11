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
  cp "$DATABASE_FILE" "$BACKUP_DIRECTORY/prod-$(date -u +%Y%m%dT%H%M%SZ).db"
  echo "Database backup created."
fi

# Apply additive Prisma changes. A destructive change now fails deployment
# instead of being silently accepted.
echo "Deploying Prisma Schema..."
npx prisma db push

echo "Starting Next.js server..."
exec node server.js
