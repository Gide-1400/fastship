// pricing-engine.js - محرك حساب الأسعار الذكي

/**
 * محرك حساب الأسعار
 */
class PricingEngine {
    constructor() {
        // معاملات التسعير
        this.factors = {
            baseMultiplier: 1.0,
            urgencyMultiplier: {
                sameDay: 2.0,
                nextDay: 1.5,
                within3Days: 1.2,
                within7Days: 1.0,
                moreThan7Days: 0.9
            },
            seasonalMultiplier: {
                peak: 1.3,      // موسم الذروة
                normal: 1.0,    // عادي
                low: 0.8        // موسم منخفض
            },
            insuranceRate: 0.05,  // 5% من قيمة الشحنة
            platformCommission: 0.20, // 20% عمولة المنصة
            taxRate: 0.15,      // 15% ضريبة القيمة المضافة
        };
        
        // المدن السعودية الرئيسية وأسعارها الأساسية
        this.cityBasePrices = {
            'الرياض': 50,
            'جدة': 50,
            'مكة المكرمة': 45,
            'المدينة المنورة': 45,
            'الدمام': 40,
            'الخبر': 40,
            'الطائف': 35,
            'تبوك': 35,
            'بريدة': 30,
            'أبها': 30
        };
    }
    
    /**
     * حساب السعر الكامل للشحنة
     */
    calculateFullPrice(shipment, carrier, distance, options = {}) {
        const {
            includeInsurance = shipment.insuranceRequired,
            includeTax = true,
            urgency = 'within7Days',
            season = 'normal'
        } = options;
        
        // السعر الأساسي
        const basePrice = this.calculateBasePrice(shipment, carrier, distance);
        
        // إضافة معامل الاستعجال
        const urgencyPrice = basePrice * this.factors.urgencyMultiplier[urgency];
        
        // إضافة معامل الموسمية
        const seasonalPrice = urgencyPrice * this.factors.seasonalMultiplier[season];
        
        // إضافة رسوم إضافية
        const additionalFees = this.calculateAdditionalFees(shipment);
        
        let totalPrice = seasonalPrice + additionalFees;
        
        // إضافة التأمين إذا طُلب
        let insuranceCost = 0;
        if (includeInsurance) {
            insuranceCost = this.calculateInsurance(shipment.value);
            totalPrice += insuranceCost;
        }
        
        // إضافة الضريبة
        let taxAmount = 0;
        if (includeTax) {
            taxAmount = totalPrice * this.factors.taxRate;
            totalPrice += taxAmount;
        }
        
        // تقريب السعر
        totalPrice = Math.ceil(totalPrice / 5) * 5; // تقريب لأقرب 5 ريال
        
        return {
            basePrice: Math.round(basePrice),
            urgencyMultiplier: this.factors.urgencyMultiplier[urgency],
            seasonalMultiplier: this.factors.seasonalMultiplier[season],
            additionalFees: Math.round(additionalFees),
            insuranceCost: Math.round(insuranceCost),
            taxAmount: Math.round(taxAmount),
            totalPrice: Math.round(totalPrice),
            carrierEarnings: Math.round(totalPrice * (1 - this.factors.platformCommission)),
            platformCommission: Math.round(totalPrice * this.factors.platformCommission),
            breakdown: this.generatePriceBreakdown(
                basePrice,
                additionalFees,
                insuranceCost,
                taxAmount,
                totalPrice
            )
        };
    }
    
    /**
     * حساب السعر الأساسي
     */
    calculateBasePrice(shipment, carrier, distance) {
        const carrierType = window.FastShipModels.CarrierTypes[carrier.type.toUpperCase()];
        
        // السعر الأساسي للموصل
        let basePrice = carrierType.basePrice;
        
        // إضافة سعر المسافة
        const distancePrice = distance * carrierType.pricePerKm;
        
        // إضافة سعر الوزن
        const weightPrice = this.calculateWeightPrice(shipment.weight, carrierType);
        
        // إضافة سعر الحجم
        const volumePrice = this.calculateVolumePrice(shipment.calculateVolume());
        
        // إضافة أسعار المدن
        const cityPrice = this.getCityPrice(shipment.fromLocation.city, shipment.toLocation.city);
        
        return basePrice + distancePrice + weightPrice + volumePrice + cityPrice;
    }
    
