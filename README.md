# 🚚 FastShip - منصة الشحن الذكية العالمية

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/fastship/fastship)
[![Languages](https://img.shields.io/badge/languages-6-orange.svg)](#languages)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.1-yellow.svg)](https://firebase.google.com)

> **منصة عالمية تربط بين أصحاب الشحنات والموصلين بطريقة ذكية وآمنة**

FastShip هي منصة ويب حديثة تستفيد من الرحلات اليومية للأشخاص لتوصيل الشحنات بسرعة وأمان وبأسعار معقولة. ندعم **6 لغات عالمية** ونغطي أكثر من **4 مليار شخص** حول العالم.

---

## 📋 المحتويات

- [المميزات](#-المميزات)
- [التقنيات المستخدمة](#-التقنيات-المستخدمة)
- [هيكل المشروع](#-هيكل-المشروع)
- [التثبيت والإعداد](#-التثبيت-والإعداد)
- [الاستخدام](#-الاستخدام)
- [اللغات المدعومة](#-اللغات-المدعومة)
- [Firebase Configuration](#-firebase-configuration)
- [المساهمة](#-المساهمة)
- [الترخيص](#-الترخيص)
- [التواصل](#-التواصل)

---

## ✨ المميزات

### 🔍 **مطابقة ذكية**
- خوارزمية متقدمة تربط بين الشحنات والرحلات بناءً على المسار والوقت
- نظام تسجيل نقاط يحدد أفضل التطابقات
- دعم النقاط الوسيطة في الرحلات

### 🛡️ **أمان كامل**
- توثيق كامل لجميع المستخدمين
- تشفير SSL/TLS لجميع البيانات
- نظام تقييم شفاف
- تأمين على الشحنات

### 💰 **أسعار تنافسية**
- تخفيض كبير في تكاليف الشحن (حتى 50%)
- سعر عادل للموصلين
- لا رسوم مخفية

### 🌍 **منصة عالمية**
- دعم **6 لغات**: العربية، الإنجليزية، الصينية، الإسبانية، الروسية، الأردية
- تغطية عالمية واسعة
- واجهة متجاوبة تماماً (Mobile-First)

### ⚡ **سرعة وسهولة**
- واجهة مستخدم بسيطة وسهلة
- تسجيل سريع (أقل من دقيقتين)
- إشعارات فورية
- تتبع الشحنات في الوقت الفعلي

---

## 🛠️ التقنيات المستخدمة

### Frontend
- **HTML5** - هيكل الصفحات
- **CSS3** - التصميم والتنسيق
  - CSS Grid & Flexbox
  - Animations & Transitions
  - Responsive Design
- **JavaScript (ES6+)** - البرمجة والتفاعل
  - Modules
  - Async/Await
  - DOM Manipulation

### Backend & Database
- **Firebase**
  - Authentication - نظام المصادقة
  - Realtime Database - قاعدة البيانات
  - Storage - تخزين الملفات
  - Hosting - الاستضافة

### Architecture
- **MVC Pattern** - فصل المنطق عن العرض
- **Modular JavaScript** - كود منظم وقابل لإعادة الاستخدام
- **Progressive Web App Ready** - جاهز للتحويل لتطبيق PWA

---

## 📁 هيكل المشروع

```
fastship/
│
├── index.html                      # الصفحة الرئيسية
├── shared-auth.html                # صفحة تسجيل الدخول/التسجيل المشتركة
├── README.md                       # توثيق المشروع
├── .gitignore                      # ملفات Git المستبعدة
│
├── js/                             # ملفات JavaScript
│   ├── firebase-config.js          # إعدادات Firebase
│   ├── auth.js                     # نظام المصادقة
│   ├── database.js                 # دوال قاعدة البيانات
│   ├── matching.js                 # خوارزمية المطابقة
│   ├── translations.js             # نظام اللغات (6 لغات)
│   └── utils.js                    # دوال مساعدة
│
├── css/                            # ملفات التصميم
│   ├── global.css                  # التصميم العام
│   ├── animations.css              # الحركات والتأثيرات
│   └── responsive.css              # التصميم المتجاوب
│
├── shippers/                       # قسم أصحاب الشحنات
│   ├── dashboard.html              # لوحة التحكم
│   ├── create-shipment.html        # إنشاء شحنة جديدة
│   ├── my-shipments.html           # شحناتي
│   ├── profile.html                # الملف الشخصي
│   └── css/
│       └── shipper-styles.css      # تصميم خاص بأصحاب الشحنات
│
├── carriers/                       # قسم الموصلين
│   ├── dashboard.html              # لوحة التحكم
│   ├── create-trip.html            # إنشاء رحلة جديدة
│   ├── my-trips.html               # رحلاتي
│   ├── available-shipments.html    # الشحنات المتاحة
│   ├── profile.html                # الملف الشخصي
│   └── css/
│       └── carrier-styles.css      # تصميم خاص بالموصلين
│
├── pages/                          # صفحات إضافية
│   ├── about.html                  # من نحن
│   ├── contact.html                # اتصل بنا
│   ├── faq.html                    # الأسئلة الشائعة
│   ├── terms.html                  # الشروط والأحكام
│   └── privacy.html                # سياسة الخصوصية
│
└── assets/                         # الموارد (اختياري)
    ├── images/                     # الصور
    └── icons/                      # الأيقونات
```

---

## 🚀 التثبيت والإعداد

### المتطلبات الأساسية
- متصفح ويب حديث (Chrome, Firefox, Safari, Edge)
- خادم ويب محلي (Live Server, XAMPP, WAMP) أو Firebase Hosting
- حساب Firebase (مجاني)

### خطوات التثبيت

#### 1️⃣ تحميل المشروع
```bash
# Clone من GitHub
git clone https://github.com/your-username/fastship.git

# أو قم بتنزيل ZIP وفك الضغط
```

#### 2️⃣ إعداد Firebase

1. افتح [Firebase Console](https://console.firebase.google.com)
2. أنشئ مشروع جديد
3. فعّل Authentication (Email/Password)
4. أنشئ Realtime Database
5. انسخ إعدادات المشروع

#### 3️⃣ تحديث إعدادات Firebase

افتح `js/firebase-config.js` وحدّث الإعدادات:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

#### 4️⃣ تشغيل المشروع

**باستخدام Live Server (VS Code):**
```bash
# في VS Code
# انقر بزر الماوس الأيمن على index.html
# اختر "Open with Live Server"
```

**أو استخدم Python:**
```bash
# Python 3
python -m http.server 8000

# ثم افتح: http://localhost:8000
```

**أو استخدم Node.js:**
```bash
npx http-server
```

#### 5️⃣ النشر على Firebase (اختياري)

```bash
# تثبيت Firebase CLI
npm install -g firebase-tools

# تسجيل الدخول
firebase login

# تهيئة المشروع
firebase init

# النشر
firebase deploy
```

---

## 📖 الاستخدام

### للمستخدمين الجدد

#### تسجيل كصاحب شحنة:
1. افتح الصفحة الرئيسية
2. اضغط "أرسل شحنة" أو "تسجيل جديد"
3. اختر "صاحب شحنة"
4. أكمل البيانات المطلوبة
5. سجل الدخول
6. أنشئ شحنتك الأولى!

#### تسجيل كموصل:
1. افتح الصفحة الرئيسية
2. اضغط "اصبح موصلاً" أو "تسجيل جديد"
3. اختر "موصل"
4. أكمل البيانات المطلوبة
5. سجل الدخول
6. أنشئ رحلتك الأولى!

### للمطورين

#### إضافة لغة جديدة:

افتح `js/translations.js` وأضف:

```javascript
const translations = {
  // ...
  fr: {  // French
    name: "Français",
    flag: "🇫🇷",
    dir: "ltr",
    nav_home: "Accueil",
    // ... المزيد من الترجمات
  }
};
```

#### إضافة مدينة جديدة لخوارزمية المطابقة:

افتح `js/matching.js` وأضف:

```javascript
initializeCities() {
  return {
    // ...
    "باريس": { lat: 48.8566, lng: 2.3522, country: "FR" },
  };
}
```

---

## 🌐 اللغات المدعومة

| اللغة | الكود | الاتجاه | الحالة |
|-------|------|----------|--------|
| 🇸🇦 العربية | ar | RTL | ✅ جاهز |
| 🇬🇧 English | en | LTR | ✅ جاهز |
| 🇨🇳 中文 | zh | LTR | ✅ جاهز |
| 🇪🇸 Español | es | LTR | ✅ جاهز |
| 🇷🇺 Русский | ru | LTR | ✅ جاهز |
| 🇵🇰 اردو | ur | RTL | ✅ جاهز |

**التغطية السكانية:** أكثر من 4 مليار شخص حول العالم!

---

## 🔥 Firebase Configuration

### هيكل قاعدة البيانات

```json
{
  "users": {
    "shipper": {
      "userId1": {
        "name": "أحمد محمد",
        "email": "ahmed@example.com",
        "phone": "+966501234567",
        "rating": 4.8,
        "totalRatings": 25,
        "completedShipments": 15
      }
    },
    "carrier": {
      "userId2": {
        "name": "محمد علي",
        "email": "mohamed@example.com",
        "phone": "+966509876543",
        "vehicleType": "suv",
        "rating": 4.9,
        "completedTrips": 42
      }
    }
  },
  "shipments": {
    "shipmentId1": {
      "shipperId": "userId1",
      "from": "الرياض",
      "to": "جدة",
      "weight": 50,
      "status": "pending",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  },
  "trips": {
    "tripId1": {
      "carrierId": "userId2",
      "from": "الرياض",
      "to": "جدة",
      "capacity": 500,
      "availableSpace": 300,
      "status": "active",
      "departureDate": "2025-01-20"
    }
  }
}
```

### قواعد الأمان (Security Rules)

```json
{
  "rules": {
    "users": {
      "$userType": {
        "$userId": {
          ".read": "auth != null && (auth.uid === $userId || root.child('users/'+$userType+'/'+auth.uid+'/role').val() === 'admin')",
          ".write": "auth != null && auth.uid === $userId"
        }
      }
    },
    "shipments": {
      ".read": "auth != null",
      "$shipmentId": {
        ".write": "auth != null && (data.child('shipperId').val() === auth.uid || !data.exists())"
      }
    },
    "trips": {
      ".read": "auth != null",
      "$tripId": {
        ".write": "auth != null && (data.child('carrierId').val() === auth.uid || !data.exists())"
      }
    }
  }
}
```

---

## 🤝 المساهمة

نرحب بمساهماتكم! إليك كيفية المساهمة:

1. Fork المشروع
2. أنشئ فرع للميزة الجديدة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى الفرع (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

### معايير المساهمة
- اتبع نمط الكود الموجود
- أضف تعليقات واضحة بالعربية والإنجليزية
- اختبر التغييرات قبل الإرسال
- حدّث التوثيق عند الحاجة

---

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

```
MIT License

Copyright (c) 2025 FastShip

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 📞 التواصل

### الدعم الفني
- 📧 Email: [support@fastship.com](mailto:support@fastship.com)
- 💬 Discord: [FastShip Community](https://discord.gg/fastship)
- 🐦 Twitter: [@FastShipApp](https://twitter.com/fastshipapp)

### للاستفسارات التجارية
- 📧 Email: [business@fastship.com](mailto:business@fastship.com)
- 📞 Phone: +966 50 123 4567

### روابط مفيدة
- 🌐 الموقع: [https://fastship.com](https://fastship.com)
- 📚 التوثيق: [https://docs.fastship.com](https://docs.fastship.com)
- 🐛 تقارير الأخطاء: [GitHub Issues](https://github.com/fastship/fastship/issues)

---

## 🙏 شكر وتقدير

- شكراً لفريق Firebase على المنصة الرائعة
- شكراً لكل المساهمين في المشروع
- شكراً لمجتمع المطورين العرب

---

## 📊 الإحصائيات

![GitHub Stars](https://img.shields.io/github/stars/fastship/fastship?style=social)
![GitHub Forks](https://img.shields.io/github/forks/fastship/fastship?style=social)
![GitHub Issues](https://img.shields.io/github/issues/fastship/fastship)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/fastship/fastship)

---

<div align="center">

**صُنع بـ ❤️ من قبل فريق FastShip**

⭐ إذا أعجبك المشروع، لا تنسى إضافة نجمة!

[الموقع](https://fastship.com) • 
[التوثيق](https://docs.fastship.com) • 
[تقديم مشكلة](https://github.com/fastship/fastship/issues) • 
[طلب ميزة](https://github.com/fastship/fastship/issues/new?template=feature_request.md)

</div>

---

## 📅 خارطة الطريق

- [x] إطلاق النسخة الأولى (v1.0)
- [x] دعم 6 لغات
- [ ] تطبيق الجوال (iOS & Android)
- [ ] نظام الدفع المتقدم
- [ ] تتبع GPS الفوري
- [ ] نظام الإشعارات Push
- [ ] API للمطورين
- [ ] لوحة تحكم الإدارة
- [ ] نظام الولاء والمكافآت
- [ ] التكامل مع خدمات الدفع العالمية

---

**آخر تحديث:** يناير 2025  
**الإصدار:** 1.0.0  
**الحالة:** ✅ جاهز للإنتاج
