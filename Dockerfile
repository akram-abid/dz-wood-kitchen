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

# Install pnpm and tsx to run migration and seed scripts
RUN npm install -g pnpm tsx

# Copy built artifacts and runtime files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/.drizzle ./.drizzle

# Copy wait-for-it script
COPY wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Wait for db, then run migrations, then seed, then start app
CMD ["sh", "-c", "./wait-for-it.sh db:5432 -- pnpm drizzle-kit push && pnpm exec tsx scripts/seed.ts && node dist/server.js"]x scripts/seed.ts && node dist/server.js
