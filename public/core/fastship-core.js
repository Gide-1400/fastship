// fastship-core.js - الملف الرئيسي لربط جميع مكونات المنصة

/**
 * منصة FastShip - المنطق الأساسي
 */
class FastShipCore {
    constructor() {
        this.initialized = false;
        this.models = null;
        this.matchingEngine = null;
        this.pricingEngine = null;
        this.tripManager = null;
        this.mockData = null;
    }
    
    /**
     * تهيئة المنصة
     */
    async initialize() {
        if (this.initialized) {
            console.warn('FastShip already initialized');
            return;
        }
        
        try {
            // التحقق من توفر المكونات
            if (!window.FastShipModels) {
                throw new Error('FastShipModels not loaded');
            }
            
            // تهيئة المكونات
            this.models = window.FastShipModels;
            this.matchingEngine = window.FastShipMatchingEngine;
            this.pricingEngine = window.FastShipPricingEngine;
            this.tripManager = window.FastShipTripManager;
            this.mockData = window.FastShipMockData;
            
            // تحميل البيانات التجريبية
            if (this.mockData && this.mockData.initializeMockData) {
                this.mockData.initializeMockData();
            }
            
            this.initialized = true;
            
            console.log('✅ FastShip Core initialized successfully');
            console.log('📦 Models:', Object.keys(this.models));
            console.log('🔍 Matching Engine:', this.matchingEngine ? 'Ready' : 'Not available');
            console.log('💰 Pricing Engine:', this.pricingEngine ? 'Ready' : 'Not available');
            console.log('🛣️ Trip Manager:', this.tripManager ? 'Ready' : 'Not available');
            
            return true;
        } catch (error) {
            console.error('❌ FastShip initialization failed:', error);
            return false;
        }
    }
    
    /**
     * إنشاء شحنة جديدة
     */
    createShipment(shipmentData) {
        if (!this.initialized) {
            throw new Error('FastShip not initialized. Call initialize() first.');
        }
        
        try {
            const shipment = new this.models.Shipment(shipmentData);
            
            // إضافة للقائمة
            this.matchingEngine.shipments.push(shipment);
            
            console.log('✅ Shipment created:', shipment.id);
            
            return shipment;
        } catch (error) {
            console.error('❌ Failed to create shipment:', error);
            throw error;
        }
    }
    
    /**
     * البحث عن موصلين مناسبين لشحنة
     */
    findCarriersForShipment(shipmentId, filters = {}) {
        if (!this.initialized) {
            throw new Error('FastShip not initialized');
        }
        
        const shipment = this.matchingEngine.shipments.find(s => s.id === shipmentId);
        
        if (!shipment) {
            throw new Error('Shipment not found');
        }
        
        const matches = this.matchingEngine.findMatchingCarriers(shipment, filters);
        
        console.log(`🔍 Found ${matches.length} matching carriers for shipment ${shipmentId}`);
        
        return matches;
    }
    
    /**
     * البحث عن رحلات متاحة لشحنة
     */
    findTripsForShipment(shipmentId, filters = {}) {
        if (!this.initialized) {
            throw new Error('FastShip not initialized');
        }
        
        const shipment = this.matchingEngine.shipments.find(s => s.id === shipmentId);
        
        if (!shipment) {
            throw new Error('Shipment not found');
        }
        
        const trips = this.matchingEngine.findAvailableTrips(shipment, filters);
        
        console.log(`🛣️ Found ${trips.length} available trips for shipment ${shipmentId}`);
        
        return trips;
    }
    
    /**
     * حساب سعر الشحنة
     */
    calculateShipmentPrice(shipmentId, carrierId, options = {}) {
        if (!this.initialized) {
            throw new Error('FastShip not initialized');
        }
        
        const shipment = this.matchingEngine.shipments.find(s => s.id === shipmentId);
        const carrier = this.matchingEngine.carriers.find(c => c.id === carrierId);
        
        if (!shipment) throw new Error('Shipment not found');
        if (!carrier) throw new Error('Carrier not found');
        
        const distance = this.matchingEngine.calculateDistance(
            shipment.fromLocation,
            shipment.toLocation
        );
        
        const pricing = this.pricingEngine.calculateFullPrice(
            shipment,
            carrier,
            distance,
            options
        );
        
        console.log(`💰 Price calculated for shipment ${shipmentId}:`, pricing.totalPrice, 'SAR');
        
        return pricing;
    }
    
    /**
     * إنشاء رحلة جديدة
     */
    createTrip(tripData) {
        if (!this.initialized) {
            throw new Error('FastShip not initialized');
        }
        
        try {
            const trip = this.tripManager.createTrip(tripData);
            
            console.log('✅ Trip created:', trip.id);
            
            return trip;
        } catch (error) {
            console.error('❌ Failed to create trip:', error);
            throw error;
        }
    }
    
    /**
     * حجز شحنة في رحلة
     */
    bookShipment(tripId, shipmentId) {
        if (!this.initialized) {
            throw new Error('FastShip not initialized');
        }
        
        const shipment = this.matchingEngine.shipments.find(s => s.id === shipmentId);
        
        if (!shipment) {
            throw new Error('Shipment not found');
        }
        
        try {
            const booking = this.tripManager.bookSpace(tripId, shipmentId, shipment.weight);
            
            // تحديث حالة الشحنة
            shipment.status = this.models.ShipmentStatus.ACCEPTED.id;
            
            console.log('✅ Shipment booked:', booking.id);
            
            return booking;
        } catch (error) {
            console.error('❌ Failed to book shipment:', error);
            throw error;
        }
    }
    
