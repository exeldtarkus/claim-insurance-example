#!/bin/sh
set -e

# Opsional: Jika kamu ingin memastikan variabel lingkungan dimuat
echo "[ENTRYPOINT] Environment variables loaded."

# Cek apakah file .env ada (hanya untuk log)
if [ -f "/app/.env" ]; then
  echo "[ENTRYPOINT] .env file detected."
else
  echo "[ENTRYPOINT] Running with system environment variables."
fi

echo "[ENTRYPOINT] Starting Next.js App..."

# Menjalankan perintah utama (CMD dari Dockerfile, yaitu: node server.js)
exec "$@"