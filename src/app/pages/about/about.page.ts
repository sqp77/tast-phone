import { Component } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
  IonButtons, IonBackButton, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { globeOutline, mailOutline, logoInstagram, logoTwitter, starOutline } from 'ionicons/icons';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
    IonButtons, IonBackButton, IonButton, NgFor,
  ],
})
export class AboutPage {
  constructor() {
    addIcons({ globeOutline, mailOutline, logoInstagram, logoTwitter, starOutline });
  }

  readonly features = [
    { emoji: '🗺️', title: 'استكشف 11 مدينة', desc: 'تغطية شاملة لأبرز مدن المملكة' },
    { emoji: '🏛️', title: 'معالم سياحية', desc: 'دليل تفصيلي لأشهر المعالم والأماكن' },
    { emoji: '🎪', title: 'الفعاليات والمهرجانات', desc: 'آخر الفعاليات والمهرجانات الموسمية' },
    { emoji: '❤️', title: 'قائمة المفضلة', desc: 'احفظ أماكنك المفضلة للرجوع إليها' },
    { emoji: '✈️', title: 'تخطيط الرحلات', desc: 'خطّط رحلاتك وإدارتها بسهولة' },
    { emoji: '🌐', title: 'عربي وإنجليزي', desc: 'دعم كامل للغتين العربية والإنجليزية' },
  ];
}
