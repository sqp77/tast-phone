import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton,
  IonIcon, IonSegment, IonSegmentButton, IonLabel, IonChip,
  ToastController
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  heartOutline, heart, shareOutline, locationOutline, star,
  peopleOutline, businessOutline, restaurantOutline, calendarOutline,
  timeOutline, globeOutline
} from 'ionicons/icons';
import { TourismService } from '../../core/services/tourism.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { Share } from '@capacitor/share';
import { City } from '../../core/models/city.model';
import { Attraction } from '../../core/models/attraction.model';
import { TourismEvent } from '../../core/models/event.model';
import { AttractionCardComponent } from '../../shared/components/attraction-card/attraction-card.component';
import { EventCardComponent } from '../../shared/components/event-card/event-card.component';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-city-detail',
  templateUrl: 'city-detail.page.html',
  styleUrls: ['city-detail.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton,
    IonIcon, IonSegment, IonSegmentButton, IonLabel, IonChip,
    AttractionCardComponent, EventCardComponent,
    NgFor, NgIf, DecimalPipe, FormsModule,
  ],
})
export class CityDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tourism = inject(TourismService);
  private readonly favorites = inject(FavoritesService);
  private readonly toast = inject(ToastController);

  city?: City;
  attractions: Attraction[] = [];
  events: TourismEvent[] = [];
  isLoading = true;
  activeTab = 'info';
  selectedImageIndex = 0;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.tourism.getCityById(id).subscribe(c => {
      this.city = c;
      if (c) {
        this.tourism.getAttractions(c.id).subscribe(a => this.attractions = a);
        this.tourism.getEvents(c.id).subscribe(e => { this.events = e; this.isLoading = false; });
      } else {
        this.isLoading = false;
      }
    });
    addIcons({
      heartOutline, heart, shareOutline, locationOutline, star,
      peopleOutline, businessOutline, restaurantOutline, calendarOutline,
      timeOutline, globeOutline,
    });
  }

  get isFavorite(): boolean {
    return this.city ? this.favorites.isFavorite(this.city.id, 'city') : false;
  }

  async toggleFavorite(): Promise<void> {
    if (!this.city) return;
    const added = await this.favorites.toggle(this.city.id, 'city');
    const t = await this.toast.create({
      message: added ? 'تمت الإضافة للمفضلة ❤️' : 'تمت الإزالة من المفضلة',
      duration: 1800,
      position: 'bottom',
      color: added ? 'success' : 'medium',
    });
    await t.present();
  }

  async share(): Promise<void> {
    if (!this.city) return;
    try {
      await Share.share({
        title: this.city.nameAr,
        text: `${this.city.shortDescAr} - Saudi Explorer`,
        url: `https://saudiexplorer.sa/cities/${this.city.id}`,
      });
    } catch {
      const t = await this.toast.create({ message: 'تعذّر المشاركة', duration: 1500 });
      await t.present();
    }
  }

  get stats(): { icon: string; value: string; label: string }[] {
    if (!this.city) return [];
    return [
      { icon: '🏛️', value: String(this.city.attractionCount), label: 'معلم سياحي' },
      { icon: '🏨', value: String(this.city.hotelCount), label: 'فندق' },
      { icon: '🍽️', value: String(this.city.restaurantCount), label: 'مطعم' },
      { icon: '🎪', value: String(this.city.eventCount), label: 'فعالية' },
    ];
  }
}
