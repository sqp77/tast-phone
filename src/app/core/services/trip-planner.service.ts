import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MockDataService } from './mock-data.service';

export interface TripDay {
  day: number;
  date: string;
  morning: TripActivity[];
  afternoon: TripActivity[];
  evening: TripActivity[];
}

export interface TripActivity {
  id: string;
  nameAr: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'transport';
  icon: string;
  duration: string;
  tip?: string;
  image?: string;
}

export interface GeneratedTrip {
  cityId: string;
  cityNameAr: string;
  days: TripDay[];
  estimatedBudget: string;
  highlights: string[];
}

export type Interest = 'heritage' | 'nature' | 'food' | 'adventure' | 'shopping' | 'culture' | 'beach' | 'religious';

const INTEREST_LABELS: Record<Interest, string> = {
  heritage: 'التراث والتاريخ',
  nature: 'الطبيعة',
  food: 'المطاعم والمأكولات',
  adventure: 'المغامرات',
  shopping: 'التسوق',
  culture: 'الثقافة والفنون',
  beach: 'الشواطئ',
  religious: 'السياحة الدينية',
};

const INTEREST_ICONS: Record<Interest, string> = {
  heritage: '🏛️',
  nature: '🌿',
  food: '🍽️',
  adventure: '🧗',
  shopping: '🛍️',
  culture: '🎭',
  beach: '🏖️',
  religious: '🕌',
};

@Injectable({ providedIn: 'root' })
export class TripPlannerService {
  private readonly mock = inject(MockDataService);

  readonly interests: { id: Interest; label: string; icon: string }[] =
    (Object.keys(INTEREST_LABELS) as Interest[]).map(k => ({
      id: k,
      label: INTEREST_LABELS[k],
      icon: INTEREST_ICONS[k],
    }));

  generateTrip(cityId: string, days: number, interests: Interest[]): Observable<GeneratedTrip> {
    const city = this.mock.getCityById(cityId);
    if (!city) return of(this.getDefaultTrip(cityId, days));

    const attractions = this.mock.getAttractionsByCityId(cityId).filter(a =>
      interests.some(i => a.category === i || a.tags.includes(i))
    ).slice(0, days * 4);

    const allAttractions = this.mock.getAttractionsByCityId(cityId);

    const tripDays: TripDay[] = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      const dayAttrs = allAttractions.slice(i * 3, i * 3 + 3);

      return {
        day: i + 1,
        date: date.toISOString(),
        morning: [
          {
            id: `breakfast-${i}`,
            nameAr: i === 0 ? 'إفطار ترحيبي في الفندق' : 'إفطار في مطعم محلي',
            type: 'restaurant',
            icon: '☕',
            duration: '45 دقيقة',
            tip: 'جرب الفطور السعودي التقليدي مع الكبسة والفول',
          },
          dayAttrs[0] ? {
            id: dayAttrs[0].id,
            nameAr: dayAttrs[0].nameAr,
            type: 'attraction' as const,
            icon: '🏛️',
            duration: dayAttrs[0].durationAr,
            image: dayAttrs[0].image,
          } : {
            id: `morning-${i}`,
            nameAr: 'جولة في المدينة القديمة',
            type: 'attraction' as const,
            icon: '🗺️',
            duration: 'ساعتان',
          },
        ],
        afternoon: [
          dayAttrs[1] ? {
            id: dayAttrs[1].id,
            nameAr: dayAttrs[1].nameAr,
            type: 'attraction' as const,
            icon: '⭐',
            duration: dayAttrs[1].durationAr,
            image: dayAttrs[1].image,
          } : {
            id: `afternoon-${i}`,
            nameAr: 'استكشاف السوق الشعبي',
            type: 'attraction' as const,
            icon: '🛍️',
            duration: 'ساعتان',
          },
          {
            id: `lunch-${i}`,
            nameAr: 'غداء في مطعم مشهور',
            type: 'restaurant' as const,
            icon: '🍛',
            duration: 'ساعة',
            tip: 'لا تفوت تجربة الكبسة والمندي الأصيلة',
          },
        ],
        evening: [
          dayAttrs[2] ? {
            id: dayAttrs[2].id,
            nameAr: dayAttrs[2].nameAr,
            type: 'attraction' as const,
            icon: '🌙',
            duration: dayAttrs[2].durationAr,
            image: dayAttrs[2].image,
          } : {
            id: `evening-${i}`,
            nameAr: 'نزهة على كورنيش المدينة',
            type: 'attraction' as const,
            icon: '🌅',
            duration: 'ساعة ونصف',
          },
          {
            id: `dinner-${i}`,
            nameAr: 'عشاء فاخر مع إطلالة رائعة',
            type: 'restaurant' as const,
            icon: '🌟',
            duration: 'ساعتان',
            tip: 'احجز مسبقاً في المطاعم الراقية',
          },
        ],
      };
    });

    const trip: GeneratedTrip = {
      cityId,
      cityNameAr: city.nameAr,
      days: tripDays,
      estimatedBudget: this.estimateBudget(days),
      highlights: [city.nameAr, ...allAttractions.slice(0, 3).map(a => a.nameAr)],
    };

    return of(trip);
  }

  private estimateBudget(days: number): string {
    const perDay = 800;
    const total = perDay * days;
    return `${total.toLocaleString('ar-SA')} ريال`;
  }

  private getDefaultTrip(cityId: string, days: number): GeneratedTrip {
    return {
      cityId,
      cityNameAr: 'الرياض',
      days: [],
      estimatedBudget: `${(800 * days).toLocaleString('ar-SA')} ريال`,
      highlights: [],
    };
  }
}
