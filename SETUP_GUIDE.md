# PrepAI Setup Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Supabase recommended)
- Clerk account for authentication
- Retell AI API key
- Groq API key

## Environment Setup

1. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your `.env` file with the following:**

   ```env
   # App Configuration
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   NEXT_PUBLIC_LIVE_URL=localhost:3000

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Supabase Database
   DATABASE_URL=postgresql://user:password@host:port/database?schema=public
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Retell AI (Voice Interviews)
   RETELL_API_KEY=your_retell_api_key

   # Groq AI (Inference Provider)
   GROQ_API_KEY=your_groq_api_key
   GROQ_MODEL=mixtral-8x7b-32768
   ```

## Database Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

3. **Push schema to database:**
   ```bash
   npx prisma db push
   ```

   Or create and run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed default data (optional):**
   ```bash
   npx prisma db seed
   ```

## Groq AI Models

Choose from available Groq models and set in `GROQ_MODEL`:
- `mixtral-8x7b-32768` (Recommended - balanced performance)
- `llama3-70b-8192` (High quality, longer context)
- `llama3-8b-8192` (Fast, lower cost)
- `gemma-7b-it` (Alternative option)

Visit https://console.groq.com/docs/models for the latest models.

## Running the Application

1. **Development mode:**
   ```bash
   npm run dev
   ```

2. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Key Features Implemented

### Backend
- ✅ Prisma ORM with PostgreSQL
- ✅ Clerk authentication with multi-tenant support
- ✅ Groq AI for question generation and analysis
- ✅ Retell AI for voice interviews
- ✅ Comprehensive scoring system
- ✅ Resume parsing and analysis

### Frontend
- ✅ Modern, professional UI design
- ✅ Responsive layouts
- ✅ shadcn/ui components
- ✅ React-icons throughout
- ✅ Real-time interview interface
- ✅ Analytics dashboard

## Architecture Overview

```
src/
├── app/
│   ├── (client)/          # Protected dashboard routes
│   ├── (user)/            # Public interview interface
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # React components
├── lib/
│   ├── prisma.ts          # Prisma client
│   ├── db.service.ts      # Database service layer
│   └── groq.service.ts    # Groq AI service
└── prisma/
    └── schema.prisma      # Database schema
```

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check firewall/network settings

### Prisma Errors
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Re-generate client
npx prisma generate
```

### Authentication Issues
- Verify Clerk keys are correct
- Check middleware configuration
- Ensure routes are properly protected

## Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database
- Use Supabase for managed PostgreSQL
- Or deploy your own PostgreSQL instance
- Run migrations after deployment

## Support

For issues or questions:
- Check Groq docs: https://console.groq.com/docs
- Clerk docs: https://clerk.com/docs
- Retell AI docs: https://docs.retellai.com
