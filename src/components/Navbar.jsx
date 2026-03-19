"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="w-full py-4 border-b border-gray-800 mb-6 bg-[#121212]">
      <div className="max-w-7xl mx-auto container-padding flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tight text-text-primary uppercase">
          PrimeTrade<span className="text-accent-buy">AI</span>
        </Link>
        <nav className="flex gap-4 items-center">
          {!loading && (
            user ? (
              <div className="flex items-center gap-4">
                <div className="text-sm text-text-secondary hidden md:block">
                  <span className="font-semibold text-text-primary mr-2 uppercase tracking-wide">{user.username}</span>
                  {user.role === 'admin' && (
                    <span className="px-2 py-0.5 rounded-full bg-accent-sell/20 text-accent-sell text-xs font-bold uppercase">ADMIN</span>
                  )}
                </div>
                <Button variant="ghost" className="text-sm" onClick={logout}>Sign Out</Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="primary">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="buy">Register</Button>
                </Link>
              </div>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
