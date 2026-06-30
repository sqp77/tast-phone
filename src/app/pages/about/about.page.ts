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
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonButtons, IonBackButton, IonButton, NgFor],
})
export class AboutPage {
  constructor() {
    addIcons({ globeOutline, mailOutline, logoInstagram, logoTwitter, starOutline });
  }

  readonly visionPillars = [
    { icon: '🏛️', label: 'تراث' },
    { icon: '🌊', label: 'طبيعة' },
    { icon: '🎭', label: 'ترفيه' },
    { icon: '🍽️', label: 'طعام' },
    { icon: '🏨', label: 'إقامة' },
    { icon: '🤝', label: 'أعمال' },
  ];

  readonly facts = [
    { icon: '🕌', value: '98,000+', label: 'مسجد' },
    { icon: '🏖️', value: '1,800 كم', label: 'شواطئ' },
    { icon: '🌴', value: '5', label: 'مواقع يونسكو' },
    { icon: '🏔️', value: '3,000م', label: 'أعلى قمة' },
    { icon: '🛢️', value: '17%', label: 'احتياطي النفط' },
    { icon: '🎪', value: '100M', label: 'زيارة 2030' },
  ];

  readonly features = [
    { emoji: '🗺️', title: 'استكشف 11 مدينة', desc: 'تغطية شاملة لأبرز مدن المملكة' },
    { emoji: '🏛️', title: 'معالم سياحية', desc: 'دليل تفصيلي لأشهر المعالم والأماكن' },
    { emoji: '🤖', title: 'المرشد الذكي', desc: 'مساعد ذكي يجيب على أسئلتك السياحية' },
    { emoji: '✈️', title: 'مخطط الرحلات', desc: 'خطّط رحلاتك باستخدام الذكاء الاصطناعي' },
    { emoji: '🏨', title: 'فنادق ومطاعم', desc: 'أفضل خيارات الإقامة والطعام' },
    { emoji: '🏆', title: 'نظام النقاط', desc: 'اكسب نقاط وشارات أثناء الاستكشاف' },
  ];

  readonly contactLinks = [
    { icon: 'globe-outline', label: 'saudiexplorer.sa' },
    { icon: 'mail-outline', label: 'hello@saudiexplorer.sa' },
    { icon: 'logo-twitter', label: '@SaudiExplorer' },
    { icon: 'logo-instagram', label: '@SaudiExplorer' },
  ];
}
