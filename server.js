#!/usr/bin/env node

/**
 * Universal Next.js Local Server
 * Runs any Next.js project without SWC dependency
 * Works offline, no internet required
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const NEXT_DIR = path.join(PROJECT_ROOT, '.next');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const PAGES_DIR = path.join(PROJECT_ROOT, 'pages');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

// Helper: Read file safely
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath);
  } catch (err) {
    return null;
  }
}

// Helper: Get MIME type
function getMimeType(ext) {
  return MIME_TYPES[ext.toLowerCase()] || 'application/octet-stream';
}

// Helper: Check if path is directory
function isDirectory(filePath) {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

// Serve static files from public
function servePublic(pathname, res) {
  const filePath = path.join(PUBLIC_DIR, pathname);

  // Security: prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    return null;
  }

  if (fs.existsSync(filePath)) {
    if (isDirectory(filePath)) {
      const indexPath = path.join(filePath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return readFile(indexPath);
      }
    } else {
      return readFile(filePath);
    }
  }
  return null;
}

// Serve from .next/static
function serveNextStatic(pathname, res) {
  const filePath = path.join(NEXT_DIR, 'static', pathname.slice('/_next/static'.length));

  if (!filePath.startsWith(NEXT_DIR)) {
    return null;
  }

  return readFile(filePath);
}

// Serve from .next/server (pre-built pages)
function serveNextPage(pathname) {
  // Try .next/server/app/page.js first (App Router)
  let filePath = path.join(NEXT_DIR, 'server', 'app', pathname === '/' ? 'page.js' : `${pathname}/page.js`);

  if (!fs.existsSync(filePath)) {
    // Try .next/server/pages (Pages Router)
    filePath = path.join(NEXT_DIR, 'server', 'pages', pathname === '/' ? 'index.js' : `${pathname}.js`);
  }

  if (fs.existsSync(filePath)) {
    return filePath;
  }

  return null;
}

// Simple HTML response for development
function sendHTML(res, content, statusCode = 200) {
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(content);
}

// Request handler
const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;
  const ext = path.extname(pathname);

  // Set CORS headers for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve _next/static files
  if (pathname.startsWith('/_next/static/')) {
    const content = serveNextStatic(pathname, res);
    if (content) {
      res.writeHead(200, { 'Content-Type': getMimeType(ext) });
      res.end(content);
      return;
    }
  }

  // Serve public files
  if (pathname.startsWith('/') && !pathname.startsWith('/_')) {
    const content = servePublic(pathname, res);
    if (content) {
      res.writeHead(200, { 'Content-Type': getMimeType(ext) });
      res.end(content);
      return;
    }
  }

  // Try to serve pre-built Next.js page
  const pageFile = serveNextPage(pathname);
  if (pageFile) {
    try {
      const content = readFile(pageFile);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
      return;
    } catch (err) {
      console.error('Error serving page:', err.message);
    }
  }

  // 404 page
  sendHTML(res, `
    <!DOCTYPE html>
    <html>
      <head>
        <title>404 - Not Found</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f1f5f9;
          }
          .container {
            max-width: 600px;
            margin: 100px auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          h1 { color: #e11d48; margin: 0 0 10px; }
          p { color: #64748b; margin: 10px 0; }
          a { color: #0ea5e9; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>404 - Page Not Found</h1>
          <p>Path: <code>${pathname}</code></p>
          <p><a href="/">← Go Home</a></p>
          <hr>
          <p style="color: #94a3b8; font-size: 12px;">
            If this is a dynamic route, run: <code>npm run build</code>
          </p>
        </div>
      </body>
    </html>
  `, 404);
});

// Start server
server.listen(PORT, HOST, () => {
  console.log(`\n🚀 Next.js Local Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📍 URL:      http://localhost:${PORT}`);
  console.log(`📁 Project:  ${PROJECT_ROOT}`);
  console.log(`✓ Running offline - no internet needed`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  // Check if .next exists
  if (!fs.existsSync(NEXT_DIR)) {
    console.log(`⚠️  Warning: .next folder not found`);
    console.log(`   Run: npm run build\n`);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use`);
    console.error(`   Try: PORT=3001 node server.js\n`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 Server shutting down...');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});
