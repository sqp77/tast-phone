import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError, delay } from 'rxjs';
import { StorageService } from './storage.service';
import { User, AuthCredentials, RegisterData } from '../models/user.model';

const DEMO_USER: User = {
  id: '1',
  firstName: 'سعود',
  lastName: 'القحطاني',
  username: 'saud.explorer',
  email: 'saud@explorer.sa',
  phone: '+966-50-000-0000',
  avatar: 'https://i.pravatar.cc/150?img=8',
  nationality: 'Saudi',
  preferredLanguage: 'ar',
  createdAt: new Date().toISOString(),
  visitedCities: ['1', '2', '3'],
  savedItems: [],
};

const AUTH_TOKEN_KEY = 'se_auth_token';
const USER_KEY = 'se_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  private readonly _user = signal<User | null>(null);
  private readonly _isLoading = signal(false);

  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly displayName = computed(() => {
    const u = this._user();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });

  async init(): Promise<void> {
    const token = await this.storage.get(AUTH_TOKEN_KEY);
    if (token) {
      const userData = await this.storage.get(USER_KEY);
      if (userData) this._user.set(JSON.parse(userData));
    }
  }

  login(creds: AuthCredentials): Observable<User> {
    this._isLoading.set(true);
    // Simulate API call
    if (creds.username && creds.password.length >= 6) {
      return new Observable(observer => {
        setTimeout(async () => {
          await this.storage.set(AUTH_TOKEN_KEY, 'demo_jwt_token_' + Date.now());
          await this.storage.set(USER_KEY, JSON.stringify(DEMO_USER));
          this._user.set(DEMO_USER);
          this._isLoading.set(false);
          observer.next(DEMO_USER);
          observer.complete();
        }, 1200);
      });
    }
    return new Observable(observer => {
      setTimeout(() => {
        this._isLoading.set(false);
        observer.error({ message: 'بيانات الدخول غير صحيحة' });
      }, 1000);
    });
  }

  register(data: RegisterData): Observable<User> {
    this._isLoading.set(true);
    const newUser: User = {
      id: Date.now().toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      preferredLanguage: 'ar',
      createdAt: new Date().toISOString(),
      visitedCities: [],
      savedItems: [],
    };
    return new Observable(observer => {
      setTimeout(async () => {
        await this.storage.set(AUTH_TOKEN_KEY, 'demo_jwt_token_' + Date.now());
        await this.storage.set(USER_KEY, JSON.stringify(newUser));
        this._user.set(newUser);
        this._isLoading.set(false);
        observer.next(newUser);
        observer.complete();
      }, 1500);
    });
  }

  async logout(): Promise<void> {
    await this.storage.remove(AUTH_TOKEN_KEY);
    await this.storage.remove(USER_KEY);
    this._user.set(null);
    await this.router.navigate(['/auth/login']);
  }

  async getToken(): Promise<string | null> {
    return this.storage.get(AUTH_TOKEN_KEY);
  }

  updateProfile(updates: Partial<User>): void {
    const current = this._user();
    if (current) {
      const updated = { ...current, ...updates };
      this._user.set(updated);
      this.storage.set(USER_KEY, JSON.stringify(updated));
    }
  }
}
