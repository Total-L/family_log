export type UserRole = 'senior' | 'family' | 'member';

export interface Family {
  id: string;
  name: string;
  inviteCode: string;
}

export interface User {
  id: string; // Auth User ID
  name: string;
  avatar?: string;
  role: UserRole;
  familyId?: string; // Optional because user might be logged in but not in a family yet
  email?: string;
}

export interface Story {
  id: string;
  authorId: string;
  familyId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  imageUrls: string[];
  likes: number;
  createdAt: string;
}
