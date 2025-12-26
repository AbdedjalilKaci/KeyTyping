import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/index.css'; 
import ClientSessionProvider from '../components/ClientSessionProvider';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'KeyTyping - Speed Typing Website',
    description: 'Check your typing speed in seconds!',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ClientSessionProvider>
                    {children}
                </ClientSessionProvider>
            </body>
        </html>
    );
}
