import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonIcon, IonChip } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, heartOutline, heart, locationOutline, bed } from 'ionicons/icons';
import { Hotel } from '../../../core/models/hotel.model';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-hotel-card',
  templateUrl: 'hotel-card.component.html',
  styleUrls: ['hotel-card.component.scss'],
  standalone: true,
  imports: [IonIcon, IonChip, NgFor, NgIf, DecimalPipe],
})
export class HotelCardComponent {
  @Input() hotel!: Hotel;
  @Output() favoriteToggled = new EventEmitter<Hotel>();

  private readonly router = inject(Router);

  get starsArr(): number[] { return Array(this.hotel.stars).fill(0); }

  constructor() {
    addIcons({ star, heartOutline, heart, locationOutline, bed });
  }

  toggleFavorite(e: Event): void {
    e.stopPropagation();
    this.favoriteToggled.emit(this.hotel);
  }

  open(): void {
    this.router.navigate(['/hotels', this.hotel.id]);
  }
}
