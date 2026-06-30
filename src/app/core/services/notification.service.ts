import { Injectable, signal } from '@angular/core';
import { Notification } from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications = signal<Notification[]>(MOCK_NOTIFICATIONS);

  readonly notifications = this._notifications.asReadonly();
  readonly unreadCount = () => this._notifications().filter(n => !n.isRead).length;

  markAsRead(id: string): void {
    this._notifications.update(list =>
      list.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }

  markAllRead(): void {
    this._notifications.update(list => list.map(n => ({ ...n, isRead: true })));
  }

  deleteNotification(id: string): void {
    this._notifications.update(list => list.filter(n => n.id !== id));
  }
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    titleAr: '🎉 موسم الرياض يبدأ قريباً!',
    titleEn: '🎉 Riyadh Season Starting Soon!',
    bodyAr: 'استعد لأكبر موسم ترفيهي في تاريخ المملكة. احجز تذاكرك الآن.',
    bodyEn: 'Get ready for the biggest entertainment season in the Kingdom\'s history. Book your tickets now.',
    type: 'event',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=100&q=80',
  },
  {
    id: 'n2',
    titleAr: '💎 عرض خاص على فنادق العُلا',
    titleEn: '💎 Special Offer on AlUla Hotels',
    bodyAr: 'خصم يصل إلى 40% على أفضل منتجعات العُلا الفاخرة.',
    bodyEn: 'Up to 40% off on the finest luxury resorts in AlUla.',
    type: 'offer',
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'n3',
    titleAr: '🗺️ تم إضافة مناطق جديدة في أبها',
    titleEn: '🗺️ New Areas Added in Abha',
    bodyAr: 'اكتشف 5 وجهات سياحية جديدة تم إضافتها في منطقة عسير.',
    bodyEn: 'Discover 5 new tourist destinations added in Asir region.',
    type: 'update',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'n4',
    titleAr: '⭐ قيّم تجربتك في جدة',
    titleEn: '⭐ Rate Your Jeddah Experience',
    bodyAr: 'يبدو أنك زرت جدة مؤخراً. شاركنا رأيك لمساعدة المسافرين الآخرين.',
    bodyEn: 'It looks like you recently visited Jeddah. Share your opinion to help other travelers.',
    type: 'system',
    isRead: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];
