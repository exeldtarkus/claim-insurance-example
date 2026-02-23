# STAGE 1: Build app and native module
FROM node:23-slim AS builder
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  sqlite3 \
  && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
COPY .env.production .env
RUN npm run build

# STAGE 2: Runtime image (slim)
FROM node:23-slim AS runner
WORKDIR /app

# Install runtime sqlite
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3124
ENV NEXT_PUBLIC_API_URL=http://8.215.197.177:3124
ENV SERVICES_HOST=http://8.215.197.177:8016

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env.production .env.production

# Optional: Copy lib if used at runtime
COPY --from=builder /app/src/lib ./src/lib

EXPOSE 3124
CMD ["node", "server.js"]
