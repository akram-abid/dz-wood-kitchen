# Stage 1: Build the React app
FROM node:18 AS build

WORKDIR /app

# Accept ARGs for VITE env vars
ARG VITE_REACT_APP_ORIGIN

# Set as ENV so Vite can access it
ENV VITE_REACT_APP_ORIGIN=$VITE_REACT_APP_ORIGIN

# Install deps
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build with injected env
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Clean default site
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3002
CMD ["nginx", "-g", "daemon off;"]
