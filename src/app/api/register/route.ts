import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';

export const runtime = 'nodejs';

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        console.log('Registration request received');
        const body = await req.json();
        console.log('Request body:', body);

        const validated = userSchema.safeParse(body);
        if (!validated.success) {
            console.error('Validation error:', validated.error);
            return NextResponse.json({ message: 'Invalid input', errors: validated.error.issues }, { status: 400 });
        }

        const { email, password, name } = validated.data;

        console.log('Checking if user exists:', email);
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log('User already exists');
            return NextResponse.json(
                { user: null, message: 'User with this email already exists' },
                { status: 409 }
            );
        }

        console.log('Hashing password...');
        const passwordHash = await hash(password, 10);

        console.log('Creating user in database...');
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                passwordHash,
            },
        });

        const { passwordHash: _, ...userWithoutPassword } = newUser;
        console.log('User created successfully:', newUser.id);

        return NextResponse.json(
            { user: userWithoutPassword, message: 'User created successfully' },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration Error Details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code // Prisma error codes
        });

        return NextResponse.json(
            { message: 'Something went wrong on server', details: error.message },
            { status: 500 }
        );
    }
}
