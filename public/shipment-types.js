// نظام أنواع الشحنات والموصلين - FastShip Platform
// يدعم جميع أنواع الشحنات من الصغيرة إلى العملاقة

class ShipmentTypeManager {
    constructor() {
        this.shipmentTypes = this.initializeShipmentTypes();
        this.carrierTypes = this.initializeCarrierTypes();
        this.pricingRules = this.initializePricingRules();
    }

    // تعريف أنواع الشحنات حسب المواصفات
    initializeShipmentTypes() {
        return {
            // الشحنات الصغيرة (10-20 كيلو)
            small: {
                id: 'small',
                name: 'شحنات صغيرة',
                nameEn: 'Small Shipments',
                icon: '🎒',
                weightRange: { min: 0.1, max: 20 }, // كيلو
                volumeRange: { min: 0.001, max: 0.1 }, // متر مكعب
                description: 'مستندات، كتب، هدايا صغيرة',
                examples: ['مستندات رسمية', 'كتب ومجلات', 'هدايا صغيرة', 'أدوية', 'إكسسوارات'],
                compatibleCarriers: ['regular_traveler'],
                basePrice: 0.5, // ريال لكل كيلو
                color: '#3B82F6',
                bgColor: '#EFF6FF'
            },
            
            // الشحنات المتوسطة (300-1500 كيلو)
            medium: {
                id: 'medium',
                name: 'شحنات متوسطة',
                nameEn: 'Medium Shipments',
                icon: '📦',
                weightRange: { min: 20, max: 1500 }, // كيلو
                volumeRange: { min: 0.1, max: 2 }, // متر مكعب
                description: 'أجهزة إلكترونية، مشتوات online',
                examples: ['أجهزة إلكترونية', 'ملابس', 'أطعمة', 'مستلزمات منزلية', 'أدوات'],
                compatibleCarriers: ['car_owner'],
                basePrice: 0.8, // ريال لكل كيلو
                color: '#F59E0B',
                bgColor: '#FFFBEB'
            },
            
            // الشحنات الكبيرة (4-50 طن)
            large: {
                id: 'large',
                name: 'شحنات كبيرة',
                nameEn: 'Large Shipments',
                icon: '🚚',
                weightRange: { min: 1500, max: 50000 }, // كيلو
                volumeRange: { min: 2, max: 50 }, // متر مكعب
                description: 'أثاث، أجهزة، بضائع تجارية',
                examples: ['أثاث', 'أجهزة كبيرة', 'بضائع تجارية', 'مواد بناء', 'معدات'],
                compatibleCarriers: ['truck_owner'],
                basePrice: 1.2, // ريال لكل كيلو
                color: '#10B981',
                bgColor: '#ECFDF5'
            },
            
            // الشحنات العملاقة (50-1000+ طن)
            massive: {
                id: 'massive',
                name: 'شحنات عملاقة',
                nameEn: 'Massive Shipments',
                icon: '🏢',
                weightRange: { min: 50000, max: 1000000 }, // كيلو
                volumeRange: { min: 50, max: 1000 }, // متر مكعب
                description: 'بضائع تجارية ضخمة، مواد بناء',
                examples: ['حاويات', 'معدات صناعية', 'مواد بناء ضخمة', 'بضائع تجارية كبيرة'],
                compatibleCarriers: ['fleet_company'],
                basePrice: 0.6, // ريال لكل كيلو (سعر مخفض للكميات الكبيرة)
                color: '#8B5CF6',
                bgColor: '#F3F4F6'
            }
        };
    }

