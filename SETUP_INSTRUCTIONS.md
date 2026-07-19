# edXBD Setup Instructions

## Quick Start (Recommended)

Follow these steps on your Mac to get the project running:

### Step 1: Downgrade to Next.js 14
```bash
cd /Users/a1/Desktop/webApp/edXBD
npm install next@14 react@19.1.0 react-dom@19.1.0
```

This removes the SWC compilation requirement and enables Babel fallback.

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
```
http://localhost:3000
```

---

## Why Downgrade?
- **Next.js 15.x**: Requires Rust SWC compiler (incompatible with offline environments)
- **Next.js 14.x**: Supports Babel fallback (works offline, everywhere)
- **Your React version (19.1.0)**: Fully compatible with Next.js 14

---

## Alternative: Keep Next.js 15 (If You Prefer)

If you want to stick with Next.js 15:

### On your Mac (with internet):
```bash
npm run build
```

### After building, run:
```bash
npm run start
```

This uses pre-built files and doesn't need the SWC compiler.

---

## Project Status
✓ All dependencies installed
✓ TypeScript configured  
✓ Tailwind CSS ready
✓ MongoDB integration set up
✓ Environment variables configured

Just need to adjust the Next.js version and you're ready to code!

---

## Environment Variables
Make sure `.env.local` exists with your database connection:
```
MONGODB_URI=your_connection_string
```

See `.env.example` for all required variables.

---

## Scripts Available
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run seed:admin` - Seed admin user to database
