import { Component, OnInit, inject } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar,
  IonSegment, IonSegmentButton, IonLabel, IonRefresher, IonRefresherContent,
  IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { TourismService } from '../../core/services/tourism.service';
import { TourismEvent } from '../../core/models/event.model';
import { EventCardComponent } from '../../shared/components/event-card/event-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-events',
  templateUrl: 'events.page.html',
  styleUrls: ['events.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar,
    IonSegment, IonSegmentButton, IonLabel, IonRefresher, IonRefresherContent,
    IonButtons, IonBackButton,
    EventCardComponent, EmptyStateComponent, SkeletonCardComponent,
    NgFor, NgIf,
  ],
})
export class EventsPage implements OnInit {
  private readonly tourism = inject(TourismService);

  all: TourismEvent[] = [];
  filtered: TourismEvent[] = [];
  isLoading = true;
  activeFilter = 'all';

  readonly filters = [
    { value: 'all', label: 'الكل' },
    { value: 'entertainment', label: 'ترفيه' },
    { value: 'cultural', label: 'ثقافة' },
    { value: 'sports', label: 'رياضة' },
    { value: 'festivals', label: 'مهرجانات' },
  ];

  ngOnInit(): void {
    this.tourism.getEvents().subscribe(e => {
      this.all = e;
      this.filtered = e;
      this.isLoading = false;
    });
  }

  onSearch(event: CustomEvent): void {
    const q = (event.detail.value ?? '').toLowerCase();
    this.applyFilters(q);
  }

  onFilterChange(event: CustomEvent): void {
    this.activeFilter = event.detail.value;
    this.applyFilters();
  }

  private applyFilters(search = ''): void {
    this.filtered = this.all.filter(e => {
      const matchFilter = this.activeFilter === 'all' || e.category === this.activeFilter;
      const matchSearch = !search || e.titleAr.includes(search) || e.cityNameAr.includes(search);
      return matchFilter && matchSearch;
    });
  }

  async refresh(event: CustomEvent): Promise<void> {
    this.isLoading = true;
    this.tourism.getEvents().subscribe(e => {
      this.all = e;
      this.filtered = e;
      this.isLoading = false;
      (event.target as HTMLIonRefresherElement).complete();
    });
  }
}
