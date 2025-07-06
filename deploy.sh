#!/bin/bash

REPO_URL="git@github-BigBr41n:BigBr41n/fastify-DZWC-api.git"
APP_PARENT_DIR="/home/lab"
APP_DIR="$APP_PARENT_DIR/fastify-DZWC-api"
BRANCH="backend"

echo "🧼 Stopping running containers..."
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR" && docker compose -f docker-compose.yml down
  cd ~
fi

echo "🧼 Stopping and removing containers/images from Docker Compose..."

if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR"

  # Stop and remove containers, networks, volumes, images created by docker-compose
  docker compose -f docker-compose.yml down --volumes --remove-orphans
fi

echo "🧹 Removing old repo folder..."
rm -rf "$APP_DIR"

echo "📥 Cloning repo into $APP_PARENT_DIR..."
git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"

echo "🧼 Cleaning up old Docker images..."
docker system prune -af

echo "🏗️ Starting app with Docker Compose (prod config)..."
cd "$APP_DIR" || exit 1
docker compose -f docker-compose.yml up -d --build

echo "✅ Deployment finished successfully!"
