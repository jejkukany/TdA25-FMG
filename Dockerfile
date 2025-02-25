# Base stage
FROM node:18-bullseye AS base

# Install system dependencies for native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Create .dockerignore if you haven't already to exclude node_modules
RUN npm install --prefix frontend
RUN npm install --prefix backend

# Build stage
FROM base AS builder
WORKDIR /app

# Copy source files
COPY frontend ./frontend
COPY backend ./backend

# 🛠️ Rebuild better-sqlite3 to fix native module issue BEFORE building Next.js
RUN npm rebuild better-sqlite3 --prefix frontend

# Build frontend (Next.js)
RUN npm run build --prefix frontend

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
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/.next/standalone ./frontend/
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static

# Copy backend files
COPY --from=builder /app/backend /app/backend

# Copy SQLite database into frontend
COPY --chmod=777 --from=builder /app/sqlite.db /app/sqlite.db

# Ensure sqlite.db is writable
RUN chmod a+rw /app/sqlite.db
RUN chmod a+rw /app

USER nextjs

# Expose necessary ports
EXPOSE 3000 

# Use JSON format for CMD
WORKDIR /app/frontend
CMD ["npm", "start"]
