'use client';

import { Navigation } from '../components/Navigation';
import { useSession } from 'next-auth/react';
import { CircleUser } from 'lucide-react';

export default function ProfilePage() {
    const { data: session } = useSession();
    const user = session?.user;

    // Type assertion for user id since it might not be in the default type definition
    const userId = (user as any)?.id || 'Loading...';

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A', fontFamily: 'Inter, sans-serif' }}>
            <Navigation />

            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl mb-8" style={{ color: '#ffffff' }}>Profile</h1>

                <div
                    className="p-8 rounded-xl mb-8"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                    <div className="flex items-center gap-6 mb-8">
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                        >
                            <CircleUser size={48} style={{ color: '#ef4444' }} />
                        </div>
                        <div>
                            <h2 className="text-3xl mb-2" style={{ color: '#ffffff' }}>{user?.name || 'Guest'}</h2>
                            <p style={{ color: '#9ca3af' }}>{user?.email || 'No email'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm" style={{ color: '#9ca3af' }}>Name</label>
                            <input
                                type="text"
                                value={user?.name || ''}
                                readOnly
                                className="w-full px-4 py-3 rounded-lg outline-none"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#ffffff'
                                }}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm" style={{ color: '#9ca3af' }}>Email</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                readOnly
                                className="w-full px-4 py-3 rounded-lg outline-none"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#ffffff'
                                }}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm" style={{ color: '#9ca3af' }}>Member Since</label>
                            <input
                                type="text"
                                value="December 2024"
                                readOnly
                                className="w-full px-4 py-3 rounded-lg outline-none"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#ffffff'
                                }}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm" style={{ color: '#9ca3af' }}>User ID</label>
                            <input
                                type="text"
                                value={userId}
                                readOnly
                                className="w-full px-4 py-3 rounded-lg outline-none"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#ffffff'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Statistics Section */}
                <div
                    className="p-8 rounded-xl"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                    <h2 className="text-2xl mb-6" style={{ color: '#ffffff' }}>Your Statistics</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <p className="text-sm mb-2" style={{ color: '#9ca3af' }}>Tests Completed</p>
                            <p className="text-3xl" style={{ color: '#ef4444', fontFamily: "'JetBrains Mono', monospace" }}>24</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm mb-2" style={{ color: '#9ca3af' }}>Best WPM</p>
                            <p className="text-3xl" style={{ color: '#ffffff', fontFamily: "'JetBrains Mono', monospace" }}>82</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm mb-2" style={{ color: '#9ca3af' }}>Avg Accuracy</p>
                            <p className="text-3xl" style={{ color: '#ffffff', fontFamily: "'JetBrains Mono', monospace" }}>96%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm mb-2" style={{ color: '#9ca3af' }}>Total Time</p>
                            <p className="text-3xl" style={{ color: '#ffffff', fontFamily: "'JetBrains Mono', monospace" }}>24m</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
