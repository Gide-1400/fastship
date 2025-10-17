// matching-engine.js - نظام المطابقة الذكي بين الشحنات والموصلين

/**
 * محرك المطابقة الذكي
 */
class MatchingEngine {
    constructor() {
        this.carriers = [];
        this.trips = [];
        this.shipments = [];
    }
    
    /**
     * إيجاد أفضل الموصلين لشحنة معينة
     * @param {Shipment} shipment - الشحنة المراد توصيلها
     * @param {Object} filters - فلاتر إضافية
     * @returns {Array} قائمة الموصلين المتطابقين مرتبة حسب الأفضلية
     */
    findMatchingCarriers(shipment, filters = {}) {
        const {
            maxPrice = Infinity,
            minRating = 0,
            verifiedOnly = false,
            maxDistance = Infinity
        } = filters;
        
        // الحصول على أنواع الموصلين المناسبة
        const matchingCarrierTypes = shipment.getMatchingCarriers();
        
        // فلترة الموصلين
        let matches = this.carriers.filter(carrier => {
            // التحقق من نوع الموصل
            if (!matchingCarrierTypes.includes(carrier.type)) return false;
            
            // التحقق من إمكانية قبول الشحنة
            if (!carrier.canAcceptShipment(shipment)) return false;
            
            // التحقق من التقييم
            if (carrier.rating < minRating) return false;
            
            // التحقق من التوثيق
            if (verifiedOnly && !carrier.isVerified) return false;
            
            return true;
        });
        
        // الحصول على رحلات هؤلاء الموصلين
        matches = matches.map(carrier => {
            const carrierTrips = this.trips.filter(trip => 
                trip.carrierId === carrier.id &&
                trip.status === 'active' &&
                this.isRouteCompatible(shipment, trip)
            );
            
            return {
                carrier,
                trips: carrierTrips,
                score: this.calculateMatchScore(carrier, carrierTrips, shipment)
            };
        });
        
        // ترتيب النتائج حسب النقاط
        matches.sort((a, b) => b.score - a.score);
        
        return matches;
    }
    
    /**
     * التحقق من توافق المسار
     */
    isRouteCompatible(shipment, trip) {
        // التحقق من تطابق المدينة المنطلق
        const fromMatch = this.compareLoca tions(
            shipment.fromLocation,
            trip.fromLocation
        );
        
        // التحقق من تطابق مدينة الوصول
        const toMatch = this.compareLocations(
            shipment.toLocation,
            trip.toLocation
        );
        
        // التحقق من التواريخ
        const dateMatch = new Date(trip.departureDate) >= new Date(shipment.pickupDate);
        
        return fromMatch && toMatch && dateMatch;
    }
    
    /**
     * مقارنة الموقعين
     */
    compareLocations(loc1, loc2) {
        return loc1.city === loc2.city || 
               this.calculateDistance(loc1, loc2) < 50; // ضمن دائرة 50 كم
    }
    
    /**
     * حساب المسافة بين موقعين (بالكيلومتر)
     */
    calculateDistance(loc1, loc2) {
        if (!loc1.lat || !loc1.lng || !loc2.lat || !loc2.lng) {
            // إذا لم تتوفر الإحداثيات، نستخدم قاعدة بيانات المسافات
            return this.getDistanceFromDatabase(loc1.city, loc2.city);
        }
        
        const R = 6371; // نصف قطر الأرض بالكيلومتر
        const dLat = this.deg2rad(loc2.lat - loc1.lat);
        const dLon = this.deg2rad(loc2.lng - loc1.lng);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(loc1.lat)) * Math.cos(this.deg2rad(loc2.lat)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return distance;
    }
    
    deg2rad(deg) {
        return deg * (Math.PI/180);
    }
    
