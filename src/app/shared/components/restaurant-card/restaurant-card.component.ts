import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, heartOutline, heart, locationOutline, timeOutline } from 'ionicons/icons';
import { Restaurant } from '../../../core/models/restaurant.model';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurant-card',
  templateUrl: 'restaurant-card.component.html',
  styleUrls: ['restaurant-card.component.scss'],
  standalone: true,
  imports: [IonIcon, NgFor, NgIf],
})
export class RestaurantCardComponent {
  @Input() restaurant!: Restaurant;
  @Output() favoriteToggled = new EventEmitter<Restaurant>();

  private readonly router = inject(Router);

  get priceSymbol(): string { return '＄'.repeat(this.restaurant.priceRange); }

  constructor() {
    addIcons({ star, heartOutline, heart, locationOutline, timeOutline });
  }

  toggleFavorite(e: Event): void {
    e.stopPropagation();
    this.favoriteToggled.emit(this.restaurant);
  }

  open(): void {
    this.router.navigate(['/restaurants', this.restaurant.id]);
  }
}
