export interface TourismEvent {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  images: string[];
  cityId: string;
  cityNameAr: string;
  cityNameEn: string;
  category: EventCategory;
  categoryAr: string;
  startDate: string;
  endDate: string;
  venue: string;
  venueAr: string;
  price: number;
  priceType: 'free' | 'paid';
  organizer: string;
  website?: string;
  tags: string[];
  tagsAr: string[];
  featured: boolean;
  isFavorite?: boolean;
  attendeeCount?: number;
  coordinates?: { lat: number; lng: number };
}

export type EventCategory =
  | 'festival'
  | 'sports'
  | 'music'
  | 'art'
  | 'food'
  | 'business'
  | 'heritage'
  | 'entertainment'
  | 'wellness';
