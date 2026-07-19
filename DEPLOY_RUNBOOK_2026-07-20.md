# Deploy Runbook — Security + Fixes (20 July 2026)

**Do the steps in order.** Step 2 (VPS `.env`) must happen **before** the new code serves traffic, or admin login will 500 (production now requires `JWT_SECRET`).

I could not push from this session (GitHub is network-blocked here), so you run these on your Mac + VPS.

---

## Step 1 — Commit & push (on your Mac)

```bash
cd ~/Desktop/webApp/edXBD

# Stale lock left by the sandbox — remove it (safe, it's 0 bytes)
rm -f .git/index.lock

# Confirm the DB files are now untracked (should show "D dev.db")
git status --short

git add -A
git commit -m "Security: remove hardcoded admin creds + JWT fallback; fix 404s, www redirect, stale claims, readability"

# The VPS builds from the edxbd-prod repo's main branch:
git push prod prod-deploy:main
```

---

## Step 2 — Set secrets on the VPS (BEFORE redeploy)

SSH into the VPS, go to the folder that holds `docker-compose.yml`, and create a `.env` **next to it**:

```bash
cd /path/to/your/compose/folder   # where docker-compose.yml lives

cat > .env <<'EOF'
JWT_SECRET=ekPjdImTRpv7qwkLNbonb5bOCtCxUJhQegd8mt4YC/Jwt5/M1RtHZXvob7j4c0fY
ADMIN_EMAIL=admin@eduexpressint.com
ADMIN_PASSWORD=O5XX4sV3Q88PCKIYNtNy
EOF

chmod 600 .env
```

> Change `ADMIN_PASSWORD` to whatever you like — just keep it strong.
> The updated `docker-compose.yml` (in this push) reads this `.env` automatically.

---

## Step 3 — Redeploy with a clean build

```bash
docker compose down
docker compose build --no-cache        # forces the new code (fixes the stale /universities + /destinations)
docker compose up -d
docker compose logs -f web             # watch it start; Ctrl-C when you see "Starting Next.js server..."
```

---

## Step 4 — Rotate the existing admin password

The persisted database still has the old `admin123` password. Setting `ADMIN_PASSWORD`
only affects a *missing* admin, so update the existing row once:

```bash
docker exec edxbd_web node -e "const b=require('bcryptjs');const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();(async()=>{await p.user.update({where:{email:process.env.ADMIN_EMAIL},data:{password:await b.hash(process.env.ADMIN_PASSWORD,10)}});console.log('admin password rotated');process.exit(0)})()"
```

After this, `admin123` no longer works — log in with your new `ADMIN_PASSWORD`.

---

## Step 5 — Verify (2 minutes)

```bash
# Login works with the NEW password, fails with the old one
curl -s -X POST https://eduexpressint.com/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@eduexpressint.com","password":"O5XX4sV3Q88PCKIYNtNy"}' | head

# admin123 must now be rejected (expect 401)
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://eduexpressint.com/api/auth/login \
  -H 'Content-Type: application/json' -d '{"email":"admin@eduexpressint.com","password":"admin123"}'
```

Then in a browser check:
- `https://eduexpressint.com/universities` → shows the **new** database directory with real records (not "0 universities").
- `https://eduexpressint.com/destinations` → new evidence-first cards (no "Don't let paperwork hold you back").
- `https://www.eduexpressint.com/` → 301-redirects to the non-www URL.
- Footer links **United Kingdom**, **Complaints and review**, and the homepage **China success stories** link → all load (no 404).
- View-source on `/universities`: `<link rel="canonical" href="https://eduexpressint.com/universities">` and no `your-google-verification-code` placeholders.

---

## Rollback (if anything is wrong)

```bash
git revert HEAD && git push prod prod-deploy:main
docker compose build --no-cache && docker compose up -d
```

## After it's confirmed working
- Rotate the `JWT_SECRET` again later if this file was ever shared; existing admin sessions will just need a re-login.
- Delete this runbook and `SITE_AUDIT_2026-07-20.md` from the repo once done (they contain the secret above), or keep them out of git.
