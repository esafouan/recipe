# Multi-stage build for optimized production image
FROM node:20.11-alpine AS base

# Install pnpm globally and curl for healthcheck
RUN npm install -g pnpm && \
    apk add --no-cache curl

# Stage 1: Dependencies
FROM base AS deps
WORKDIR /app

# Copy package files
COPY apps/recipe-blog/package.json ./
COPY apps/recipe-blog/pnpm-lock.yaml ./

# Install dependencies only
RUN pnpm install --frozen-lockfile --production=false

# Stage 2: Build
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY apps/recipe-blog/ ./

# Build the application
RUN pnpm run build

# Stage 3: Production runtime
FROM base AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]