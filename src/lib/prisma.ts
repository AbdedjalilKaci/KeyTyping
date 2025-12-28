import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

if (!process.env.DATABASE_URL) {
    const errorMessage = '⚠️ DATABASE_URL is not set. Database features will not work.';
    if (process.env.NODE_ENV === 'production') {
        throw new Error(errorMessage + ' Please set DATABASE_URL in your Vercel environment variables.');
    }
    console.warn(errorMessage);
}

// Prisma Client configuration optimized for serverless environments (Vercel)
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
