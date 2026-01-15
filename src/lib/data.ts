import { Story } from './types';

export const MOCK_STORIES: Story[] = [
    {
        id: 's1',
        authorId: 'u1',
        authorName: '爷爷',
        authorAvatar: '/avatars/grandpa.png',
        title: '1980年的老照片',
        content: '那时候如果你想要照相，得去照相馆。这张是我和你奶奶结婚十周年的纪念照，我们在那个老公园的长椅上坐了一下午。那天的阳光真好啊...',
        imageUrls: ['https://images.unsplash.com/photo-1544299371-295b9671d2b7?auto=format&fit=crop&q=80&w=800'],
        likes: 5,
        createdAt: '2025-10-01T10:00:00Z',
    },
    {
        id: 's2',
        authorId: 'u1',
        authorName: '爷爷',
        content: '今天王明来看我了，给我带了很好的茶叶。我们聊起了他小时候学骑自行车的事，摔得鼻青脸肿也不哭，是个男子汉！',
        imageUrls: [],
        likes: 12,
        createdAt: '2025-10-15T14:30:00Z',
    },
    {
        id: 's3',
        authorId: 'u2',
        authorName: '王明 (孙子)',
        authorAvatar: '/avatars/grandson.png',
        content: '爷爷今天精神不错，希望能一直这样健康快乐。下次带你去吃烤鸭！',
        imageUrls: [],
        likes: 3,
        createdAt: '2025-10-15T18:00:00Z',
    }
];
