// FastShip Enhanced Features - الميزات المتقدمة لمنصة FastShip
// نظام إدارة السعة، التتبع، الإشعارات، والتقييمات

class FastShipEnhanced extends FastShipCore {
    constructor() {
        super();
        this.routes = [];
        this.realTimeTracking = new Map();
        this.notificationQueue = [];
        this.ratingSystem = new RatingSystem();
        this.paymentProcessor = new PaymentProcessor();
        
        this.initEnhancedFeatures();
    }

    initEnhancedFeatures() {
        this.startRealTimeUpdates();
        this.initNotificationSystem();
    }

    // ===== نظام إدارة السعة المتقدم =====

    // إدارة السعة للموصلين
    manageCarrierCapacity(carrierId, currentLoad = null) {
        const carrier = this.getCarrier(carrierId);
        if (!carrier) return null;

        const capacity = {
            total: {
                weight: carrier.vehicle.capacity.weight,
                volume: carrier.vehicle.capacity.volume
            },
            used: currentLoad || this.calculateCurrentLoad(carrierId),
            available: {
                weight: 0,
                volume: 0
            },
            utilization: {
                weight: 0,
                volume: 0
            }
        };

        // حساب السعة المتاحة
        capacity.available.weight = capacity.total.weight - capacity.used.weight;
        capacity.available.volume = capacity.total.volume - capacity.used.volume;

        // حساب نسبة الاستغلال
        capacity.utilization.weight = (capacity.used.weight / capacity.total.weight) * 100;
        capacity.utilization.volume = (capacity.used.volume / capacity.total.volume) * 100;

        return capacity;
    }

    // حساب الحمولة الحالية للموصل
    calculateCurrentLoad(carrierId) {
        const activeShipments = this.shipments.filter(s => 
            s.selectedCarrier === carrierId && 
            ['picked_up', 'in_transit'].includes(s.status)
        );

        let totalWeight = 0;
        let totalVolume = 0;

        activeShipments.forEach(shipment => {
            totalWeight += shipment.weight;
            const volume = (shipment.dimensions.length * shipment.dimensions.width * shipment.dimensions.height) / 1000000;
            totalVolume += volume;
        });

        return { weight: totalWeight, volume: totalVolume };
    }

    // التحقق من إمكانية إضافة شحنة جديدة
    canAcceptShipment(carrierId, shipmentId) {
        const shipment = this.getShipment(shipmentId);
        const capacity = this.manageCarrierCapacity(carrierId);
        
        if (!shipment || !capacity) return false;

        const requiredWeight = shipment.weight;
        const requiredVolume = (shipment.dimensions.length * shipment.dimensions.width * shipment.dimensions.height) / 1000000;

        return capacity.available.weight >= requiredWeight && 
               capacity.available.volume >= requiredVolume;
    }

    // اقتراح التحميل الأمثل
    optimizeCarrierLoad(carrierId, availableShipments) {
        const carrier = this.getCarrier(carrierId);
        const capacity = this.manageCarrierCapacity(carrierId);
        
        if (!carrier || !capacity) return [];

        // ترتيب الشحنات حسب الربحية والكفاءة
        const sortedShipments = availableShipments
            .filter(s => this.canAcceptShipment(carrierId, s.id))
            .map(s => ({
                ...s,
                profitability: this.calculateCarrierPrice(s, carrier) / s.weight,
                efficiency: s.weight / ((s.dimensions.length * s.dimensions.width * s.dimensions.height) / 1000000)
            }))
            .sort((a, b) => (b.profitability + b.efficiency) - (a.profitability + a.efficiency));

        // اختيار أفضل مجموعة من الشحنات
        const optimizedLoad = [];
        let remainingWeight = capacity.available.weight;
        let remainingVolume = capacity.available.volume;

        for (const shipment of sortedShipments) {
            const requiredWeight = shipment.weight;
            const requiredVolume = (shipment.dimensions.length * shipment.dimensions.width * shipment.dimensions.height) / 1000000;

            if (remainingWeight >= requiredWeight && remainingVolume >= requiredVolume) {
                optimizedLoad.push(shipment);
                remainingWeight -= requiredWeight;
                remainingVolume -= requiredVolume;
            }
        }

        return optimizedLoad;
    }