    /**
     * اقتراح شحنات للموصل
     */
    suggestShipmentsForCarrier(carrierId, tripId, filters = {}) {
        if (!this.initialized) {
            throw new Error('FastShip not initialized');
        }
        
        const carrier = this.matchingEngine.carriers.find(c => c.id === carrierId);
        const trip = this.tripManager.trips.find(t => t.id === tripId);
        
        if (!carrier) throw new Error('Carrier not found');
        if (!trip) throw new Error('Trip not found');
        
        const suggestions = this.matchingEngine.suggestShipmentsForCarrier(
            carrier,
            trip,
            filters
        );
        
        console.log(`📦 Found ${suggestions.length} suggested shipments for carrier ${carrierId}`);
        
        return suggestions;
    }
    
    /**
     * تحسين استغلال المساحة في رحلة
     */
    optimizeTripSpace(tripId) {
        if (!this.initialized) {
            throw new Error('FastShip not initialized');
        }
        
        const trip = this.tripManager.trips.find(t => t.id === tripId);
        
        if (!trip) {
            throw new Error('Trip not found');
        }
        
        const availableShipments = this.matchingEngine.shipments.filter(
            s => s.status === this.models.ShipmentStatus.PENDING.id
        );
        
        const optimization = this.matchingEngine.optimizeSpaceUtilization(
            trip,
            availableShipments
        );
        
        console.log(`🎯 Space optimization for trip ${tripId}:`, 
                    `${optimization.utilization.toFixed(2)}% utilization`);
        
        return optimization;
    }
    
    /**
     * الحصول على إحصائيات المنصة
     */
    getStatistics() {
        if (!this.initialized) {
            throw new Error('FastShip not initialized');
        }
        
        const totalShipments = this.matchingEngine.shipments.length;
        const totalCarriers = this.matchingEngine.carriers.length;
        const totalTrips = this.tripManager.trips.length;
        
        const pendingShipments = this.matchingEngine.shipments.filter(
            s => s.status === this.models.ShipmentStatus.PENDING.id
        ).length;
        
        const activeTrips = this.tripManager.trips.filter(
            t => t.status === 'active'
        ).length;
        
        const deliveredShipments = this.matchingEngine.shipments.filter(
            s => s.status === this.models.ShipmentStatus.DELIVERED.id
        ).length;
        
        return {
            totalShipments,
            totalCarriers,
            totalTrips,
            pendingShipments,
            activeTrips,
            deliveredShipments,
            averageRating: this.calculateAverageRating(),
            totalCapacity: this.calculateTotalCapacity()
        };
    }
    
    /**
     * حساب متوسط التقييم
     */
    calculateAverageRating() {
        const carriers = this.matchingEngine.carriers;
        
        if (carriers.length === 0) return 0;
        
        const totalRating = carriers.reduce((sum, c) => sum + c.rating, 0);
        return (totalRating / carriers.length).toFixed(2);
    }
    
    /**
     * حساب المساحة الإجمالية المتاحة
     */
    calculateTotalCapacity() {
        const trips = this.tripManager.trips.filter(t => t.status === 'active');
        
        return trips.reduce((sum, t) => sum + t.availableSpace, 0);
    }
    
    /**
     * البحث الشامل
     */
    search(query, type = 'all') {
        if (!this.initialized) {
            throw new Error('FastShip not initialized');
        }
        
        const results = {
            shipments: [],
            carriers: [],
            trips: []
        };
        
        const searchLower = query.toLowerCase();
        
        if (type === 'all' || type === 'shipments') {
            results.shipments = this.matchingEngine.shipments.filter(s => 
                s.id.toLowerCase().includes(searchLower) ||
                s.description.toLowerCase().includes(searchLower) ||
                s.fromLocation.city.includes(query) ||
                s.toLocation.city.includes(query)
            );
        }
        
        if (type === 'all' || type === 'carriers') {
            results.carriers = this.matchingEngine.carriers.filter(c => 
                c.id.toLowerCase().includes(searchLower) ||
                c.vehicle.includes(query)
            );
        }
        
        if (type === 'all' || type === 'trips') {
            results.trips = this.tripManager.trips.filter(t => 
                t.id.toLowerCase().includes(searchLower) ||
                t.fromLocation.city.includes(query) ||
                t.toLocation.city.includes(query)
            );
        }
        
        return results;
    }
    
    /**
     * تصدير البيانات
     */
    exportData() {
        if (!this.initialized) {
            throw new Error('FastShip not initialized');
        }
        
        return {
            shipments: this.matchingEngine.shipments,
            carriers: this.matchingEngine.carriers,
            trips: this.tripManager.trips,
            bookings: this.tripManager.bookings,
            statistics: this.getStatistics(),
            exportedAt: new Date().toISOString()
        };
    }
    
    /**
     * مسح جميع البيانات (للاختبار فقط)
     */
    clearAllData() {
        if (!this.initialized) {
            throw new Error('FastShip not initialized');
        }
        
        this.matchingEngine.shipments = [];
        this.matchingEngine.carriers = [];
        this.matchingEngine.trips = [];
        this.tripManager.trips = [];
        this.tripManager.bookings = [];
        
        console.log('🗑️ All data cleared');
    }
}

// إنشاء نسخة عامة من المنصة
if (typeof window !== 'undefined') {
    window.FastShip = new FastShipCore();
    
    // تهيئة تلقائية عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.FastShip.initialize().then(success => {
                if (success) {
                    console.log('🚀 FastShip Platform is ready!');
                    
                    // إطلاق حدث مخصص
                    window.dispatchEvent(new Event('fastship:ready'));
                }
            });
        });
    } else {
        window.FastShip.initialize().then(success => {
            if (success) {
                console.log('🚀 FastShip Platform is ready!');
                window.dispatchEvent(new Event('fastship:ready'));
            }
        });
    }
}

// تصدير للاستخدام في Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FastShipCore };
}
