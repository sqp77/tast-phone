import { Injectable, inject, signal, computed } from '@angular/core';
import { StorageService } from './storage.service';

export interface Badge {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  color: string;
  pointsRequired: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Achievement {
  id: string;
  nameAr: string;
  icon: string;
  points: number;
  earnedAt: string;
}

export interface GameProfile {
  points: number;
  level: number;
  levelNameAr: string;
  citiesVisited: number;
  attractionsViewed: number;
  tripsCreated: number;
  achievements: Achievement[];
  badges: string[];
}

const LEVELS = [
  { level: 1, nameAr: 'مستكشف مبتدئ', minPoints: 0 },
  { level: 2, nameAr: 'رحّالة نشيط', minPoints: 200 },
  { level: 3, nameAr: 'سائح متمرس', minPoints: 500 },
  { level: 4, nameAr: 'مغامر شجاع', minPoints: 1000 },
  { level: 5, nameAr: 'مستكشف خبير', minPoints: 2000 },
  { level: 6, nameAr: 'فارس السفر', minPoints: 3500 },
  { level: 7, nameAr: 'سفير المملكة', minPoints: 5000 },
];

const ALL_BADGES: Badge[] = [
  { id: 'first_city', nameAr: 'أول مدينة', nameEn: 'First City', descAr: 'زر أول مدينة', descEn: 'Visit your first city', icon: '🏙️', color: '#006C35', pointsRequired: 50, unlocked: false },
  { id: 'explorer', nameAr: 'مستكشف', nameEn: 'Explorer', descAr: 'زر 5 مدن', descEn: 'Visit 5 cities', icon: '🧭', color: '#009E60', pointsRequired: 250, unlocked: false },
  { id: 'heritage_lover', nameAr: 'محب التراث', nameEn: 'Heritage Lover', descAr: 'زر 3 مواقع تراثية', descEn: 'Visit 3 heritage sites', icon: '🏛️', color: '#C9A227', pointsRequired: 150, unlocked: false },
  { id: 'foodie', nameAr: 'عاشق الطعام', nameEn: 'Foodie', descAr: 'اكتشف 10 مطاعم', descEn: 'Discover 10 restaurants', icon: '🍽️', color: '#E91E63', pointsRequired: 200, unlocked: false },
  { id: 'trip_planner', nameAr: 'مخطط الرحلات', nameEn: 'Trip Planner', descAr: 'أنشئ أول رحلة', descEn: 'Create your first trip', icon: '📋', color: '#2196F3', pointsRequired: 100, unlocked: false },
  { id: 'photographer', nameAr: 'المصوّر', nameEn: 'Photographer', descAr: 'شارك 5 صور', descEn: 'Share 5 photos', icon: '📸', color: '#9C27B0', pointsRequired: 300, unlocked: false },
  { id: 'kingdom_master', nameAr: 'سيد المملكة', nameEn: 'Kingdom Master', descAr: 'زر 10 مدن', descEn: 'Visit 10 cities', icon: '👑', color: '#FF9800', pointsRequired: 1000, unlocked: false },
  { id: 'night_owl', nameAr: 'بومة الليل', nameEn: 'Night Owl', descAr: 'استكشف 5 فعاليات ليلية', descEn: 'Explore 5 night events', icon: '🦉', color: '#3F51B5', pointsRequired: 400, unlocked: false },
];

const GAME_KEY = 'se_game_profile';

@Injectable({ providedIn: 'root' })
export class GamificationService {
  private readonly storage = inject(StorageService);

  private readonly _profile = signal<GameProfile>({
    points: 120,
    level: 1,
    levelNameAr: 'مستكشف مبتدئ',
    citiesVisited: 2,
    attractionsViewed: 7,
    tripsCreated: 0,
    achievements: [
      { id: 'welcome', nameAr: 'مرحباً بك', icon: '🎉', points: 50, earnedAt: new Date().toISOString() },
      { id: 'first_city', nameAr: 'أول مدينة', icon: '🏙️', points: 50, earnedAt: new Date().toISOString() },
      { id: 'explorer_start', nameAr: 'بداية الاستكشاف', icon: '🧭', points: 20, earnedAt: new Date().toISOString() },
    ],
    badges: ['first_city'],
  });

  readonly profile = this._profile.asReadonly();
  readonly points = computed(() => this._profile().points);
  readonly level = computed(() => this._profile().level);
  readonly levelName = computed(() => this._profile().levelNameAr);

  readonly badges = computed(() =>
    ALL_BADGES.map(b => ({ ...b, unlocked: this._profile().badges.includes(b.id) }))
  );

  readonly nextLevel = computed(() => {
    const current = this._profile().level;
    return LEVELS.find(l => l.level === current + 1) ?? null;
  });

  readonly progressToNextLevel = computed(() => {
    const pts = this._profile().points;
    const currentLevel = LEVELS.find(l => l.level === this._profile().level)!;
    const next = this.nextLevel();
    if (!next) return 100;
    const range = next.minPoints - currentLevel.minPoints;
    const earned = pts - currentLevel.minPoints;
    return Math.min(100, Math.round((earned / range) * 100));
  });

  async init(): Promise<void> {
    const saved = await this.storage.get(GAME_KEY);
    if (saved) this._profile.set(JSON.parse(saved));
  }

  addPoints(amount: number, reason: string): void {
    const current = this._profile();
    const newPoints = current.points + amount;
    const newLevel = LEVELS.filter(l => l.minPoints <= newPoints).pop()!;
    const updated: GameProfile = {
      ...current,
      points: newPoints,
      level: newLevel.level,
      levelNameAr: newLevel.nameAr,
    };
    this._profile.set(updated);
    this.storage.set(GAME_KEY, JSON.stringify(updated));
  }

  unlockBadge(badgeId: string): void {
    const current = this._profile();
    if (current.badges.includes(badgeId)) return;
    const badge = ALL_BADGES.find(b => b.id === badgeId);
    if (!badge) return;
    const updated: GameProfile = {
      ...current,
      badges: [...current.badges, badgeId],
      achievements: [
        ...current.achievements,
        { id: badgeId, nameAr: badge.nameAr, icon: badge.icon, points: badge.pointsRequired, earnedAt: new Date().toISOString() },
      ],
    };
    this._profile.set(updated);
    this.storage.set(GAME_KEY, JSON.stringify(updated));
    this.addPoints(badge.pointsRequired, badge.nameAr);
  }

  recordCityVisit(): void {
    const current = this._profile();
    const updated = { ...current, citiesVisited: current.citiesVisited + 1 };
    this._profile.set(updated);
    this.addPoints(30, 'زيارة مدينة');
    if (updated.citiesVisited >= 1) this.unlockBadge('first_city');
    if (updated.citiesVisited >= 5) this.unlockBadge('explorer');
    if (updated.citiesVisited >= 10) this.unlockBadge('kingdom_master');
  }

  recordTripCreated(): void {
    const current = this._profile();
    this._profile.set({ ...current, tripsCreated: current.tripsCreated + 1 });
    this.addPoints(100, 'إنشاء رحلة');
    this.unlockBadge('trip_planner');
  }

  getAllBadges(): Badge[] {
    return this.badges();
  }
}
