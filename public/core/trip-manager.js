// trip-manager.js - نظام إدارة الرحلات والمساحات المتاحة

/**
 * مدير الرحلات
 */
class TripManager {
    constructor() {
        this.trips = [];
        this.bookings = [];
    }
    
    /**
     * إنشاء رحلة جديدة
     */
    createTrip(tripData) {
        const {
            carrierId,
            fromLocation,
            toLocation,
            departureDate,
            arrivalDate,
            availableSpace,
            maxShipments = 10,
            pricing = {},
            restrictions = {}
        } = tripData;
        
        // التحقق من صحة البيانات
        if (!carrierId || !fromLocation || !toLocation || !departureDate || !availableSpace) {
            throw new Error('بيانات الرحلة غير مكتملة');
        }
        
        // إنشاء الرحلة
        const trip = new window.FastShipModels.Trip({
            carrierId,
            fromLocation,
            toLocation,
            departureDate,
            arrivalDate: arrivalDate || this.calculateArrivalDate(departureDate, fromLocation, toLocation),
            availableSpace,
            maxShipments
        });
        
        // إضافة معلومات إضافية
        trip.pricing = pricing;
        trip.restrictions = restrictions;
        trip.stops = []; // نقاط التوقف في الطريق
        trip.route = this.calculateRoute(fromLocation, toLocation);
        
        this.trips.push(trip);
        
        return trip;
    }
    
    /**
     * حساب تاريخ الوصول المتوقع
     */
    calculateArrivalDate(departureDate, fromLocation, toLocation) {
        const departure = new Date(departureDate);
        const distance = window.FastShipMatchingEngine.calculateDistance(fromLocation, toLocation);
        
        // متوسط السرعة 80 كم/ساعة
        const hours = Math.ceil(distance / 80);
        
        const arrival = new Date(departure.getTime() + hours * 60 * 60 * 1000);
        return arrival.toISOString();
    }
    
    /**
     * حساب المسار
     */
    calculateRoute(fromLocation, toLocation) {
        return {
            from: fromLocation,
            to: toLocation,
            distance: window.FastShipMatchingEngine.calculateDistance(fromLocation, toLocation),
            estimatedDuration: 0, // سيتم حسابه لاحقاً
            waypoints: [] // نقاط في الطريق
        };
    }
    
    /**
     * حجز مساحة في رحلة
     */
    bookSpace(tripId, shipmentId, weight) {
        const trip = this.trips.find(t => t.id === tripId);
        
        if (!trip) {
            throw new Error('الرحلة غير موجودة');
        }
        
        if (trip.status !== 'active') {
            throw new Error('الرحلة غير نشطة');
        }
        
        if (trip.availableSpace < weight) {
            throw new Error('لا توجد مساحة كافية في الرحلة');
        }
        
        if (trip.shipments.length >= trip.maxShipments) {
            throw new Error('وصلت الرحلة للحد الأقصى من الشحنات');
        }
        
        // إضافة الحجز
        const booking = {
            id: this.generateBookingId(),
            tripId,
            shipmentId,
            weight,
            bookedAt: new Date().toISOString(),
            status: 'confirmed'
        };
        
        trip.addShipment(shipmentId, weight);
        this.bookings.push(booking);
        
        return booking;
    }
    
    /**
     * إلغاء حجز
     */
    cancelBooking(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        
        if (!booking) {
            throw new Error('الحجز غير موجود');
        }
        
        const trip = this.trips.find(t => t.id === booking.tripId);
        
        if (trip) {
            trip.removeShipment(booking.shipmentId, booking.weight);
        }
        
        booking.status = 'cancelled';
        booking.cancelledAt = new Date().toISOString();
        
        return booking;
    }
    
    /**
     * البحث عن رحلات متاحة
     */
    searchTrips(searchCriteria) {
        const {
            fromCity,
            toCity,
            departureDate,
            minSpace = 0,
            maxPrice = Infinity,
            carrierTypes = []
        } = searchCriteria;
        
        let results = this.trips.filter(trip => {
            // فلترة حسب الحالة
            if (trip.status !== 'active') return false;
            
            // فلترة حسب المدينة
            if (fromCity && trip.fromLocation.city !== fromCity) return false;
            if (toCity && trip.toLocation.city !== toCity) return false;
            
            // فلترة حسب التاريخ
            if (departureDate) {
                const tripDate = new Date(trip.departureDate).toDateString();
                const searchDate = new Date(departureDate).toDateString();
                if (tripDate !== searchDate) return false;
            }
            
            // فلترة حسب المساحة
            if (trip.availableSpace < minSpace) return false;
            
            return true;
        });
        
        // إضافة معلومات إضافية
        results = results.map(trip => {
            const carrier = this.getCarrierInfo(trip.carrierId);
            
            return {
                trip,
                carrier,
                distance: trip.route.distance,
                utilization: ((trip.capacity - trip.availableSpace) / trip.capacity) * 100
            };
        });
        
        return results;
    }
    
    /**
     * الحصول على معلومات الموصل
     */
    getCarrierInfo(carrierId) {
        // يمكن استرجاع المعلومات من قاعدة البيانات أو الذاكرة
        return {
            id: carrierId,
            name: 'اسم الموصل',
            rating: 4.5,
            totalTrips: 100
        };
    }
    
