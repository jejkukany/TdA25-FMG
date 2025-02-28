# Base stage
FROM node:18-bullseye AS base

# Install system dependencies for native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first
# Copy package.json and lockfile, then install dependencies
COPY package.json ./
RUN npm install

# Build stage
FROM base AS builder
WORKDIR /app
COPY . .

# Build frontend (Next.js)
RUN npm run build

# Production stage
FROM node:18-bullseye AS runner
WORKDIR /app

# Use ARG for build-time variables
ARG AUTH_SECRET
ARG AUTH_URL

# Set environment variables
ENV NODE_ENV=production
ENV BETTER_AUTH_SECRET=${AUTH_SECRET}
ENV BETTER_AUTH_URL=${AUTH_URL}

# Add a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files for production
COPY --chmod=777 sqlite.db /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/node_modules ./node_modules



RUN chmod a+rw /app

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]