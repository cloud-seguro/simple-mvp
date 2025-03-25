# Docker Setup for Simple MVP Project

This document explains how to use Docker with this Next.js application.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine

## Environment Variables

Before running the application, make sure to create a `.env` file in the root directory with the following variables:

```
# Database connection (example)
DATABASE_URL=postgresql://postgres.yourdbid:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.yourdbid:password@aws-0-region.pooler.supabase.com:5432/postgres

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=https://yoursupabaseid.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=avatars
```

## Development Environment

To start the development environment with hot reloading:

```bash
docker-compose -f docker-compose.dev.yml up
```

This will:

- Build the development Docker image
- Start the application in development mode
- Mount your local files for hot reloading
- Expose the application on port 3000

## Production Environment

To start the production environment:

```bash
docker-compose up -d
```

This will:

- Build the production Docker image
- Start the application in production mode
- Run the application as a daemon
- Expose the application on port 3000

## Database Migrations

To run database migrations:

```bash
./docker-migrate.sh
```

This script will:

- Run Prisma migrations
- Generate the Prisma client

## Stopping the Containers

To stop the development environment:

```bash
docker-compose -f docker-compose.dev.yml down
```

To stop the production environment:

```bash
docker-compose down
```

## Rebuilding the Containers

If you make changes to the Dockerfile or dependencies, rebuild the containers:

For development:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

For production:

```bash
docker-compose up --build -d
```

## Viewing Logs

For development:

```bash
docker-compose -f docker-compose.dev.yml logs -f
```

For production:

```bash
docker-compose logs -f
```

## Accessing the Container Shell

For development:

```bash
docker-compose -f docker-compose.dev.yml exec dev sh
```

For production:

```bash
docker-compose exec app sh
```
