"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Story, Family } from './types';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from './supabase';

interface AuthContextType {
    user: User | null;
    family: Family | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
    stories: Story[];
    addStory: (content: string, imageUrls?: string[]) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    family: null,
    isLoading: true,
    signOut: async () => { },
    stories: [],
    addStory: async () => { },
    refreshProfile: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [family, setFamily] = useState<Family | null>(null);
    const [stories, setStories] = useState<Story[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const refreshProfile = async () => {
        // 1. Get Auth Session
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            setUser(null);
            setFamily(null);
            setIsLoading(false);
            return;
        }

        // 2. Fetch Profile from DB
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (profile) {
            setUser({
                id: session.user.id,
                email: session.user.email,
                name: profile.full_name || session.user.email?.split('@')[0] || '家人',
                avatar: profile.avatar_url,
                role: profile.role as any,
                familyId: profile.family_id
            });

            // 3. Fetch Family if user has one
            if (profile.family_id) {
                const { data: fam } = await supabase
                    .from('families')
                    .select('*')
                    .eq('id', profile.family_id)
                    .single();

                if (fam) {
                    setFamily({
                        id: fam.id,
                        name: fam.name,
                        inviteCode: fam.invite_code
                    });
                    // Load Stories for this family
                    fetchStories(fam.id);
                } else {
                    // Profile has family_id but family not found? Edge case.
                    setFamily(null);
                }
            } else {
                setFamily(null);
            }
        } else {
            // Auth exists but no profile row? Create one? 
            // For simple MVP we might handle this in Login/Register flow explicitly.
            // Or create a blank one here.
        }

        setIsLoading(false);
    };

    const fetchStories = async (familyId: string) => {
        const { data, error } = await supabase
            .from('stories')
            .select('*')
            .eq('family_id', familyId)
            .order('created_at', { ascending: false });

        if (data) {
            const mappedStories: Story[] = data.map(d => ({
                id: d.id.toString(),
                authorId: d.author_id,
                familyId: d.family_id,
                authorName: d.author_name,
                authorAvatar: d.author_avatar,
                content: d.content || d.audio_text, // Simplified
                imageUrls: d.image_urls || [],
                likes: d.likes,
                createdAt: d.created_at,
            }));
            setStories(mappedStories);
        }
    };

    useEffect(() => {
        refreshProfile();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            refreshProfile();
        });

        return () => subscription.unsubscribe();
    }, []);

    // Protected Route Logic
    useEffect(() => {
        if (isLoading) return;
        const isAuthPage = pathname.startsWith('/login');
        const isOnboarding = pathname.startsWith('/onboarding');

        if (!user && !isAuthPage) {
            router.replace('/login');
        } else if (user && !family && !isOnboarding) {
            router.replace('/onboarding');
        } else if (user && family && (isAuthPage || isOnboarding)) {
            router.replace('/');
        }
    }, [user, family, isLoading, pathname, router]);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setFamily(null);
        router.replace('/login');
    };

    const addStory = async (content: string, imageUrls: string[] = []) => {
        if (!user || !family) return;

        const { error } = await supabase.from('stories').insert({
            author_id: user.id,
            family_id: family.id,
            author_name: user.name,
            author_avatar: user.avatar,
            content: content,
            image_urls: imageUrls,
        });

        if (!error) {
            fetchStories(family.id); // Refresh
        } else {
            console.error(error);
            alert('发布失败，请重试');
        }
    };

    return (
        <AuthContext.Provider value={{ user, family, isLoading, signOut, stories, addStory, refreshProfile }}>
            {isLoading ? (
                <div className="flex h-screen items-center justify-center bg-[var(--color-background)]">
                    <div className="animate-spin text-4xl">⏳</div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
