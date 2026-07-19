#!/bin/bash

# Universal Next.js Local Runner
# Works with any Next.js project, no SWC/internet needed

set -e

echo "🚀 Next.js Local Runner"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get project name
PROJECT_NAME=$(basename "$(pwd)")
echo "📁 Project: $PROJECT_NAME"

# Check if .next exists
if [ ! -d ".next" ]; then
  echo -e "${YELLOW}⚠️  .next folder not found${NC}"
  echo "   Building project..."

  # Try npm run build with offline flag
  SKIP_ENV_VALIDATION=true npm run build 2>&1 | head -50

  if [ ! -d ".next" ]; then
    echo -e "${RED}❌ Build failed${NC}"
    echo "   Make sure you ran: npm install"
    exit 1
  fi
  echo -e "${GREEN}✓ Build complete${NC}"
fi

# Check for custom server.js
if [ -f "server.js" ]; then
  echo -e "${GREEN}✓ Found server.js${NC}"
  PORT=${PORT:-3000}
  echo "   Starting on port $PORT..."
  node server.js
else
  echo -e "${RED}❌ server.js not found${NC}"
  echo "   Copy server.js from: https://github.com/yourusername/nextjs-local"
  exit 1
fi
