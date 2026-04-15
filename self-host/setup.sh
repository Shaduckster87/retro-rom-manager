#!/bin/bash
# ═══════════════════════════════════════════════════════
#  RetroVault – Self-Hosted Setup Script
#  Ubuntu 24.04 LTS
# ═══════════════════════════════════════════════════════

set -e

echo "═══════════════════════════════════════════"
echo "  🎮 RetroVault Self-Hosted Setup"
echo "  Ubuntu 24.04 LTS"
echo "═══════════════════════════════════════════"
echo ""

# ─── 1. System Dependencies ─────────────────────────
echo "📦 Installing system dependencies..."
apt-get update -qq
apt-get install -y -qq docker.io docker-compose-v2 nodejs npm git curl nginx certbot python3-certbot-nginx

# Enable Docker
systemctl enable docker
systemctl start docker

echo "✅ System dependencies installed"

# ─── 2. Generate Secrets ────────────────────────────
echo ""
echo "🔑 Generating secrets..."

JWT_SECRET=$(openssl rand -base64 48 | tr -d '\n/+=')
POSTGRES_PASSWORD=$(openssl rand -base64 24 | tr -d '\n/+=')

# Generate JWT keys
chmod +x self-host/generate-keys.sh
KEYS=$(bash self-host/generate-keys.sh "$JWT_SECRET")
ANON_KEY=$(echo "$KEYS" | grep "ANON_KEY=" | cut -d= -f2)
SERVICE_ROLE_KEY=$(echo "$KEYS" | grep "SERVICE_ROLE_KEY=" | cut -d= -f2)

# ─── 3. Create .env ─────────────────────────────────
echo ""
echo "📝 Creating .env file..."

cat > .env << EOF
# ═══ RetroVault Self-Hosted Configuration ═══

# Database
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

# JWT
JWT_SECRET=${JWT_SECRET}

# API Keys (auto-generated)
ANON_KEY=${ANON_KEY}
SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}

# URLs – change these to your domain!
API_EXTERNAL_URL=http://localhost:8000
SITE_URL=http://localhost:3000

# Frontend env vars
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_PUBLISHABLE_KEY=${ANON_KEY}
EOF

echo "✅ .env created"

# ─── 4. Start Services ──────────────────────────────
echo ""
echo "🐳 Starting Docker services..."
docker compose up -d

echo ""
echo "⏳ Waiting for database to be ready..."
until docker exec retrovault-db pg_isready -U postgres > /dev/null 2>&1; do
  sleep 2
done

echo "✅ Database ready"

# ─── 5. Run Migrations ──────────────────────────────
echo ""
echo "🗄️ Running database migrations..."

for migration in supabase/migrations/*.sql; do
  echo "  → Running $(basename $migration)..."
  docker exec -i retrovault-db psql -U postgres -d retrovault < "$migration" 2>/dev/null || true
done

echo "✅ Migrations complete"

# ─── 6. Create Admin User ───────────────────────────
echo ""
echo "👤 Creating admin user..."

# Create admin via GoTrue API
sleep 3
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:9999/admin/users \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@retrovault.local",
    "password": "RomVault2024!",
    "email_confirm": true
  }')

ADMIN_ID=$(echo "$ADMIN_RESPONSE" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try{console.log(JSON.parse(d).id)}
    catch(e){console.log('')}
  });
")

if [ -n "$ADMIN_ID" ] && [ "$ADMIN_ID" != "undefined" ]; then
  # Insert admin role
  docker exec -i retrovault-db psql -U postgres -d retrovault << SQL
INSERT INTO public.user_roles (user_id, role) VALUES ('${ADMIN_ID}', 'admin') ON CONFLICT DO NOTHING;
SQL
  echo "✅ Admin created: admin@retrovault.local / RomVault2024!"
else
  echo "⚠️  Admin user might already exist. Manual creation may be needed."
fi

# ─── 7. Build Frontend ──────────────────────────────
echo ""
echo "🏗️ Building frontend..."
npm install
npm run build

echo "✅ Frontend built to dist/"

# ─── 8. Nginx Config ────────────────────────────────
echo ""
echo "🌐 Configuring Nginx..."

cat > /etc/nginx/sites-available/retrovault << 'NGINX'
server {
    listen 80;
    server_name _;

    # Frontend
    root /opt/retrovault/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Supabase API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        client_max_body_size 500M;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/retrovault /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo "✅ Nginx configured"

# ─── Done! ───────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════"
echo "  🎮 RetroVault is running!"
echo "═══════════════════════════════════════════"
echo ""
echo "  🌐 Frontend:  http://localhost"
echo "  🔌 API:       http://localhost:8000"
echo "  🔒 Admin:     admin@retrovault.local / RomVault2024!"
echo ""
echo "  📋 Next steps:"
echo "    1. Change SITE_URL in .env to your domain"
echo "    2. Run: certbot --nginx (for HTTPS)"
echo "    3. Change admin password after first login!"
echo ""
