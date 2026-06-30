import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  heartOutline, airplaneOutline, notificationsOutline,
  moonOutline, languageOutline, helpCircleOutline, informationCircleOutline,
  logOutOutline, chevronForwardOutline, cameraOutline, sparklesOutline,
  trophyOutline, starOutline, restaurantOutline, bedOutline, chatbubblesOutline
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { GamificationService } from '../../core/services/gamification.service';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, NgIf, NgFor, DecimalPipe],
})
export class ProfilePage {
  readonly auth = inject(AuthService);
  readonly favorites = inject(FavoritesService);
  readonly gamification = inject(GamificationService);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertController);

  constructor() {
    addIcons({
      heartOutline, airplaneOutline, notificationsOutline,
      moonOutline, languageOutline, helpCircleOutline, informationCircleOutline,
      logOutOutline, chevronForwardOutline, cameraOutline, sparklesOutline,
      trophyOutline, starOutline, restaurantOutline, bedOutline, chatbubblesOutline,
    });
  }

  readonly menuItems = [
    { icon: 'heart-outline', label: 'المفضلة', route: '/tabs/favorites', color: '#E91E63' },
    { icon: 'airplane-outline', label: 'رحلاتي', route: '/tabs/trips', color: '#2196F3' },
    { icon: 'chatbubbles-outline', label: 'المرشد الذكي', route: '/ai-guide', color: '#009E60' },
    { icon: 'bed-outline', label: 'الفنادق', route: '/hotels', color: '#9C27B0' },
    { icon: 'restaurant-outline', label: 'المطاعم', route: '/restaurants', color: '#FF5722' },
    { icon: 'notifications-outline', label: 'الإشعارات', route: '/notifications', color: '#FF9800' },
    { icon: 'language-outline', label: 'اللغة والإعدادات', route: '/settings', color: '#607D8B', badge: 'AR' },
    { icon: 'information-circle-outline', label: 'عن المملكة', route: '/about', color: '#006C35' },
  ];

  async confirmLogout(): Promise<void> {
    const a = await this.alert.create({
      header: 'تسجيل الخروج',
      message: 'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
      buttons: [
        { text: 'إلغاء', role: 'cancel' },
        {
          text: 'خروج',
          handler: async () => { await this.auth.logout(); },
        },
      ],
    });
    await a.present();
  }

  navigate(route: string | null): void {
    if (route) this.router.navigate([route]);
  }
}
