'use client';

import { Navigation } from '../components/Navigation';
import { Settings, User, Trash2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [wordCount, setWordCount] = useState('50');
    const [difficulty, setDifficulty] = useState('medium');
    const [soundEnabled, setSoundEnabled] = useState(true);

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session, status, router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsUpdating(true);

        try {
            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password: password || undefined }),
            });

            if (res.ok) {
                setMessage('Profile updated successfully (refresh to see changes)');
                setPassword('');
            } else {
                setMessage('Failed to update profile');
            }
        } catch (error) {
            setMessage('Error updating profile');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

        try {
            const res = await fetch('/api/user', {
                method: 'DELETE',
            });

            if (res.ok) {
                await signOut({ callbackUrl: '/' });
            } else {
                alert('Failed to delete account');
            }
        } catch (error) {
            alert('Error deleting account');
        }
    };

    if (status === 'loading') {
        return <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A', fontFamily: 'Inter, sans-serif' }}>
            <Navigation />

            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl mb-2 flex items-center gap-3" style={{ color: '#ffffff' }}>
                    <Settings size={36} style={{ color: '#ef4444' }} />
                    Settings
                </h1>
                <p className="mb-8" style={{ color: '#9ca3af' }}>Customize your typing experience</p>

                {/* Account Settings */}
                <div
                    className="p-8 rounded-xl mb-6"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                    <h2 className="text-2xl mb-6 flex items-center gap-2" style={{ color: '#ffffff' }}>
                        <User size={24} style={{ color: '#ef4444' }} />
                        Account Settings
                    </h2>

                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        {message && <div className={`text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{message}</div>}

                        <div>
                            <label className="block mb-2 text-sm" style={{ color: '#9ca3af' }}>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-[#0F172A] border border-[#ef4444] text-white focus:ring-1 focus:ring-[#ef4444] outline-none"
                                placeholder="Your Name"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm" style={{ color: '#9ca3af' }}>New Password (leave blank to keep current)</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-[#0F172A] border border-[#ef4444] text-white focus:ring-1 focus:ring-[#ef4444] outline-none"
                                placeholder="Min 6 characters"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="px-6 py-2 rounded-lg flex items-center gap-2 transition-all hover:bg-red-600 disabled:opacity-50"
                                style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                            >
                                <Save size={18} />
                                {isUpdating ? 'Saving...' : 'Save Changes'}
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                className="px-6 py-2 rounded-lg flex items-center gap-2 transition-all hover:bg-red-900/50"
                                style={{ backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}
                            >
                                <Trash2 size={18} />
                                Delete Account
                            </button>
                        </div>
                    </form>
                </div>

                {/* Test Settings */}
                <div
                    className="p-8 rounded-xl mb-6"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                    <h2 className="text-2xl mb-6" style={{ color: '#ffffff' }}>Test Settings</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block mb-3 text-sm" style={{ color: '#9ca3af' }}>Word Count</label>
                            <div className="flex gap-4">
                                {['25', '50', '100'].map((count) => (
                                    <button
                                        key={count}
                                        onClick={() => setWordCount(count)}
                                        className="px-6 py-2 rounded-lg transition-all"
                                        style={{
                                            backgroundColor: wordCount === count ? '#ef4444' : 'rgba(255, 255, 255, 0.05)',
                                            color: '#ffffff',
                                            border: `1px solid ${wordCount === count ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`
                                        }}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-3 text-sm" style={{ color: '#9ca3af' }}>Difficulty</label>
                            <div className="flex gap-4">
                                {['easy', 'medium', 'hard'].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setDifficulty(level)}
                                        className="px-6 py-2 rounded-lg transition-all capitalize"
                                        style={{
                                            backgroundColor: difficulty === level ? '#ef4444' : 'rgba(255, 255, 255, 0.05)',
                                            color: '#ffffff',
                                            border: `1px solid ${difficulty === level ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`
                                        }}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appearance Settings */}
                <div
                    className="p-8 rounded-xl mb-6"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                    <h2 className="text-2xl mb-6" style={{ color: '#ffffff' }}>Appearance</h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p style={{ color: '#ffffff' }}>Theme</p>
                                <p className="text-sm" style={{ color: '#9ca3af' }}>Dark mode only</p>
                            </div>
                            <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#9ca3af' }}>
                                Dark
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p style={{ color: '#ffffff' }}>Font</p>
                                <p className="text-sm" style={{ color: '#9ca3af' }}>Monospace font for typing</p>
                            </div>
                            <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#9ca3af', fontFamily: "'JetBrains Mono', monospace" }}>
                                JetBrains Mono
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audio Settings */}
                <div
                    className="p-8 rounded-xl"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                    <h2 className="text-2xl mb-6" style={{ color: '#ffffff' }}>Audio</h2>

                    <div className="flex items-center justify-between">
                        <div>
                            <p style={{ color: '#ffffff' }}>Sound Effects</p>
                            <p className="text-sm" style={{ color: '#9ca3af' }}>Play sounds on keypress</p>
                        </div>
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="px-6 py-2 rounded-lg transition-all"
                            style={{
                                backgroundColor: soundEnabled ? '#ef4444' : 'rgba(255, 255, 255, 0.05)',
                                color: '#ffffff',
                                border: `1px solid ${soundEnabled ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`
                            }}
                        >
                            {soundEnabled ? 'Enabled' : 'Disabled'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
