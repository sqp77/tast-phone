import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel, IonIcon, IonMenuToggle,
  IonAvatar, MenuController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  home, homeOutline, compass, compassOutline, map, mapOutline,
  calendar, calendarOutline, heart, heartOutline, person, personOutline,
  settings, settingsOutline, informationCircle, informationCircleOutline,
  logOut, notifications, notificationsOutline, search
} from 'ionicons/icons';
import { AuthService } from './core/services/auth.service';
import { NgIf, NgFor } from '@angular/common';

interface MenuLink {
  title: string;
  url: string;
  icon: string;
  iconFilled: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonItem, IonLabel, IonIcon, IonMenuToggle,
    IonAvatar, NgIf, NgFor,
  ],
})
export class AppComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly menuCtrl = inject(MenuController);

  readonly user = this.auth.user;
  readonly isAuthenticated = this.auth.isAuthenticated;

  readonly menuLinks: MenuLink[] = [
    { title: 'الرئيسية', url: '/tabs/home', icon: 'home-outline', iconFilled: 'home' },
    { title: 'المدن', url: '/cities', icon: 'map-outline', iconFilled: 'map' },
    { title: 'الفعاليات', url: '/events', icon: 'calendar-outline', iconFilled: 'calendar' },
    { title: 'المفضلة', url: '/tabs/favorites', icon: 'heart-outline', iconFilled: 'heart' },
    { title: 'الإعدادات', url: '/settings', icon: 'settings-outline', iconFilled: 'settings' },
    { title: 'عن المملكة', url: '/about', icon: 'information-circle-outline', iconFilled: 'information-circle' },
  ];

  ngOnInit(): void {
    addIcons({
      home, homeOutline, compass, compassOutline, map, mapOutline,
      calendar, calendarOutline, heart, heartOutline, person, personOutline,
      settings, settingsOutline, informationCircle, informationCircleOutline,
      logOut, notifications, notificationsOutline, search,
    });
  }

  navigate(url: string): void {
    this.menuCtrl.close();
    this.router.navigate([url]);
  }

  async logout(): Promise<void> {
    await this.menuCtrl.close();
    await this.auth.logout();
  }
}
