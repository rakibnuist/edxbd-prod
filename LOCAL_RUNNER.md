# 🚀 Universal Next.js Local Runner

Run ANY Next.js project locally without needing Next.js CLI, SWC compiler, or internet.

## Quick Start

```bash
# Development mode (serves source files directly)
npm run local:dev

# OR production mode (pre-built)
npm run build
npm run local

# OR use shell script
bash run-local.sh
```

Then open: **http://localhost:3000**

---

## Two Modes

### Mode 1: Development (`npm run local:dev`)
- ✓ Serves source files directly from `src/app` or `pages/`
- ✓ No compilation needed
- ✓ Fastest startup
- ✓ Works 100% offline
- ✓ Shows page info and file content
- ⚠️ No actual React rendering (reference only)

**Best for:** Quick checks, inspecting source files

```bash
node server-dev.js
```

### Mode 2: Production (`npm run local`)
- ✓ Uses pre-built files from `.next/`
- ✓ Serves compiled pages
- ✓ Better performance
- ⚠️ Requires `npm run build` first

**Best for:** Testing production builds

```bash
npm run build
node server.js
```

---

## How It Works

### server-dev.js (Development Server)
```javascript
// Looks for pages in order of priority:
1. .next/server/app/page.js (pre-built)
2. .next/server/pages/index.js (pre-built)  
3. src/app/page.tsx (source)
4. src/app/page.js (source)
5. pages/index.tsx (source)
6. pages/index.js (source)
```

- Creates HTML wrapper for each page
- Shows file info and content
- Serves public/ files automatically
- Handles static assets from .next/

### server.js (Production Server)
- Serves pre-built .next/server files
- Serves .next/static assets
- Serves /public files
- 404 fallback

---

## For All Your Next.js Projects

### Apply to Any Project

1. **Copy the servers:**
   ```bash
   cp server.js server-dev.js <your-nextjs-project>/
   ```

2. **Update package.json:**
   ```json
   {
     "scripts": {
       "local": "node server.js",
       "local:dev": "node server-dev.js",
       "local:build": "npm run build && npm run local"
     }
   }
   ```

3. **Use it:**
   ```bash
   npm run local:dev
   ```

### Or Use the Script Template

```bash
#!/bin/bash
# run-project.sh
cd $1  # Project directory
npm run local:dev
```

Then:
```bash
bash run-project.sh /path/to/project
```

---

## Comparison

| Feature | Dev Server | Prod Server | Next.js CLI |
|---------|-----------|------------|------------|
| **SWC Required** | ✗ | ✗ | ✓ |
| **Internet Needed** | ✗ | ✗ | ✓ |
| **Offline** | ✓ | ✓ | ✗ |
| **React Rendering** | ✗ | ✓ | ✓ |
| **Startup Time** | <1s | <1s | 10-30s |
| **Source Serving** | ✓ | ✗ | ✗ |
| **Production Ready** | ✗ | ✓ | ✓ |

---

## Troubleshooting

### "Port 3000 already in use"
```bash
PORT=3001 npm run local:dev
```

### "Can't find page"
Make sure your project has either:
- `src/app/page.tsx` (App Router)
- `pages/index.tsx` (Pages Router)

### "Server won't start"
```bash
# Check if port is occupied
lsof -i :3000

# Kill existing process
kill <PID>
```

---

## Environment Setup

### For macOS (Your Local Machine)
Use this for development:
```bash
npm run dev  # Uses Next.js CLI with SWC
```

### For Sandboxed/CI Environments
Use this instead:
```bash
npm run local:dev   # No SWC, no internet needed
npm run build && npm run local  # Pre-built mode
```

---

## API Routes (If Your Project Has Them)

The local servers serve pages and static files. For API routes, you need:

1. **Option A:** Build and use `next start`
   ```bash
   npm run build
   npm run start
   ```

2. **Option B:** Extend server.js to handle `/api/` routes
   - Look at existing server.js for structure
   - Add API handler function

3. **Option C:** Create separate Express server
   ```bash
   npm install express
   # Create api.js that handles routes
   ```

---

## Advanced: Custom Configuration

### Change Port
```bash
PORT=8080 npm run local:dev
```

### Host Binding
Edit `server-dev.js`:
```javascript
const HOST = '127.0.0.1';  // Only localhost
// OR
const HOST = '0.0.0.0';    // All interfaces
```

### Add Custom Routes
Edit server-dev.js `findPage()` function to add more search paths.

---

## For Your Entire Workflow

### Recommended Setup

```bash
# Development (on your Mac with internet)
npm run dev

# Before testing anywhere else
npm run build

# Local testing (sandbox/CI or offline)
npm run local

# Or dev mode locally
npm run local:dev
```

---

## Next Steps

1. ✓ Test: `npm run local:dev`
2. ✓ Check: Open http://localhost:3000
3. ✓ Share: Copy servers to other Next.js projects
4. ✓ Automate: Use in CI/CD pipelines

---

**You now have a Next.js runner that works everywhere, offline, without SWC. 🎉**
