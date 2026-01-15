"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
    const { user, refreshProfile } = useAuth();
    const router = useRouter();
    const [mode, setMode] = useState<'create' | 'join'>('create');
    const [familyName, setFamilyName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!user || !familyName) return;
        setLoading(true);

        // Generate random 6-char code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        const { data, error } = await supabase.from('families').insert({
            name: familyName,
            invite_code: code
        }).select().single();

        if (error) {
            alert('创建失败: ' + error.message);
        } else if (data) {
            // Update profile
            await supabase.from('profiles').update({
                family_id: data.id,
                role: 'admin'
            }).eq('id', user.id);

            await refreshProfile();
            router.replace('/');
        }
        setLoading(false);
    };

    const handleJoin = async () => {
        if (!user || !inviteCode) return;
        setLoading(true);

        // Find family
        const { data: families, error } = await supabase
            .from('families')
            .select('id')
            .eq('invite_code', inviteCode);

        if (error || !families || families.length === 0) {
            alert('邀请码无效，请检查');
            setLoading(false);
            return;
        }

        const familyId = families[0].id;

        // Update profile
        const { error: updateError } = await supabase.from('profiles').update({
            family_id: familyId,
            role: 'member'
        }).eq('id', user.id);

        if (updateError) {
            alert('加入失败: ' + updateError.message);
        } else {
            await refreshProfile();
            router.replace('/');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-background)]">
            <div className="w-full max-w-md card">
                <h1 className="text-3xl font-bold mb-6 text-center text-[var(--color-primary)]">欢迎, {user?.name}</h1>

                <div className="flex mb-8 border-b border-stone-200">
                    <button
                        className={`flex-1 py-3 text-lg font-bold ${mode === 'create' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-stone-400'}`}
                        onClick={() => setMode('create')}
                    >
                        创建新家庭
                    </button>
                    <button
                        className={`flex-1 py-3 text-lg font-bold ${mode === 'join' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-stone-400'}`}
                        onClick={() => setMode('join')}
                    >
                        加入家庭
                    </button>
                </div>

                {mode === 'create' ? (
                    <div className="space-y-6">
                        <p className="text-stone-500">创建一个新的家庭空间，您将成为管理员。</p>
                        <input
                            type="text"
                            placeholder="给家庭起个名字 (如: 王家大院)"
                            className="w-full p-4 rounded-xl border-2 border-stone-300 outline-none"
                            value={familyName}
                            onChange={e => setFamilyName(e.target.value)}
                        />
                        <button
                            onClick={handleCreate}
                            disabled={loading || !familyName}
                            className="w-full btn-primary py-4 text-xl"
                        >
                            {loading ? '创建中...' : '立即创建'}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <p className="text-stone-500">输入家人的邀请码，加入已有的家庭。</p>
                        <input
                            type="text"
                            placeholder="输入6位邀请码"
                            className="w-full p-4 rounded-xl border-2 border-stone-300 outline-none text-center uppercase tracking-widest"
                            value={inviteCode}
                            onChange={e => setInviteCode(e.target.value.toUpperCase())}
                            maxLength={6}
                        />
                        <button
                            onClick={handleJoin}
                            disabled={loading || inviteCode.length < 6}
                            className="w-full btn-primary py-4 text-xl"
                        >
                            {loading ? '加入中...' : '立即加入'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
