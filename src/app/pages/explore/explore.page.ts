import { Component, OnInit, inject } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar,
  IonSegment, IonSegmentButton, IonLabel, IonRefresher, IonRefresherContent, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, gridOutline, listOutline } from 'ionicons/icons';
import { TourismService } from '../../core/services/tourism.service';
import { City } from '../../core/models/city.model';
import { Attraction } from '../../core/models/attraction.model';
import { TourismEvent } from '../../core/models/event.model';
import { Hotel } from '../../core/models/hotel.model';
import { Restaurant } from '../../core/models/restaurant.model';
import { CityCardComponent } from '../../shared/components/city-card/city-card.component';
import { AttractionCardComponent } from '../../shared/components/attraction-card/attraction-card.component';
import { EventCardComponent } from '../../shared/components/event-card/event-card.component';
import { HotelCardComponent } from '../../shared/components/hotel-card/hotel-card.component';
import { RestaurantCardComponent } from '../../shared/components/restaurant-card/restaurant-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-explore',
  templateUrl: 'explore.page.html',
  styleUrls: ['explore.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar,
    IonSegment, IonSegmentButton, IonLabel, IonRefresher, IonRefresherContent, IonIcon,
    CityCardComponent, AttractionCardComponent, EventCardComponent,
    HotelCardComponent, RestaurantCardComponent,
    EmptyStateComponent, SkeletonCardComponent,
    NgFor, NgIf,
  ],
})
export class ExplorePage implements OnInit {
  private readonly tourism = inject(TourismService);

  activeSegment = 'cities';
  searchQuery = '';
  isLoading = true;

  cities: City[] = [];
  attractions: Attraction[] = [];
  events: TourismEvent[] = [];
  hotels: Hotel[] = [];
  restaurants: Restaurant[] = [];

  private allCities: City[] = [];
  private allAttractions: Attraction[] = [];
  private allEvents: TourismEvent[] = [];
  private allHotels: Hotel[] = [];
  private allRestaurants: Restaurant[] = [];

  readonly segments = [
    { value: 'cities',      label: 'مدن',    icon: '🏙️' },
    { value: 'attractions', label: 'معالم',  icon: '🏛️' },
    { value: 'events',      label: 'فعاليات', icon: '🎪' },
    { value: 'hotels',      label: 'فنادق',  icon: '🏨' },
    { value: 'restaurants', label: 'مطاعم',  icon: '🍽️' },
  ];

  constructor() {
    addIcons({ searchOutline, gridOutline, listOutline });
  }

  ngOnInit(): void { this.loadAll(); }

  private loadAll(): void {
    this.isLoading = true;
    this.tourism.getCities().subscribe(c => { this.allCities = c; this.cities = c; });
    this.tourism.getAttractions().subscribe(a => { this.allAttractions = a; this.attractions = a; });
    this.tourism.getEvents().subscribe(e => { this.allEvents = e; this.events = e; });
    this.tourism.getHotels().subscribe(h => { this.allHotels = h; this.hotels = h; });
    this.tourism.getRestaurants().subscribe(r => { this.allRestaurants = r; this.restaurants = r; this.isLoading = false; });
  }

  onSearch(event: CustomEvent): void {
    const q = (event.detail.value ?? '').toLowerCase().trim();
    this.searchQuery = q;
    if (!q) { this.resetAll(); return; }
    this.cities = this.allCities.filter(c => c.nameAr.includes(q) || c.nameEn.toLowerCase().includes(q));
    this.attractions = this.allAttractions.filter(a => a.nameAr.includes(q) || a.nameEn.toLowerCase().includes(q));
    this.events = this.allEvents.filter(e => e.titleAr.includes(q));
    this.hotels = this.allHotels.filter(h => h.nameAr.includes(q) || h.nameEn.toLowerCase().includes(q));
    this.restaurants = this.allRestaurants.filter(r => r.nameAr.includes(q) || r.nameEn.toLowerCase().includes(q));
  }

  private resetAll(): void {
    this.cities = this.allCities;
    this.attractions = this.allAttractions;
    this.events = this.allEvents;
    this.hotels = this.allHotels;
    this.restaurants = this.allRestaurants;
  }

  onSegmentChange(event: CustomEvent): void {
    this.activeSegment = event.detail.value;
  }

  async refresh(event: CustomEvent): Promise<void> {
    this.searchQuery = '';
    this.loadAll();
    setTimeout(() => (event.target as HTMLIonRefresherElement).complete(), 1200);
  }

  get hasResults(): boolean {
    switch (this.activeSegment) {
      case 'cities':      return this.cities.length > 0;
      case 'attractions': return this.attractions.length > 0;
      case 'events':      return this.events.length > 0;
      case 'hotels':      return this.hotels.length > 0;
      case 'restaurants': return this.restaurants.length > 0;
      default: return false;
    }
  }

  get activeCount(): number {
    switch (this.activeSegment) {
      case 'cities':      return this.cities.length;
      case 'attractions': return this.attractions.length;
      case 'events':      return this.events.length;
      case 'hotels':      return this.hotels.length;
      case 'restaurants': return this.restaurants.length;
      default: return 0;
    }
  }
}
