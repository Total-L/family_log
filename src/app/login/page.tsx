"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);
    const { login } = useAuth();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(code);
        if (!success) {
            setError(true);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-background)]">
            <div className="w-full max-w-md card text-center">
                <h1 className="text-4xl mb-2 text-[var(--color-primary)]">🏠 亲情时光</h1>
                <p className="text-xl text-[var(--color-text-muted)] mb-8">输入家庭码进入</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="tel"
                            placeholder="请输入密码 (如 1234)"
                            className="w-full text-center text-3xl p-4 rounded-xl border-2 border-stone-300 focus:border-[var(--color-primary)] outline-none"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                setError(false);
                            }}
                            maxLength={4}
                        />
                        {error && <p className="text-red-500 mt-2 text-lg">密码不对哦，再试一次</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full btn-primary text-2xl py-4"
                    >
                        进 入
                    </button>
                </form>

                <div className="mt-8 text-stone-400 text-sm">
                    <p>爷爷账号: 1234</p>
                    <p>子女账号: 5678</p>
                </div>
            </div>
        </div>
    );
}
