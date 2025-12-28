# KeyTyping Speed Typing Website

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Deployment on Vercel

### Required Environment Variables

To deploy this project on Vercel, you need to set the following environment variables in your Vercel project settings:

1. **DATABASE_URL** - Your PostgreSQL database connection string
   - Example: `postgresql://user:password@host:port/database?schema=public`
   - You can use Vercel Postgres, Supabase, or any PostgreSQL provider

2. **NEXTAUTH_SECRET** - A random secret key for NextAuth.js
   - Generate one using: `openssl rand -base64 32`
   - Or use: https://generate-secret.vercel.app/32
   - Minimum 32 characters

3. **NEXTAUTH_URL** - Your production URL
   - For Vercel: `https://your-project-name.vercel.app`
   - This is required for authentication to work in production

### Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable above with its value
4. Make sure to select **Production**, **Preview**, and **Development** environments as needed
5. Redeploy your application after adding the variables

### Database Setup

1. Set up a PostgreSQL database (Vercel Postgres, Supabase, etc.)
2. Run Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```
   Or use Vercel's build command which includes `prisma generate` (already configured in package.json)

### Important Notes

- The `vercel.json` file is configured to use Node.js runtime for API routes
- All API routes are configured with `runtime = 'nodejs'` for proper server-side execution
- Make sure your database is accessible from Vercel's servers

Link of website:
https://key-typing-livid.vercel.app/
