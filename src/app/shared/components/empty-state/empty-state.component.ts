import { Component, Input } from '@angular/core';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, heartOutline, mapOutline, calendarOutline, wifiOutline } from 'ionicons/icons';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  templateUrl: 'empty-state.component.html',
  styleUrls: ['empty-state.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, NgIf],
})
export class EmptyStateComponent {
  @Input() icon = 'search-outline';
  @Input() title = 'لا توجد نتائج';
  @Input() message = 'حاول البحث بكلمات مختلفة';
  @Input() actionLabel = '';
  @Input() action: (() => void) | null = null;

  constructor() {
    addIcons({ searchOutline, heartOutline, mapOutline, calendarOutline, wifiOutline });
  }
}
