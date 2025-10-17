# FastShip Core Logic - المنطق الأساسي لمنصة FastShip

## 📦 المحتويات

### 1. models.js - نماذج البيانات
يحتوي على جميع نماذج البيانات الأساسية للمنصة:
- **CarrierTypes**: أنواع الموصلين (مسافر عادي، صاحب سيارة، صاحب شاحنة، شركة أساطيل)
- **ShipmentTypes**: أنواع الشحنات (صغيرة، متوسطة، كبيرة، عملاقة)
- **ShipmentCategories**: فئات الشحنات (مستندات، إلكترونيات، ملابس، إلخ)
- **Shipment Class**: نموذج الشحنة
- **Carrier Class**: نموذج الموصل
- **Trip Class**: نموذج الرحلة
- **Location Class**: نموذج الموقع

### 2. matching-engine.js - محرك المطابقة
نظام ذكي لمطابقة الشحنات مع الموصلين المناسبين:
- **findMatchingCarriers()**: إيجاد الموصلين المناسبين لشحنة معينة
- **findAvailableTrips()**: إيجاد الرحلات المتاحة
- **suggestShipmentsForCarrier()**: اقتراح شحنات للموصل
- **optimizeSpaceUtilization()**: تحسين استغلال المساحة
- **calculateDistance()**: حساب المسافة بين موقعين
- **calculateMatchScore()**: حساب درجة التطابق

### 3. pricing-engine.js - محرك التسعير
نظام متقدم لحساب الأسعار:
- **calculateFullPrice()**: حساب السعر الكامل للشحنة
- **calculateBasePrice()**: حساب السعر الأساسي
- **calculateInsurance()**: حساب تكلفة التأمين
- **calculateDiscount()**: حساب الخصومات
- **calculateCarrierEarnings()**: حساب أرباح الموصل
- **comparePrices()**: مقارنة الأسعار بين موصلين

### 4. trip-manager.js - مدير الرحلات
نظام إدارة الرحلات والحجوزات:
- **createTrip()**: إنشاء رحلة جديدة
- **bookSpace()**: حجز مساحة في رحلة
- **cancelBooking()**: إلغاء حجز
- **searchTrips()**: البحث عن رحلات متاحة
- **getTripStatistics()**: الحصول على إحصائيات الرحلة
- **calculateTripEarnings()**: حساب أرباح الرحلة

### 5. mock-data.js - البيانات التجريبية
بيانات تجريبية للاختبار والتطوير:
- مدن السعودية مع الإحداثيات
- مستخدمين تجريبيين
- موصلين تجريبيين
- رحلات تجريبية
- شحنات تجريبية
- تقييمات وإشعارات

### 6. fastship-core.js - الملف الرئيسي
ربط جميع المكونات معاً وتوفير API موحد:
- **initialize()**: تهيئة المنصة
- **createShipment()**: إنشاء شحنة جديدة
- **findCarriersForShipment()**: البحث عن موصلين
- **calculateShipmentPrice()**: حساب سعر الشحنة
- **createTrip()**: إنشاء رحلة
- **bookShipment()**: حجز شحنة
- **getStatistics()**: الحصول على إحصائيات المنصة

## 🚀 الاستخدام

### 1. تضمين الملفات في HTML

```html
<!-- FastShip Core Logic -->
<script src="core/models.js"></script>
<script src="core/matching-engine.js"></script>
<script src="core/pricing-engine.js"></script>
<script src="core/trip-manager.js"></script>
<script src="core/mock-data.js"></script>
<script src="core/fastship-core.js"></script>
```

### 2. الانتظار حتى جاهزية المنصة

```javascript
window.addEventListener('fastship:ready', function() {
    console.log('FastShip is ready!');
    
    // يمكنك الآن استخدام المنصة
    const stats = window.FastShip.getStatistics();
    console.log('Platform statistics:', stats);
});
```

### 3. إنشاء شحنة جديدة

```javascript
const shipment = window.FastShip.createShipment({
    senderId: 'USR-001',
    category: 'electronics',
    weight: 5,
    dimensions: { length: 30, width: 20, height: 10 },
    fromLocation: new window.FastShipModels.Location({
        city: 'الرياض',
        region: 'الرياض',
        lat: 24.7136,
        lng: 46.6753
    }),
    toLocation: new window.FastShipModels.Location({
        city: 'جدة',
        region: 'مكة المكرمة',
        lat: 21.5169,
        lng: 39.2192
    }),
    pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    description: 'جهاز لابتوب',
    value: 5000,
    insuranceRequired: true
});

console.log('Shipment created:', shipment.id);
```

### 4. البحث عن موصلين

```javascript
const matches = window.FastShip.findCarriersForShipment(shipment.id, {
    minRating: 4.0,
    verifiedOnly: true
});

console.log('Found carriers:', matches.length);
```

