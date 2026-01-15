export type UserRole = 'senior' | 'family';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string; // Denormalized for simpler MVP
  authorAvatar?: string;
  title?: string; // Optional, might just be a date or thought
  content: string; // Text transcript or description
  audioUrl?: string; // Voice memoir
  imageUrls: string[]; // Photo bank
  likes: number;
  createdAt: string; // ISO String
}

export interface Comment {
  id: string;
  storyId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}
