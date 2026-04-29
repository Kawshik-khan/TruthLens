# ==================================================
# TruthLens Ultimate Production Dockerfile
# Next.js + Prisma + Tailwind + Railway Optimized
# Small, Fast, Stable
# ==================================================

# ---------- Base ----------
FROM node:20-alpine AS base

# ==================================================
# Dependencies
# ==================================================
FROM base AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY package.json package-lock.json ./

# Install all deps for build
RUN npm ci

# ==================================================
# Builder
# ==================================================
FROM base AS builder

WORKDIR /app

# Build-time environment
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma
RUN npx prisma generate

# Build Next.js
RUN npm run build

# ==================================================
# Runner
# ==================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache openssl

# Security user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy only needed files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Optional public folder (safe if exists)
COPY --from=builder /app/public ./public

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
