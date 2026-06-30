import { Component, Input } from '@angular/core';
import { IonCard, IonCardContent, IonSkeletonText } from '@ionic/angular/standalone';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-skeleton-card',
  templateUrl: 'skeleton-card.component.html',
  styleUrls: ['skeleton-card.component.scss'],
  standalone: true,
  imports: [IonCard, IonCardContent, IonSkeletonText, NgFor, NgIf],
})
export class SkeletonCardComponent {
  @Input() variant: 'city' | 'event' | 'article' | 'list' = 'city';
  @Input() count = 3;
  readonly items = Array.from({ length: this.count });
}
