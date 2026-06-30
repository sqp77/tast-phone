import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { NgFor, NgIf, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonBackButton, IonIcon, IonButton, IonFooter
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  sendOutline, sparklesOutline, closeCircleOutline,
  chatbubblesOutline, arrowBackOutline
} from 'ionicons/icons';
import { AiGuideService, ChatMessage } from '../../core/services/ai-guide.service';

@Component({
  selector: 'app-ai-guide',
  templateUrl: 'ai-guide.page.html',
  styleUrls: ['ai-guide.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonBackButton, IonIcon, IonButton, IonFooter,
    FormsModule, NgFor, NgIf,
  ],
})
export class AiGuidePage implements OnInit {
  @ViewChild('chatContent') chatContent!: IonContent;

  readonly guide = inject(AiGuideService);
  private readonly location = inject(Location);

  inputText = '';
  isTyping = false;

  get messages(): ChatMessage[] { return this.guide.messages(); }
  get quickQuestions() { return this.guide.quickQuestions; }

  constructor() {
    addIcons({ sendOutline, sparklesOutline, closeCircleOutline, chatbubblesOutline, arrowBackOutline });
  }

  ngOnInit(): void {
    setTimeout(() => this.scrollToBottom(), 300);
  }

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text) return;
    this.inputText = '';
    this.isTyping = true;
    this.guide.sendMessage(text).subscribe(() => {
      this.isTyping = false;
      this.scrollToBottom();
    });
    this.scrollToBottom();
  }

  sendQuickQuestion(query: string): void {
    this.inputText = query;
    this.sendMessage();
  }

  clearChat(): void { this.guide.clearChat(); }

  goBack(): void { this.location.back(); }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.chatContent?.scrollToBottom(300);
    }, 100);
  }

  onEnter(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }
}
