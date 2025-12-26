'use client';

import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { TypingTest } from '../components/TypingTest';

export default function HomePage() {
    const [testId, setTestId] = useState(0);

    const handleTitleClick = () => {
        setTestId(prev => prev + 1);
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'transparent', fontFamily: 'Inter, sans-serif' }}>
            <Navigation />

            <main className="flex-1 text flex flex-col items-center justify-center">
                <div className="text-center mb-8">
                    <h1
                        onClick={handleTitleClick}
                        className="text-5xl mb-4 cursor-pointer hover:opacity-80 transition-opacity select-none"
                        style={{ color: '#ffffff' }}
                    >
                        KeyTyping
                    </h1>
                </div>

                <TypingTest key={testId} />
            </main>
        </div>
    );
}
