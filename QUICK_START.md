# ⚡ Quick Start - Local Next.js Runner

## Right Now (edXBD Project)

```bash
# Development mode (instant, no build)
npm run local:dev

# Then open browser → http://localhost:3000
```

That's it! Server is running.

---

## Or Full Production Mode

```bash
npm run build
npm run local
```

---

## For Any Other Next.js Project

```bash
# Copy the servers
cp /Users/a1/Desktop/webApp/edXBD/server*.js /path/to/project/

# Update package.json (add to "scripts" section):
# "local": "node server.js",
# "local:dev": "node server-dev.js"

# Run it
cd /path/to/project
npm run local:dev
```

---

## What You Get

✅ Run ANY Next.js project locally  
✅ No SWC compiler needed  
✅ No internet required  
✅ Works offline, always  
✅ Instant startup  
✅ Multiple projects at once (different ports)

---

## How to Use Different Ports

```bash
PORT=3001 npm run local:dev  # Project 1
PORT=3002 npm run local:dev  # Project 2
PORT=3003 npm run local:dev  # Project 3
```

Open:
- http://localhost:3001
- http://localhost:3002
- http://localhost:3003

---

## More Info

- Full guide: `CLAUDE_LOCAL_RUNNER_GUIDE.md`
- Details: `LOCAL_RUNNER.md`
- Setup instructions: `SETUP_INSTRUCTIONS.md`

---

**Ready? Run this:**
```bash
npm run local:dev
```

🚀 Done!
