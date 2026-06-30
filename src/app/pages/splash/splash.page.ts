import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { StorageService } from '../../core/services/storage.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-splash',
  templateUrl: 'splash.page.html',
  styleUrls: ['splash.page.scss'],
  standalone: true,
  imports: [IonContent],
})
export class SplashPage implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly storage: StorageService,
    private readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.checkNavigation(), 2800);
  }

  private async checkNavigation(): Promise<void> {
    if (this.auth.isAuthenticated()) {
      await this.router.navigate(['/tabs'], { replaceUrl: true });
    } else {
      const onboardingDone = await this.storage.get('se_onboarding_done');
      if (onboardingDone === 'true') {
        await this.router.navigate(['/auth/login'], { replaceUrl: true });
      } else {
        await this.router.navigate(['/onboarding'], { replaceUrl: true });
      }
    }
  }
}
