import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { MockDataService } from './mock-data.service';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

const QUICK_QUESTIONS = [
  { label: 'أفضل وقت للزيارة؟', query: 'ما هو أفضل وقت لزيارة المملكة العربية السعودية؟' },
  { label: 'أشهر المعالم؟', query: 'ما هي أشهر المعالم السياحية في المملكة؟' },
  { label: 'طعام أصيل', query: 'ما هي أشهر الأكلات السعودية الأصيلة التي يجب أن أجربها؟' },
  { label: 'رحلة للعائلات', query: 'ما هي أفضل الوجهات المناسبة للعائلات في السعودية؟' },
  { label: 'المناطق التراثية', query: 'ما هي المناطق والمواقع التراثية في المملكة؟' },
  { label: 'NEOM والمستقبل', query: 'ما الذي يمكن رؤيته في مشروع نيوم؟' },
];

const AI_RESPONSES: Record<string, string> = {
  default: `مرحباً بك في Saudi Explorer! 🌟

أنا مرشدك السياحي الذكي. يمكنني مساعدتك في:
• اقتراح الوجهات المثالية لك
• التخطيط لرحلتك
• معلومات عن المعالم والفعاليات
• نصائح السفر والإقامة
• الطعام والثقافة السعودية

اسألني عن أي شيء تريد معرفته! ✨`,

  time: `أفضل وقت لزيارة المملكة العربية السعودية هو في فصل الشتاء من نوفمبر حتى مارس 🌤️

الطقس في هذه الفترة:
• معتدل ومناسب للسياحة
• درجات الحرارة بين 15-25 درجة
• مثالي للجولات الخارجية

المدن الجبلية كأبها وتبوك ممتعة طوال العام 🏔️

موسم الرياض يُقام في الشتاء ويوفر تجارب ترفيهية رائعة! 🎡`,

  attractions: `أشهر المعالم السياحية في المملكة 🌟

🏛️ العُلا ومدائن صالح (تراث اليونسكو)
🗼 برج المملكة في الرياض
🕌 المسجد النبوي في المدينة المنورة
🏖️ كورنيش جدة والبلد التاريخي
🏔️ جبال أبها الخضراء
🌊 شواطئ الخبر والدمام
🎡 موسم الرياض
🐟 متحف الحوت في جدة
⛰️ نيوم والخط
🏜️ الربع الخالي`,

  food: `أشهر الأكلات السعودية الأصيلة 🍽️

🍚 الكبسة - الطبق الوطني بامتياز
🥩 المندي - اللحم المطهو على البخار
🫓 الجريش - تراث نجدي أصيل
🍗 الدجاج المشوي على الفحم
🥗 السلطة العربية الطازجة
🍯 التمر بأنواعه (300+ نوع!)
☕ القهوة العربية بالهيل
🥛 اللبن الرايب والزبادي

لا تفوت تجربة الأكل في مطاعم البلد القديم في جدة! 🌟`,

  family: `أفضل الوجهات العائلية في السعودية 👨‍👩‍👧‍👦

🎢 موسم الرياض (ترفيه لا مثيل له)
🌊 كورنيش الدمام والخبر
🏔️ أبها وتلفريك السودة
🐠 شواطئ جدة للسنوركلينغ
🦁 حديقة الحيوان بالرياض
🎪 العُلا ومغامراتها الصحراوية
🏰 مدينة الترفيه في الرياض
🌊 بريح في الخبر (مدينة ترفيهية)

الفنادق الكبرى توفر أنشطة خاصة للأطفال! 🎯`,

  heritage: `المناطق التراثية والتاريخية في المملكة 🏛️

📜 العُلا ومدائن صالح - تراث نبطي أمازيغي (يونسكو)
🕌 الدرعية - مهد الدولة السعودية (يونسكو)
🏘️ البلد التاريخي في جدة (يونسكو)
🗿 الحِجر الأثرية
🏯 قصر المصمك التاريخي
🌴 واحة الأحساء (يونسكو)
⛪ المسجد النبوي الشريف
🏺 متحف الحضارات في جدة
🎨 فنون الصخور في حائل
🌄 مدينة تيماء الأثرية`,

  neom: `نيوم - مدينة المستقبل 🚀

نيوم هو مشروع طموح بمساحة 26,500 كم² في شمال غرب المملكة:

🏙️ ذا لاين - مدينة خطية بلا سيارات
⛷️ تروجينا - منتجع الجبال والثلوج
🌊 سينيوم - جزيرة الترفيه البحري
🏭 أوكساجون - مدينة الصناعة الخضراء

المشروع يستقطب السياح للاستمتاع بالمناظر الطبيعية الخلابة في منطقة تبوك وخليج العقبة! 🌊`,
};

