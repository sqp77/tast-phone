import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonRefresher, IonRefresherContent,
  IonIcon, IonAvatar, IonButton, IonChip, IonLabel, IonBadge, MenuController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  notificationsOutline, searchOutline, menuOutline, star,
  locationOutline, sparklesOutline, calendarOutline,
  bedOutline, restaurantOutline, chatbubblesOutline
} from 'ionicons/icons';
import { TourismService } from '../../core/services/tourism.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { City } from '../../core/models/city.model';
import { Attraction } from '../../core/models/attraction.model';
import { TourismEvent } from '../../core/models/event.model';
import { Article } from '../../core/models/article.model';
import { Hotel } from '../../core/models/hotel.model';
import { Restaurant } from '../../core/models/restaurant.model';
import { CityCardComponent } from '../../shared/components/city-card/city-card.component';
import { AttractionCardComponent } from '../../shared/components/attraction-card/attraction-card.component';
import { EventCardComponent } from '../../shared/components/event-card/event-card.component';
import { HotelCardComponent } from '../../shared/components/hotel-card/hotel-card.component';
import { RestaurantCardComponent } from '../../shared/components/restaurant-card/restaurant-card.component';
import { ArticleCardComponent } from '../../shared/components/article-card/article-card.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonRefresher, IonRefresherContent,
    IonIcon, IonAvatar, IonButton, IonChip, IonLabel, IonBadge,
    CityCardComponent, AttractionCardComponent, EventCardComponent,
    HotelCardComponent, RestaurantCardComponent, ArticleCardComponent,
    SectionHeaderComponent, SkeletonCardComponent,
    NgFor, NgIf, DecimalPipe,
  ],
})
export class HomePage implements OnInit, OnDestroy {
  private readonly tourism = inject(TourismService);
  private readonly auth = inject(AuthService);
  private readonly notif = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly menu = inject(MenuController);

  readonly user = this.auth.user;
  readonly unreadCount = this.notif.unreadCount;

  isLoading = true;
  cities: City[] = [];
  attractions: Attraction[] = [];
  events: TourismEvent[] = [];
  articles: Article[] = [];
  hotels: Hotel[] = [];
  restaurants: Restaurant[] = [];

  readonly heroSlides = [
    { image: 'https://images.unsplash.com/photo-1590764508404-09c67fff4358?auto=format&fit=crop&w=1200&q=80', titleAr: 'اكتشف العُلا', subtitleAr: 'جوهرة التراث العالمي', badge: 'وجهة مميزة' },
    { image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=1200&q=80', titleAr: 'أبها الخضراء', subtitleAr: 'جنة الجنوب', badge: 'اكتشف الآن' },
    { image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=1200&q=80', titleAr: 'جدة التاريخية', subtitleAr: 'عروس البحر الأحمر', badge: 'تراث يونسكو' },
    { image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80', titleAr: 'الرياض الذهبية', subtitleAr: 'قلب المملكة النابض', badge: 'موسم الرياض' },
  ];

  currentHeroIndex = 0;
  private heroInterval?: ReturnType<typeof setInterval>;

  readonly quickLinks = [
    { icon: '🏛️', label: 'تراث',    route: '/cities' },
    { icon: '🏖️', label: 'شواطئ',  route: '/tabs/explore' },
    { icon: '🏔️', label: 'جبال',   route: '/tabs/explore' },
    { icon: '🎪', label: 'فعاليات', route: '/events' },
    { icon: '🍽️', label: 'مطاعم',  route: '/restaurants' },
    { icon: '🏨', label: 'فنادق',   route: '/hotels' },
    { icon: '🤖', label: 'مرشد ذكي', route: '/ai-guide' },
    { icon: '🗺️', label: 'رحلاتي',  route: '/tabs/trips' },
  ];

  constructor() {
    addIcons({
      notificationsOutline, searchOutline, menuOutline, star,
      locationOutline, sparklesOutline, calendarOutline,
      bedOutline, restaurantOutline, chatbubblesOutline,
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.startHeroSlider();
  }

  ngOnDestroy(): void {
    if (this.heroInterval) clearInterval(this.heroInterval);
  }

  private loadData(): void {
    this.isLoading = true;
    this.tourism.getFeaturedCities().subscribe(c => { this.cities = c; });
    this.tourism.getFeaturedAttractions().subscribe(a => { this.attractions = a; });
    this.tourism.getFeaturedEvents().subscribe(e => { this.events = e; });
    this.tourism.getFeaturedHotels().subscribe(h => { this.hotels = h; });
    this.tourism.getFeaturedRestaurants().subscribe(r => { this.restaurants = r; });
    this.tourism.getArticles({ limit: 5 }).subscribe(res => {
      this.articles = res.articles;
      this.isLoading = false;
    });
  }

  private startHeroSlider(): void {
    this.heroInterval = setInterval(() => {
      this.currentHeroIndex = (this.currentHeroIndex + 1) % this.heroSlides.length;
    }, 4000);
  }

  get currentHero() { return this.heroSlides[this.currentHeroIndex]; }

  async refresh(event: CustomEvent): Promise<void> {
    this.loadData();
    setTimeout(() => (event.target as HTMLIonRefresherElement).complete(), 1500);
  }

  openMenu(): void { this.menu.open('main-menu'); }
  goToSearch(): void { this.router.navigate(['/search']); }
  goToNotifications(): void { this.router.navigate(['/notifications']); }
  goToCities(): void { this.router.navigate(['/cities']); }
  goToEvents(): void { this.router.navigate(['/events']); }
  goToHotels(): void { this.router.navigate(['/hotels']); }
  goToRestaurants(): void { this.router.navigate(['/restaurants']); }
  goToAiGuide(): void { this.router.navigate(['/ai-guide']); }
  goToExplore(): void { this.router.navigate(['/tabs/explore']); }
  selectHero(i: number): void { this.currentHeroIndex = i; }
  navigateTo(route: string): void { this.router.navigate([route]); }
}
