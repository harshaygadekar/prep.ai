# Database Setup Instructions

## Quick Fix for DATABASE_URL Error

You're seeing the error because the DATABASE_URL needs your Supabase password. Here's how to fix it:

### Option 1: Get Your Supabase Password (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard/project/dxdeqzpwjglrboaxmmwh
2. Click on "Project Settings" (gear icon)
3. Click on "Database" in the left sidebar
4. Under "Connection string", select "URI" format
5. Copy the connection string
6. Replace the DATABASE_URL in your `.env` file with the copied string

### Option 2: Reset Your Database Password

1. Go to https://supabase.com/dashboard/project/dxdeqzpwjglrboaxmmwh/settings/database
2. Under "Database Password", click "Reset database password"
3. Copy the new password
4. Update your `.env` file:
   ```
   DATABASE_URL=postgresql://postgres.dxdeqzpwjglrboaxmmwh:[YOUR_PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
   Replace `[YOUR_PASSWORD]` with the password you just copied

### After Setting DATABASE_URL

Run these commands:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Restart your dev server
npm run dev
```

## Verify Setup

Once done, visit http://localhost:3000/dashboard and you should see the new UI without database errors!

## Alternative: Use MockDataService (Temporary)

If you want to test the UI immediately without setting up the database, I can temporarily switch back to MockDataService. However, for production, you'll need the real database.
