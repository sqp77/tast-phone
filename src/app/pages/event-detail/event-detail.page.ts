import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonChip,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  heartOutline, heart, shareOutline, locationOutline, calendarOutline,
  ticketOutline, timeOutline, peopleOutline
} from 'ionicons/icons';
import { TourismService } from '../../core/services/tourism.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { Share } from '@capacitor/share';
import { TourismEvent } from '../../core/models/event.model';
import { NgIf, NgFor, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-event-detail',
  templateUrl: 'event-detail.page.html',
  styleUrls: ['event-detail.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonChip,
    NgIf, NgFor, DatePipe, DecimalPipe,
  ],
})
export class EventDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tourism = inject(TourismService);
  private readonly favorites = inject(FavoritesService);
  private readonly toast = inject(ToastController);

  event?: TourismEvent;
  isLoading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.tourism.getEventById(id).subscribe(e => {
      this.event = e;
      this.isLoading = false;
    });
    addIcons({
      heartOutline, heart, shareOutline, locationOutline, calendarOutline,
      ticketOutline, timeOutline, peopleOutline,
    });
  }

  get isFavorite(): boolean {
    return this.event ? this.favorites.isFavorite(this.event.id, 'event') : false;
  }

  async toggleFavorite(): Promise<void> {
    if (!this.event) return;
    const added = await this.favorites.toggle(this.event.id, 'event');
    const t = await this.toast.create({
      message: added ? 'أُضيفت للمفضلة ❤️' : 'أُزيلت من المفضلة',
      duration: 1800,
      color: added ? 'success' : 'medium',
      position: 'bottom',
    });
    await t.present();
  }

  async share(): Promise<void> {
    if (!this.event) return;
    try {
      await Share.share({
        title: this.event.titleAr,
        text: `${this.event.descriptionAr.substring(0, 100)} - Saudi Explorer`,
        url: `https://saudiexplorer.sa/events/${this.event.id}`,
      });
    } catch {
      const t = await this.toast.create({ message: 'تعذّر المشاركة', duration: 1500 });
      await t.present();
    }
  }
}
