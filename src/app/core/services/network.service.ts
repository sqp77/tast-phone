import { Injectable, signal } from '@angular/core';
import { Network } from '@capacitor/network';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  private readonly _isOnline = signal(true);
  private readonly _connectionType = signal<string>('wifi');

  readonly isOnline = this._isOnline.asReadonly();
  readonly connectionType = this._connectionType.asReadonly();

  async init(): Promise<void> {
    const status = await Network.getStatus();
    this._isOnline.set(status.connected);
    this._connectionType.set(status.connectionType);

    Network.addListener('networkStatusChange', (status) => {
      this._isOnline.set(status.connected);
      this._connectionType.set(status.connectionType);
    });
  }
}
