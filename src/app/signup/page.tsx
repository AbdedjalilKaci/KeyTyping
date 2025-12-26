'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Github, UserPlus } from 'lucide-react';
import { signIn } from 'next-auth/react';
import axios from 'axios';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await axios.post('/api/register', {
                name: `${name} ${surname}`,
                email,
                password,
            });

            if (res.status === 201) {
                const result = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });

                if (result?.error) {
                    setError('Account created, please sign in manually.');
                    router.push('/login');
                } else {
                    router.push('/home');
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-3xl font-light text-white mb-6">
                        <span>⌨</span>
                        <span>Key<span className="text-[#ef4444] font-bold italic">Typing</span></span>
                    </Link>
                    <h2 className="text-4xl font-light text-white mb-2">Create Account</h2>
                    <p className="text-gray-400">Join the elite typing community</p>
                </div>

                <div className="bg-[#151515] p-8 rounded-2xl border border-white/5 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">First Name</label>
                                <input
                                    type="text"
                                    placeholder="John"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Doe"
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
                            <input
                                type="password"
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] outline-none transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-[#ef4444] text-white rounded-xl font-semibold text-lg hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? 'Creating account...' : (
                                <>
                                    <UserPlus size={20} className="group-hover:translate-x-1 transition-transform" />
                                    Get Started
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/5"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#151515] px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all group">
                            <Github size={20} />
                            <span className="text-sm">GitHub</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all">
                            <span className="text-xl font-bold text-red-500">G</span>
                            <span className="text-sm">Google</span>
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#ef4444] font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
