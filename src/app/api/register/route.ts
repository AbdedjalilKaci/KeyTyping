import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';
export const runtime = 'nodejs'

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name } = userSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { user: null, message: 'User with this email already exists' },
                { status: 409 }
            );
        }

        const passwordHash = await hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                passwordHash,
            },
        });

        const { passwordHash: _, ...userWithoutPassword } = newUser;

        return NextResponse.json(
            { user: userWithoutPassword, message: 'User created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration Error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
        }
        return NextResponse.json(
            { message: 'Something went wrong on server' },
            { status: 500 }
        );
    }
}
