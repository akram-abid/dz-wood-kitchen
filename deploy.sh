#!/bin/bash

REPO_URL="git@github.com:BigBr41n/fastify-DZWC-api.git"
APP_PARENT_DIR="/home/azureuser/lab"
APP_DIR="$APP_PARENT_DIR/fastify-DZWC-api"
BRANCH="backend"

echo "🧼 Stopping running containers..."
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR" && docker-compose -f docker-compose.prod.yml down
  cd ~
fi

echo "🗑️ Nuclear Docker cleanup - removing EVERYTHING..."
# Stop all running containers
docker stop $(docker ps -aq) 2>/dev/null || true

# Remove all containers (running and stopped)
docker rm $(docker ps -aq) 2>/dev/null || true

# Remove all images (including tagged ones)
docker rmi $(docker images -q) --force 2>/dev/null || true

# Remove all volumes
docker volume rm $(docker volume ls -q) 2>/dev/null || true

# Remove all networks (except default ones)
docker network rm $(docker network ls -q) 2>/dev/null || true

# Remove all build cache, unused images, containers, networks
docker system prune -af --volumes

# Remove all buildx cache
docker buildx prune -af 2>/dev/null || true

echo "🧹 Removing old repo folder..."
rm -rf "$APP_DIR"

echo "📥 Cloning repo into $APP_PARENT_DIR..."
git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"

echo "🧼 Cleaning up old Docker images..."
docker system prune -af

echo "🏗️ Starting app with Docker Compose (prod config)..."
cd "$APP_DIR" || exit 1
docker-compose -f docker-compose.yml up -d --build

echo "✅ Deployment finished successfully!"
