import { Component, inject, signal } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonToggle, IonIcon,
  IonButtons, IonBackButton, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  moonOutline, notificationsOutline, languageOutline, textOutline,
  lockClosedOutline, trashOutline, cloudDownloadOutline
} from 'ionicons/icons';
import { StorageService } from '../../core/services/storage.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonToggle, IonIcon,
    IonButtons, IonBackButton, FormsModule, NgFor,
  ],
})
export class SettingsPage {
  private readonly storage = inject(StorageService);
  private readonly toast = inject(ToastController);

  darkMode = signal(false);
  notifications = signal(true);
  language = signal<'ar' | 'en'>('ar');
  cacheSize = signal('12.4 MB');

  constructor() {
    addIcons({
      moonOutline, notificationsOutline, languageOutline, textOutline,
      lockClosedOutline, trashOutline, cloudDownloadOutline,
    });
    this.loadSettings();
  }

  private async loadSettings(): Promise<void> {
    const dark = await this.storage.get('se_dark_mode');
    const notif = await this.storage.get('se_notifications');
    const lang = await this.storage.get('se_language');
    if (dark !== null) this.darkMode.set(dark === 'true');
    if (notif !== null) this.notifications.set(notif === 'true');
    if (lang) this.language.set(lang as 'ar' | 'en');
  }

  async toggleDark(event: CustomEvent): Promise<void> {
    const val = event.detail.checked;
    this.darkMode.set(val);
    document.documentElement.classList.toggle('ion-palette-dark', val);
    await this.storage.set('se_dark_mode', String(val));
  }

  async toggleNotifications(event: CustomEvent): Promise<void> {
    const val = event.detail.checked;
    this.notifications.set(val);
    await this.storage.set('se_notifications', String(val));
  }

  async clearCache(): Promise<void> {
    this.cacheSize.set('0 MB');
    const t = await this.toast.create({ message: 'تم مسح الذاكرة المؤقتة', duration: 1800, color: 'success' });
    await t.present();
  }

  readonly settingsGroups = [
    {
      title: 'المظهر',
      items: [
        { icon: 'moon-outline', label: 'الوضع الليلي', type: 'dark-toggle' },
      ],
    },
    {
      title: 'الإشعارات',
      items: [
        { icon: 'notifications-outline', label: 'الإشعارات', type: 'notif-toggle' },
      ],
    },
    {
      title: 'التخزين',
      items: [
        { icon: 'trash-outline', label: 'مسح الذاكرة المؤقتة', type: 'clear-cache' },
      ],
    },
  ];
}
