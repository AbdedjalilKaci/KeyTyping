'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Github } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError('Invalid email or password');
        } else {
            router.push('/home');
        }
    };

    return (
        <div className="login h-screen w-screen overflow-hidden flex justify-center items-center font-sans" style={{ backgroundColor: 'transparent' }}>
            <div className="text-center mb-10">
                <a href="/" className="absolute top-10 left-10 text-3xl font-light   text-white mb-2">Key <span className="text-[#ef4444] font-bold font-script italic">Typing</span></a>
                <h2 className="text-4xl rotate-[-45deg]  font-light text-white mb-2">
                    Welcome Back to <span className="text-[#ef4444] font-script italic font-bold">KeyTyping</span>
                </h2>
            </div>
            <div className="w-full lg:w-1/2 h-full flex items-center mt-20 justify-center p-8 relative">
                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {error && <div className="text-red-500 text-center">{error}</div>}
                        <div className="space-y-2">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#151515] border border-[#ef4444] rounded-2xl text-white placeholder-gray-500 focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#151515] border border-[#ef4444] rounded-2xl text-white placeholder-gray-500 focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] outline-none transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-[#ef4444] text-white rounded-full font-medium text-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                        >
                            Login
                        </button>
                    </form>

                    <div className="mt-8 flex justify-center gap-4">
                        <button className="p-3 bg-white rounded-full hover:scale-110 transition-transform">
                            <Github size={24} className="text-black" />
                        </button>
                        <button className="p-3 bg-white rounded-full hover:scale-110 transition-transform flex items-center justify-center w-12 h-12">
                            <span className="text-2xl font-bold text-red-500">G</span>
                        </button>
                    </div>

                    <div className="mt-8 text-center text-gray-400">
                        <p className="text-sm">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-[#ef4444] italic font-script text-lg ml-1 hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
