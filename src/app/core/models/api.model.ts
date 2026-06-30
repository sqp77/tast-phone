export interface ApiResponse<T> {
  data: T;
  total?: number;
  skip?: number;
  limit?: number;
}

export interface DummyPost {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: { likes: number; dislikes: number };
  views: number;
  userId: number;
}

export interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  image: string;
  address: {
    city: string;
    country: string;
  };
}

export interface DummyPostsResponse {
  posts: DummyPost[];
  total: number;
  skip: number;
  limit: number;
}

export interface DummyUsersResponse {
  users: DummyUser[];
  total: number;
  skip: number;
  limit: number;
}

export interface PaginationParams {
  limit: number;
  skip: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface SearchParams {
  q: string;
  limit?: number;
  skip?: number;
}

export interface FavoriteItem {
  id: string;
  type: 'city' | 'attraction' | 'event' | 'article';
  addedAt: string;
}

export interface Trip {
  id: string;
  name: string;
  nameAr: string;
  startDate: string;
  endDate: string;
  cityIds: string[];
  attractionIds: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  notes?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  type: 'event' | 'offer' | 'update' | 'system';
  isRead: boolean;
  createdAt: string;
  image?: string;
  actionUrl?: string;
}
