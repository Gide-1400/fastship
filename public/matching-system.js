// FastShip Smart Matching System
// نظام المطابقة الذكي لمنصة FastShip

class FastShipMatchingSystem {
    constructor() {
        this.shipmentTypes = {
            small: {
                name: 'شحنات صغيرة',
                weightRange: { min: 0.1, max: 20 }, // كيلو
                examples: ['مستندات', 'كتب', 'هدايا صغيرة', 'أدوية', 'إلكترونيات صغيرة'],
                compatibleCarriers: ['regular_traveler'],
                icon: '🎒',
                color: 'green'
            },
            medium: {
                name: 'شحنات متوسطة',
                weightRange: { min: 20, max: 1500 }, // كيلو
                examples: ['أجهزة إلكترونية', 'ملابس', 'مشتريات online', 'أطعمة', 'أدوات منزلية'],
                compatibleCarriers: ['regular_traveler', 'car_owner'],
                icon: '📦',
                color: 'blue'
            },
            large: {
                name: 'شحنات كبيرة',
                weightRange: { min: 1500, max: 50000 }, // كيلو = 50 طن
                examples: ['أثاث', 'أجهزة منزلية', 'بضائع تجارية', 'معدات', 'قطع غيار'],
                compatibleCarriers: ['car_owner', 'truck_owner'],
                icon: '🚚',
                color: 'orange'
            },
            giant: {
                name: 'شحنات عملاقة',
                weightRange: { min: 50000, max: 1000000 }, // كيلو = 1000 طن
                examples: ['مواد بناء', 'حاويات', 'معدات ثقيلة', 'سيارات', 'بضائع تجارية ضخمة'],
                compatibleCarriers: ['truck_owner', 'fleet_company'],
                icon: '🏢',
                color: 'purple'
            }
        };

        this.carrierTypes = {
            regular_traveler: {
                name: 'المسافر العادي',
                capacity: { min: 0.1, max: 20 }, // كيلو
                vehicles: ['تاكسي', 'حافلة', 'طائرة', 'قطار'],
                example: 'طالب مسافر يحمل حقيبة صغيرة',
                icon: '🚶‍♂️',
                color: 'green',
                compatibleShipments: ['small', 'medium']
            },
            car_owner: {
                name: 'صاحب السيارة الخاصة',
                capacity: { min: 20, max: 1500 }, // كيلو
                vehicles: ['كورولا', 'بيك أب', 'سيارات خاصة'],
                example: 'موظف مسافر بين المدن بسيارته',
                icon: '🚗',
                color: 'blue',
                compatibleShipments: ['medium', 'large']
            },
            truck_owner: {
                name: 'صاحب الشاحنة',
                capacity: { min: 1500, max: 50000 }, // كيلو = 50 طن
                vehicles: ['دينات', 'شاحنات متوسطة', 'تريلات'],
                example: 'سائق شاحنة برحلات منتظمة',
                icon: '🚚',
                color: 'orange',
                compatibleShipments: ['large', 'giant']
            },
            fleet_company: {
                name: 'الشركات والأساطيل',
                capacity: { min: 50000, max: 1000000 }, // كيلو = 1000 طن
                vehicles: ['تريلات', 'قطارات', 'طائرات', 'سفن'],
                example: 'شركات شحن لديها مساحات غير مستغلة',
                icon: '🏢',
                color: 'purple',
                compatibleShipments: ['giant']
            }
        };

        this.routes = {
            'الرياض-جدة': { distance: 870, duration: 8, cost: { small: 50, medium: 200, large: 800, giant: 3000 } },
            'الرياض-الدمام': { distance: 395, duration: 4, cost: { small: 30, medium: 120, large: 500, giant: 2000 } },
            'جدة-الدمام': { distance: 1275, duration: 12, cost: { small: 80, medium: 300, large: 1200, giant: 5000 } },
            'الرياض-أبها': { distance: 650, duration: 6, cost: { small: 40, medium: 150, large: 600, giant: 2500 } },
            'جدة-المدينة المنورة': { distance: 360, duration: 4, cost: { small: 25, medium: 100, large: 400, giant: 1500 } }
        };
    }

