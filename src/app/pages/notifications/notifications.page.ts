import { Component, inject } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon,
  IonButtons, IonBackButton, IonItemSliding, IonItem, IonLabel,
  IonItemOptions, IonItemOption
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkDoneOutline, trashOutline } from 'ionicons/icons';
import { NotificationService } from '../../core/services/notification.service';
import { Notification as AppNotification } from '../../core/models/api.model';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.page.html',
  styleUrls: ['notifications.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon,
    IonButtons, IonBackButton, IonItemSliding, IonItem, IonLabel,
    IonItemOptions, IonItemOption,
    DatePipe, NgFor, NgIf,
  ],
})
export class NotificationsPage {
  readonly notif = inject(NotificationService);

  constructor() {
    addIcons({ checkmarkDoneOutline, trashOutline });
  }

  delete(id: string): void {
    this.notif.deleteNotification(id);
  }

  markRead(n: AppNotification): void {
    if (!n.isRead) this.notif.markAsRead(n.id);
  }

  markAll(): void {
    this.notif.markAllRead();
  }

  notifIcon(type: string): string {
    const icons: Record<string, string> = { event: '🎪', offer: '💎', update: '🗺️', system: '⭐' };
    return icons[type] ?? '🔔';
  }

  typeLabel(type: string): string {
    const labels: Record<string, string> = { event: 'فعالية', offer: 'عرض', update: 'تحديث', system: 'نظام' };
    return labels[type] ?? type;
  }
}
