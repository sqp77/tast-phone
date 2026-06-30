export interface Hotel {
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
  stars: number;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  amenities: HotelAmenity[];
  amenitiesAr: string[];
  category: HotelCategory;
  coordinates: { lat: number; lng: number };
  phone?: string;
  website?: string;
  featured: boolean;
  isFavorite?: boolean;
  checkIn: string;
  checkOut: string;
  tags: string[];
  tagsAr: string[];
}

export type HotelCategory = 'luxury' | 'boutique' | 'resort' | 'business' | 'budget' | 'heritage';

export interface HotelAmenity {
  icon: string;
  nameAr: string;
  nameEn: string;
}