    // تحديد نوع الشحنة بناءً على الوزن
    determineShipmentType(weight) {
        for (const [type, config] of Object.entries(this.shipmentTypes)) {
            if (weight >= config.weightRange.min && weight <= config.weightRange.max) {
                return type;
            }
        }
        return 'giant'; // إذا كان الوزن أكبر من الحد الأقصى
    }

    // العثور على الموصّلين المناسبين
    findCompatibleCarriers(shipmentType, from, to, preferences = {}) {
        const shipment = this.shipmentTypes[shipmentType];
        const compatibleCarriers = [];

        for (const [carrierType, carrier] of Object.entries(this.carrierTypes)) {
            if (shipment.compatibleCarriers.includes(carrierType)) {
                // حساب التكلفة المقدرة
                const route = this.getRoute(from, to);
                const estimatedCost = this.calculateCost(shipmentType, carrierType, route);
                
                // حساب التقييم المتوقع
                const rating = this.calculateRating(carrierType, shipmentType);
                
                // حساب الوقت المتوقع
                const estimatedTime = this.calculateTime(carrierType, route);

                compatibleCarriers.push({
                    type: carrierType,
                    name: carrier.name,
                    capacity: carrier.capacity,
                    vehicles: carrier.vehicles,
                    example: carrier.example,
                    icon: carrier.icon,
                    color: carrier.color,
                    estimatedCost: estimatedCost,
                    rating: rating,
                    estimatedTime: estimatedTime,
                    compatibility: this.calculateCompatibility(shipmentType, carrierType)
                });
            }
        }

        // ترتيب النتائج حسب الأفضلية
        return compatibleCarriers.sort((a, b) => {
            // أولوية للتوافق العالي
            if (a.compatibility !== b.compatibility) {
                return b.compatibility - a.compatibility;
            }
            // ثم حسب التكلفة
            return a.estimatedCost - b.estimatedCost;
        });
    }

    // حساب التكلفة
    calculateCost(shipmentType, carrierType, route) {
        if (!route) return 0;
        
        const baseCost = route.cost[shipmentType] || 0;
        
        // تعديل التكلفة حسب نوع الموصّل
        const carrierMultiplier = {
            'regular_traveler': 0.8,    // أرخص
            'car_owner': 1.0,          // متوسط
            'truck_owner': 1.2,        // أغلى قليلاً
            'fleet_company': 1.5       // أغلى (لكن للشحنات الضخمة)
        };

        return Math.round(baseCost * (carrierMultiplier[carrierType] || 1.0));
    }

    // حساب التقييم المتوقع
    calculateRating(carrierType, shipmentType) {
        const baseRatings = {
            'regular_traveler': 4.2,
            'car_owner': 4.5,
            'truck_owner': 4.7,
            'fleet_company': 4.8
        };

        // تعديل التقييم حسب توافق نوع الشحنة
        const compatibilityBonus = this.calculateCompatibility(shipmentType, carrierType) * 0.1;
        
        return Math.min(5.0, (baseRatings[carrierType] || 4.0) + compatibilityBonus);
    }

    // حساب الوقت المتوقع
    calculateTime(carrierType, route) {
        if (!route) return 0;
        
        const baseTime = route.duration;
        
        // تعديل الوقت حسب نوع الموصّل
        const timeMultiplier = {
            'regular_traveler': 1.0,    // وقت عادي
            'car_owner': 1.1,          // أبطأ قليلاً
            'truck_owner': 1.2,        // أبطأ
            'fleet_company': 1.5       // أبطأ (لكن للشحنات الضخمة)
        };

        return Math.round(baseTime * (timeMultiplier[carrierType] || 1.0));
    }

    // حساب التوافق
    calculateCompatibility(shipmentType, carrierType) {
        const shipment = this.shipmentTypes[shipmentType];
        const carrier = this.carrierTypes[carrierType];
        
        if (!shipment.compatibleCarriers.includes(carrierType)) {
            return 0;
        }

        // حساب التوافق بناءً على نطاق الوزن
        const shipmentMin = shipment.weightRange.min;
        const shipmentMax = shipment.weightRange.max;
        const carrierMin = carrier.capacity.min;
        const carrierMax = carrier.capacity.max;

        // إذا كان نطاق الشحنة داخل نطاق الموصّل
        if (shipmentMin >= carrierMin && shipmentMax <= carrierMax) {
            return 100;
        }

        // حساب النسبة المئوية للتداخل
        const overlap = Math.min(shipmentMax, carrierMax) - Math.max(shipmentMin, carrierMin);
        const totalRange = Math.max(shipmentMax, carrierMax) - Math.min(shipmentMin, carrierMin);
        
        return Math.max(0, Math.round((overlap / totalRange) * 100));
    }

