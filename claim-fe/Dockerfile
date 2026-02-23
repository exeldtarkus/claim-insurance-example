# ---------- Stage 1: Builder ----------
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Prisma (optional)
RUN npx prisma generate
RUN npx prisma db push

# Build Next.js
RUN npm run build

# ---------- Stage 2: Runtime ----------
FROM node:20-slim

WORKDIR /app

# Install curl & jq to fetch from Consul
RUN apt-get update && apt-get install -y curl jq && rm -rf /var/lib/apt/lists/*

# Copy compiled app and deps
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Add entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# env setting
ENV HOST=0.0.0.0

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "server.js"]