    // ===== نظام تحسين المسارات =====

    // إنشاء مسار محسن للموصل
    createOptimizedRoute(carrierId, shipmentIds) {
        const carrier = this.getCarrier(carrierId);
        const shipments = shipmentIds.map(id => this.getShipment(id)).filter(Boolean);
        
        if (!carrier || shipments.length === 0) return null;

        // تجميع نقاط الاستلام والتسليم
        const waypoints = [];
        
        shipments.forEach(shipment => {
            waypoints.push({
                type: 'pickup',
                shipmentId: shipment.id,
                location: shipment.pickup,
                priority: shipment.priority === 'urgent' ? 1 : 2
            });
            
            waypoints.push({
                type: 'delivery',
                shipmentId: shipment.id,
                location: shipment.delivery,
                priority: shipment.priority === 'urgent' ? 1 : 2
            });
        });

        // تحسين ترتيب النقاط
        const optimizedWaypoints = this.optimizeWaypoints(waypoints, carrier.vehicle.location);

        const route = {
            id: this.generateId('RT'),
            carrierId: carrierId,
            shipmentIds: shipmentIds,
            waypoints: optimizedWaypoints,
            totalDistance: this.calculateRouteDistance(optimizedWaypoints),
            estimatedDuration: this.calculateRouteDuration(optimizedWaypoints),
            estimatedCost: this.calculateRouteCost(optimizedWaypoints, carrier),
            status: 'planned',
            createdAt: new Date().toISOString()
        };

        this.routes.push(route);
        return route;
    }

    // تحسين ترتيب النقاط في المسار
    optimizeWaypoints(waypoints, startLocation) {
        // خوارزمية بسيطة لتحسين المسار (يمكن تطويرها لاحقاً)
        const optimized = [{ type: 'start', location: startLocation }];
        const remaining = [...waypoints];

        let currentLocation = startLocation;

        while (remaining.length > 0) {
            // البحث عن أقرب نقطة
            let nearestIndex = 0;
            let nearestDistance = Infinity;

            remaining.forEach((waypoint, index) => {
                const distance = this.calculateDistance(currentLocation.coordinates, waypoint.location.coordinates);
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestIndex = index;
                }
            });

            const nearest = remaining.splice(nearestIndex, 1)[0];
            optimized.push(nearest);
            currentLocation = nearest.location;
        }

