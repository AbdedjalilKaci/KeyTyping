import Link from 'next/link';
import { Keyboard, Activity } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'transparent', fontFamily: 'Inter, sans-serif' }}>
            <header className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div className="flex items-center gap-2">
                    <span className="text-4xl">⌨</span>
                    <span className="text-2xl" style={{ color: '#ffffff' }}>KeyTyping</span>
                </div>
                <div className="flex gap-4">
                    <Link
                        href="/login"
                        className="px-6 py-2 rounded-lg transition-colors"
                        style={{ color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                    >
                        Login
                    </Link>
                    <Link
                        href="/signup"
                        className="px-6 py-2 rounded-lg transition-all hover:scale-105"
                        style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                    >
                        Sign Up
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative">
                <div className="max-w-4xl text-center mb-12">
                    <h1 className="text-6xl mb-6 font-light" style={{ color: '#ffffff', fontFamily: '"Caveat", cursive' }}>
                        Check your typing <span style={{ color: '#ef4444', fontStyle: 'italic' }}>speed in seconds!</span>
                    </h1>
                    <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#e5e7eb' }}>
                        Take a quick typing test to measure your speed and accuracy, improve your skills, and track your progress over time.
                    </p>
                    <Link
                        href="/home"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full transition-all hover:scale-105 text-xl font-medium"
                        style={{ backgroundColor: '#ef4444', color: '#ffffff', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)' }}
                    >
                        Start Your First Sprint →
                    </Link>
                </div>

                {/* <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center animate-bounce">
                    <p className="text-sm mb-2" style={{ color: '#ffffff' }}>View More</p>
                    <div className="w-6 h-10 border-2 rounded-full flex justify-center p-1" style={{ borderColor: '#ef4444' }}>
                        <div className="w-1 h-2 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                    </div>
                </div> */}

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mt-16">
                    <div
                        className="p-6 rounded-xl"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                    >
                        <Keyboard size={40} style={{ color: '#ef4444', marginBottom: '16px' }} />
                        <h3 className="text-xl mb-2" style={{ color: '#ffffff' }}>Clean Interface</h3>
                        <p style={{ color: '#9ca3af' }}>Minimalist design focused on your typing performance without distractions</p>
                    </div>

                    <div
                        className="p-6 rounded-xl"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                    >
                        <Activity size={40} style={{ color: '#ef4444', marginBottom: '16px' }} />
                        <h3 className="text-xl mb-2" style={{ color: '#ffffff' }}>Real-time Stats</h3>
                        <p style={{ color: '#9ca3af' }}>Track your WPM, accuracy, and progress with instant feedback</p>
                    </div>

                    <div
                        className="p-6 rounded-xl"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                    >
                        <span className="text-4xl mb-4 block">💻</span>
                        <h3 className="text-xl mb-2" style={{ color: '#ffffff' }}>Developer Friendly</h3>
                        <p style={{ color: '#9ca3af' }}>Practice with programming terms and common code patterns</p>
                    </div>
                </div>
            </main>

            <footer className="px-6 py-6 text-center" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', color: '#6b7280' }}>
                <p>© 2024 KeyTyping. All rights reserved.</p>
            </footer>
        </div>
    );
}
