'use client';

import { Navigation } from '../components/Navigation';
import { Activity } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface TestResult {
    id: string;
    wpm: number;
    accuracy: number;
    time: number;
    createdAt: string;
}

interface Stats {
    averageWPM: number;
    bestWPM: number;
    averageAccuracy: number;
    totalTests: number;
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [recentTests, setRecentTests] = useState<TestResult[]>([]);
    const [stats, setStats] = useState<Stats>({
        averageWPM: 0,
        bestWPM: 0,
        averageAccuracy: 0,
        totalTests: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated') {
            const fetchData = async () => {
                try {
                    const res = await fetch('/api/results');
                    if (res.ok) {
                        const data = await res.json();
                        setRecentTests(data.recentTests);
                        setStats(data.stats);
                    }
                } catch (error) {
                    console.error('Failed to fetch dashboard data', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [status, router]);

    if (status === 'loading' || loading) {
        return <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A', fontFamily: 'Inter, sans-serif' }}>
            <Navigation />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-4xl mb-8" style={{ color: '#ffffff' }}>Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div
                        className="p-6 rounded-xl"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                    >
                        <p className="text-sm mb-2" style={{ color: '#9ca3af' }}>Average WPM</p>
                        <p className="text-3xl" style={{ color: '#ef4444', fontFamily: "'JetBrains Mono', monospace" }}>{stats.averageWPM}</p>
                    </div>

                    <div
                        className="p-6 rounded-xl"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                    >
                        <p className="text-sm mb-2" style={{ color: '#9ca3af' }}>Best WPM</p>
                        <p className="text-3xl" style={{ color: '#ffffff', fontFamily: "'JetBrains Mono', monospace" }}>{stats.bestWPM}</p>
                    </div>

                    <div
                        className="p-6 rounded-xl"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                    >
                        <p className="text-sm mb-2" style={{ color: '#9ca3af' }}>Avg Accuracy</p>
                        <p className="text-3xl" style={{ color: '#ffffff', fontFamily: "'JetBrains Mono', monospace" }}>{stats.averageAccuracy}%</p>
                    </div>

                    <div
                        className="p-6 rounded-xl"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                    >
                        <p className="text-sm mb-2" style={{ color: '#9ca3af' }}>Total Tests</p>
                        <p className="text-3xl" style={{ color: '#ffffff', fontFamily: "'JetBrains Mono', monospace" }}>{stats.totalTests}</p>
                    </div>
                </div>

                <div
                    className="p-6 rounded-xl"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                    <h2 className="text-2xl mb-6 flex items-center gap-2" style={{ color: '#ffffff' }}>
                        <Activity size={24} style={{ color: '#ef4444' }} />
                        Recent Tests
                    </h2>

                    <div className="space-y-4">
                        {recentTests.length === 0 ? (
                            <p className="text-gray-400">No tests taken yet. Go type!</p>
                        ) : (
                            recentTests.map((test) => (
                                <div
                                    key={test.id}
                                    className="p-4 rounded-lg flex items-center justify-between"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                                >
                                    <div>
                                        <p style={{ color: '#ffffff' }}>{new Date(test.createdAt).toLocaleDateString()}</p>
                                        <p className="text-sm" style={{ color: '#9ca3af' }}>{test.time}s</p>
                                    </div>
                                    <div className="flex gap-8">
                                        <div className="text-right">
                                            <p className="text-sm" style={{ color: '#9ca3af' }}>WPM</p>
                                            <p className="text-xl" style={{ color: '#ef4444', fontFamily: "'JetBrains Mono', monospace" }}>{test.wpm}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm" style={{ color: '#9ca3af' }}>Accuracy</p>
                                            <p className="text-xl" style={{ color: '#ffffff', fontFamily: "'JetBrains Mono', monospace" }}>{Math.round(test.accuracy)}%</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
