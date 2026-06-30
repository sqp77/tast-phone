export interface Attraction {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  images: string[];
  cityId: string;
  cityNameAr: string;
  cityNameEn: string;
  category: AttractionCategory;
  categoryAr: string;
  rating: number;
  reviewCount: number;
  price: number;
  priceType: 'free' | 'paid' | 'donation';
  duration: string;
  durationAr: string;
  openingHours: string;
  openingHoursAr: string;
  coordinates: { lat: number; lng: number };
  tags: string[];
  tagsAr: string[];
  featured: boolean;
  isFavorite?: boolean;
}

export type AttractionCategory =
  | 'heritage'
  | 'nature'
  | 'adventure'
  | 'culture'
  | 'shopping'
  | 'dining'
  | 'entertainment'
  | 'religious'
  | 'museum'
  | 'beach';
