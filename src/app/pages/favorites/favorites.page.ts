import { Component, OnInit, inject } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonSegment, IonSegmentButton,
  IonLabel, IonRefresher, IonRefresherContent
} from '@ionic/angular/standalone';
import { FavoritesService } from '../../core/services/favorites.service';
import { TourismService } from '../../core/services/tourism.service';
import { City } from '../../core/models/city.model';
import { Attraction } from '../../core/models/attraction.model';
import { TourismEvent } from '../../core/models/event.model';
import { CityCardComponent } from '../../shared/components/city-card/city-card.component';
import { AttractionCardComponent } from '../../shared/components/attraction-card/attraction-card.component';
import { EventCardComponent } from '../../shared/components/event-card/event-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: 'favorites.page.html',
  styleUrls: ['favorites.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonSegment, IonSegmentButton,
    IonLabel, IonRefresher, IonRefresherContent,
    CityCardComponent, AttractionCardComponent, EventCardComponent, EmptyStateComponent,
    NgFor, NgIf, FormsModule,
  ],
})
export class FavoritesPage implements OnInit {
  private readonly favSvc = inject(FavoritesService);
  private readonly tourism = inject(TourismService);

  activeTab = 'cities';
  favCities: City[] = [];
  favAttractions: Attraction[] = [];
  favEvents: TourismEvent[] = [];

  ngOnInit(): void {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    const cityIds = this.favSvc.cityIds();
    const attrIds = this.favSvc.attractionIds();
    const eventIds = this.favSvc.eventIds();

    this.tourism.getCities().subscribe(cities => {
      this.favCities = cities.filter(c => cityIds.includes(c.id));
    });
    this.tourism.getAttractions().subscribe(attrs => {
      this.favAttractions = attrs.filter(a => attrIds.includes(a.id));
    });
    this.tourism.getEvents().subscribe(events => {
      this.favEvents = events.filter(e => eventIds.includes(e.id));
    });
  }

  async refresh(event: CustomEvent): Promise<void> {
    this.loadFavorites();
    setTimeout(() => (event.target as HTMLIonRefresherElement).complete(), 800);
  }

  get currentCount(): number {
    if (this.activeTab === 'cities') return this.favCities.length;
    if (this.activeTab === 'attractions') return this.favAttractions.length;
    return this.favEvents.length;
  }
}
