# Production Deployment & Operations Checklist

**EduExpress International (`eduexpressint.com`)**  
*Next.js 16.4.3 App Router · React 19 · TypeScript · Prisma SQLite · Tailwind CSS*  
*SDK: `@google/genai` (^3.3.0) · Gemini 4 Hydrogen · Gemini Decision 1*

---

## 1. Release Commits

| Commit SHA | Type | Summary |
|---|---|---|
| `d34a6f5` | `fix(seo)` | Harmonize JSON-LD graph, canonicals, sitemaps, and author hygiene. |
| `817868d` | `feat(ai)` | Integrate Google Gemini API suite across student evaluation and counseling workflows. |

---

## 2. Production Environment Configuration

Ensure the following environment variables are set in the production environment (e.g., VPS `.env`, Docker compose, or secret manager):

```bash
# ----------------------------------------------------
# Core Server & Database
# ----------------------------------------------------
NODE_ENV=production
PORT=3000
DATABASE_URL="file:/absolute/path/to/data/edxbd.db"
NEXT_PUBLIC_SITE_URL="https://eduexpressint.com"
NEXT_PUBLIC_SITE_NAME="EduExpress International"

# ----------------------------------------------------
# Google Gemini API
# ----------------------------------------------------
GEMINI_API_KEY="<YOUR_PRODUCTION_GOOGLE_GEMINI_API_KEY>"
# Optional fallback alias:
# GOOGLE_API_KEY="<YOUR_PRODUCTION_GOOGLE_GEMINI_API_KEY>"

# ----------------------------------------------------
# Security & Auth Secrets
# ----------------------------------------------------
JWT_SECRET="<SECURE_JWT_SECRET>"
SETTINGS_ENCRYPTION_KEY="<SECURE_KEY>"
BACKUP_ENCRYPTION_KEY="<SECURE_KEY>"
REVALIDATE_SECRET="<SECURE_REVALIDATE_SECRET>"
ADMIN_EMAIL="admin@eduexpressint.com"

# ----------------------------------------------------
# Marketing & Conversion Tracking (Meta CAPI)
# ----------------------------------------------------
NEXT_PUBLIC_META_PIXEL_ID="4631458287174571"
META_ACCESS_TOKEN="<META_CONVERSIONS_API_TOKEN>"
```

> [!IMPORTANT]
> - Never commit `.env` or files containing student lead data (`*.csv`).
> - If `GEMINI_API_KEY` is omitted or quota is exhausted, all seven features automatically transition to **Catalog Fallback Mode** (`mode: 'catalog'`), serving authentic database records with HTTP 200 without downtime.

---

## 3. Pre-Deployment Smoke Test Protocol

Before pointing production DNS / load balancers to the new build:

```bash
# Step 1: Run complete unit test suite (60 tests)
node --test src/lib/*.test.mjs

# Step 2: Verify TypeScript strict compilation
npx tsc --noEmit

# Step 3: Verify Pre-Deploy SEO Launch Acceptance Audit
npm run seo:audit

# Step 4: Run production build with Webpack
npm run build
```

---

## 4. Standalone Deployment Instructions

When running in containerized environments (Docker) or systemd services with `output: 'standalone'`:

```bash
# 1. Install production dependencies
npm ci --omit=dev

# 2. Build the Next.js artifacts
npm run build

# 3. Synchronize static assets into standalone root
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

# 4. Start the server
DATABASE_URL="file:/app/data/edxbd.db" PORT=3000 node .next/standalone/server.js
```

---

## 5. AI Endpoints & Rate Limit Specifications

| Route | Method | Rate Limit | Primary Model | Resilient Fallback |
|---|---|---|---|---|
| `/api/ai/fit-preview` | `POST` | 25 req / hr | `gemini-4-hydrogen` | Catalog Scoring Generator |
| `/api/admin/leads/[id]/copilot` | `POST` | 60 req / hr | `gemini-decision-1` + `gemini-4-hydrogen` | Catalog Triage Generator |
| `/api/ai/advisor` | `POST` | 30 req / hr | `gemini-4-hydrogen` (Tool Calling) | Catalog SSE Generator |
| `/api/ai/evaluate-transcript` | `POST` | 20 req / hr | `gemini-4-hydrogen` (Vision) | Catalog Marksheet Scanner |
| `/api/ai/visa-simulator` | `POST` | 25 req / hr | `gemini-4-hydrogen` | Rule-based Consular Evaluator |
| `/api/ai/cost-feasibility` | `POST` | 30 req / hr | `gemini-4-hydrogen` | ClearCost Multi-currency Engine |
| `/api/ai/sop-reviewer` | `POST` | 25 req / hr | `gemini-4-hydrogen` | Catalog Rubric Evaluator |

---

## 6. Post-Deployment Smoke Verification

Run curl commands to confirm endpoints respond correctly on production:

```bash
# 1. Health check
curl -I https://eduexpressint.com/api/health

# 2. Fit Preview Endpoint
curl -X POST https://eduexpressint.com/api/ai/fit-preview \
  -H "Content-Type: application/json" \
  -d '{"studentLevel":"HSC / A Level","gpa":"4.80","intendedMajor":"Computer Science","budgetBand":"CNY 15,000–25,000 / year","intakeYear":"2027","language":"en"}'

# 3. SOP Reviewer Endpoint
curl -X POST https://eduexpressint.com/api/ai/sop-reviewer \
  -H "Content-Type: application/json" \
  -d '{"text":"I wish to conduct research on distributed machine learning systems at Southeast University in Nanjing.","documentType":"study_plan","targetCountry":"China","targetDegree":"Master","language":"en"}'
```