### 5. حساب السعر

```javascript
const pricing = window.FastShip.calculateShipmentPrice(
    shipment.id,
    matches[0].carrier.id,
    {
        urgency: 'nextDay',
        includeInsurance: true
    }
);

console.log('Price:', pricing.totalPrice, 'SAR');
console.log('Carrier earnings:', pricing.carrierEarnings, 'SAR');
```

### 6. حجز شحنة

```javascript
const booking = window.FastShip.bookShipment(tripId, shipment.id);
console.log('Booking confirmed:', booking.id);
```

## 📊 أمثلة متقدمة

### البحث عن رحلات متاحة

```javascript
const trips = window.FastShip.findTripsForShipment(shipment.id, {
    maxPrice: 500,
    minRating: 4.5
});

trips.forEach(tripInfo => {
    console.log(`Trip ${tripInfo.trip.id}:`);
    console.log(`  Price: ${tripInfo.price} SAR`);
    console.log(`  Distance: ${tripInfo.distance} km`);
    console.log(`  Duration: ${tripInfo.estimatedDuration}`);
    console.log(`  Match Score: ${tripInfo.matchScore}`);
});
```

### تحسين استغلال المساحة

```javascript
const optimization = window.FastShip.optimizeTripSpace(tripId);

console.log('Optimization results:');
console.log(`  Selected shipments: ${optimization.shipments.length}`);
console.log(`  Total weight: ${optimization.totalWeight} kg`);
console.log(`  Utilization: ${optimization.utilization.toFixed(2)}%`);
console.log(`  Remaining capacity: ${optimization.remainingCapacity} kg`);
```

### الحصول على إحصائيات المنصة

```javascript
const stats = window.FastShip.getStatistics();

console.log('Platform Statistics:');
console.log(`  Total Shipments: ${stats.totalShipments}`);
console.log(`  Total Carriers: ${stats.totalCarriers}`);
console.log(`  Active Trips: ${stats.activeTrips}`);
console.log(`  Average Rating: ${stats.averageRating}`);
console.log(`  Total Capacity: ${stats.totalCapacity} kg`);
```

## 🎯 الميزات الرئيسية

### ✅ نظام المطابقة الذكي
- مطابقة تلقائية بين الشحنات والموصلين
- حساب درجة التطابق بناءً على عدة معايير
- تحسين استغلال المساحة المتاحة

### 💰 نظام التسعير الديناميكي
- حساب الأسعار بناءً على المسافة والوزن والنوع
- دعم الخصومات والعروض الخاصة
- حساب أرباح الموصل تلقائياً

### 🛣️ إدارة الرحلات
- إنشاء وإدارة الرحلات
- حجز المساحات وإلغاء الحجوزات
- تتبع إحصائيات الرحلات

### 📦 أنواع الشحنات
- دعم 4 أحجام: صغيرة، متوسطة، كبيرة، عملاقة
- 8 فئات: مستندات، إلكترونيات، ملابس، أطعمة، كتب، أدوية، أثاث، أخرى
- خيارات التأمين والعناية الخاصة

### 🚗 أنواع الموصلين
- مسافر عادي (حتى 20 كجم)
- صاحب سيارة خاصة (حتى 1.5 طن)
- صاحب شاحنة (حتى 50 طن)
- شركة أساطيل (فوق 50 طن)

## 🔧 API Reference

### Window Objects

```javascript
window.FastShip              // المنصة الرئيسية
window.FastShipModels        // نماذج البيانات
window.FastShipMatchingEngine // محرك المطابقة
window.FastShipPricingEngine  // محرك التسعير
window.FastShipTripManager    // مدير الرحلات
window.FastShipMockData       // البيانات التجريبية
```

### Events

```javascript
// حدث جاهزية المنصة
window.addEventListener('fastship:ready', function() {
    // المنصة جاهزة للاستخدام
});
```

## 📝 ملاحظات مهمة

1. **التهيئة التلقائية**: المنصة تقوم بالتهيئة تلقائياً عند تحميل الصفحة
2. **البيانات التجريبية**: يتم تحميل البيانات التجريبية تلقائياً للتطوير
3. **التوافقية**: يدعم المتصفحات الحديثة فقط (Chrome, Firefox, Safari, Edge)
4. **الأداء**: تم تحسين الأداء للتعامل مع آلاف الشحنات والرحلات

## 🐛 التصحيح والاختبار

للتحقق من صحة التهيئة:

```javascript
console.log('FastShip initialized:', window.FastShip.initialized);
console.log('Available models:', Object.keys(window.FastShipModels));
```

لتصدير البيانات للتحليل:

```javascript
const data = window.FastShip.exportData();
console.log(JSON.stringify(data, null, 2));
```

## 📄 الترخيص

جميع الحقوق محفوظة © 2024 FastShip
