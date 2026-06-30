import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import {
  IonContent, IonButton, IonIcon, IonInput, IonHeader, IonToolbar,
  IonTitle, IonBackButton, IonButtons, IonSpinner, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, chevronBackOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonButton, IonIcon, IonInput, IonHeader, IonToolbar,
    IonTitle, IonBackButton, IonButtons, IonSpinner, ReactiveFormsModule, NgIf,
  ],
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);

  showPassword = false;
  isLoading = false;

  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: this.passwordMatch });

  constructor() {
    addIcons({ eyeOutline, eyeOffOutline, chevronBackOutline });
  }

  private passwordMatch(control: AbstractControl): { [key: string]: boolean } | null {
    const pwd = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pwd !== confirm ? { passwordMismatch: true } : null;
  }

  async register(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const v = this.form.value;
    this.auth.register({
      firstName: v.firstName!,
      lastName: v.lastName!,
      email: v.email!,
      username: v.username!,
      password: v.password!,
      confirmPassword: v.confirmPassword!,
    }).subscribe({
      next: async () => {
        this.isLoading = false;
        await this.router.navigate(['/tabs'], { replaceUrl: true });
      },
      error: async (err) => {
        this.isLoading = false;
        const toast = await this.toastCtrl.create({
          message: err.message ?? 'فشل إنشاء الحساب',
          duration: 3000,
          color: 'danger',
          position: 'top',
        });
        await toast.present();
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/auth/login']);
  }
}
