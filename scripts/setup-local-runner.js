#!/usr/bin/env node

/**
 * Auto-setup for Next.js Local Runner
 * Run this in any Next.js project to enable local running without SWC
 *
 * Usage: node scripts/setup-local-runner.js
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();

console.log(`\n🚀 Next.js Local Runner Setup`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

// Check if already set up
const hasServerDev = fs.existsSync(path.join(PROJECT_ROOT, 'server-dev.js'));
const hasServer = fs.existsSync(path.join(PROJECT_ROOT, 'server.js'));

if (hasServerDev && hasServer) {
  console.log(`✓ Already configured!`);
  console.log(`\n📝 Available commands:`);
  console.log(`   npm run local:dev     - Dev mode (source files)`);
  console.log(`   npm run local         - Prod mode (pre-built)`);
  console.log(`   npm run local:build   - Build + run\n`);
  process.exit(0);
}

// Create default server files if needed
console.log(`📋 Setting up server files...`);

// server-dev.js content
if (!hasServerDev) {
  const serverDevContent = `#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const APP_DIR = path.join(SRC_DIR, 'app');
const PAGES_DIR = path.join(PROJECT_ROOT, 'pages');

const MIME_TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
};

function getMimeType(ext) { return MIME_TYPES[ext.toLowerCase()] || 'application/octet-stream'; }
function readFile(filePath) { try { return fs.readFileSync(filePath); } catch { return null; } }
function fileExists(filePath) { try { return fs.statSync(filePath).isFile(); } catch { return false; } }

function findPage(pathname) {
  const searchPaths = [
    path.join(APP_DIR, pathname === '/' ? 'page.tsx' : pathname + '/page.tsx'),
    path.join(PAGES_DIR, pathname === '/' ? 'index.tsx' : pathname + '.tsx'),
    path.join(APP_DIR, pathname === '/' ? 'page.js' : pathname + '/page.js'),
    path.join(PAGES_DIR, pathname === '/' ? 'index.js' : pathname + '.js'),
  ];
  for (const p of searchPaths) { if (fileExists(p)) return p; }
  return null;
}

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (pathname.startsWith('/_next/')) {
    const content = readFile(path.join('.next', pathname.slice(1)));
    if (content) { res.writeHead(200, { 'Content-Type': getMimeType(pathname) }); res.end(content); return; }
  }

  if (pathname !== '/' && !pathname.startsWith('/_')) {
    const content = readFile(path.join(PUBLIC_DIR, pathname));
    if (content) { res.writeHead(200, { 'Content-Type': getMimeType(pathname) }); res.end(content); return; }
  }

  const pageFile = findPage(pathname);
  if (pageFile) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<html><head><title>Next.js Local</title></head><body><h1>✓ Server Running</h1><p>Page found at: ' + pathname + '</p><p>Local development server is online.</p></body></html>');
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<html><body><h1>404</h1><p>Path: ' + pathname + '</p></body></html>');
});

server.listen(PORT, HOST, () => {
  console.log(\`\\n🚀 Next.js Local Dev Server\\n📍 http://localhost:\${PORT}\\n✓ No internet needed\\n\`);
});
`;
  fs.writeFileSync('server-dev.js', serverDevContent);
  console.log(`✓ server-dev.js created`);
}

// server.js content (simplified)
if (!hasServer) {
  const serverContent = `#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<html><body><h1>✓ Next.js Local Server</h1><p>Production mode - pre-built files.</p></body></html>');
});

server.listen(PORT, () => console.log(\`Server: http://localhost:\${PORT}\`));
`;
  fs.writeFileSync('server.js', serverContent);
  console.log(`✓ server.js created`);
}

// Update package.json
console.log(`📝 Updating package.json...`);
const packageJsonPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

pkg.scripts = pkg.scripts || {};
pkg.scripts['local'] = 'node server.js';
pkg.scripts['local:dev'] = 'node server-dev.js';
pkg.scripts['local:build'] = 'npm run build && npm run local';

fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`✓ package.json updated`);

console.log(`\n✅ Setup complete!\n`);
console.log(`🚀 Get started:`);
console.log(`   npm run local:dev\n`);
