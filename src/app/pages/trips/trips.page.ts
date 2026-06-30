import { Component, OnInit, inject, signal } from '@angular/core';
import {
  IonContent, IonButton, IonIcon,
  ToastController, ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  sparklesOutline, closeOutline, arrowBackOutline,
  calendarOutline, locationOutline, bookmarkOutline,
  trashOutline, airplaneOutline
} from 'ionicons/icons';
import { StorageService } from '../../core/services/storage.service';
import { GamificationService } from '../../core/services/gamification.service';
import {
  TripPlannerService, GeneratedTrip, TripDay, Interest
} from '../../core/services/trip-planner.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { Trip } from '../../core/models/api.model';
import { City } from '../../core/models/city.model';
import { NgFor, NgIf, DatePipe } from '@angular/common';

const TRIPS_KEY = 'se_trips';

@Component({
  selector: 'app-trips',
  templateUrl: 'trips.page.html',
  styleUrls: ['trips.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, NgFor, NgIf, DatePipe],
})
export class TripsPage implements OnInit {
  private readonly storage = inject(StorageService);
  private readonly toast = inject(ToastController);
  private readonly actionSheet = inject(ActionSheetController);
  private readonly planner = inject(TripPlannerService);
  private readonly mock = inject(MockDataService);
  private readonly gamification = inject(GamificationService);

  readonly trips = signal<Trip[]>([]);

  showPlanner = false;
  plannerStep = 1;
  selectedCityId = '';
  selectedDays = 3;
  selectedInterests: Interest[] = ['heritage', 'food'];
  generatedTrip: GeneratedTrip | null = null;
  isGenerating = false;

  readonly availableCities: City[] = [];
  readonly plannerInterests = this.planner.interests;

  readonly tripGradients = [
    'linear-gradient(135deg, #006C35, #009E60)',
    'linear-gradient(135deg, #C9A227, #F0D98A)',
    'linear-gradient(135deg, #2196F3, #21CBF3)',
    'linear-gradient(135deg, #E91E63, #FF5722)',
    'linear-gradient(135deg, #9C27B0, #673AB7)',
  ];

  constructor() {
    addIcons({
      sparklesOutline, closeOutline, arrowBackOutline,
      calendarOutline, locationOutline, bookmarkOutline,
      trashOutline, airplaneOutline,
    });
    (this.availableCities as City[]) = this.mock.cities;
  }

  ngOnInit(): void { this.loadTrips(); }

  private async loadTrips(): Promise<void> {
    const saved = await this.storage.get(TRIPS_KEY);
    this.trips.set(saved ? JSON.parse(saved) : []);
  }

  private async saveTrips(): Promise<void> {
    await this.storage.set(TRIPS_KEY, JSON.stringify(this.trips()));
  }

  openPlanner(): void {
    this.showPlanner = true;
    this.plannerStep = 1;
    this.selectedCityId = '';
    this.generatedTrip = null;
  }

  closePlanner(): void { this.showPlanner = false; }

  selectCity(id: string): void { this.selectedCityId = id; }

  isInterestSelected(id: Interest): boolean {
    return this.selectedInterests.includes(id);
  }

  toggleInterest(id: Interest): void {
    if (this.isInterestSelected(id)) {
      this.selectedInterests = this.selectedInterests.filter(i => i !== id);
    } else {
      this.selectedInterests = [...this.selectedInterests, id];
    }
  }

  generateTrip(): void {
    this.isGenerating = true;
    this.planner.generateTrip(this.selectedCityId, this.selectedDays, this.selectedInterests)
      .subscribe(trip => {
        this.generatedTrip = trip;
        this.plannerStep = 3;
        this.isGenerating = false;
      });
  }

  async saveGeneratedTrip(): Promise<void> {
    if (!this.generatedTrip) return;
    const trip: Trip = {
      id: Date.now().toString(),
      name: `رحلة ${this.generatedTrip.cityNameAr}`,
      nameAr: `رحلة ${this.generatedTrip.cityNameAr}`,
      startDate: this.generatedTrip.days[0]?.date ?? new Date().toISOString(),
      endDate: this.generatedTrip.days[this.generatedTrip.days.length - 1]?.date ?? new Date().toISOString(),
      cityIds: [this.selectedCityId],
      attractionIds: [],
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    };
    this.trips.update(t => [trip, ...t]);
    await this.saveTrips();
    this.gamification.recordTripCreated();
    this.showPlanner = false;
    const t = await this.toast.create({
      message: 'تم حفظ رحلتك بنجاح! ✈️',
      duration: 2000, color: 'success', position: 'bottom',
    });
    await t.present();
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

  allActivities(day: TripDay) {
    return [...day.morning, ...day.afternoon, ...day.evening];
  }

  statusLabel(s: string): string {
    return s === 'upcoming' ? 'قادمة' : s === 'ongoing' ? 'جارية' : 'منتهية';
  }
}
