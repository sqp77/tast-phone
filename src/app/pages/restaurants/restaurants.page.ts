import { Component, OnInit, inject } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonSearchbar, IonRefresher, IonRefresherContent, IonChip, IonLabel, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { restaurantOutline } from 'ionicons/icons';
import { MockDataService } from '../../core/services/mock-data.service';
import { Restaurant } from '../../core/models/restaurant.model';
import { RestaurantCardComponent } from '../../shared/components/restaurant-card/restaurant-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-restaurants',
  templateUrl: 'restaurants.page.html',
  styleUrls: ['restaurants.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonSearchbar, IonRefresher, IonRefresherContent, IonChip, IonLabel, IonIcon,
    RestaurantCardComponent, EmptyStateComponent, NgFor, NgIf,
  ],
})
export class RestaurantsPage implements OnInit {
  private readonly mock = inject(MockDataService);

  allRestaurants: Restaurant[] = [];
  filtered: Restaurant[] = [];
  searchQuery = '';
  activeCategory = 'all';

  readonly categories = [
    { id: 'all', label: 'الكل' },
    { id: 'saudi', label: 'سعودي' },
    { id: 'seafood', label: 'أسماك' },
    { id: 'fine-dining', label: 'راقٍ' },
    { id: 'cafe', label: 'مقهى' },
    { id: 'grills', label: 'مشاوي' },
  ];

  constructor() { addIcons({ restaurantOutline }); }

  ngOnInit(): void {
    this.allRestaurants = this.mock.restaurants;
    this.filtered = [...this.allRestaurants];
  }

  onSearch(e: CustomEvent): void {
    this.searchQuery = (e.detail.value ?? '').toLowerCase();
    this.applyFilters();
  }

  selectCategory(id: string): void {
    this.activeCategory = id;
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = [...this.allRestaurants];
    if (this.searchQuery) {
      result = result.filter(r =>
        r.nameAr.includes(this.searchQuery) ||
        r.cuisineAr.includes(this.searchQuery) ||
        r.cityNameAr.includes(this.searchQuery)
      );
    }
    if (this.activeCategory !== 'all') {
      result = result.filter(r => r.category === this.activeCategory);
    }
    this.filtered = result;
  }

  refresh(e: CustomEvent): void {
    this.filtered = [...this.allRestaurants];
    setTimeout(() => (e.target as HTMLIonRefresherElement).complete(), 800);
  }
}
