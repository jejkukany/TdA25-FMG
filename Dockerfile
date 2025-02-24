# Base stage
FROM node:18-bullseye AS base

# Install system dependencies for native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json files and install dependencies
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

RUN npm install --prefix frontend
RUN npm install --prefix backend

# Build stage
FROM base AS builder
WORKDIR /app
COPY . .

# 🛠️ Rebuild better-sqlite3 to fix native module issue BEFORE building Next.js
RUN npm rebuild better-sqlite3 --prefix frontend

# Build frontend (Next.js)
RUN npm run build --prefix frontend

# Production stage
FROM node:18-bullseye AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV BETTER_AUTH_SECRET=BbQpeDCVu5KA1zrCUuECuTGHf6ujmHhF
ENV BETTER_AUTH_URL=https://13682ac4.app.deploy.tourde.app

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

# Start both backend and frontend using PM2
CMD node /app/frontend/server.js

