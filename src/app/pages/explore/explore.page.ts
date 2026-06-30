import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar,
  IonSegment, IonSegmentButton, IonLabel, IonRefresher, IonRefresherContent,
  IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/angular/standalone';
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

@Component({
  selector: 'app-explore',
  templateUrl: 'explore.page.html',
  styleUrls: ['explore.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar,
    IonSegment, IonSegmentButton, IonLabel, IonRefresher, IonRefresherContent,
    IonInfiniteScroll, IonInfiniteScrollContent,
    CityCardComponent, AttractionCardComponent, EventCardComponent,
    EmptyStateComponent, SkeletonCardComponent,
    NgFor, NgIf,
  ],
})
export class ExplorePage implements OnInit {
  private readonly tourism = inject(TourismService);
  private readonly router = inject(Router);

  activeSegment = 'cities';
  searchQuery = '';
  isLoading = true;

  cities: City[] = [];
  attractions: Attraction[] = [];
  events: TourismEvent[] = [];

  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.isLoading = true;
    this.tourism.getCities().subscribe(c => { this.cities = c; });
    this.tourism.getAttractions().subscribe(a => { this.attractions = a; });
    this.tourism.getEvents().subscribe(e => { this.events = e; this.isLoading = false; });
  }

  onSearch(event: CustomEvent): void {
    this.searchQuery = event.detail.value ?? '';
    if (this.searchQuery.length > 1) {
      if (this.activeSegment === 'cities') {
        this.tourism.searchCities(this.searchQuery).subscribe(c => this.cities = c);
      }
    } else if (this.searchQuery.length === 0) {
      this.loadAll();
    }
  }

  onSegmentChange(event: CustomEvent): void {
    this.activeSegment = event.detail.value;
  }

  async refresh(event: CustomEvent): Promise<void> {
    this.loadAll();
    setTimeout(() => (event.target as HTMLIonRefresherElement).complete(), 1200);
  }

  get hasResults(): boolean {
    if (this.activeSegment === 'cities') return this.cities.length > 0;
    if (this.activeSegment === 'attractions') return this.attractions.length > 0;
    return this.events.length > 0;
  }
}
