import { Component, Input } from '@angular/core';
import { IonIcon, IonChip } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline, eyeOutline, heartOutline } from 'ionicons/icons';
import { Article } from '../../../core/models/article.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-article-card',
  templateUrl: 'article-card.component.html',
  styleUrls: ['article-card.component.scss'],
  standalone: true,
  imports: [IonIcon, IonChip, NgIf],
})
export class ArticleCardComponent {
  @Input() article!: Article;
  @Input() variant: 'horizontal' | 'vertical' = 'horizontal';

  constructor() {
    addIcons({ timeOutline, eyeOutline, heartOutline });
  }
}
