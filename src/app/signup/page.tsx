'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Github } from 'lucide-react';
import { signIn } from 'next-auth/react';
import axios from 'axios';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post('/api/register', {
                name: `${name} ${surname}`,
                email,
                password,
            });

            if (res.status === 200) {
                const result = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });

                if (result?.error) {
                    setError('Registration successful but login failed. Please login manually.');
                    router.push('/login');
                } else {
                    router.push('/home');
                }
            } else {
                const data = await res.data;
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Something went wrong')
        }
    };

    return (
        <div className="signup h-screen w-screen overflow-hidden flex font-sans justify-center items-center " style={{ backgroundColor: 'transparent' }}>
            <div className="">
                <a href="/" className="absolute top-10 left-10 text-3xl font-light   text-white mb-2">Key <span className="text-[#ef4444] font-bold font-script italic">Typing</span></a>
                <h2 className="text-5xl font-light rotate-[-45deg] text-white mb-2">
                    Join us for <span className="text-[#ef4444] font-bold font-script italic">speed Time</span>
                </h2>
            </div>
            <div className="w-full lg:w-1/2 h-full flex items-center justify-center mt-20  relative">
                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-10 ">
                        {error && <div className="text-red-500 text-center">{error}</div>}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Firstname"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-[#151515] border border-[#ef4444] rounded-2xl text-white placeholder-gray-500 focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Lastname"
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-[#151515] border border-[#ef4444] rounded-2xl text-white placeholder-gray-500 focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 bg-[#151515] py-2.5   border border-[#ef4444]  rounded-2xl text-white placeholder-gray-500 focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#151515] border  border-[#ef4444] rounded-2xl text-white placeholder-gray-500 focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] outline-none transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-[#ef4444] text-white rounded-full font-medium text-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                        >
                            Get Started
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
                            You have account!{' '}
                            <Link href="/login" className="text-[#ef4444] italic font-script text-lg ml-1 hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
