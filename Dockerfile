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
RUN npm install -g pnpm && pnpm install

# Verify installation
RUN pnpm list

# Build stage
FROM base AS builder
WORKDIR /app
COPY . .

RUN pnpm build

# Production stage
FROM node:18-bullseye AS runner
WORKDIR /app

ENV NODE_ENV=production

# Add a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files for production
COPY --chmod=765 sqlite.db /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ensure sqlite.db is writable by anyone
RUN chmod a+rw /app/sqlite.db

RUN chmod a+rw /app

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
