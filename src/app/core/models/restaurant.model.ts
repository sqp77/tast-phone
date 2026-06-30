export interface Restaurant {
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
  address: string;
  addressAr: string;
  cuisine: string;
  cuisineAr: string;
  category: RestaurantCategory;
  rating: number;
  reviewCount: number;
  priceRange: 1 | 2 | 3 | 4;
  openingHours: string;
  openingHoursAr: string;
  coordinates: { lat: number; lng: number };
  phone?: string;
  featured: boolean;
  isFavorite?: boolean;
  tags: string[];
  tagsAr: string[];
  isHalal: boolean;
  deliveryAvailable: boolean;
}

export type RestaurantCategory =
  | 'saudi'
  | 'arabic'
  | 'international'
  | 'seafood'
  | 'grills'
  | 'vegetarian'
  | 'cafe'
  | 'fast-food'
  | 'fine-dining';
