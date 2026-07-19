#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting Next.js Docker Entrypoint..."

# Apply Prisma migrations directly using the deployed database
echo "Deploying Prisma Migrations..."
npx prisma migrate deploy

echo "Starting Next.js server..."
exec node server.js
