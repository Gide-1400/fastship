// FastShip Platform Core Logic - نظام FastShip الأساسي
// منصة ذكية تربط بين أي شخص عنده شحنة وأي شخص عنده مساحة فارغة

class FastShipCore {
    constructor() {
        this.shipments = [];
        this.carriers = [];
        this.users = [];
        this.matches = [];
        this.transactions = [];
        this.notifications = [];
        
        this.init();
    }

    init() {
        this.loadData();
        this.initSampleData();
    }

    // ===== نماذج البيانات الأساسية =====

    // نموذج المستخدم
    createUser(userData) {
        return {
            id: this.generateId('USER'),
            email: userData.email,
            phone: userData.phone,
            firstName: userData.firstName,
            lastName: userData.lastName,
            accountType: userData.accountType, // 'shipper', 'carrier', 'both'
            profileImage: userData.profileImage || null,
            rating: 5.0,
            reviewCount: 0,
            isVerified: false,
            documents: {
                nationalId: null,
                drivingLicense: null,
                vehicleRegistration: null,
                commercialLicense: null
            },
            preferences: {
                language: 'ar',
                notifications: true,
                autoMatch: true
            },
            address: {
                city: userData.city,
                region: userData.region,
                coordinates: userData.coordinates || null
            },
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
        };
    }

    // نموذج الشحنة
    createShipment(shipmentData) {
        const shipmentType = this.classifyShipmentByWeight(shipmentData.weight);
        const estimatedPrice = this.calculateEstimatedPrice(shipmentData);
        
        return {
            id: this.generateId('SH'),
            trackingNumber: this.generateTrackingNumber(),
            senderId: shipmentData.senderId,
            
            // تفاصيل الشحنة
            type: shipmentData.type, // 'documents', 'electronics', 'food', 'clothes', 'furniture', 'other'
            category: shipmentType, // 'small', 'medium', 'large', 'x-large'
            weight: shipmentData.weight, // بالكيلوغرام
            dimensions: {
                length: shipmentData.dimensions?.length || 0,
                width: shipmentData.dimensions?.width || 0,
                height: shipmentData.dimensions?.height || 0
            },
            value: shipmentData.value || 0, // قيمة الشحنة للتأمين
            fragile: shipmentData.fragile || false,
            perishable: shipmentData.perishable || false,
            
            // المسار والتوقيت
            pickup: {
                city: shipmentData.pickup.city,
                region: shipmentData.pickup.region,
                address: shipmentData.pickup.address,
                coordinates: shipmentData.pickup.coordinates,
                contactName: shipmentData.pickup.contactName,
                contactPhone: shipmentData.pickup.contactPhone,
                preferredTime: shipmentData.pickup.preferredTime
            },
            delivery: {
                city: shipmentData.delivery.city,
                region: shipmentData.delivery.region,
                address: shipmentData.delivery.address,
                coordinates: shipmentData.delivery.coordinates,
                contactName: shipmentData.delivery.contactName,
                contactPhone: shipmentData.delivery.contactPhone,
                preferredTime: shipmentData.delivery.preferredTime
            },
            
            // السعر والدفع
            estimatedPrice: estimatedPrice,
            maxBudget: shipmentData.maxBudget || estimatedPrice * 1.5,
            paymentMethod: shipmentData.paymentMethod || 'cash',
            
            // الحالة والتتبع
            status: 'pending', // 'pending', 'matched', 'picked_up', 'in_transit', 'delivered', 'cancelled'
            priority: shipmentData.priority || 'normal', // 'low', 'normal', 'high', 'urgent'
            
            // المطابقة
            matchingCarriers: [],
            selectedCarrier: null,
            
            // التوقيتات
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            
            // ملاحظات خاصة
            specialInstructions: shipmentData.specialInstructions || '',
            images: shipmentData.images || []
        };
    }

