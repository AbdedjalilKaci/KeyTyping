import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

if (!process.env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL is not set. Database features will not work.');
}

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
