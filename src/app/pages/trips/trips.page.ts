import { Component, OnInit, inject, signal } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon,
  IonFab, IonFabButton, AlertController, ToastController,
  ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, airplaneOutline, calendarOutline, locationOutline } from 'ionicons/icons';
import { StorageService } from '../../core/services/storage.service';
import { Trip } from '../../core/models/api.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { NgFor, NgIf, DatePipe } from '@angular/common';

const TRIPS_KEY = 'se_trips';

@Component({
  selector: 'app-trips',
  templateUrl: 'trips.page.html',
  styleUrls: ['trips.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon,
    IonFab, IonFabButton,
    EmptyStateComponent, NgFor, NgIf, DatePipe,
  ],
})
export class TripsPage implements OnInit {
  private readonly storage = inject(StorageService);
  private readonly alert = inject(AlertController);
  private readonly toast = inject(ToastController);
  private readonly actionSheet = inject(ActionSheetController);

  readonly trips = signal<Trip[]>([]);

  readonly addTripFn = () => this.addTrip();

  constructor() {
    addIcons({ addOutline, trashOutline, airplaneOutline, calendarOutline, locationOutline });
  }

  ngOnInit(): void {
    this.loadTrips();
  }

  private async loadTrips(): Promise<void> {
    const saved = await this.storage.getObject<Trip[]>(TRIPS_KEY);
    this.trips.set(saved ?? []);
  }

  private async saveTrips(): Promise<void> {
    await this.storage.setObject(TRIPS_KEY, this.trips());
  }

  async addTrip(): Promise<void> {
    const a = await this.alert.create({
      header: 'رحلة جديدة',
      inputs: [
        { name: 'name', placeholder: 'اسم الرحلة', type: 'text' },
        { name: 'startDate', placeholder: 'تاريخ البداية', type: 'date' },
        { name: 'endDate', placeholder: 'تاريخ النهاية', type: 'date' },
      ],
      buttons: [
        { text: 'إلغاء', role: 'cancel' },
        {
          text: 'إضافة',
          handler: async (data) => {
            if (!data.name) return false;
            const trip: Trip = {
              id: Date.now().toString(),
              name: data.name,
              nameAr: data.name,
              startDate: data.startDate ?? '',
              endDate: data.endDate ?? '',
              cityIds: [],
              attractionIds: [],
              status: 'upcoming',
              createdAt: new Date().toISOString(),
            };
            this.trips.update(t => [...t, trip]);
            await this.saveTrips();
            const t = await this.toast.create({ message: 'تمت إضافة الرحلة ✈️', duration: 1500, color: 'success' });
            await t.present();
            return true;
          },
        },
      ],
    });
    await a.present();
  }

  async tripOptions(trip: Trip): Promise<void> {
    const sheet = await this.actionSheet.create({
      header: trip.nameAr,
      buttons: [
        {
          text: 'حذف الرحلة',
          icon: 'trash-outline',
          role: 'destructive',
          handler: async () => {
            this.trips.update(t => t.filter(x => x.id !== trip.id));
            await this.saveTrips();
          },
        },
        { text: 'إلغاء', role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  statusLabel(s: string): string {
    return s === 'upcoming' ? 'قادمة' : s === 'ongoing' ? 'جارية' : 'منتهية';
  }
}
