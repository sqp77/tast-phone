import { Component, OnInit, inject } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonSearchbar, IonRefresher, IonRefresherContent, IonIcon, IonChip, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { starOutline, filterOutline } from 'ionicons/icons';
import { MockDataService } from '../../core/services/mock-data.service';
import { Hotel } from '../../core/models/hotel.model';
import { HotelCardComponent } from '../../shared/components/hotel-card/hotel-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hotels',
  templateUrl: 'hotels.page.html',
  styleUrls: ['hotels.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonSearchbar, IonRefresher, IonRefresherContent, IonIcon, IonChip, IonLabel,
    HotelCardComponent, EmptyStateComponent, NgFor, NgIf, FormsModule,
  ],
})
export class HotelsPage implements OnInit {
  private readonly mock = inject(MockDataService);

  allHotels: Hotel[] = [];
  filtered: Hotel[] = [];
  searchQuery = '';
  activeCategory = 'all';

  readonly categories = [
    { id: 'all', label: 'الكل' },
    { id: 'luxury', label: 'فاخر' },
    { id: 'resort', label: 'منتجع' },
    { id: 'boutique', label: 'بوتيك' },
    { id: 'business', label: 'أعمال' },
  ];

  constructor() { addIcons({ starOutline, filterOutline }); }

  ngOnInit(): void {
    this.allHotels = this.mock.hotels;
    this.filtered = [...this.allHotels];
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
    let result = [...this.allHotels];
    if (this.searchQuery) {
      result = result.filter(h =>
        h.nameAr.includes(this.searchQuery) ||
        h.nameEn.toLowerCase().includes(this.searchQuery) ||
        h.cityNameAr.includes(this.searchQuery)
      );
    }
    if (this.activeCategory !== 'all') {
      result = result.filter(h => h.category === this.activeCategory);
    }
    this.filtered = result;
  }

  refresh(e: CustomEvent): void {
    this.filtered = [...this.allHotels];
    setTimeout(() => (e.target as HTMLIonRefresherElement).complete(), 800);
  }
}