        return optimized;
    }

    // حساب المسافة الإجمالية للمسار
    calculateRouteDistance(waypoints) {
        let totalDistance = 0;
        
        for (let i = 1; i < waypoints.length; i++) {
            const distance = this.calculateDistance(
                waypoints[i-1].location.coordinates,
                waypoints[i].location.coordinates
            );
            totalDistance += distance;
        }
        
        return Math.round(totalDistance * 100) / 100;
    }

    // حساب المدة المقدرة للمسار
    calculateRouteDuration(waypoints) {
        const totalDistance = this.calculateRouteDistance(waypoints);
        const averageSpeed = 60; // كم/ساعة
        const stopTime = (waypoints.length - 1) * 15; // 15 دقيقة لكل توقف
        
        const drivingTime = (totalDistance / averageSpeed) * 60; // بالدقائق
        return Math.round(drivingTime + stopTime);
    }

    // حساب تكلفة المسار
    calculateRouteCost(waypoints, carrier) {
        const totalDistance = this.calculateRouteDistance(waypoints);
        return totalDistance * carrier.pricing.baseRate;
    }

    // ===== نظام التتبع الفوري =====

    // بدء التتبع الفوري للشحنة
    startRealTimeTracking(shipmentId) {
        const shipment = this.getShipment(shipmentId);
        if (!shipment) return false;

        const tracking = {
            shipmentId: shipmentId,
            currentLocation: null,
            lastUpdate: new Date().toISOString(),
            status: shipment.status,
            estimatedArrival: null,
            route: null,
            updates: []
        };

        this.realTimeTracking.set(shipmentId, tracking);
        return true;
    }

    // تحديث موقع الشحنة
    updateShipmentLocation(shipmentId, location, status = null) {
        const tracking = this.realTimeTracking.get(shipmentId);
        if (!tracking) return false;

        const update = {
            timestamp: new Date().toISOString(),
            location: location,
            status: status || tracking.status,
            note: ''
        };

        tracking.currentLocation = location;
        tracking.lastUpdate = update.timestamp;
        tracking.updates.push(update);

        if (status) {
            tracking.status = status;
            this.updateShipmentStatus(shipmentId, status);
        }

        // إرسال إشعار للمرسل والمستقبل
        this.sendTrackingNotification(shipmentId, update);

        return true;
    }

    // الحصول على معلومات التتبع
    getTrackingInfo(shipmentId) {
        return this.realTimeTracking.get(shipmentId) || null;
    }

    // ===== نظام الإشعارات الفوري =====

    initNotificationSystem() {
        // بدء معالجة الإشعارات كل 30 ثانية
        setInterval(() => {
            this.processNotificationQueue();
        }, 30000);
    }

    // إضافة إشعار جديد
    addNotification(userId, type, title, message, data = {}) {
        const notification = {
            id: this.generateId('NOT'),
            userId: userId,
            type: type, // 'match', 'status_update', 'payment', 'rating', 'system'
            title: title,
            message: message,
            data: data,
            read: false,
            createdAt: new Date().toISOString()
        };

        this.notificationQueue.push(notification);
        this.notifications.push(notification);

        // إرسال فوري للإشعارات المهمة
        if (['match', 'payment', 'urgent'].includes(type)) {
            this.sendInstantNotification(notification);
        }

        return notification;
    }

    // إرسال إشعار فوري
    sendInstantNotification(notification) {
        // يمكن دمجها مع خدمات الإشعارات الفورية مثل Firebase
        console.log(`🔔 إشعار فوري: ${notification.title} - ${notification.message}`);
        
        // محاكاة إرسال الإشعار
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/resources/logo.png'
            });
        }
    }

    // إرسال إشعار تتبع
    sendTrackingNotification(shipmentId, update) {
        const shipment = this.getShipment(shipmentId);
        if (!shipment) return;

        const statusMessages = {
            'picked_up': 'تم استلام شحنتك وهي في الطريق',
            'in_transit': 'شحنتك في الطريق إليك',
            'delivered': 'تم تسليم شحنتك بنجاح'
        };

        const message = statusMessages[update.status] || 'تم تحديث حالة شحنتك';

        this.addNotification(
            shipment.senderId,
            'status_update',
            `تحديث الشحنة ${shipment.trackingNumber}`,
            message,
            { shipmentId: shipmentId, location: update.location }
        );
    }

    // معالجة قائمة الإشعارات
    processNotificationQueue() {
        while (this.notificationQueue.length > 0) {
            const notification = this.notificationQueue.shift();
            this.deliverNotification(notification);
        }
    }

    // تسليم الإشعار
    deliverNotification(notification) {
        // يمكن دمجها مع خدمات البريد الإلكتروني أو الرسائل النصية
        console.log(`📧 تسليم إشعار: ${notification.title} للمستخدم ${notification.userId}`);
    }

    // ===== نظام التقييم والمراجعات =====

    // إضافة تقييم
    addRating(fromUserId, toUserId, shipmentId, rating, review = '') {
        return this.ratingSystem.addRating(fromUserId, toUserId, shipmentId, rating, review);
    }

    // الحصول على متوسط التقييم
    getUserRating(userId) {
        return this.ratingSystem.getUserRating(userId);
    }

    // ===== نظام الدفع =====

    // معالجة الدفع
    processPayment(shipmentId, paymentMethod, amount) {
        return this.paymentProcessor.processPayment(shipmentId, paymentMethod, amount);
    }

    // ===== وظائف التكامل =====

    // تحديث حالة الشحنة
    updateShipmentStatus(shipmentId, newStatus) {
        const shipment = this.getShipment(shipmentId);
        if (!shipment) return false;

        const oldStatus = shipment.status;
        shipment.status = newStatus;
        shipment.updatedAt = new Date().toISOString();

        // إضافة سجل للتغيير
        if (!shipment.statusHistory) shipment.statusHistory = [];
        shipment.statusHistory.push({
            from: oldStatus,
            to: newStatus,
            timestamp: new Date().toISOString()
        });

        this.saveData();
        return true;
    }

    // بدء التحديثات الفورية
    startRealTimeUpdates() {
        // محاكاة التحديثات الفورية
        setInterval(() => {
            this.updateActiveShipments();
        }, 60000); // كل دقيقة
    }

    // تحديث الشحنات النشطة
    updateActiveShipments() {
        const activeShipments = this.shipments.filter(s => 
            ['picked_up', 'in_transit'].includes(s.status)
        );

        activeShipments.forEach(shipment => {
            // محاكاة تحديث الموقع
            if (Math.random() > 0.7) { // 30% احتمال التحديث
                const randomLocation = this.generateRandomLocation();
                this.updateShipmentLocation(shipment.id, randomLocation);
            }
        });
    }

    // توليد موقع عشوائي (للمحاكاة)
    generateRandomLocation() {
        return {
            lat: 24.7136 + (Math.random() - 0.5) * 0.1,
            lng: 46.6753 + (Math.random() - 0.5) * 0.1,
            address: 'موقع محدث'
        };
    }
}

