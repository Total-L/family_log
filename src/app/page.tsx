"use client";

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import StoryCard from '@/components/StoryCard';
import Link from 'next/link';

export default function Home() {
  const { user, family, signOut, isLoading, stories } = useAuth();
  const router = useRouter();

  // Auth check handled in Context, but extra safety or loading state
  if (isLoading) return null;
  if (!user || !family) return null;

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--color-background)]/95 backdrop-blur-md shadow-sm px-4 py-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-[var(--color-primary)] m-0">{family.name}</h1>
          <button
            onClick={signOut}
            className="text-sm bg-stone-100 text-stone-600 px-3 py-1 rounded-lg hover:bg-stone-200"
          >
            退出
          </button>
        </div>
        <div className="flex justify-between items-center text-sm text-stone-500">
          <p>👋 下午好, {user.name}</p>
          <p className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded">邀请码: <span className="font-bold select-all">{family.inviteCode}</span></p>
        </div>
      </header>

      {/* Timeline */}
      <div className="max-w-md mx-auto p-4 pb-24">
        {stories.map(story => (
          <StoryCard key={story.id} story={story} />
        ))}
        {stories.length === 0 && (
          <div className="text-center py-10 text-stone-400">
            还没有任何回忆，快去添加第一条吧！
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Link href="/new">
        <button className="fixed bottom-6 right-6 w-16 h-16 bg-[var(--color-primary)] text-white rounded-full shadow-lg flex items-center justify-center text-3xl hover:scale-105 transition-transform active:scale-95">
          +
        </button>
      </Link>
    </main>
  );
}
