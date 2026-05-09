# Production Deployment Guide

## Overview

This project is prepared for a self-hosted Next.js 16 Node deployment on a VPS with:

- `output: "standalone"` for a smaller production runtime
- PM2 process management
- Nginx reverse proxying
- PostgreSQL as the primary database
- environment-driven deployment versioning and server action encryption

## Required Environment Variables

Start from `./.env.example`.

Minimum production variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@127.0.0.1:5432/eros_enterprises?schema=public"
NEXT_PUBLIC_SITE_URL="https://erosenterprises.in"
DEPLOYMENT_VERSION="2026-05-09-release-01"
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY="BASE64_AES_KEY"
RATE_LIMIT_ENABLED="false"
RATE_LIMIT_MAX_REQUESTS="10"
RATE_LIMIT_WINDOW_MS="60000"
```

Optional but recommended:

- `SHADOW_DATABASE_URL` for migration workflows on the server
- provider-specific WhatsApp credentials if the mock provider is replaced

## Production Scripts

Use these repository scripts:

```powershell
npm run typecheck
npm run lint
npm run build
npm run verify
npm run start
npm run start:standalone
```

Recommended runtime path for PM2:

```powershell
node .next-production-build/standalone/server.js
```

## PostgreSQL Setup

1. Install PostgreSQL 15+ on the VPS.
2. Create the application database and a dedicated user.
3. Grant that user ownership or full privileges on the application database.
4. Run Prisma migrations before starting the app.

Example:

```sql
CREATE DATABASE eros_enterprises;
CREATE USER eros_app WITH ENCRYPTED PASSWORD 'replace_me';
GRANT ALL PRIVILEGES ON DATABASE eros_enterprises TO eros_app;
```

After the environment file is in place:

```powershell
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

## Build And Release Flow

1. Pull the target revision on the VPS.
2. Install dependencies with `npm ci`.
3. Export the production environment variables.
4. Run `npm run verify`.
5. Start or reload PM2.

Example:

```powershell
npm ci
npx prisma generate
npx prisma migrate deploy
npm run verify
pm2 startOrReload ecosystem.config.js --env production
pm2 save
```

## PM2

The repo includes `ecosystem.config.js`.

Useful commands:

```powershell
pm2 start ecosystem.config.js
pm2 reload eros-enterprises
pm2 logs eros-enterprises
pm2 save
pm2 startup
```

## Nginx Reverse Proxy

Use Nginx in front of Next.js to handle TLS termination, buffering policy, and request controls.

Example server block:

```nginx
server {
    listen 80;
    server_name erosenterprises.in www.erosenterprises.in;

    client_max_body_size 10m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
        proxy_buffering off;
    }
}
```

Recommended add-ons:

- Certbot or another TLS termination workflow
- Nginx `limit_req` / `limit_conn` rules for public form endpoints
- access log rotation

## Rate-Limit-Ready Notes

The app now includes a lightweight server-side rate-limit helper for lead capture. It is intentionally simple and memory-based so the project has a clean integration point without forcing a production backend choice.

For VPS production, prefer one of:

- Nginx `limit_req` for coarse request limiting
- Redis-backed shared limiting if multiple app instances will be used
- provider-specific limits for external messaging actions

## Backups And Restore

Recommended baseline:

- daily PostgreSQL logical backup with `pg_dump`
- weekly encrypted off-server copy
- retention policy for at least 7 daily and 4 weekly backups

Example backup:

```powershell
pg_dump --format=custom --file=eros_enterprises.dump --dbname="$env:DATABASE_URL"
```

Example restore:

```powershell
pg_restore --clean --if-exists --no-owner --dbname="$env:DATABASE_URL" eros_enterprises.dump
```

Always test restore on a non-production database before relying on backups.

## Deployment Checklist

- `npm ci` completed successfully
- environment file created from `.env.example`
- `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` set and stable across deploys
- `DEPLOYMENT_VERSION` updated for the release
- `npx prisma migrate deploy` completed
- `npm run verify` passed
- `.next` and other build directories remain ignored by git
- PM2 process restarted cleanly
- Nginx config reloaded successfully
- homepage, contact page, one service page, and all dashboard index routes checked after deploy