// نظام التقييم
class RatingSystem {
    constructor() {
        this.ratings = [];
    }

    addRating(fromUserId, toUserId, shipmentId, rating, review = '') {
        const ratingData = {
            id: Date.now().toString(),
            fromUserId: fromUserId,
            toUserId: toUserId,
            shipmentId: shipmentId,
            rating: Math.max(1, Math.min(5, rating)), // بين 1 و 5
            review: review,
            createdAt: new Date().toISOString()
        };

        this.ratings.push(ratingData);
        this.updateUserRating(toUserId);
        
        return ratingData;
    }

    getUserRating(userId) {
        const userRatings = this.ratings.filter(r => r.toUserId === userId);
        
        if (userRatings.length === 0) {
            return { average: 5.0, count: 0 };
        }

        const total = userRatings.reduce((sum, r) => sum + r.rating, 0);
        const average = Math.round((total / userRatings.length) * 10) / 10;

        return { average: average, count: userRatings.length };
    }

    updateUserRating(userId) {
        const rating = this.getUserRating(userId);
        
        // تحديث تقييم المستخدم في النظام
        if (window.FastShip) {
            const user = window.FastShip.getUser(userId);
            if (user) {
                user.rating = rating.average;
                user.reviewCount = rating.count;
            }

            // تحديث تقييم الموصل إذا كان موجوداً
            const carrier = window.FastShip.carriers.find(c => c.userId === userId);
            if (carrier) {
                carrier.stats.rating = rating.average;
                carrier.stats.reviewCount = rating.count;
            }
        }
    }
}

// نظام الدفع
class PaymentProcessor {
    constructor() {
        this.transactions = [];
    }

    processPayment(shipmentId, paymentMethod, amount) {
        const transaction = {
            id: Date.now().toString(),
            shipmentId: shipmentId,
            paymentMethod: paymentMethod, // 'cash', 'card', 'bank_transfer', 'wallet'
            amount: amount,
            currency: 'SAR',
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // محاكاة معالجة الدفع
        setTimeout(() => {
            transaction.status = Math.random() > 0.1 ? 'completed' : 'failed';
            transaction.completedAt = new Date().toISOString();
            
            if (window.FastShip) {
                window.FastShip.addNotification(
                    null, // سيتم تحديد المستخدم لاحقاً
                    'payment',
                    'تحديث الدفع',
                    transaction.status === 'completed' ? 'تم الدفع بنجاح' : 'فشل في الدفع',
                    { transactionId: transaction.id }
                );
            }
        }, 2000);

        this.transactions.push(transaction);
        return transaction;
    }

    getTransaction(id) {
        return this.transactions.find(t => t.id === id);
    }
}

// إنشاء مثيل محسن من FastShip
window.FastShipEnhanced = new FastShipEnhanced();

// تصدير الفئة
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FastShipEnhanced;
}