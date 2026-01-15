"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (isRegister) {
            // Sign Up
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) {
                alert('注册失败: ' + error.message);
            } else {
                // Create initial profile
                if (data.user) {
                    await supabase.from('profiles').insert({
                        id: data.user.id,
                        full_name: email.split('@')[0],
                    });
                    alert('注册成功！请登录。');
                    setIsRegister(false);
                }
            }
        } else {
            // Sign In
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                alert('登录失败: ' + error.message);
            } else {
                router.replace('/');
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-background)]">
            <div className="w-full max-w-md card text-center">
                <h1 className="text-4xl mb-2 text-[var(--color-primary)]">🏠 亲情时光</h1>
                <p className="text-xl text-[var(--color-text-muted)] mb-8">
                    {isRegister ? '注册新账号' : '登录您的家庭'}
                </p>

                <form onSubmit={handleAuth} className="space-y-6">
                    <input
                        type="email"
                        placeholder="邮箱地址"
                        className="w-full text-lg p-4 rounded-xl border-2 border-stone-300 outline-none focus:border-[var(--color-primary)]"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="密码"
                        className="w-full text-lg p-4 rounded-xl border-2 border-stone-300 outline-none focus:border-[var(--color-primary)]"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary text-2xl py-4 disabled:opacity-50"
                    >
                        {loading ? '处理中...' : (isRegister ? '注 册' : '登 录')}
                    </button>
                </form>

                <div className="mt-8">
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-stone-500 underline"
                    >
                        {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
                    </button>
                </div>
            </div>
        </div>
    );
}
