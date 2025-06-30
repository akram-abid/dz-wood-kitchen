# -------- BUILD STAGE --------
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy and install deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build the TypeScript code
RUN pnpm build

# -------- RUNTIME STAGE --------
FROM node:22-alpine

WORKDIR /app

# Install pnpm and tsx to run seed script
RUN npm install -g pnpm tsx

# Copy only necessary files from build stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src ./src

# Set environment variables if needed
ENV NODE_ENV=production
ENV PORT=3000

# Expose Fastify port
EXPOSE 3000

# Run DB seed then start server
CMD pnpm exec tsx scripts/seed.ts && node dist/server.js
