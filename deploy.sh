#!/bin/bash

set -e  # Exit on error
set -x  # Debug mode

# === Config ===
APP_DIR="/home/lab-fe"
PROJECT_NAME="dz-wood-kitchen"
PROJECT_PATH="$APP_DIR/$PROJECT_NAME"
GIT_REPO="git@github-akram:akram-abid/dz-wood-kitchen.git"
CONTAINER_NAME="dzwoodkitchen-frontend"
IMAGE_NAME="dzwoodkitchen-frontend"
BUILD_ARG_ORIGIN="https://dzwoodkitchen.com"

# === Cleanup old container and image ===
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true
docker rmi $IMAGE_NAME || true

# === Remove only the project folder ===
rm -rf "$PROJECT_PATH"

# === Clone latest version ===
git clone $GIT_REPO "$PROJECT_PATH"

# === Build ===
cd "$PROJECT_PATH"

docker build \
  --build-arg VITE_REACT_APP_ORIGIN=$BUILD_ARG_ORIGIN \
  -t $IMAGE_NAME .

# === Run ===
docker run -d -p 127.0.0.1:3002:3002 --name $CONTAINER_NAME $IMAGE_NAME
