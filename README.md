# PrepAI - AI-Powered Interview Platform

A professional, AI-powered interview preparation platform built with Next.js 14, Prisma, PostgreSQL, and Groq AI.

## Features

- **AI-Powered Interviews**: Practice with intelligent AI interviewers powered by Groq
- **Real-time Voice Interviews**: Integrated with Retell AI for realistic voice-based interviews
- **Comprehensive Analytics**: Track performance, identify strengths, and get personalized feedback
- **Multiple AI Interviewers**: Each with unique personalities, expertise, and interview styles
- **Resume-Based Questions**: Upload your resume to get tailored interview questions
- **Performance Scoring**: Advanced AI scoring across multiple dimensions
- **Professional UI**: Modern, clean design with violet/slate color scheme
- **Multi-tenant Support**: Organization-based access via Clerk authentication

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Supabase) with Prisma ORM
- **AI**: Groq AI for fast inference (mixtral-8x7b-32768, llama3-70b-8192)
- **Voice AI**: Retell AI for realistic voice interviews
- **Authentication**: Clerk with organization support
- **UI**: Tailwind CSS, shadcn/ui, react-icons (HeroIcons)
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (Supabase recommended)
- Clerk account for authentication
- Groq API key for AI features
- Retell AI API key for voice interviews (optional)

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Groq AI (Inference Provider)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=mixtral-8x7b-32768

# Retell AI (Voice Interviews)
RETELL_API_KEY=your_retell_api_key_here

# App URL
NEXT_PUBLIC_LIVE_URL=http://localhost:3000
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd prepai
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Database

#### Option A: Using Supabase (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use existing one
3. Get your connection string from **Settings → Database**
4. Use the **Transaction** pooler connection string
5. Add it to your `.env` file as `DATABASE_URL`

#### Option B: Local PostgreSQL

```bash
# Ensure PostgreSQL is running locally
DATABASE_URL="postgresql://postgres:password@localhost:5432/prepai"
```

### 4. Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 5. Configure Authentication (Clerk)

1. Create account at [Clerk.com](https://clerk.com)
2. Create a new application
3. Get your API keys from **API Keys** section
4. Add keys to `.env` file
5. Configure organizations in Clerk dashboard

### 6. Get Groq API Key

1. Go to [Groq Console](https://console.groq.com)
2. Sign up or log in
3. Navigate to [API Keys](https://console.groq.com/keys)
4. Create a new API key
5. Add to `.env` as `GROQ_API_KEY`

### 7. (Optional) Configure Retell AI

1. Sign up at [Retell AI](https://www.retellai.com)
2. Get your API key
3. Add to `.env` as `RETELL_API_KEY`
4. Note: App works without this, but voice interviews will use mock mode

### 8. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
prepai/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── (client)/          # Client dashboard routes
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   │   ├── page.tsx
│   │   │   │   ├── interviewers/
│   │   │   │   ├── analytics/
│   │   │   │   ├── results/
│   │   │   │   ├── settings/
│   │   │   │   └── help/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (user)/
│   │   │   └── call/          # Interview call interface
│   │   ├── api/               # API routes
│   │   │   ├── interviewers/
│   │   │   ├── interviews/
│   │   │   ├── analytics/
│   │   │   ├── scoring/
│   │   │   └── ...
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── navbar.tsx
│   │   └── sideMenu.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── db.service.ts      # Database operations
│   │   └── groq.service.ts    # AI operations
│   └── types/                 # TypeScript types
├── .env                       # Environment variables
├── .env.example              # Environment template
└── README.md
```

## Key Features Explained

### 1. AI Interviewers

Create and manage AI interviewers with:
- Unique personalities and expertise areas
- Customizable interview styles
- Role-specific question generation
- Voice-based interview capabilities (via Retell AI)

### 2. Interview Creation

- Upload resume for personalized questions
- Choose from multiple AI interviewers
- Set interview objectives and parameters
- Generate questions automatically with Groq AI

### 3. Real-time Scoring

- Multi-dimensional scoring:
  - Communication clarity
  - Technical accuracy
  - Problem-solving approach
  - Confidence level
  - Response relevance
- AI-powered feedback with strengths and improvements
- Detailed performance analytics

### 4. Analytics Dashboard

- Performance trends over time
- Skill breakdown visualization
- Success rate tracking
- Interview history
- Personalized recommendations

## API Endpoints

### Interviewers

- `GET /api/interviewers` - Get all interviewers
- `POST /api/interviewers` - Create interviewer
- `GET /api/interviewers?id={id}` - Get single interviewer

### Interviews

- `GET /api/interviews` - Get user's interviews
- `POST /api/create-interview` - Create new interview
- `GET /api/interviews/{id}` - Get interview details

### Sessions & Scoring

- `POST /api/register-call` - Register voice interview session
- `POST /api/scoring` - Score interview response
- `GET /api/scoring?sessionId={id}` - Get session scores

### Analytics

- `GET /api/analytics` - Get user analytics
- `GET /api/analytics?interviewId={id}` - Get interview-specific analytics

### AI Services

- `POST /api/generate-interview-questions` - Generate questions with AI
- `POST /api/resume-upload` - Upload resume and get questions
- `POST /api/interview-session` - Start AI interview session

## Database Schema

The application uses 5 main models:

1. **Interviewer** - AI interviewer profiles
2. **Interview** - Interview configurations
3. **Session** - Interview sessions
4. **Response** - Question-answer pairs with scores
5. **Resume** - Uploaded resume data

View the complete schema in [`prisma/schema.prisma`](prisma/schema.prisma)

## Development

### Run Tests

```bash
npm run test
```

### Build for Production

```bash
npm run build
```

### Database Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name your_migration_name

# Push schema changes
npx prisma db push

# Open Prisma Studio
npx prisma studio
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables
4. Deploy

### Other Platforms

- Ensure Node.js 18+ runtime
- Set all environment variables
- Run `npm run build`
- Start with `npm run start`

## Troubleshooting

### Database Connection Issues

```bash
# Verify DATABASE_URL format
postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true

# Test connection
npx prisma db push
```

### Prisma Client Not Generated

```bash
npx prisma generate
```

### Missing Environment Variables

Check `.env.example` for all required variables

### Groq AI Errors

- Verify API key is correct
- Check rate limits at [Groq Console](https://console.groq.com)
- Ensure `GROQ_MODEL` is set correctly

## Design System

### Colors

- Primary: Violet (`violet-600`, `violet-500`)
- Secondary: Indigo (`indigo-600`, `indigo-500`)
- Neutral: Slate (`slate-900`, `slate-600`, `slate-200`)
- Success: Emerald (`emerald-600`)
- Warning: Amber (`amber-600`)
- Error: Red (`red-600`)

### Icons

All icons use `react-icons/hi` (HeroIcons)

### Typography

- Headings: Bold, slate-900
- Body: Regular, slate-600
- Links: Medium, violet-600

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues and questions:
- Check existing issues on GitHub
- Review documentation files:
  - [SETUP_GUIDE.md](SETUP_GUIDE.md)
  - [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
  - [DATABASE_SETUP.md](DATABASE_SETUP.md)
  - [NEXT_STEPS.md](NEXT_STEPS.md)

## License

[Your License Here]

## Acknowledgments

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Groq](https://groq.com)
- [Retell AI](https://www.retellai.com)
- [Clerk](https://clerk.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com)
