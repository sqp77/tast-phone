import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, map, of, forkJoin } from 'rxjs';
import { ApiService } from './api.service';
import { MockDataService } from './mock-data.service';
import { City } from '../models/city.model';
import { Attraction } from '../models/attraction.model';
import { TourismEvent } from '../models/event.model';
import { Article } from '../models/article.model';
import { PaginationParams } from '../models/api.model';

const CITY_IMAGES = [
  'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6',
  'https://images.unsplash.com/photo-1578895101408-1a36b834405b',
  'https://images.unsplash.com/photo-1590764508404-09c67fff4358',
  'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa',
  'https://images.unsplash.com/photo-1559494007-9f5847c49d94',
];

const CATEGORY_AR: Record<string, string> = {
  travel: 'سفر', tourism: 'سياحة', food: 'طعام', adventure: 'مغامرة',
  culture: 'ثقافة', heritage: 'تراث', nature: 'طبيعة', history: 'تاريخ',
};

@Injectable({ providedIn: 'root' })
export class TourismService {
  private readonly api = inject(ApiService);
  private readonly mock = inject(MockDataService);

  private readonly _searchQuery = signal('');
  readonly searchQuery = this._searchQuery.asReadonly();

  // ─── Cities ──────────────────────────────────────────────────────────────
  getCities(): Observable<City[]> {
    return of(this.mock.cities);
  }

  getFeaturedCities(): Observable<City[]> {
    return of(this.mock.getFeaturedCities());
  }

  getCityById(id: string): Observable<City | undefined> {
    return of(this.mock.getCityById(id));
  }

  searchCities(query: string): Observable<City[]> {
    return of(this.mock.searchCities(query));
  }

  // ─── Attractions ─────────────────────────────────────────────────────────
  getAttractions(cityId?: string): Observable<Attraction[]> {
    if (cityId) return of(this.mock.getAttractionsByCityId(cityId));
    return of(this.mock.attractions);
  }

  getFeaturedAttractions(): Observable<Attraction[]> {
    return of(this.mock.getFeaturedAttractions());
  }

  getAttractionById(id: string): Observable<Attraction | undefined> {
    return of(this.mock.attractions.find(a => a.id === id));
  }

  // ─── Events ──────────────────────────────────────────────────────────────
  getEvents(cityId?: string): Observable<TourismEvent[]> {
    if (cityId) return of(this.mock.getEventsByCityId(cityId));
    return of(this.mock.events);
  }

  getFeaturedEvents(): Observable<TourismEvent[]> {
    return of(this.mock.getFeaturedEvents());
  }

  getEventById(id: string): Observable<TourismEvent | undefined> {
    return of(this.mock.events.find(e => e.id === id));
  }

  // ─── Articles (from API) ──────────────────────────────────────────────────
  getArticles(params: Partial<PaginationParams> = {}): Observable<{ articles: Article[]; total: number }> {
    return this.api.getPosts(params).pipe(
      map(res => ({
        articles: res.posts.map((p, i) => this.transformPostToArticle(p, i)),
        total: res.total,
      }))
    );
  }

  searchArticles(query: string): Observable<Article[]> {
    return this.api.searchPosts({ q: query, limit: 20 }).pipe(
      map(res => res.posts.map((p, i) => this.transformPostToArticle(p, i)))
    );
  }

  // ─── Global Search ────────────────────────────────────────────────────────
  globalSearch(query: string): Observable<{
    cities: City[];
    attractions: Attraction[];
    events: TourismEvent[];
  }> {
    const q = query.toLowerCase();
    return of({
      cities: this.mock.searchCities(query),
      attractions: this.mock.searchAttractions(query),
      events: this.mock.events.filter(e =>
        e.titleAr.includes(query) || e.titleEn.toLowerCase().includes(q)
      ),
    });
  }

  setSearchQuery(q: string): void {
    this._searchQuery.set(q);
  }

  // ─── Transform Helpers ────────────────────────────────────────────────────
  private transformPostToArticle(post: { id: number; title: string; body: string; tags: string[]; reactions: { likes: number }; views: number; userId: number }, index: number): Article {
    const city = this.mock.cities[index % this.mock.cities.length];
    return {
      id: String(post.id),
      titleEn: this.capitalize(post.title),
      titleAr: this.translateTitle(post.title),
      contentEn: post.body,
      contentAr: this.translateContent(post.body),
      excerpt: post.body.substring(0, 100) + '...',
      excerptAr: this.translateContent(post.body).substring(0, 100) + '...',
      image: `${CITY_IMAGES[index % CITY_IMAGES.length]}?auto=format&fit=crop&w=800&q=80`,
      author: `Mohammed Al-Rashid`,
      authorAvatar: `https://i.pravatar.cc/150?img=${(post.userId % 70) + 1}`,
      publishDate: new Date(Date.now() - index * 86400000 * 3).toISOString(),
      category: post.tags[0] ?? 'travel',
      categoryAr: CATEGORY_AR[post.tags[0]] ?? 'سفر',
      readTimeMin: Math.max(3, Math.ceil(post.body.split(' ').length / 200)),
      tags: post.tags,
      tagsAr: post.tags.map(t => CATEGORY_AR[t] ?? t),
      views: post.views,
      likes: post.reactions.likes,
      cityId: city?.id,
    };
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  private translateTitle(title: string): string {
    const titleMap: Record<string, string> = {
      'his death without society': 'وفاة بدون مجتمع',
      'you will never believe': 'لن تصدق ما ستراه',
    };
    return titleMap[title] ?? `اكتشف: ${this.mock.cities[Math.floor(Math.random() * this.mock.cities.length)].nameAr}`;
  }

  private translateContent(content: string): string {
    return `استكشف جمال المملكة العربية السعودية واكتشف كنوزها الخفية. ${content.substring(0, 50)}... تجربة سياحية لا تُنسى في أرض الحضارات والتاريخ العريق.`;
  }
}
