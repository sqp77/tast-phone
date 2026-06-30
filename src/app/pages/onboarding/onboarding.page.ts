import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, checkmarkOutline } from 'ionicons/icons';
import { StorageService } from '../../core/services/storage.service';
import { NgFor, NgIf } from '@angular/common';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  gradient: string;
}

@Component({
  selector: 'app-onboarding',
  templateUrl: 'onboarding.page.html',
  styleUrls: ['onboarding.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, NgFor, NgIf],
})
export class OnboardingPage {
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);

  currentIndex = 0;

  readonly slides: Slide[] = [
    {
      image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=800&q=80',
      title: 'اكتشف المملكة',
      subtitle: 'استكشف أجمل المدن والوجهات السياحية في المملكة العربية السعودية بكل سهولة ويسر',
      gradient: 'linear-gradient(160deg, #006C35, #009E60)',
    },
    {
      image: 'https://images.unsplash.com/photo-1590764508404-09c67fff4358?auto=format&fit=crop&w=800&q=80',
      title: 'تراث عريق',
      subtitle: 'اكتشف المواقع التاريخية المذهلة والتراث الحضاري العميق لأرض الحضارات',
      gradient: 'linear-gradient(160deg, #4A2C0A, #C9A227)',
    },
    {
      image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=800&q=80',
      title: 'مغامرات لا تنتهي',
      subtitle: 'من جبال عسير إلى رمال الربع الخالي، كل يوم مغامرة جديدة تنتظرك',
      gradient: 'linear-gradient(160deg, #1a3a5c, #006C35)',
    },
    {
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
      title: 'فعاليات استثنائية',
      subtitle: 'لا تفوت أبرز الفعاليات والمهرجانات التي تحتضنها مدن المملكة طوال العام',
      gradient: 'linear-gradient(160deg, #3d0066, #9900cc)',
    },
  ];

  constructor() {
    addIcons({ arrowForwardOutline, checkmarkOutline });
  }

  get isLast(): boolean {
    return this.currentIndex === this.slides.length - 1;
  }

  get current(): Slide {
    return this.slides[this.currentIndex];
  }

  next(): void {
    if (this.isLast) {
      this.finish();
    } else {
      this.currentIndex++;
    }
  }

  skip(): void {
    this.finish();
  }

  selectSlide(index: number): void {
    this.currentIndex = index;
  }

  private async finish(): Promise<void> {
    await this.storage.set('se_onboarding_done', 'true');
    await this.router.navigate(['/auth/login'], { replaceUrl: true });
  }
}