    // تعريف أنواع الموصلين حسب المواصفات
    initializeCarrierTypes() {
        return {
            // النوع 1: المسافر العادي
            regular_traveler: {
                id: 'regular_traveler',
                name: 'المسافر العادي',
                nameEn: 'Regular Traveler',
                icon: '🚶‍♂️',
                transportModes: ['taxi', 'bus', 'plane', 'train'],
                capacityRange: { min: 0.1, max: 20 }, // كيلو
                volumeRange: { min: 0.001, max: 0.1 }, // متر مكعب
                description: 'تاكسي، حافلة، طائرة، قطار',
                example: 'طالب مسافر يحمل حقيبة صغيرة',
                compatibleShipments: ['small'],
                baseRate: 0.5, // ريال لكل كيلو
                color: '#3B82F6',
                bgColor: '#EFF6FF',
                requirements: ['هوية وطنية', 'تأمين صحي', 'تقييم 4+ نجوم']
            },
            
            // النوع 2: صاحب السيارة الخاصة
            car_owner: {
                id: 'car_owner',
                name: 'صاحب السيارة الخاصة',
                nameEn: 'Car Owner',
                icon: '🚗',
                transportModes: ['private_car', 'pickup'],
                capacityRange: { min: 20, max: 1500 }, // كيلو
                volumeRange: { min: 0.1, max: 2 }, // متر مكعب
                description: 'سيارات خاصة (كورولا، بيك أب، etc.)',
                example: 'موظف مسافر بين المدن بسيارته',
                compatibleShipments: ['small', 'medium'],
                baseRate: 0.8, // ريال لكل كيلو
                color: '#F59E0B',
                bgColor: '#FFFBEB',
                requirements: ['رخصة قيادة', 'تأمين مركبة', 'فحص فني', 'تقييم 4+ نجوم']
            },
            
            // النوع 3: صاحب الشاحنة
            truck_owner: {
                id: 'truck_owner',
                name: 'صاحب الشاحنة',
                nameEn: 'Truck Owner',
                icon: '🚚',
                transportModes: ['truck', 'van', 'trailer'],
                capacityRange: { min: 1500, max: 50000 }, // كيلو
                volumeRange: { min: 2, max: 50 }, // متر مكعب
                description: 'دينات، شاحنات متوسطة',
                example: 'سائق شاحنة برحلات منتظمة',
                compatibleShipments: ['small', 'medium', 'large'],
                baseRate: 1.2, // ريال لكل كيلو
                color: '#10B981',
                bgColor: '#ECFDF5',
                requirements: ['رخصة قيادة ثقيلة', 'تأمين مركبة', 'فحص فني', 'تقييم 4+ نجوم']
            },
            
            // النوع 4: الشركات والأساطيل
            fleet_company: {
                id: 'fleet_company',
                name: 'الشركات والأساطيل',
                nameEn: 'Fleet Companies',
                icon: '🏢',
                transportModes: ['truck', 'plane', 'ship', 'train'],
                capacityRange: { min: 50000, max: 1000000 }, // كيلو
                volumeRange: { min: 50, max: 1000 }, // متر مكعب
                description: 'تريلات، قطارات، طائرات، سفن',
                example: 'شركات شحن لديها مساحات غير مستغلة',
                compatibleShipments: ['small', 'medium', 'large', 'massive'],
                baseRate: 0.6, // ريال لكل كيلو
                color: '#8B5CF6',
                bgColor: '#F3F4F6',
                requirements: ['ترخيص شركة', 'تأمين شامل', 'شهادات جودة', 'تقييم 4.5+ نجوم']
            }
        };
    }

    // نظام التسعير الذكي
    initializePricingRules() {
        return {
            // عوامل التسعير
            factors: {
                distance: {
                    local: 1.0,      // داخل المدينة
                    regional: 1.2,   // بين المدن في نفس المنطقة
                    national: 1.5,   // بين المناطق
                    international: 2.0 // دولي
                },
                urgency: {
                    standard: 1.0,   // عادي
                    express: 1.5,    // سريع
                    same_day: 2.0    // نفس اليوم
                },
                weight: {
                    light: 1.0,      // خفيف
                    medium: 0.9,     // متوسط
                    heavy: 0.8,      // ثقيل
                    massive: 0.7     // عملاق
                },
                season: {
                    low: 0.8,        // موسم منخفض
                    normal: 1.0,     // موسم عادي
                    high: 1.3        // موسم عالي
                }
            },
            
            // حدود التسعير
            limits: {
                min: 5,    // أقل سعر (ريال)
                max: 10000 // أعلى سعر (ريال)
            }
        };
    }

    // تحديد نوع الشحنة حسب الوزن والحجم
    determineShipmentType(weight, volume) {
        for (const [typeId, type] of Object.entries(this.shipmentTypes)) {
            if (weight >= type.weightRange.min && weight <= type.weightRange.max &&
                volume >= type.volumeRange.min && volume <= type.volumeRange.max) {
                return type;
            }
        }
        
        // إذا لم يطابق أي نوع، نحدد حسب الوزن فقط
        if (weight <= 20) return this.shipmentTypes.small;
        if (weight <= 1500) return this.shipmentTypes.medium;
        if (weight <= 50000) return this.shipmentTypes.large;
        return this.shipmentTypes.massive;
    }

    // تحديد الموصلين المناسبين لنوع الشحنة
    getCompatibleCarriers(shipmentType) {
        return Object.values(this.carrierTypes).filter(carrier => 
            carrier.compatibleShipments.includes(shipmentType.id)
        );
    }

    // حساب السعر الذكي
    calculatePrice(shipmentType, carrierType, distance, urgency = 'standard', season = 'normal') {
        const basePrice = shipmentType.basePrice;
        const carrierRate = carrierType.baseRate;
        
        // حساب العوامل
        const distanceFactor = this.pricingRules.factors.distance[distance] || 1.0;
        const urgencyFactor = this.pricingRules.factors.urgency[urgency] || 1.0;
        const seasonFactor = this.pricingRules.factors.season[season] || 1.0;
        
        // حساب السعر النهائي
        let price = basePrice * carrierRate * distanceFactor * urgencyFactor * seasonFactor;
        
        // تطبيق حدود التسعير
        price = Math.max(this.pricingRules.limits.min, price);
        price = Math.min(this.pricingRules.limits.max, price);
        
        return Math.round(price * 100) / 100; // تقريب لرقمين عشريين
    }