    /**
     * الحصول على المسافة من قاعدة البيانات
     */
    getDistanceFromDatabase(city1, city2) {
        // قاعدة بيانات المسافات بين المدن السعودية الرئيسية (بالكيلومتر)
        const distances = {
            'الرياض-جدة': 950,
            'الرياض-الدمام': 400,
            'الرياض-المدينة المنورة': 850,
            'الرياض-أبها': 950,
            'الرياض-تبوك': 1300,
            'جدة-المدينة المنورة': 420,
            'جدة-الدمام': 1350,
            'جدة-أبها': 580,
            'الدمام-المدينة المنورة': 1050,
            'الدمام-أبها': 1200,
            'المدينة المنورة-أبها': 900
        };
        
        const key1 = `${city1}-${city2}`;
        const key2 = `${city2}-${city1}`;
        
        return distances[key1] || distances[key2] || 500; // قيمة افتراضية
    }
    
    /**
     * حساب نقاط التطابق
     */
    calculateMatchScore(carrier, trips, shipment) {
        let score = 0;
        
        // نقاط التقييم (0-30 نقطة)
        score += carrier.rating * 6;
        
        // نقاط الخبرة (0-20 نقطة)
        score += Math.min(carrier.totalTrips / 10, 20);
        
        // نقاط التوثيق (0-15 نقطة)
        if (carrier.isVerified) score += 15;
        
        // نقاط التأمين (0-10 نقاط)
        if (carrier.insurance) score += 10;
        
        // نقاط توفر الرحلات (0-25 نقاط)
        if (trips.length > 0) {
            score += Math.min(trips.length * 5, 25);
            
            // إضافة نقاط لقرب موعد الرحلة
            const nearestTrip = trips.reduce((nearest, trip) => {
                const tripDate = new Date(trip.departureDate);
                const nearestDate = new Date(nearest.departureDate);
                return tripDate < nearestDate ? trip : nearest;
            });
            
            const daysDiff = Math.abs(
                (new Date(nearestTrip.departureDate) - new Date(shipment.pickupDate)) / (1000 * 60 * 60 * 24)
            );
            
            if (daysDiff <= 1) score += 10;
            else if (daysDiff <= 3) score += 5;
        }
        
        return score;
    }
    
    /**
     * إيجاد رحلات متاحة لشحنة معينة
     */
    findAvailableTrips(shipment, filters = {}) {
        const matchingCarriers = this.findMatchingCarriers(shipment, filters);
        
        const availableTrips = [];
        
        matchingCarriers.forEach(({ carrier, trips }) => {
            trips.forEach(trip => {
                if (trip.availableSpace >= shipment.weight) {
                    const distance = this.calculateDistance(
                        shipment.fromLocation,
                        shipment.toLocation
                    );
                    
                    const carrierType = window.FastShipModels.CarrierTypes[carrier.type.toUpperCase()];
                    const price = this.calculatePrice(shipment.weight, distance, carrierType);
                    
                    availableTrips.push({
                        trip,
                        carrier,
                        price,
                        distance,
                        estimatedDuration: this.calculateDuration(distance, carrier.type),
                        matchScore: this.calculateMatchScore(carrier, [trip], shipment)
                    });
                }
            });
        });
        
        // ترتيب حسب النقاط
        availableTrips.sort((a, b) => b.matchScore - a.matchScore);
        
        return availableTrips;
    }
    
    /**
     * حساب السعر
     */
    calculatePrice(weight, distance, carrierType) {
        const basePrice = carrierType.basePrice;
        const pricePerKm = carrierType.pricePerKm;
        const weightFactor = weight / 100; // كل 100 كجم
        
        const price = basePrice + (distance * pricePerKm) + (weightFactor * 10);
        
        return Math.round(price);
    }
    
    /**
     * حساب المدة المتوقعة (بالساعات)
     */
    calculateDuration(distance, carrierType) {
        const speeds = {
            'regular_traveler': 80,  // متوسط السرعة
            'private_car': 100,
            'truck_owner': 70,
            'fleet_company': 60
        };
        
        const speed = speeds[carrierType] || 80;
        return Math.round((distance / speed) * 10) / 10;
    }
    