    /**
     * حساب سعر الوزن
     */
    calculateWeightPrice(weight, carrierType) {
        // كل 10 كجم = نسبة من السعر الأساسي
        const weightFactor = weight / 10;
        const pricePerUnit = carrierType.basePrice * 0.05; // 5% من السعر الأساسي لكل 10 كجم
        
        return weightFactor * pricePerUnit;
    }
    
    /**
     * حساب سعر الحجم
     */
    calculateVolumePrice(volume) {
        // كل متر مكعب = 50 ريال
        return volume * 50;
    }
    
    /**
     * الحصول على سعر المدينة
     */
    getCityPrice(fromCity, toCity) {
        const fromPrice = this.cityBasePrices[fromCity] || 30;
        const toPrice = this.cityBasePrices[toCity] || 30;
        
        return (fromPrice + toPrice) / 2;
    }
    
    /**
     * حساب الرسوم الإضافية
     */
    calculateAdditionalFees(shipment) {
        let fees = 0;
        
        const category = window.FastShipModels.ShipmentCategories[shipment.category.toUpperCase()];
        
        if (!category) return fees;
        
        // رسوم الأشياء الهشة
        if (category.fragile) {
            fees += 20;
        }
        
        // رسوم العناية الخاصة
        if (category.requiresSpecialCare) {
            fees += 30;
        }
        
        // رسوم التبريد
        if (category.requiresRefrigeration) {
            fees += 50;
        }
        
        // رسوم الصور والتوثيق
        if (shipment.images && shipment.images.length > 0) {
            fees += 10;
        }
        
        return fees;
    }
    
    /**
     * حساب تكلفة التأمين
     */
    calculateInsurance(value) {
        if (value <= 0) return 0;
        
        // التأمين = 5% من القيمة بحد أدنى 20 ريال
        const insurance = value * this.factors.insuranceRate;
        return Math.max(insurance, 20);
    }
    
    /**
     * توليد تفاصيل السعر
     */
    generatePriceBreakdown(basePrice, additionalFees, insurance, tax, total) {
        return [
            {
                label: 'السعر الأساسي',
                value: Math.round(basePrice),
                description: 'يشمل النقل والمسافة والوزن'
            },
            {
                label: 'رسوم إضافية',
                value: Math.round(additionalFees),
                description: 'رسوم خاصة بنوع الشحنة'
            },
            {
                label: 'التأمين',
                value: Math.round(insurance),
                description: 'تأمين شامل على الشحنة'
            },
            {
                label: 'ضريبة القيمة المضافة (15%)',
                value: Math.round(tax),
                description: 'الضريبة المضافة'
            },
            {
                label: 'الإجمالي',
                value: Math.round(total),
                description: 'السعر النهائي الشامل',
                isTotal: true
            }
        ];
    }
    
    /**
     * حساب تقدير السعر السريع
     */
    quickEstimate(weight, distance, carrierType = 'private_car') {
        const type = window.FastShipModels.CarrierTypes[carrierType.toUpperCase()];
        
        if (!type) return 0;
        
        const basePrice = type.basePrice;
        const distancePrice = distance * type.pricePerKm;
        const weightPrice = (weight / 10) * (type.basePrice * 0.05);
        
        const subtotal = basePrice + distancePrice + weightPrice;
        const total = subtotal * 1.15; // مع الضريبة
        
        return Math.ceil(total / 5) * 5;
    }
    
