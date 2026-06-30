import { Component, inject } from '@angular/core';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  home, homeOutline, compass, compassOutline, map, mapOutline,
  heart, heartOutline, person, personOutline
} from 'ionicons/icons';
import { NotificationService } from '../../core/services/notification.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [
    IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge, NgIf,
  ],
})
export class TabsPage {
  private readonly notifications = inject(NotificationService);
  private readonly favorites = inject(FavoritesService);

  readonly unreadCount = this.notifications.unreadCount;
  readonly favCount = this.favorites.count;

  constructor() {
    addIcons({
      home, homeOutline, compass, compassOutline, map, mapOutline,
      heart, heartOutline, person, personOutline,
    });
  }
}
