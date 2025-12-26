import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';
export const runtime = 'nodejs'

const resultSchema = z.object({
    wpm: z.number().int().min(0),
    accuracy: z.number().min(0).max(100),
    time: z.number().int().positive(),
});

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const userId = session.user.id;

        const recentTests = await prisma.result.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });

        const aggregations = await prisma.result.aggregate({
            where: { userId },
            _avg: {
                wpm: true,
                accuracy: true,
            },
            _max: {
                wpm: true,
            },
            _count: {
                id: true,
            },
        });

        const stats = {
            averageWPM: Math.round(aggregations._avg.wpm || 0),
            averageAccuracy: Math.round(aggregations._avg.accuracy || 0),
            bestWPM: aggregations._max.wpm || 0,
            totalTests: aggregations._count.id || 0,
        };

        return NextResponse.json({ recentTests, stats });
    } catch (error) {
        console.error('Error fetching results:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const json = await req.json();
        const body = resultSchema.parse(json);

        const result = await prisma.result.create({
            data: {
                wpm: body.wpm,
                accuracy: body.accuracy,
                time: body.time,
                userId: session.user.id,
            },
        });

        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 });
        }
        console.error('Error saving result:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
