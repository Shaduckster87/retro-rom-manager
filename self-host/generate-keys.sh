#!/bin/bash
# ═══════════════════════════════════════════════════════
#  RetroVault – JWT Key Generator
#  Generates anon + service_role JWTs for self-hosting
# ═══════════════════════════════════════════════════════

set -e

JWT_SECRET="${1:-super-secret-jwt-token-with-at-least-32-characters-long}"

if ! command -v node &> /dev/null; then
  echo "❌ Node.js required. Install: apt install nodejs"
  exit 1
fi

echo "🔑 Generating JWT keys with secret..."
echo ""

ANON_KEY=$(node -e "
const header = Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url');
const now = Math.floor(Date.now()/1000);
const payload = Buffer.from(JSON.stringify({
  role:'anon',
  iss:'supabase',
  iat:now,
  exp:now+157680000
})).toString('base64url');
const crypto = require('crypto');
const sig = crypto.createHmac('sha256','${JWT_SECRET}').update(header+'.'+payload).digest('base64url');
console.log(header+'.'+payload+'.'+sig);
")

SERVICE_KEY=$(node -e "
const header = Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url');
const now = Math.floor(Date.now()/1000);
const payload = Buffer.from(JSON.stringify({
  role:'service_role',
  iss:'supabase',
  iat:now,
  exp:now+157680000
})).toString('base64url');
const crypto = require('crypto');
const sig = crypto.createHmac('sha256','${JWT_SECRET}').update(header+'.'+payload).digest('base64url');
console.log(header+'.'+payload+'.'+sig);
")

echo "ANON_KEY=${ANON_KEY}"
echo ""
echo "SERVICE_ROLE_KEY=${SERVICE_KEY}"
echo ""
echo "JWT_SECRET=${JWT_SECRET}"
echo ""
echo "✅ Add these to your .env file!"
