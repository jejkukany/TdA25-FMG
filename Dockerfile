# Base image
FROM node:18-bullseye AS base

# Install dependencies
WORKDIR /app
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
COPY sqlite.db ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
