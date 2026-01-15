import { Story } from '@/lib/types';
import Image from 'next/image';

interface StoryCardProps {
    story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
    return (
        <div className="card mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center text-xl overflow-hidden mr-3">
                    {/* Fallback avatar if no image */}
                    {story.authorAvatar ? (
                        <div className="w-full h-full relative">
                            {/* In a real app we'd use Next/Image with blur */}
                            <img src={story.authorAvatar} alt={story.authorName} className="object-cover w-full h-full" />
                        </div>
                    ) : (
                        <span>{story.authorName[0]}</span>
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-lg text-[var(--color-primary)]">{story.authorName}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        {new Date(story.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                </div>
            </div>



            <p className="text-lg whitespace-pre-wrap mb-4 leading-relaxed">
                {story.content}
            </p>

            {story.imageUrls.length > 0 && (
                <div className="mb-4 rounded-xl overflow-hidden">
                    {story.imageUrls.map((url, idx) => (
                        <img key={idx} src={url} alt="Memory" className="w-full h-auto object-cover" />
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                <button className="flex items-center space-x-2 text-[var(--color-text-muted)] hover:text-red-500 transition-colors">
                    <span className="text-2xl">❤️</span>
                    <span className="font-bold">{story.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-[var(--color-text-muted)]">
                    <span className="text-2xl">💬</span>
                    <span>评论</span>
                </button>
            </div>
        </div>
    );
}