@Injectable({ providedIn: 'root' })
export class AiGuideService {
  private readonly mock = inject(MockDataService);

  readonly quickQuestions = QUICK_QUESTIONS;
  private readonly _messages = signal<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: AI_RESPONSES['default'],
      timestamp: new Date(),
    },
  ]);

  readonly messages = this._messages.asReadonly();

  sendMessage(userText: string): Observable<ChatMessage> {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date(),
    };

    const loadingMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    this._messages.update(msgs => [...msgs, userMsg, loadingMsg]);

    const response = this.generateResponse(userText);

    return new Observable(observer => {
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        this._messages.update(msgs => [...msgs.filter(m => !m.isLoading), aiMsg]);
        observer.next(aiMsg);
        observer.complete();
      }, 1200);
    });
  }

  private generateResponse(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes('وقت') || lower.includes('موسم') || lower.includes('متى')) return AI_RESPONSES['time'];
    if (lower.includes('معالم') || lower.includes('سياحة') || lower.includes('أماكن')) return AI_RESPONSES['attractions'];
    if (lower.includes('طعام') || lower.includes('أكل') || lower.includes('مطعم') || lower.includes('كبسة')) return AI_RESPONSES['food'];
    if (lower.includes('عائلة') || lower.includes('أطفال') || lower.includes('ترفيه')) return AI_RESPONSES['family'];
    if (lower.includes('تراث') || lower.includes('تاريخ') || lower.includes('أثر')) return AI_RESPONSES['heritage'];
    if (lower.includes('نيوم') || lower.includes('لاين') || lower.includes('مستقبل')) return AI_RESPONSES['neom'];
    if (lower.includes('رياض')) return `الرياض العاصمة الذهبية 🌟\n\nأبرز ما يمكن زيارته:\n🗼 برج المملكة\n🏯 قصر المصمك\n🛍️ مول الرياض\n🎡 موسم الرياض\n🌿 حديقة الملك عبدلله\n🏛️ الدرعية التاريخية\n\nأفضل وقت للزيارة: نوفمبر - مارس 🌤️`;
    if (lower.includes('جدة')) return `جدة عروس البحر الأحمر 🌊\n\nأبرز المعالم:\n🌊 كورنيش جدة (30 كم)\n🏘️ البلد التاريخي (يونسكو)\n⛲ نافورة الملك فهد\n🐠 الشعاب المرجانية\n🛍️ سوق الذهب\n🎨 جدة للفنون\n\nأفضل الأنشطة: الغوص والسنوركلينغ! 🤿`;
    if (lower.includes('علا') || lower.includes('عُلا')) return `العُلا - جوهرة التراث العالمي ✨\n\nعُلا تقدم تجربة لا مثيل لها:\n🏛️ مدائن صالح (الحِجر) - تراث يونسكو\n🌹 وادي الفن - فنون صخرية\n🌙 ليالي العُلا المضيئة\n🎪 موسم العُلا\n🌄 غروب الشمس الساحر\n🐪 جولات الإبل في الصحراء\n\nاحجز مبكراً - الطلب كبير! 🌟`;

    return `شكراً على سؤالك! 😊\n\nسأساعدك في الحصول على معلومات سياحية شاملة عن المملكة العربية السعودية.\n\nيمكنني إرشادك إلى:\n🏙️ أفضل المدن للزيارة\n🏛️ المعالم التاريخية\n🍽️ أفضل المطاعم\n🏨 الفنادق المميزة\n📅 الفعاليات والمهرجانات\n\nما الذي تريد معرفته بالتحديد؟ ✨`;
  }

  clearChat(): void {
    this._messages.set([{
      id: '0',
      role: 'assistant',
      content: AI_RESPONSES['default'],
      timestamp: new Date(),
    }]);
  }
}
