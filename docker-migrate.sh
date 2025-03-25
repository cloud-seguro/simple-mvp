#!/bin/bash
set -e

echo "Running Prisma migrations..."
docker-compose exec -T app pnpm prisma migrate deploy

echo "Generating Prisma client..."
docker-compose exec -T app pnpm prisma generate

echo "Database migrations completed successfully!" 