    /**
     * اقتراح شحنات للموصل
     */
    suggestShipmentsForCarrier(carrier, trip, filters = {}) {
        const suggestions = [];
        
        this.shipments.forEach(shipment => {
            // التحقق من حالة الشحنة
            if (shipment.status !== window.FastShipModels.ShipmentStatus.PENDING.id) return;
            
            // التحقق من إمكانية قبول الشحنة
            if (!carrier.canAcceptShipment(shipment)) return;
            
            // التحقق من توافق المسار
            if (!this.isRouteCompatible(shipment, trip)) return;
            
            // حساب النقاط والربح
            const distance = this.calculateDistance(
                shipment.fromLocation,
                shipment.toLocation
            );
            
            const carrierType = window.FastShipModels.CarrierTypes[carrier.type.toUpperCase()];
            const price = this.calculatePrice(shipment.weight, distance, carrierType);
            const profit = price * 0.8; // 80% للموصل، 20% عمولة المنصة
            
            suggestions.push({
                shipment,
                price,
                profit,
                distance,
                spaceUsage: (shipment.weight / trip.availableSpace) * 100,
                priority: this.calculateShipmentPriority(shipment)
            });
        });
        
        // ترتيب حسب الأولوية والربح
        suggestions.sort((a, b) => {
            if (b.priority !== a.priority) return b.priority - a.priority;
            return b.profit - a.profit;
        });
        
        return suggestions;
    }
    
    /**
     * حساب أولوية الشحنة
     */
    calculateShipmentPriority(shipment) {
        let priority = 0;
        
        // أولوية عالية للشحنات العاجلة
        const daysUntilPickup = Math.abs(
            (new Date(shipment.pickupDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysUntilPickup <= 1) priority += 10;
        else if (daysUntilPickup <= 3) priority += 5;
        
        // أولوية للشحنات القيمة
        if (shipment.value > 5000) priority += 5;
        if (shipment.insuranceRequired) priority += 3;
        
        // أولوية للشحنات الخفيفة (سهولة النقل)
        if (shipment.weight <= 20) priority += 2;
        
        return priority;
    }
    
    /**
     * تحسين استغلال المساحة - اقتراح مجموعة شحنات
     */
    optimizeSpaceUtilization(trip, availableShipments) {
        // خوارزمية Knapsack لتحسين استغلال المساحة
        const capacity = trip.availableSpace;
        const shipments = availableShipments.filter(s => 
            s.weight <= capacity && 
            this.isRouteCompatible(s, trip)
        );
        
        // ترتيب حسب نسبة القيمة/الوزن
        shipments.sort((a, b) => {
            const ratioA = a.value / a.weight;
            const ratioB = b.value / b.weight;
            return ratioB - ratioA;
        });
        
        const selectedShipments = [];
        let remainingCapacity = capacity;
        
        for (const shipment of shipments) {
            if (shipment.weight <= remainingCapacity && selectedShipments.length < trip.maxShipments) {
                selectedShipments.push(shipment);
                remainingCapacity -= shipment.weight;
            }
        }
        
        return {
            shipments: selectedShipments,
            totalWeight: capacity - remainingCapacity,
            utilization: ((capacity - remainingCapacity) / capacity) * 100,
            remainingCapacity
        };
    }
    
    /**
     * تحديث قوائم البيانات
     */
    updateCarriers(carriers) {
        this.carriers = carriers;
    }
    
    updateTrips(trips) {
        this.trips = trips;
    }
    
    updateShipments(shipments) {
        this.shipments = shipments;
    }
}

// تصدير المحرك
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MatchingEngine };
}

// جعل المحرك متاح عالمياً
if (typeof window !== 'undefined') {
    window.FastShipMatchingEngine = new MatchingEngine();
}
