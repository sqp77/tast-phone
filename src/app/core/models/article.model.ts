export interface Article {
  id: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  excerpt: string;
  excerptAr: string;
  image: string;
  author: string;
  authorAvatar: string;
  publishDate: string;
  category: string;
  categoryAr: string;
  readTimeMin: number;
  tags: string[];
  tagsAr: string[];
  views: number;
  likes: number;
  cityId?: string;
}

export interface TravelGuide {
  id: string;
  titleAr: string;
  titleEn: string;
  image: string;
  cityId: string;
  cityNameAr: string;
  cityNameEn: string;
  tips: GuideTip[];
  estimatedBudget: string;
  duration: string;
  durationAr: string;
}

export interface GuideTip {
  icon: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
}
