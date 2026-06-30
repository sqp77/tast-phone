import { Component, OnInit, inject } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonRefresher, IonRefresherContent, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heartOutline } from 'ionicons/icons';
import { FavoritesService } from '../../core/services/favorites.service';
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
import { NgFor, NgIf } from '@angular/common';

type FavTab = 'cities' | 'attractions' | 'events' | 'hotels' | 'restaurants';

@Component({
  selector: 'app-favorites',
  templateUrl: 'favorites.page.html',
  styleUrls: ['favorites.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonRefresher, IonRefresherContent, IonIcon,
    CityCardComponent, AttractionCardComponent, EventCardComponent,
    HotelCardComponent, RestaurantCardComponent, EmptyStateComponent,
    NgFor, NgIf,
  ],
})
export class FavoritesPage implements OnInit {
  private readonly favSvc = inject(FavoritesService);
  private readonly tourism = inject(TourismService);

  activeTab: FavTab = 'cities';

  favCities: City[] = [];
  favAttractions: Attraction[] = [];
  favEvents: TourismEvent[] = [];
  favHotels: Hotel[] = [];
  favRestaurants: Restaurant[] = [];

  readonly tabs: { value: FavTab; label: string; icon: string }[] = [
    { value: 'cities',      label: 'مدن',    icon: '🏙️' },
    { value: 'attractions', label: 'معالم',  icon: '🏛️' },
    { value: 'events',      label: 'فعاليات', icon: '🎪' },
    { value: 'hotels',      label: 'فنادق',  icon: '🏨' },
    { value: 'restaurants', label: 'مطاعم',  icon: '🍽️' },
  ];

  constructor() { addIcons({ heartOutline }); }

  ngOnInit(): void { this.loadFavorites(); }

  private loadFavorites(): void {
    const cityIds = this.favSvc.cityIds();
    const attrIds = this.favSvc.attractionIds();
    const eventIds = this.favSvc.eventIds();

    this.tourism.getCities().subscribe(c => { this.favCities = c.filter(x => cityIds.includes(x.id)); });
    this.tourism.getAttractions().subscribe(a => { this.favAttractions = a.filter(x => attrIds.includes(x.id)); });
    this.tourism.getEvents().subscribe(e => { this.favEvents = e.filter(x => eventIds.includes(x.id)); });
    this.tourism.getHotels().subscribe(h => { this.favHotels = h.filter(x => x.isFavorite); });
    this.tourism.getRestaurants().subscribe(r => { this.favRestaurants = r.filter(x => x.isFavorite); });
  }

  async refresh(event: CustomEvent): Promise<void> {
    this.loadFavorites();
    setTimeout(() => (event.target as HTMLIonRefresherElement).complete(), 800);
  }

  get totalCount(): number {
    return this.favCities.length + this.favAttractions.length + this.favEvents.length +
           this.favHotels.length + this.favRestaurants.length;
  }

  countFor(tab: FavTab): number {
    switch (tab) {
      case 'cities':      return this.favCities.length;
      case 'attractions': return this.favAttractions.length;
      case 'events':      return this.favEvents.length;
      case 'hotels':      return this.favHotels.length;
      case 'restaurants': return this.favRestaurants.length;
    }
  }

  get currentEmpty(): boolean { return this.countFor(this.activeTab) === 0; }
}
