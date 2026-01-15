"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function NewMemoryPage() {
    const { user, addStory } = useAuth();
    const router = useRouter();
    const [content, setContent] = useState('');
    const [isRecording, setIsRecording] = useState(false);

    if (!user) {
        router.replace('/login');
        return null;
    }

    const handleSave = async () => {
        if (!content.trim()) return;

        // Use Context to save. No need to pass full object as Context knows User/Family.
        await addStory(content, []);
        router.push('/');
    };

    // Web Speech API Integration
    const toggleRecord = () => {
        if (isRecording) {
            setIsRecording(false);
            return;
        }

        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('您的浏览器不支持语音识别，请使用Chrome或Edge');
            return;
        }

        setIsRecording(true);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'zh-CN'; // Set to Chinese
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setContent(prev => prev + ' ' + transcript);
            setIsRecording(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsRecording(false);
            alert('语音识别失败，请重试');
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.start();
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
            <header className="px-4 py-4 flex items-center border-b border-stone-100 bg-white">
                <button onClick={() => router.back()} className="text-lg text-[var(--color-primary)] font-bold mr-4">
                    ← 返回
                </button>
                <h1 className="text-xl font-bold">记录新回忆</h1>
            </header>

            <div className="flex-1 p-4 max-w-md mx-auto w-full flex flex-col">
                <textarea
                    className="flex-1 w-full p-4 text-xl bg-transparent outline-none resize-none placeholder-stone-400"
                    placeholder="今天发生了什么有趣的事？..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />

                <div className="mt-4 mb-8 space-y-4">
                    <button
                        onClick={toggleRecord}
                        className={`w-full py-6 rounded-2xl flex items-center justify-center space-x-2 text-xl font-bold transition-all ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-stone-100 text-stone-600'}`}
                    >
                        <span>{isRecording ? '正在录音...' : '🎤 点击说话'}</span>
                    </button>

                    <button className="w-full py-4 rounded-xl bg-stone-100 text-stone-600 font-bold">
                        📷 添加照片
                    </button>
                </div>

                <button
                    onClick={handleSave}
                    disabled={!content.trim()}
                    className="w-full btn-primary py-4 text-xl disabled:opacity-50 disabled:bg-stone-300"
                >
                    发 布
                </button>
            </div>
        </div>
    );
}
