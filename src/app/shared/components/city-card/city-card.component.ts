import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonCard, IonCardContent, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, locationOutline, heart, heartOutline } from 'ionicons/icons';
import { City } from '../../../core/models/city.model';
import { FavoritesService } from '../../../core/services/favorites.service';
import { NgClass, NgIf, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-city-card',
  templateUrl: 'city-card.component.html',
  styleUrls: ['city-card.component.scss'],
  standalone: true,
  imports: [IonCard, IonCardContent, IonIcon, IonBadge, NgClass, NgIf, DecimalPipe],
})
export class CityCardComponent {
  @Input({ required: true }) city!: City;
  @Input() variant: 'wide' | 'compact' | 'featured' = 'wide';
  @Output() cardClick = new EventEmitter<City>();

  private readonly router = inject(Router);
  private readonly favorites = inject(FavoritesService);

  constructor() {
    addIcons({ star, locationOutline, heart, heartOutline });
  }

  get isFavorite(): boolean {
    return this.favorites.isFavorite(this.city.id, 'city');
  }

  navigate(): void {
    this.router.navigate(['/cities', this.city.id]);
    this.cardClick.emit(this.city);
  }

  async toggleFavorite(e: Event): Promise<void> {
    e.stopPropagation();
    await this.favorites.toggle(this.city.id, 'city');
  }
}