    // الحصول على معلومات الطريق
    getRoute(from, to) {
        const routeKey = `${from}-${to}`;
        return this.routes[routeKey] || null;
    }

    // إنشاء توصية ذكية
    generateSmartRecommendation(shipmentWeight, from, to, preferences = {}) {
        const shipmentType = this.determineShipmentType(shipmentWeight);
        const compatibleCarriers = this.findCompatibleCarriers(shipmentType, from, to, preferences);
        
        const shipment = this.shipmentTypes[shipmentType];
        
        return {
            shipmentType: shipmentType,
            shipmentInfo: shipment,
            recommendedCarriers: compatibleCarriers,
            bestMatch: compatibleCarriers[0],
            alternativeMatches: compatibleCarriers.slice(1, 3),
            totalOptions: compatibleCarriers.length
        };
    }

    // عرض النتائج في واجهة المستخدم
    displayMatchingResults(containerId, recommendation) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const { shipmentInfo, recommendedCarriers, bestMatch } = recommendation;

        let html = `
            <div class="matching-results">
                <div class="shipment-info bg-${shipmentInfo.color}-50 rounded-lg p-4 mb-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">
                        ${shipmentInfo.icon} ${shipmentInfo.name}
                    </h3>
                    <p class="text-gray-600">الوزن: ${shipmentInfo.weightRange.min}-${shipmentInfo.weightRange.max} كيلو</p>
                    <p class="text-sm text-gray-500">أمثلة: ${shipmentInfo.examples.join('، ')}</p>
                </div>

                <div class="carriers-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        `;

        recommendedCarriers.forEach((carrier, index) => {
            const isBest = index === 0;
            const cardClass = isBest ? 'border-2 border-green-400 bg-green-50' : 'border border-gray-200 bg-white';
            
            html += `
                <div class="carrier-card ${cardClass} rounded-lg p-4 ${isBest ? 'ring-2 ring-green-400' : ''}">
                    ${isBest ? '<div class="text-green-600 font-bold text-sm mb-2">⭐ الأفضل</div>' : ''}
                    <div class="flex items-center mb-3">
                        <span class="text-2xl ml-2">${carrier.icon}</span>
                        <h4 class="font-bold text-gray-800">${carrier.name}</h4>
                    </div>
                    <div class="space-y-2 text-sm">
                        <p><strong>السعة:</strong> ${carrier.capacity.min}-${carrier.capacity.max} كيلو</p>
                        <p><strong>المركبات:</strong> ${carrier.vehicles.join('، ')}</p>
                        <p><strong>التكلفة المتوقعة:</strong> ${carrier.estimatedCost} ريال</p>
                        <p><strong>التقييم:</strong> ${carrier.rating.toFixed(1)}/5</p>
                        <p><strong>الوقت المتوقع:</strong> ${carrier.estimatedTime} ساعة</p>
                        <p><strong>التوافق:</strong> ${carrier.compatibility}%</p>
                    </div>
                    <div class="mt-4">
                        <button class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors">
                            اختر هذا الموصّل
                        </button>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;
    }
}

// إنشاء مثيل من النظام
const fastShipMatching = new FastShipMatchingSystem();

// دالة للاستخدام في الصفحات
function findBestCarriers(weight, from, to, preferences = {}) {
    return fastShipMatching.generateSmartRecommendation(weight, from, to, preferences);
}

// دالة لعرض النتائج
function displayCarrierResults(containerId, weight, from, to, preferences = {}) {
    const recommendation = findBestCarriers(weight, from, to, preferences);
    fastShipMatching.displayMatchingResults(containerId, recommendation);
}

// تصدير للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FastShipMatchingSystem, fastShipMatching, findBestCarriers, displayCarrierResults };
}