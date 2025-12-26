'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Settings, CircleUser, LogOut, Activity } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export function Navigation() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
      <div className="flex items-center gap-8">
        <Link href="/home" className="flex items-center gap-2">
          <span className="text-3xl">⌨</span>
          <span className="text-xl" style={{ color: '#ffffff' }}>KeyTyping</span>
        </Link>

        <div className="flex gap-8">
          <Link
            href="/home"
            className="transition-all hover:text-white relative group py-1"
            style={{ color: isActive('/home') ? '#ef4444' : '#9ca3af' }}
          >
            Test
            {isActive('/home') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ef4444]" />}
          </Link>
          <Link
            href="/dashboard"
            className="transition-all hover:text-white flex items-center gap-2 relative group py-1"
            style={{ color: isActive('/dashboard') ? '#ef4444' : '#9ca3af' }}
          >
            <Activity size={16} />
            Dashboard
            {isActive('/dashboard') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ef4444]" />}
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {session && <span className="text-gray-400 mr-2">Hi, {session.user?.name || session.user?.email}</span>}
        <Link
          href="/profile"
          className="p-2 rounded-lg transition-colors"
          style={{ color: isActive('/profile') ? '#ef4444' : '#9ca3af' }}
        >
          <CircleUser size={24} />
        </Link>
        <Link
          href="/settings"
          className="p-2 rounded-lg transition-colors"
          style={{ color: isActive('/settings') ? '#ef4444' : '#9ca3af' }}
        >
          <Settings size={24} />
        </Link>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg transition-colors"
          style={{ color: '#9ca3af' }}
        >
          <LogOut size={24} />
        </button>
      </div>
    </nav>
  );
}
