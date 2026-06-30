import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-section-header',
  templateUrl: 'section-header.component.html',
  styleUrls: ['section-header.component.scss'],
  standalone: true,
  imports: [IonIcon, NgIf],
})
export class SectionHeaderComponent {
  @Input({ required: true }) title = '';
  @Input() subtitle = '';
  @Input() showAction = false;
  @Input() actionLabel = 'عرض الكل';
  @Output() actionClick = new EventEmitter<void>();

  constructor() {
    addIcons({ arrowBackOutline });
  }
}
