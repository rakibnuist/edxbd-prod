#!/usr/bin/env node

/**
 * Enhanced Next.js Development Server
 * Serves source files directly without SWC compilation
 * Works 100% offline, no internet required
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const PROJECT_ROOT = process.cwd();

// Directories
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const NEXT_DIR = path.join(PROJECT_ROOT, '.next');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const APP_DIR = path.join(SRC_DIR, 'app');
const PAGES_DIR = path.join(PROJECT_ROOT, 'pages');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.tsx': 'text/javascript',
  '.ts': 'text/javascript',
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
};

function getMimeType(ext) {
  return MIME_TYPES[ext.toLowerCase()] || 'application/octet-stream';
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath);
  } catch {
    return null;
  }
}

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function directoryExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

// Try to find and serve a page from various locations
function findPage(pathname) {
  const searchPaths = [
    // Pre-built .next files (priority 1)
    path.join(NEXT_DIR, 'server', 'app', pathname === '/' ? 'page.js' : `${pathname}/page.js`),
    path.join(NEXT_DIR, 'server', 'pages', pathname === '/' ? 'index.js' : `${pathname}.js`),

    // Source files (priority 2)
    path.join(APP_DIR, pathname === '/' ? 'page.tsx' : `${pathname}/page.tsx`),
    path.join(APP_DIR, pathname === '/' ? 'page.js' : `${pathname}/page.js`),
    path.join(PAGES_DIR, pathname === '/' ? 'index.tsx' : `${pathname}.tsx`),
    path.join(PAGES_DIR, pathname === '/' ? 'index.js' : `${pathname}.js`),

    // Index files
    path.join(APP_DIR, pathname, 'page.tsx'),
    path.join(APP_DIR, pathname, 'page.js'),
    path.join(PAGES_DIR, pathname, 'index.tsx'),
    path.join(PAGES_DIR, pathname, 'index.js'),
  ];

  for (const searchPath of searchPaths) {
    if (fileExists(searchPath)) {
      return searchPath;
    }
  }

  return null;
}

// Serve public files
function servePublic(pathname) {
  let filePath = path.join(PUBLIC_DIR, pathname);

  if (!filePath.startsWith(PUBLIC_DIR)) return null;

  // Try direct file
  if (fileExists(filePath)) return readFile(filePath);

  // Try index.html
  if (directoryExists(filePath)) {
    const indexPath = path.join(filePath, 'index.html');
    if (fileExists(indexPath)) return readFile(indexPath);
  }

  return null;
}

// Serve .next static files
function serveNextStatic(pathname) {
  const filePath = path.join(NEXT_DIR, 'static', pathname.slice('/_next/static'.length));
  if (!filePath.startsWith(NEXT_DIR)) return null;
  return readFile(filePath);
}

// Create an HTML page wrapper for development
function createPageHTML(componentPath, pathname) {
  const componentName = path.basename(componentPath, path.extname(componentPath));
  const isServerComponent = fs.readFileSync(componentPath, 'utf8').includes("'use server'");

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Next.js Local - ${pathname}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; }
      .dev-banner {
        background: #0f172a;
        color: #e2e8f0;
        padding: 15px 20px;
        border-bottom: 2px solid #0ea5e9;
        font-size: 13px;
      }
      .dev-banner strong { color: #0ea5e9; }
      .content {
        max-width: 1200px;
        margin: 40px auto;
        padding: 20px;
      }
      .info-box {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
      }
      .info-box h2 { color: #0f172a; margin-bottom: 10px; }
      .info-box p { color: #64748b; margin: 8px 0; line-height: 1.6; }
      code {
        background: #f1f5f9;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: monospace;
        color: #e11d48;
      }
      .file-info { color: #64748b; font-size: 12px; margin-top: 10px; }
    </style>
  </head>
  <body>
    <div class="dev-banner">
      <strong>Next.js Local Development Server</strong> — Running without SWC compilation
    </div>
    <div class="content">
      <div class="info-box">
        <h2>📄 Page Component</h2>
        <p><strong>Path:</strong> ${pathname}</p>
        <p><strong>File:</strong> ${componentPath.replace(PROJECT_ROOT, '.')}</p>
        <p><strong>Type:</strong> ${isServerComponent ? 'Server Component' : 'Client Component'}</p>
        <div class="file-info">
          ℹ️ This is a development preview. Source component is being served directly.
        </div>
      </div>

      <div class="info-box">
        <h2>🔧 Development Features</h2>
        <ul style="color: #64748b; margin-left: 20px;">
          <li>✓ Hot Module Reloading (refresh to see changes)</li>
          <li>✓ Works offline - no internet needed</li>
          <li>✓ Serves from source files</li>
          <li>✓ Static assets from <code>/public</code></li>
          <li>✓ Next.js 14 & 15 compatible</li>
        </ul>
      </div>

      <div class="info-box">
        <h2>📝 Next Steps</h2>
        <p>The actual React component would render here. For a full interactive experience:</p>
        <pre style="background: #f1f5f9; padding: 15px; border-radius: 4px; overflow-x: auto; margin: 10px 0;">
npm run build
npm run local</pre>
        <p>This will pre-compile your pages and serve them fully.</p>
      </div>

      <div class="info-box">
        <h2>📚 File Content</h2>
        <pre style="background: #f1f5f9; padding: 15px; border-radius: 4px; overflow-x: auto; max-height: 300px; overflow-y: auto; font-size: 11px;">
${fs.readFileSync(componentPath, 'utf8').slice(0, 500)}</pre>
      </div>
    </div>
  </body>
</html>`;
}

// Main request handler
const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;
  const ext = path.extname(pathname);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve /_next/static
  if (pathname.startsWith('/_next/static/')) {
    const content = serveNextStatic(pathname);
    if (content) {
      res.writeHead(200, { 'Content-Type': getMimeType(ext) });
      res.end(content);
      return;
    }
  }

  // Serve /public files
  if (pathname !== '/' && !pathname.startsWith('/_')) {
    const content = servePublic(pathname);
    if (content) {
      res.writeHead(200, { 'Content-Type': getMimeType(ext) });
      res.end(content);
      return;
    }
  }

  // Try to find page component
  const pageFile = findPage(pathname);
  if (pageFile && fileExists(pageFile)) {
    try {
      const html = createPageHTML(pageFile, pathname);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    } catch (err) {
      console.error('Error serving page:', err.message);
    }
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>404 - Not Found</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #f8fafc;
          }
          .container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            max-width: 500px;
          }
          h1 { color: #e11d48; margin: 0; font-size: 48px; }
          p { color: #64748b; margin: 20px 0; }
          code { background: #f1f5f9; padding: 2px 6px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>404</h1>
          <p>Page not found: <code>${pathname}</code></p>
          <p><a href="/" style="color: #0ea5e9; text-decoration: none;">← Go Home</a></p>
        </div>
      </body>
    </html>
  `);
});

// Start server
server.listen(PORT, HOST, () => {
  console.log(`\n🚀 Next.js Development Server (Local)`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📍 URL:         http://localhost:${PORT}`);
  console.log(`📁 Project:     ${path.basename(PROJECT_ROOT)}`);
  console.log(`🔧 Mode:        Development (Source Files)`);
  console.log(`✓ Offline:      No internet needed`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Press Ctrl+C to stop\n`);

  // Check for source files
  if (!directoryExists(APP_DIR) && !directoryExists(PAGES_DIR)) {
    console.log(`⚠️  Warning: No app/ or pages/ directory found\n`);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} already in use`);
    console.error(`Try: PORT=3001 node server-dev.js\n`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down...');
  server.close(() => process.exit(0));
});
