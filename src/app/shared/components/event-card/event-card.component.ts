import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonCard, IonCardContent, IonIcon, IonChip, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, locationOutline, heart, heartOutline, ticketOutline } from 'ionicons/icons';
import { TourismEvent } from '../../../core/models/event.model';
import { FavoritesService } from '../../../core/services/favorites.service';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-event-card',
  templateUrl: 'event-card.component.html',
  styleUrls: ['event-card.component.scss'],
  standalone: true,
  imports: [IonCard, IonCardContent, IonIcon, IonChip, IonLabel, DatePipe, NgIf],
})
export class EventCardComponent {
  @Input({ required: true }) event!: TourismEvent;
  @Input() variant: 'card' | 'list' = 'card';

  private readonly router = inject(Router);
  private readonly favorites = inject(FavoritesService);

  constructor() {
    addIcons({ calendarOutline, locationOutline, heart, heartOutline, ticketOutline });
  }

  get isFavorite(): boolean {
    return this.favorites.isFavorite(this.event.id, 'event');
  }

  navigate(): void {
    this.router.navigate(['/events', this.event.id]);
  }

  async toggleFavorite(e: Event): Promise<void> {
    e.stopPropagation();
    await this.favorites.toggle(this.event.id, 'event');
  }
}
