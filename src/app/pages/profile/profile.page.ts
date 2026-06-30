import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon,
  IonList, IonItem, IonLabel, IonToggle, AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline, heartOutline, airplaneOutline, notificationsOutline,
  moonOutline, languageOutline, helpCircleOutline, informationCircleOutline,
  logOutOutline, chevronForwardOutline, cameraOutline, createOutline
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon,
    NgIf, NgFor,
  ],
})
export class ProfilePage {
  readonly auth = inject(AuthService);
  readonly favorites = inject(FavoritesService);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertController);
  private readonly toast = inject(ToastController);

  constructor() {
    addIcons({
      personOutline, heartOutline, airplaneOutline, notificationsOutline,
      moonOutline, languageOutline, helpCircleOutline, informationCircleOutline,
      logOutOutline, chevronForwardOutline, cameraOutline, createOutline,
    });
  }

  readonly menuItems = [
    { icon: 'heart-outline', label: 'المفضلة', route: '/tabs/favorites' },
    { icon: 'airplane-outline', label: 'رحلاتي', route: '/tabs/trips' },
    { icon: 'notifications-outline', label: 'الإشعارات', route: '/notifications' },
    { icon: 'moon-outline', label: 'الوضع الليلي', route: null, toggle: true },
    { icon: 'language-outline', label: 'اللغة', route: '/settings', badge: 'AR' },
    { icon: 'help-circle-outline', label: 'مركز المساعدة', route: '/settings' },
    { icon: 'information-circle-outline', label: 'عن التطبيق', route: '/about' },
  ];

  async confirmLogout(): Promise<void> {
    const a = await this.alert.create({
      header: 'تسجيل الخروج',
      message: 'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
      buttons: [
        { text: 'إلغاء', role: 'cancel' },
        {
          text: 'خروج',
          handler: async () => {
            await this.auth.logout();
            await this.router.navigate(['/auth/login'], { replaceUrl: true });
          },
        },
      ],
    });
    await a.present();
  }

  navigate(route: string | null): void {
    if (route) this.router.navigate([route]);
  }
}
