import { Component, inject } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonSearchbar, IonIcon, IonChip,
  IonLabel, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, closeOutline, timeOutline } from 'ionicons/icons';
import { TourismService } from '../../core/services/tourism.service';
import { City } from '../../core/models/city.model';
import { Attraction } from '../../core/models/attraction.model';
import { TourismEvent } from '../../core/models/event.model';
import { CityCardComponent } from '../../shared/components/city-card/city-card.component';
import { AttractionCardComponent } from '../../shared/components/attraction-card/attraction-card.component';
import { EventCardComponent } from '../../shared/components/event-card/event-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonSearchbar, IonIcon, IonChip,
    IonLabel, IonButtons, IonBackButton,
    CityCardComponent, AttractionCardComponent, EventCardComponent,
    EmptyStateComponent, SkeletonCardComponent,
    NgFor, NgIf, FormsModule,
  ],
})
export class SearchPage {
  private readonly tourism = inject(TourismService);

  query = '';
  isSearching = false;
  hasSearched = false;

  cities: City[] = [];
  attractions: Attraction[] = [];
  events: TourismEvent[] = [];

  readonly trending = ['العُلا', 'أبها', 'جدة', 'نيوم', 'الدرعية', 'الطائف'];
  readonly recentSearches: string[] = [];

  constructor() {
    addIcons({ searchOutline, closeOutline, timeOutline });
  }

  get hasResults(): boolean {
    return this.cities.length > 0 || this.attractions.length > 0 || this.events.length > 0;
  }

  onSearch(event: CustomEvent): void {
    this.query = (event.detail.value ?? '').trim();
    if (this.query.length < 2) {
      this.cities = [];
      this.attractions = [];
      this.events = [];
      this.hasSearched = false;
      return;
    }
    this.doSearch(this.query);
  }

  doSearch(q: string): void {
    this.query = q;
    this.isSearching = true;
    this.tourism.globalSearch(q).subscribe((results: { cities: City[]; attractions: Attraction[]; events: TourismEvent[] }) => {
      this.cities = results.cities;
      this.attractions = results.attractions;
      this.events = results.events;
      this.isSearching = false;
      this.hasSearched = true;
    });
  }

  clear(): void {
    this.query = '';
    this.cities = [];
    this.attractions = [];
    this.events = [];
    this.hasSearched = false;
  }
}
