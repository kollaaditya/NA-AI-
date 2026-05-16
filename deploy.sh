#!/bin/bash
# NA AI Systems - AWS EC2 Deployment Script
# Run as: chmod +x deploy.sh && ./deploy.sh

set -e

echo "=========================================="
echo "  NA AI Systems - Production Deployment"
echo "=========================================="

# 1. Update system packages
echo "[1/8] Updating system packages..."
sudo apt-get update -y && sudo apt-get upgrade -y

# 2. Install Node.js 20 LTS
echo "[2/8] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 and Nginx globally
echo "[3/8] Installing PM2 and Nginx..."
sudo npm install -g pm2
sudo apt-get install -y nginx

# 4. Clone or pull latest code
echo "[4/8] Pulling latest code..."
if [ -d "/var/www/na-ai-systems" ]; then
  cd /var/www/na-ai-systems && git pull origin main
else
  sudo git clone https://github.com/your-org/na-ai-systems.git /var/www/na-ai-systems
  cd /var/www/na-ai-systems
fi

# 5. Install dependencies
echo "[5/8] Installing dependencies..."
cd /var/www/na-ai-systems/server && npm install --production
cd /var/www/na-ai-systems/client && npm install

# 6. Build frontend
echo "[6/8] Building React frontend..."
cd /var/www/na-ai-systems/client && npm run build

# 7. Setup environment variables
echo "[7/8] Setting up environment..."
if [ ! -f "/var/www/na-ai-systems/server/.env" ]; then
  echo "⚠️  WARNING: Create /var/www/na-ai-systems/server/.env from .env.example"
  cp /var/www/na-ai-systems/server/.env.example /var/www/na-ai-systems/server/.env
  echo "Edit the .env file with your production values before starting the server."
fi

# 8. Start/Restart with PM2
echo "[8/8] Starting application with PM2..."
cd /var/www/na-ai-systems
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# Setup Nginx
echo "Configuring Nginx..."
sudo cp /var/www/na-ai-systems/nginx.conf /etc/nginx/sites-available/naaisystems.com
sudo ln -sf /etc/nginx/sites-available/naaisystems.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "=========================================="
echo "  Deployment Complete!"
echo "  API: http://localhost:5000/health"
echo "  PM2 Status: pm2 status"
echo "  Logs: pm2 logs na-ai-systems-api"
echo "=========================================="
