import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar,
  IonRefresher, IonRefresherContent, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { TourismService } from '../../core/services/tourism.service';
import { City } from '../../core/models/city.model';
import { CityCardComponent } from '../../shared/components/city-card/city-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-cities',
  templateUrl: 'cities.page.html',
  styleUrls: ['cities.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar,
    IonRefresher, IonRefresherContent, IonButtons, IonBackButton,
    CityCardComponent, EmptyStateComponent, SkeletonCardComponent,
    NgFor, NgIf,
  ],
})
export class CitiesPage implements OnInit {
  private readonly tourism = inject(TourismService);

  allCities: City[] = [];
  filtered: City[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.tourism.getCities().subscribe(c => {
      this.allCities = c;
      this.filtered = c;
      this.isLoading = false;
    });
  }

  onSearch(event: CustomEvent): void {
    const q = (event.detail.value ?? '').toLowerCase();
    this.filtered = q.length > 0
      ? this.allCities.filter(c =>
          c.nameAr.includes(q) || c.nameEn.toLowerCase().includes(q) ||
          c.regionAr.includes(q)
        )
      : this.allCities;
  }

  async refresh(event: CustomEvent): Promise<void> {
    this.isLoading = true;
    this.tourism.getCities().subscribe(c => {
      this.allCities = c;
      this.filtered = c;
      this.isLoading = false;
      (event.target as HTMLIonRefresherElement).complete();
    });
  }
}