    /**
     * إضافة نقطة توقف للرحلة
     */
    addStop(tripId, location, estimatedArrival) {
        const trip = this.trips.find(t => t.id === tripId);
        
        if (!trip) {
            throw new Error('الرحلة غير موجودة');
        }
        
        trip.stops.push({
            location,
            estimatedArrival,
            canPickup: true,
            canDropoff: true
        });
        
        return trip;
    }
    
    /**
     * تحديث حالة الرحلة
     */
    updateTripStatus(tripId, status) {
        const trip = this.trips.find(t => t.id === tripId);
        
        if (!trip) {
            throw new Error('الرحلة غير موجودة');
        }
        
        const validStatuses = ['active', 'in_progress', 'completed', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            throw new Error('حالة غير صالحة');
        }
        
        trip.status = status;
        trip.updatedAt = new Date().toISOString();
        
        return trip;
    }
    
    /**
     * الحصول على إحصائيات الرحلة
     */
    getTripStatistics(tripId) {
        const trip = this.trips.find(t => t.id === tripId);
        
        if (!trip) {
            throw new Error('الرحلة غير موجودة');
        }
        
        const totalCapacity = trip.capacity || (trip.availableSpace + trip.shipments.reduce((sum, s) => sum + s.weight, 0));
        const usedSpace = totalCapacity - trip.availableSpace;
        
        return {
            tripId: trip.id,
            totalCapacity,
            usedSpace,
            availableSpace: trip.availableSpace,
            utilizationPercentage: ((usedSpace / totalCapacity) * 100).toFixed(2),
            shipmentsCount: trip.shipments.length,
            maxShipments: trip.maxShipments,
            status: trip.status,
            route: trip.route
        };
    }
    
    /**
     * الحصول على رحلات موصل معين
     */
    getCarrierTrips(carrierId, filters = {}) {
        const { status = null, upcoming = false } = filters;
        
        let trips = this.trips.filter(t => t.carrierId === carrierId);
        
        if (status) {
            trips = trips.filter(t => t.status === status);
        }
        
        if (upcoming) {
            const now = new Date();
            trips = trips.filter(t => new Date(t.departureDate) > now);
        }
        
        // ترتيب حسب التاريخ
        trips.sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate));
        
        return trips;
    }
    
    /**
     * حساب أرباح الرحلة
     */
    calculateTripEarnings(tripId) {
        const trip = this.trips.find(t => t.id === tripId);
        
        if (!trip) {
            throw new Error('الرحلة غير موجودة');
        }
        
        const bookings = this.bookings.filter(b => 
            b.tripId === tripId && 
            b.status === 'confirmed'
        );
        
        let totalEarnings = 0;
        const shipmentDetails = [];
        
        bookings.forEach(booking => {
            // حساب السعر لكل شحنة (يمكن استرجاعها من قاعدة البيانات)
            const price = booking.price || 0;
            const commission = price * 0.20; // 20% عمولة
            const earnings = price - commission;
            
            totalEarnings += earnings;
            
            shipmentDetails.push({
                shipmentId: booking.shipmentId,
                price,
                commission,
                earnings
            });
        });
        
        return {
            tripId,
            totalRevenue: bookings.reduce((sum, b) => sum + (b.price || 0), 0),
            totalCommission: bookings.reduce((sum, b) => sum + (b.price || 0) * 0.20, 0),
            netEarnings: totalEarnings,
            shipmentsCount: bookings.length,
            shipmentDetails
        };
    }
    
    /**
     * توليد معرف الحجز
     */
    generateBookingId() {
        return 'BKG-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    /**
     * الحصول على رحلات مماثلة
     */
    getSimilarTrips(tripId, limit = 5) {
        const trip = this.trips.find(t => t.id === tripId);
        
        if (!trip) {
            throw new Error('الرحلة غير موجودة');
        }
        
        const similar = this.trips.filter(t => 
            t.id !== tripId &&
            t.status === 'active' &&
            (t.fromLocation.city === trip.fromLocation.city ||
             t.toLocation.city === trip.toLocation.city)
        );
        
        // ترتيب حسب التشابه
        similar.sort((a, b) => {
            const scoreA = this.calculateSimilarityScore(trip, a);
            const scoreB = this.calculateSimilarityScore(trip, b);
            return scoreB - scoreA;
        });
        
        return similar.slice(0, limit);
    }
    
    /**
     * حساب درجة التشابه
     */
    calculateSimilarityScore(trip1, trip2) {
        let score = 0;
        
        // نفس المدينة المنطلق
        if (trip1.fromLocation.city === trip2.fromLocation.city) score += 10;
        
        // نفس مدينة الوصول
        if (trip1.toLocation.city === trip2.toLocation.city) score += 10;
        
        // قرب التاريخ
        const dateDiff = Math.abs(
            new Date(trip1.departureDate) - new Date(trip2.departureDate)
        ) / (1000 * 60 * 60 * 24);
        
        if (dateDiff <= 1) score += 5;
        else if (dateDiff <= 3) score += 3;
        
        // مساحة مشابهة
        const spaceDiff = Math.abs(trip1.availableSpace - trip2.availableSpace);
        if (spaceDiff < 100) score += 3;
        
        return score;
    }
    
    /**
     * تحديث بيانات الرحلات
     */
    updateTrips(trips) {
        this.trips = trips;
    }
    
    /**
     * الحصول على جميع الرحلات
     */
    getAllTrips() {
        return this.trips;
    }
}

// تصدير المدير
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TripManager };
}

// جعل المدير متاح عالمياً
if (typeof window !== 'undefined') {
    window.FastShipTripManager = new TripManager();
}
