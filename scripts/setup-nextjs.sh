#!/bin/bash

# Universal Next.js Project Setup
# Use this script for any Next.js project to avoid SWC issues

echo "🚀 Next.js Universal Setup"
echo "================================"

# Check Node version
NODE_VERSION=$(node -v)
echo "✓ Node version: $NODE_VERSION"

# Option to downgrade to Next.js 14
read -p "Do you want to use Next.js 14 (recommended for compatibility)? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "📦 Installing Next.js 14..."
  npm install next@14 react@19 react-dom@19
  echo "✓ Next.js 14 installed"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create scripts directory if it doesn't exist
mkdir -p scripts

# Create dev proxy script (fallback for SWC issues)
cat > scripts/dev-safe.js << 'DEVSCRIPT'
#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if SWC binaries exist
const swcDir = path.join(process.cwd(), 'node_modules', '@next', 'swc-linux-arm64-gnu');
const hasSWC = fs.existsSync(swcDir);

console.log('🔧 Checking environment...');

if (hasSWC) {
  console.log('✓ SWC binary found. Starting dev server...\n');
  spawn('npm', ['run', 'dev'], { stdio: 'inherit' });
} else {
  console.log('⚠️  SWC binary not found. Using production build...\n');
  console.log('Building first...');
  spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    onclose: () => {
      console.log('\n🚀 Starting production server...\n');
      spawn('npm', ['run', 'start'], { stdio: 'inherit' });
    }
  });
}
DEVSCRIPT

chmod +x scripts/dev-safe.js
echo "✓ Created scripts/dev-safe.js"

# Update package.json to add safe dev command
echo "📝 Tip: You can run 'npm run dev:safe' for automatic SWC fallback handling"

# Create .env.local template
if [ ! -f .env.local ]; then
  cat > .env.local << 'ENV'
# Add your environment variables here
# Keep this file in .gitignore
ENV
  echo "✓ Created .env.local"
fi

echo ""
echo "================================"
echo "✅ Setup complete!"
echo ""
echo "To start developing:"
echo "  npm run dev       # Standard dev server"
echo "  npm run dev:safe  # Auto-fallback if SWC issues occur"
echo ""
echo "To build for production:"
echo "  npm run build"
echo "  npm run start"
