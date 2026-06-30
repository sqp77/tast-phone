export interface City {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  shortDescAr: string;
  shortDescEn: string;
  image: string;
  images: string[];
  region: string;
  regionAr: string;
  population: string;
  area: string;
  timezone: string;
  climate: string;
  climateAr: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  tags: string[];
  tagsAr: string[];
  coordinates: Coordinates;
  bestTimeToVisit: string;
  bestTimeToVisitAr: string;
  currency: string;
  language: string;
  attractionCount: number;
  hotelCount: number;
  restaurantCount: number;
  eventCount: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface WeatherInfo {
  temp: number;
  description: string;
  icon: string;
}
