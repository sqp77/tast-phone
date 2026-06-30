import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonButton, IonIcon,
  IonInput, IonItem, IonLabel, IonSpinner, ToastController, IonCheckbox
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, logoApple, logoGoogle, personOutline, lockClosedOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonButton, IonIcon, IonInput, IonItem, IonSpinner,
    ReactiveFormsModule, NgIf,
  ],
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);

  showPassword = false;
  isLoading = false;

  readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    addIcons({ eyeOutline, eyeOffOutline, logoApple, logoGoogle, personOutline, lockClosedOutline });
  }

  async login(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { username, password } = this.form.value;
    this.auth.login({ username: username!, password: password! }).subscribe({
      next: async () => {
        this.isLoading = false;
        await this.router.navigate(['/tabs'], { replaceUrl: true });
      },
      error: async (err) => {
        this.isLoading = false;
        const toast = await this.toastCtrl.create({
          message: err.message ?? 'فشل تسجيل الدخول',
          duration: 3000,
          color: 'danger',
          position: 'top',
        });
        await toast.present();
      },
    });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  demoLogin(): void {
    this.form.setValue({ username: 'demo_user', password: 'demo123' });
    this.login();
  }
}
