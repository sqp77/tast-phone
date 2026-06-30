import { Injectable, inject, signal, computed } from '@angular/core';
import { StorageService } from './storage.service';
import { FavoriteItem } from '../models/api.model';

const FAVORITES_KEY = 'se_favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly storage = inject(StorageService);
  private readonly _favorites = signal<FavoriteItem[]>([]);

  readonly favorites = this._favorites.asReadonly();
  readonly count = computed(() => this._favorites().length);
  readonly cityIds = computed(() =>
    this._favorites().filter(f => f.type === 'city').map(f => f.id)
  );
  readonly attractionIds = computed(() =>
    this._favorites().filter(f => f.type === 'attraction').map(f => f.id)
  );
  readonly eventIds = computed(() =>
    this._favorites().filter(f => f.type === 'event').map(f => f.id)
  );

  async init(): Promise<void> {
    const data = await this.storage.getObject<FavoriteItem[]>(FAVORITES_KEY);
    if (data) this._favorites.set(data);
  }

  isFavorite(id: string, type: FavoriteItem['type']): boolean {
    return this._favorites().some(f => f.id === id && f.type === type);
  }

  async toggle(id: string, type: FavoriteItem['type']): Promise<boolean> {
    const current = this._favorites();
    const exists = current.some(f => f.id === id && f.type === type);
    const updated = exists
      ? current.filter(f => !(f.id === id && f.type === type))
      : [...current, { id, type, addedAt: new Date().toISOString() }];
    this._favorites.set(updated);
    await this.storage.setObject(FAVORITES_KEY, updated);
    return !exists;
  }

  async add(id: string, type: FavoriteItem['type']): Promise<void> {
    if (!this.isFavorite(id, type)) {
      await this.toggle(id, type);
    }
  }

  async remove(id: string, type: FavoriteItem['type']): Promise<void> {
    if (this.isFavorite(id, type)) {
      await this.toggle(id, type);
    }
  }

  async clearAll(): Promise<void> {
    this._favorites.set([]);
    await this.storage.remove(FAVORITES_KEY);
  }
}
