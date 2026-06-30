import { Component, Input, inject } from '@angular/core';
import { IonCard, IonCardContent, IonIcon, IonChip, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, timeOutline, cashOutline, heart, heartOutline } from 'ionicons/icons';
import { Attraction } from '../../../core/models/attraction.model';
import { FavoritesService } from '../../../core/services/favorites.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-attraction-card',
  templateUrl: 'attraction-card.component.html',
  styleUrls: ['attraction-card.component.scss'],
  standalone: true,
  imports: [IonCard, IonCardContent, IonIcon, IonChip, IonLabel, NgIf],
})
export class AttractionCardComponent {
  @Input({ required: true }) attraction!: Attraction;

  private readonly favorites = inject(FavoritesService);

  constructor() {
    addIcons({ star, timeOutline, cashOutline, heart, heartOutline });
  }

  get isFavorite(): boolean {
    return this.favorites.isFavorite(this.attraction.id, 'attraction');
  }

  async toggleFavorite(e: Event): Promise<void> {
    e.stopPropagation();
    await this.favorites.toggle(this.attraction.id, 'attraction');
  }
}
