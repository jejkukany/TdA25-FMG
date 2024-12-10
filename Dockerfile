# Base image
FROM node:18-bullseye AS base

# Install system dependencies for native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json and lockfile, then install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app
COPY . .

# Rebuild native modules for Docker environment
RUN pnpm rebuild better-sqlite3

# Build the project
RUN pnpm build

# Production stage
FROM node:18-bullseye AS runner
WORKDIR /app

ENV NODE_ENV=production

# Add a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