    /**
     * مقارنة الأسعار بين موصلين مختلفين
     */
    comparePrices(shipment, carriers, distance) {
        const comparisons = [];
        
        carriers.forEach(carrier => {
            const pricing = this.calculateFullPrice(shipment, carrier, distance);
            
            comparisons.push({
                carrierType: carrier.type,
                carrierName: window.FastShipModels.CarrierTypes[carrier.type.toUpperCase()].nameAr,
                totalPrice: pricing.totalPrice,
                carrierEarnings: pricing.carrierEarnings,
                estimatedDuration: this.calculateDuration(distance, carrier.type),
                pricePerKm: pricing.totalPrice / distance,
                breakdown: pricing.breakdown
            });
        });
        
        // ترتيب حسب السعر
        comparisons.sort((a, b) => a.totalPrice - b.totalPrice);
        
        return comparisons;
    }
    
    /**
     * حساب المدة المتوقعة
     */
    calculateDuration(distance, carrierType) {
        const speeds = {
            'regular_traveler': 80,
            'private_car': 100,
            'truck_owner': 70,
            'fleet_company': 60
        };
        
        const speed = speeds[carrierType] || 80;
        const hours = distance / speed;
        
        if (hours < 24) {
            return `${Math.ceil(hours)} ساعة`;
        } else {
            const days = Math.ceil(hours / 24);
            return `${days} ${days === 1 ? 'يوم' : days === 2 ? 'يومين' : 'أيام'}`;
        }
    }
    
    /**
     * حساب الخصومات
     */
    calculateDiscount(totalPrice, discountCode = null, userLevel = 'regular') {
        let discount = 0;
        let discountReason = '';
        
        // خصومات حسب مستوى المستخدم
        const userDiscounts = {
            'new': 0.10,      // 10% للمستخدمين الجدد
            'regular': 0.05,  // 5% للمستخدمين العاديين
            'premium': 0.15,  // 15% للمستخدمين المميزين
            'vip': 0.20       // 20% للمستخدمين VIP
        };
        
        if (userDiscounts[userLevel]) {
            discount = totalPrice * userDiscounts[userLevel];
            discountReason = `خصم المستخدم ${userLevel === 'new' ? 'الجديد' : userLevel === 'premium' ? 'المميز' : userLevel === 'vip' ? 'VIP' : 'العادي'}`;
        }
        
        // خصومات الكوبونات (يمكن التوسع)
        if (discountCode) {
            const couponDiscounts = {
                'WELCOME10': { percentage: 0.10, maxAmount: 50 },
                'SAVE20': { percentage: 0.20, maxAmount: 100 },
                'VIP30': { percentage: 0.30, maxAmount: 200 }
            };
            
            const coupon = couponDiscounts[discountCode];
            if (coupon) {
                const couponDiscount = Math.min(
                    totalPrice * coupon.percentage,
                    coupon.maxAmount
                );
                
                if (couponDiscount > discount) {
                    discount = couponDiscount;
                    discountReason = `كوبون الخصم ${discountCode}`;
                }
            }
        }
        
        return {
            discount: Math.round(discount),
            finalPrice: Math.round(totalPrice - discount),
            discountReason,
            discountPercentage: ((discount / totalPrice) * 100).toFixed(1)
        };
    }
    
    /**
     * حساب أرباح الموصل
     */
    calculateCarrierEarnings(totalPrice, deductions = {}) {
        const {
            platformCommission = this.factors.platformCommission,
            fuel = 0,
            toll = 0,
            other = 0
        } = deductions;
        
        const commission = totalPrice * platformCommission;
        const netEarnings = totalPrice - commission - fuel - toll - other;
        
        return {
            totalPrice: Math.round(totalPrice),
            platformCommission: Math.round(commission),
            fuel: Math.round(fuel),
            toll: Math.round(toll),
            other: Math.round(other),
            netEarnings: Math.round(netEarnings),
            profitMargin: ((netEarnings / totalPrice) * 100).toFixed(1) + '%'
        };
    }
}

// تصدير المحرك
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PricingEngine };
}

// جعل المحرك متاح عالمياً
if (typeof window !== 'undefined') {
    window.FastShipPricingEngine = new PricingEngine();
}
