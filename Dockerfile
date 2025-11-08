# ===== Stage 1: Build =====
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* tsconfig*.json ./
RUN npm ci

# Copy source
COPY src ./src

# Build TypeScript
RUN npm run build

# ===== Stage 2: Production =====
FROM node:20-alpine

WORKDIR /app

# Copy only production files
COPY package.json package-lock.json* ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN npm ci --omit=dev

# Environment variables
ENV NODE_ENV=production
ENV PORT=9002

# Expose port
EXPOSE 9002

# Start app
CMD ["node", "dist/server.js"]
