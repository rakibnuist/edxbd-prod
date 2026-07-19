#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting Next.js Docker Entrypoint..."

# Apply Prisma schema directly to the deployed database
echo "Deploying Prisma Schema..."
npx prisma db push --accept-data-loss

echo "Starting Next.js server..."
exec node server.js