    // الحصول على جميع أنواع الشحنات
    getAllShipmentTypes() {
        return Object.values(this.shipmentTypes);
    }

    // الحصول على جميع أنواع الموصلين
    getAllCarrierTypes() {
        return Object.values(this.carrierTypes);
    }

    // البحث عن الموصلين المناسبين
    findCompatibleCarriers(shipmentWeight, shipmentVolume, filters = {}) {
        const shipmentType = this.determineShipmentType(shipmentWeight, shipmentVolume);
        let compatibleCarriers = this.getCompatibleCarriers(shipmentType);
        
        // تطبيق الفلاتر
        if (filters.transportMode) {
            compatibleCarriers = compatibleCarriers.filter(carrier => 
                carrier.transportModes.includes(filters.transportMode)
            );
        }
        
        if (filters.minRating) {
            compatibleCarriers = compatibleCarriers.filter(carrier => 
                carrier.rating >= filters.minRating
            );
        }
        
        if (filters.maxPrice) {
            compatibleCarriers = compatibleCarriers.filter(carrier => 
                this.calculatePrice(shipmentType, carrier, filters.distance || 'regional') <= filters.maxPrice
            );
        }
        
        return {
            shipmentType,
            compatibleCarriers,
            estimatedPrice: this.calculatePrice(shipmentType, compatibleCarriers[0], filters.distance || 'regional')
        };
    }

    // إنشاء واجهة المستخدم لأنواع الشحنات
    createShipmentTypeSelector(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const types = this.getAllShipmentTypes();
        
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                ${types.map(type => `
                    <div class="shipment-type-card cursor-pointer p-6 rounded-xl border-2 border-gray-200 hover:border-${type.color.replace('#', '')} transition-all duration-300" 
                         data-type="${type.id}">
                        <div class="text-center">
                            <div class="text-4xl mb-3">${type.icon}</div>
                            <h3 class="text-lg font-bold text-gray-800 mb-2">${type.name}</h3>
                            <p class="text-sm text-gray-600 mb-3">${type.description}</p>
                            <div class="text-xs text-gray-500">
                                <div>الوزن: ${type.weightRange.min}-${type.weightRange.max} كجم</div>
                                <div>الحجم: ${type.volumeRange.min}-${type.volumeRange.max} م³</div>
                            </div>
                            <div class="mt-3 text-sm font-semibold text-${type.color.replace('#', '')}">
                                من ${type.basePrice} ريال/كجم
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // إضافة أحداث النقر
        container.querySelectorAll('.shipment-type-card').forEach(card => {
            card.addEventListener('click', function() {
                // إزالة التحديد من جميع البطاقات
                container.querySelectorAll('.shipment-type-card').forEach(c => 
                    c.classList.remove('selected', 'ring-2', 'ring-blue-500')
                );
                
                // تحديد البطاقة المختارة
                this.classList.add('selected', 'ring-2', 'ring-blue-500');
                
                // إرسال حدث التحديد
                const event = new CustomEvent('shipmentTypeSelected', {
                    detail: { type: this.dataset.type }
                });
                document.dispatchEvent(event);
            });
        });
    }

    // إنشاء واجهة المستخدم لأنواع الموصلين
    createCarrierTypeSelector(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const types = this.getAllCarrierTypes();
        
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${types.map(type => `
                    <div class="carrier-type-card cursor-pointer p-6 rounded-xl border-2 border-gray-200 hover:border-${type.color.replace('#', '')} transition-all duration-300" 
                         data-type="${type.id}">
                        <div class="flex items-center">
                            <div class="text-3xl ml-4">${type.icon}</div>
                            <div class="flex-1">
                                <h3 class="text-lg font-bold text-gray-800 mb-1">${type.name}</h3>
                                <p class="text-sm text-gray-600 mb-2">${type.description}</p>
                                <div class="text-xs text-gray-500 mb-2">
                                    <div>السعة: ${type.capacityRange.min}-${type.capacityRange.max} كجم</div>
                                    <div>الحجم: ${type.volumeRange.min}-${type.volumeRange.max} م³</div>
                                </div>
                                <div class="text-sm font-semibold text-${type.color.replace('#', '')}">
                                    من ${type.baseRate} ريال/كجم
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // إضافة أحداث النقر
        container.querySelectorAll('.carrier-type-card').forEach(card => {
            card.addEventListener('click', function() {
                // إزالة التحديد من جميع البطاقات
                container.querySelectorAll('.carrier-type-card').forEach(c => 
                    c.classList.remove('selected', 'ring-2', 'ring-blue-500')
                );
                
                // تحديد البطاقة المختارة
                this.classList.add('selected', 'ring-2', 'ring-blue-500');
                
                // إرسال حدث التحديد
                const event = new CustomEvent('carrierTypeSelected', {
                    detail: { type: this.dataset.type }
                });
                document.dispatchEvent(event);
            });
        });
    }
}

// إنشاء مثيل عام للمدير
window.shipmentTypeManager = new ShipmentTypeManager();

// تصدير الكلاس للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShipmentTypeManager;
}