    // نموذج الموصل/الناقل
    createCarrier(carrierData) {
        const carrierType = this.classifyCarrierByCapacity(carrierData.capacity, carrierData.vehicleType);
        
        return {
            id: this.generateId('CR'),
            userId: carrierData.userId,
            
            // نوع الموصل
            carrierType: carrierType, // 'individual', 'professional', 'company'
            category: this.getCarrierCategory(carrierData.vehicleType), // 'small', 'medium', 'large', 'x-large'
            
            // تفاصيل المركبة
            vehicle: {
                type: carrierData.vehicleType, // 'taxi', 'car', 'suv', 'pickup', 'van', 'truck', 'trailer', 'plane', 'train', 'ship'
                make: carrierData.vehicle?.make || '',
                model: carrierData.vehicle?.model || '',
                year: carrierData.vehicle?.year || new Date().getFullYear(),
                color: carrierData.vehicle?.color || '',
                plateNumber: carrierData.vehicle?.plateNumber || '',
                capacity: {
                    weight: carrierData.capacity.weight, // الحد الأقصى للوزن بالكيلوغرام
                    volume: carrierData.capacity.volume, // الحد الأقصى للحجم بالمتر المكعب
                    passengers: carrierData.capacity.passengers || 0
                },
                features: carrierData.vehicle?.features || [], // ['ac', 'gps', 'insurance', 'refrigerated']
                images: carrierData.vehicle?.images || []
            },
            
            // الخدمات المقدمة
            services: {
                sameDay: carrierData.services?.sameDay || false,
                scheduled: carrierData.services?.scheduled || true,
                express: carrierData.services?.express || false,
                fragileHandling: carrierData.services?.fragileHandling || false,
                refrigerated: carrierData.services?.refrigerated || false,
                doorToDoor: carrierData.services?.doorToDoor || true
            },
            
            // المناطق المخدومة
            serviceAreas: carrierData.serviceAreas || [], // قائمة المدن والمناطق
            
            // التوفر والجدولة
            availability: {
                status: 'available', // 'available', 'busy', 'offline'
                schedule: carrierData.availability?.schedule || {}, // جدول أسبوعي
                currentTrip: null,
                nextAvailable: new Date().toISOString()
            },
            
            // التسعير
            pricing: {
                baseRate: carrierData.pricing?.baseRate || 0, // سعر أساسي لكل كيلومتر
                weightRate: carrierData.pricing?.weightRate || 0, // سعر إضافي لكل كيلوغرام
                minimumCharge: carrierData.pricing?.minimumCharge || 0,
                currency: 'SAR'
            },
            
            // الإحصائيات
            stats: {
                totalTrips: 0,
                totalDistance: 0,
                totalEarnings: 0,
                completionRate: 100,
                onTimeRate: 100,
                rating: 5.0,
                reviewCount: 0
            },
            
            // الحالة
            isActive: true,
            isVerified: false,
            
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    // ===== نظام التصنيف الذكي =====

    // تصنيف الشحنات حسب الوزن والحجم
    classifyShipmentByWeight(weight) {
        if (weight <= 20) return 'small';        // 🎒 شحنات صغيرة - مسافر عادي
        if (weight <= 1500) return 'medium';     // 📦 شحنات متوسطة - صاحب سيارة
        if (weight <= 50000) return 'large';     // 🚚 شحنات كبيرة - صاحب شاحنة
        return 'x-large';                        // 🏢 شحنات عملاقة - أساطيل
    }

    // تصنيف الموصلين حسب نوع المركبة والسعة
    classifyCarrierByCapacity(capacity, vehicleType) {
        const smallVehicles = ['taxi', 'bus', 'plane', 'train'];
        const mediumVehicles = ['car', 'suv', 'pickup'];
        const largeVehicles = ['van', 'truck', 'trailer'];
        const xLargeVehicles = ['fleet', 'airline', 'shipping', 'train_cargo'];

        if (smallVehicles.includes(vehicleType)) return 'individual';
        if (mediumVehicles.includes(vehicleType)) return 'professional';
        if (largeVehicles.includes(vehicleType)) return 'professional';
        if (xLargeVehicles.includes(vehicleType)) return 'company';
        
        return 'professional';
    }

    // الحصول على فئة الموصل
    getCarrierCategory(vehicleType) {
        const categories = {
            // 🚶‍♂️ النوع 1: المسافر العادي (10-20 كيلو)
            'taxi': 'small',
            'bus': 'small', 
            'plane': 'small',
            'train': 'small',
            
            // 🚗 النوع 2: صاحب السيارة الخاصة (300-1500 كيلو)
            'car': 'medium',
            'suv': 'medium',
            'pickup': 'medium',
            
            // 🚚 النوع 3: صاحب الشاحنة (4-50 طن)
            'van': 'large',
            'truck': 'large',
            'trailer': 'large',
            
            // 🏢 النوع 4: الشركات والأساطيل (50-1000+ طن)
            'fleet': 'x-large',
            'airline': 'x-large',
            'shipping': 'x-large',
            'train_cargo': 'x-large'
        };
        
        return categories[vehicleType] || 'medium';
    }

    // ===== خوارزمية المطابقة الذكية =====

    // البحث عن موصلين مناسبين للشحنة
    findMatchingCarriers(shipmentId) {
        const shipment = this.getShipment(shipmentId);
        if (!shipment) return [];

        const shipmentCategory = this.classifyShipmentByWeight(shipment.weight);
        
        return this.carriers.filter(carrier => {
            // التحقق من التطابق في الفئة
            const categoryMatch = this.isCategoryCompatible(shipmentCategory, carrier.category);
            
            // التحقق من التطابق في المنطقة
            const areaMatch = this.isServiceAreaMatch(carrier, shipment);
            
            // التحقق من التوفر
            const availabilityMatch = carrier.availability.status === 'available';
            
            // التحقق من السعة
            const capacityMatch = this.isCapacityMatch(carrier, shipment);
            
            return categoryMatch && areaMatch && availabilityMatch && capacityMatch;
        }).map(carrier => ({
            ...carrier,
            matchScore: this.calculateMatchScore(shipment, carrier),
            estimatedPrice: this.calculateCarrierPrice(shipment, carrier)
        })).sort((a, b) => b.matchScore - a.matchScore);
    }

    // البحث عن شحنات مناسبة للموصل
    findMatchingShipments(carrierId) {
        const carrier = this.getCarrier(carrierId);
        if (!carrier) return [];

        return this.shipments.filter(shipment => {
            if (shipment.status !== 'pending') return false;
            
            const shipmentCategory = this.classifyShipmentByWeight(shipment.weight);
            const categoryMatch = this.isCategoryCompatible(shipmentCategory, carrier.category);
            const areaMatch = this.isServiceAreaMatch(carrier, shipment);
            const capacityMatch = this.isCapacityMatch(carrier, shipment);
            
            return categoryMatch && areaMatch && capacityMatch;
        }).map(shipment => ({
            ...shipment,
            matchScore: this.calculateMatchScore(shipment, carrier),
            estimatedEarning: this.calculateCarrierPrice(shipment, carrier)
        })).sort((a, b) => b.matchScore - a.matchScore);
    }

    // التحقق من تطابق الفئات
    isCategoryCompatible(shipmentCategory, carrierCategory) {
        const compatibility = {
            'small': ['small', 'medium', 'large', 'x-large'],
            'medium': ['medium', 'large', 'x-large'],
            'large': ['large', 'x-large'],
            'x-large': ['x-large']
        };
        
        return compatibility[shipmentCategory]?.includes(carrierCategory) || false;
    }

    // التحقق من تطابق المنطقة الجغرافية
    isServiceAreaMatch(carrier, shipment) {
        // إذا لم تكن هناك مناطق محددة، فالموصل يخدم كل المناطق
        if (!carrier.serviceAreas || carrier.serviceAreas.length === 0) return true;
        
        const pickupMatch = carrier.serviceAreas.some(area => 
            area.city === shipment.pickup.city || area.region === shipment.pickup.region
        );
        
        const deliveryMatch = carrier.serviceAreas.some(area => 
            area.city === shipment.delivery.city || area.region === shipment.delivery.region
        );
        
        return pickupMatch && deliveryMatch;
    }

    // التحقق من تطابق السعة
    isCapacityMatch(carrier, shipment) {
        const weightMatch = carrier.vehicle.capacity.weight >= shipment.weight;
        
        // حساب الحجم المطلوب
        const requiredVolume = (shipment.dimensions.length * shipment.dimensions.width * shipment.dimensions.height) / 1000000; // تحويل إلى متر مكعب
        const volumeMatch = carrier.vehicle.capacity.volume >= requiredVolume;
        
        return weightMatch && volumeMatch;
    }

    // حساب نقاط التطابق
    calculateMatchScore(shipment, carrier) {
        let score = 0;
        
        // نقاط التقييم (40%)
        score += carrier.stats.rating * 8;
        
        // نقاط معدل الإنجاز (20%)
        score += carrier.stats.completionRate * 0.2;
        
        // نقاط الالتزام بالوقت (20%)
        score += carrier.stats.onTimeRate * 0.2;
        
        // نقاط المسافة (10%) - كلما قل كلما زادت النقاط
        const distance = this.calculateDistance(shipment.pickup.coordinates, carrier.vehicle.location);
        score += Math.max(0, 10 - (distance / 10));
        
        // نقاط السعر (10%) - كلما قل كلما زادت النقاط
        const price = this.calculateCarrierPrice(shipment, carrier);
        const maxBudget = shipment.maxBudget;
        if (price <= maxBudget) {
            score += (1 - (price / maxBudget)) * 10;
        }
        
        return Math.round(score * 10) / 10;
    }

    // ===== نظام التسعير الديناميكي =====

    // حساب السعر المقدر للشحنة
    calculateEstimatedPrice(shipmentData) {
        const basePrice = this.getBasePriceByCategory(this.classifyShipmentByWeight(shipmentData.weight));
        const distance = this.calculateDistance(shipmentData.pickup.coordinates, shipmentData.delivery.coordinates);
        const weightMultiplier = this.getWeightMultiplier(shipmentData.weight);
        const urgencyMultiplier = this.getUrgencyMultiplier(shipmentData.priority);
        
        let price = basePrice + (distance * 2) + (shipmentData.weight * weightMultiplier);
        price *= urgencyMultiplier;
        
        // إضافة رسوم خاصة
        if (shipmentData.fragile) price *= 1.2;
        if (shipmentData.perishable) price *= 1.3;
        
        return Math.round(price * 100) / 100;
    }

    // حساب سعر الموصل للشحنة
    calculateCarrierPrice(shipment, carrier) {
        const distance = this.calculateDistance(shipment.pickup.coordinates, shipment.delivery.coordinates);
        
        let price = carrier.pricing.baseRate * distance;
        price += shipment.weight * carrier.pricing.weightRate;
        price = Math.max(price, carrier.pricing.minimumCharge);
        
        // خصم للموصلين ذوي التقييم العالي
        if (carrier.stats.rating >= 4.5) {
            price *= 0.95; // خصم 5%
        }
        
        return Math.round(price * 100) / 100;
    }

    // الحصول على السعر الأساسي حسب الفئة
    getBasePriceByCategory(category) {
        const basePrices = {
            'small': 10,      // 10 ريال للشحنات الصغيرة
            'medium': 50,     // 50 ريال للشحنات المتوسطة
            'large': 200,     // 200 ريال للشحنات الكبيرة
            'x-large': 1000   // 1000 ريال للشحنات العملاقة
        };
        
        return basePrices[category] || 50;
    }

    // مضاعف الوزن
    getWeightMultiplier(weight) {
        if (weight <= 20) return 0.5;
        if (weight <= 1500) return 1;
        if (weight <= 50000) return 2;
        return 5;
    }

    // مضاعف الأولوية
    getUrgencyMultiplier(priority) {
        const multipliers = {
            'low': 0.8,
            'normal': 1.0,
            'high': 1.3,
            'urgent': 1.8
        };
        
        return multipliers[priority] || 1.0;
    }

    // ===== وظائف مساعدة =====

    // توليد معرف فريد
    generateId(prefix = '') {
        return prefix + Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    // توليد رقم تتبع
    generateTrackingNumber() {
        return 'FS' + Date.now().toString().slice(-8).toUpperCase();
    }

    // حساب المسافة بين نقطتين (تقريبي)
    calculateDistance(coord1, coord2) {
        if (!coord1 || !coord2) return 100; // مسافة افتراضية
        
        const R = 6371; // نصف قطر الأرض بالكيلومتر
        const dLat = this.deg2rad(coord2.lat - coord1.lat);
        const dLon = this.deg2rad(coord2.lng - coord1.lng);
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.deg2rad(coord1.lat)) * Math.cos(this.deg2rad(coord2.lat)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return Math.round(distance * 100) / 100;
    }

    deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    // ===== إدارة البيانات =====

    // حفظ البيانات
    saveData() {
        const data = {
            shipments: this.shipments,
            carriers: this.carriers,
            users: this.users,
            matches: this.matches,
            transactions: this.transactions
        };
        
        localStorage.setItem('fastship_data', JSON.stringify(data));
    }

    // تحميل البيانات
    loadData() {
        const savedData = localStorage.getItem('fastship_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.shipments = data.shipments || [];
            this.carriers = data.carriers || [];
            this.users = data.users || [];
            this.matches = data.matches || [];
            this.transactions = data.transactions || [];
        }
    }

    // الحصول على شحنة
    getShipment(id) {
        return this.shipments.find(s => s.id === id);
    }

    // الحصول على موصل
    getCarrier(id) {
        return this.carriers.find(c => c.id === id);
    }

    // الحصول على مستخدم
    getUser(id) {
        return this.users.find(u => u.id === id);
    }

    // ===== بيانات تجريبية =====
    initSampleData() {
        if (this.shipments.length === 0) {
            this.createSampleData();
        }
    }

    createSampleData() {
        // إنشاء مستخدمين تجريبيين
        const sampleUsers = [
            {
                email: 'ahmed@example.com',
                phone: '+966501234567',
                firstName: 'أحمد',
                lastName: 'محمد',
                accountType: 'both',
                city: 'الرياض',
                region: 'منطقة الرياض'
            },
            {
                email: 'fatima@example.com', 
                phone: '+966507654321',
                firstName: 'فاطمة',
                lastName: 'علي',
                accountType: 'shipper',
                city: 'جدة',
                region: 'منطقة مكة المكرمة'
            }
        ];

        sampleUsers.forEach(userData => {
            this.users.push(this.createUser(userData));
        });

        // إنشاء موصلين تجريبيين
        const sampleCarriers = [
            {
                userId: this.users[0].id,
                vehicleType: 'car',
                capacity: { weight: 500, volume: 2 },
                serviceAreas: [
                    { city: 'الرياض', region: 'منطقة الرياض' },
                    { city: 'الدمام', region: 'المنطقة الشرقية' }
                ],
                pricing: { baseRate: 2, weightRate: 0.5, minimumCharge: 25 }
            },
            {
                userId: this.users[1].id,
                vehicleType: 'truck',
                capacity: { weight: 10000, volume: 20 },
                serviceAreas: [
                    { city: 'جدة', region: 'منطقة مكة المكرمة' },
                    { city: 'المدينة المنورة', region: 'منطقة المدينة المنورة' }
                ],
                pricing: { baseRate: 5, weightRate: 1, minimumCharge: 100 }
            }
        ];

        sampleCarriers.forEach(carrierData => {
            this.carriers.push(this.createCarrier(carrierData));
        });

        this.saveData();
    }
}

// إنشاء مثيل عام من FastShip
window.FastShip = new FastShipCore();

// تصدير الفئة للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FastShipCore;
}