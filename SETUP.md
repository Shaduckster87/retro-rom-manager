# 🎮 RetroVault – Self-Hosted Setup Guide

> Ubuntu 24.04 LTS | Self-Hosted Supabase Stack | ROM Package Management

---

## 📋 Übersicht

RetroVault läuft als kompletter Self-Hosted Stack mit:

| Service | Technologie | Port |
|---------|------------|------|
| **Datenbank** | PostgreSQL 15 | 5432 |
| **Auth** | GoTrue (Supabase Auth) | 9999 |
| **REST API** | PostgREST | 3001 |
| **File Storage** | Supabase Storage | 5000 |
| **API Gateway** | Kong | 8000 |
| **Frontend** | Nginx + Vite Build | 80/443 |

---

## 🚀 Schnellstart (Automatisch)

```bash
# 1. Repository klonen
git clone https://github.com/DEIN-USER/retrovault.git /opt/retrovault
cd /opt/retrovault

# 2. Setup-Script ausführen (als root)
chmod +x self-host/setup.sh
sudo bash self-host/setup.sh

# 3. Fertig! 🎉
# Frontend: http://deine-ip
# Admin: admin@retrovault.local / RomVault2024!
```

---

## 🔧 Manuelles Setup (Schritt für Schritt)

### 1. Voraussetzungen installieren

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-v2 nodejs npm git curl nginx
sudo systemctl enable docker && sudo systemctl start docker
```

### 2. Repository klonen

```bash
git clone https://github.com/DEIN-USER/retrovault.git /opt/retrovault
cd /opt/retrovault
```

### 3. JWT-Schlüssel generieren

```bash
chmod +x self-host/generate-keys.sh

# Eigenen JWT-Secret verwenden (mind. 32 Zeichen!)
bash self-host/generate-keys.sh "dein-super-sicheres-jwt-secret-hier"
```

Kopiere die Ausgabe — du brauchst `ANON_KEY`, `SERVICE_ROLE_KEY` und `JWT_SECRET`.

### 4. Umgebungsvariablen konfigurieren

Erstelle eine `.env` im Projektroot:

```bash
cat > .env << EOF
# Datenbank
POSTGRES_PASSWORD=dein_sicheres_passwort

# JWT (von generate-keys.sh)
JWT_SECRET=dein_jwt_secret
ANON_KEY=dein_anon_key
SERVICE_ROLE_KEY=dein_service_role_key

# URLs — ändere auf deine Domain/IP!
API_EXTERNAL_URL=http://deine-domain:8000
SITE_URL=http://deine-domain

# Frontend
VITE_SUPABASE_URL=http://deine-domain:8000
VITE_SUPABASE_PUBLISHABLE_KEY=dein_anon_key
EOF
```

### 5. Docker Services starten

```bash
docker compose up -d
```

Warte bis die DB bereit ist:

```bash
until docker exec retrovault-db pg_isready -U postgres; do sleep 2; done
```

### 6. Datenbank-Migrationen ausführen

```bash
for f in supabase/migrations/*.sql; do
  echo "Running $f..."
  docker exec -i retrovault-db psql -U postgres -d retrovault < "$f"
done
```

### 7. Admin-Benutzer erstellen

```bash
# Via GoTrue API
curl -X POST http://localhost:9999/admin/users \
  -H "Authorization: Bearer DEIN_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@retrovault.local",
    "password": "RomVault2024!",
    "email_confirm": true
  }'

# Admin-ID aus der Antwort kopieren, dann:
docker exec -i retrovault-db psql -U postgres -d retrovault -c \
  "INSERT INTO public.user_roles (user_id, role) VALUES ('ADMIN-UUID-HIER', 'admin');"
```

### 8. Frontend bauen

```bash
npm install
npm run build
```

### 9. Nginx konfigurieren

```bash
sudo cp self-host/nginx.conf /etc/nginx/sites-available/retrovault
sudo ln -sf /etc/nginx/sites-available/retrovault /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Pfad im Nginx-Config anpassen falls nötig
sudo nginx -t && sudo systemctl restart nginx
```

---

## 🔒 HTTPS mit Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d deine-domain.de
```

Danach `.env` aktualisieren:

```env
API_EXTERNAL_URL=https://deine-domain.de/api
SITE_URL=https://deine-domain.de
VITE_SUPABASE_URL=https://deine-domain.de/api
```

Frontend neu bauen und Container neustarten:

```bash
npm run build
docker compose restart
sudo systemctl restart nginx
```

---

## 📁 Dateistruktur

```
/opt/retrovault/
├── docker-compose.yml      # Alle Backend-Services
├── .env                    # Konfiguration (geheim!)
├── self-host/
│   ├── setup.sh            # Automatisches Setup-Script
│   ├── generate-keys.sh    # JWT-Key-Generator
│   ├── kong.yml            # API Gateway Config
│   └── nginx.conf          # Webserver Config
├── supabase/
│   └── migrations/         # Datenbank-Schema
├── src/                    # Frontend Source
└── dist/                   # Gebuildetes Frontend
```

---

## 🛠️ Wartung & Befehle

```bash
# Services Status
docker compose ps

# Logs anzeigen
docker compose logs -f          # Alle Services
docker compose logs -f db       # Nur Datenbank
docker compose logs -f auth     # Nur Auth

# Neustart
docker compose restart

# Komplett stoppen
docker compose down

# Datenbank Backup
docker exec retrovault-db pg_dump -U postgres retrovault > backup_$(date +%Y%m%d).sql

# Datenbank Restore
docker exec -i retrovault-db psql -U postgres -d retrovault < backup.sql

# Frontend neu bauen
npm run build && sudo systemctl restart nginx

# Update (neuer Code)
git pull
npm install && npm run build
docker compose up -d
sudo systemctl restart nginx
```

---

## ⚠️ Wichtig

- **Admin-Passwort sofort ändern** nach dem ersten Login!
- **JWT_SECRET niemals öffentlich teilen** — damit können Tokens gefälscht werden
- **Firewall einrichten**: Nur Port 80/443 nach außen öffnen, 5432/8000/9999 intern lassen
- **Regelmäßige Backups** der Datenbank und des Storage-Volumes

```bash
# Firewall-Empfehlung
sudo ufw allow 22/tcp     # SSH
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 443/tcp    # HTTPS
sudo ufw enable
```

---

## 🐛 Fehlerbehebung

| Problem | Lösung |
|---------|--------|
| DB startet nicht | `docker compose logs db` prüfen |
| Auth-Fehler | JWT_SECRET in .env und GoTrue müssen identisch sein |
| Upload schlägt fehl | Storage-Volume-Berechtigung prüfen |
| Frontend 502 | `docker compose ps` — läuft Kong? |
| CORS-Fehler | Kong-Config prüfen (`self-host/kong.yml`) |

---

*Erstellt für Ubuntu 24.04 LTS | RetroVault ROM Package Manager*
