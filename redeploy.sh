#!/usr/bin/env bash
# Clean redeploy for eduexpressint.com — run ON THE VPS, in the folder that
# holds docker-compose.yml. Does a from-scratch rebuild so no stale prerender
# (old /universities, old chunks) or old container survives.
set -euo pipefail

COMPOSE_FILE="${1:-docker-compose.yml}"   # pass a different file as arg 1 if needed
DOMAIN="eduexpressint.com"

echo "==> Using compose file: $COMPOSE_FILE"
cd "$(dirname "$0")"

echo "==> Stopping current stack"
docker compose -f "$COMPOSE_FILE" down --remove-orphans

# If this compose persists the app via ./app-data:/app, the old .next build
# lingers there and gets served for bare URLs. Drop it so the new build wins.
if [ -d ./app-data/.next ]; then
  echo "==> Removing stale build cache (./app-data/.next)"
  rm -rf ./app-data/.next
fi

echo "==> Rebuilding image with no cache"
docker compose -f "$COMPOSE_FILE" build --no-cache

echo "==> Starting fresh stack"
docker compose -f "$COMPOSE_FILE" up -d

echo "==> Waiting for the app to come up"
sleep 8

echo "==> Verifying"
echo -n "  HTTP -> HTTPS redirect: "
curl -sI "http://$DOMAIN" | grep -iE "^(HTTP/|location:)" || echo "  (no redirect header seen)"
echo -n "  /universities title:    "
curl -s "https://$DOMAIN/universities" | grep -o "<title>[^<]*" | head -1 || true

echo "==> Done. If the title still says 'Partner Universities', the old build is"
echo "    still cached — re-run and confirm you are NOT using final-compose.yml/"
echo "    test-compose.yml (they mount ./app-data:/app and persist the old build)."
