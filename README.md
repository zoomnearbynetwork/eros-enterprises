# Eros Enterprises

## Local PostgreSQL Setup (Windows)

This app is designed to use a normal PostgreSQL server on `localhost:5432`. The application database must be `eros_enterprises` and Prisma migrations use a dedicated shadow database named `eros_enterprises_shadow`.

1. Install PostgreSQL for Windows and make sure the Database Server is running.

2. Create the databases with `psql`:

```powershell
psql -U postgres -h localhost -p 5432 -d postgres -c "CREATE DATABASE eros_enterprises;"
psql -U postgres -h localhost -p 5432 -d postgres -c "CREATE DATABASE eros_enterprises_shadow;"
```

If the databases already exist, PostgreSQL will report that and you can continue.

3. Copy `.env.example` to `.env` and set your local PostgreSQL password:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/eros_enterprises?schema=public"
SHADOW_DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/eros_enterprises_shadow?schema=public"
```

4. Generate the Prisma client:

```powershell
npx prisma generate
```

5. Apply the local migration:

```powershell
npx prisma migrate dev --name phase4_crm_core
```

6. Seed demo roles, services, and users:

```powershell
npx prisma db seed
```

7. Start the app:

```powershell
npm run dev
```

8. Run the verification build:

```powershell
npm run verify
```

## Production

Production deployment notes, PM2 config, Nginx guidance, PostgreSQL setup, and backup/checklist instructions live in `docs/production-deployment.md`.
