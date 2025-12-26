import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '../../../lib/prisma';
import { hash } from 'bcryptjs';
import { z } from 'zod';
export const runtime = 'nodejs'

const userUpdateSchema = z.object({
    name: z.string().min(2).optional(),
    password: z.string().min(6).optional(),
});

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const json = await req.json();
        const body = userUpdateSchema.parse(json);

        const dataToUpdate: any = {};
        if (body.name) dataToUpdate.name = body.name;
        if (body.password) {
            dataToUpdate.passwordHash = await hash(body.password, 12);
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: dataToUpdate,
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 });
        }
        console.error('Error updating user:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        await prisma.result.deleteMany({
            where: { userId: session.user.id },
        });

        await prisma.user.delete({
            where: { id: session.user.id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting user:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
