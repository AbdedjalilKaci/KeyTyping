import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter an email and password');
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user || !user.passwordHash) {
                        throw new Error('No user found with this email');
                    }

                    const isPasswordValid = await compare(
                        credentials.password,
                        user.passwordHash
                    );

                    if (!isPasswordValid) {
                        throw new Error('Incorrect password');
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    };
                } catch (error: any) {
                    console.error('NextAuth Authorize Error:', error);
                    throw new Error(error.message || 'Authentication failed');
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
};
