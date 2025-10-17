// نظام التتبع المباشر للشحنات
class TrackingManager {
    constructor() {
        this.trackingData = new Map();
        this.updateInterval = 30000; // 30 ثانية
        this.init();
    }

    init() {
        this.loadTrackingData();
        this.startTrackingUpdates();
    }

    // بدء تتبع شحنة جديدة
    startTracking(shipmentId, travelerId, route) {
        const trackingId = 'TRK-' + Date.now();
        
        const trackingInfo = {
            id: trackingId,
            shipmentId: shipmentId,
            travelerId: travelerId,
            route: route,
            status: 'picked_up',
            currentLocation: route.from,
            progress: 0,
            estimatedArrival: this.calculateETA(route),
            updates: [{
                timestamp: new Date().toISOString(),
                status: 'picked_up',
                location: route.from,
                message: 'تم استلام الشحنة من المرسل'
            }],
            createdAt: new Date().toISOString()
        };

        this.trackingData.set(shipmentId, trackingInfo);
        this.saveTrackingData();
        
        return trackingId;
    }

    // تحديث موقع الشحنة
    updateLocation(shipmentId, location, status = null) {
        const tracking = this.trackingData.get(shipmentId);
        if (!tracking) return false;

        const oldLocation = tracking.currentLocation;
        tracking.currentLocation = location;
        
        if (status) {
            tracking.status = status;
        }

        // حساب التقدم
        tracking.progress = this.calculateProgress(tracking.route, location);

        // إضافة تحديث جديد
        tracking.updates.push({
            timestamp: new Date().toISOString(),
            status: tracking.status,
            location: location,
            message: this.getStatusMessage(tracking.status, location),
            progress: tracking.progress
        });

        this.saveTrackingData();
        this.notifyStakeholders(shipmentId, tracking);
        
        return true;
    }

    // حساب التقدم
    calculateProgress(route, currentLocation) {
        const routePoints = this.getRoutePoints(route);
        const currentIndex = routePoints.findIndex(point => point.city === currentLocation);
        
        if (currentIndex === -1) return 0;
        if (currentIndex === routePoints.length - 1) return 100;
        
        return Math.round((currentIndex / (routePoints.length - 1)) * 100);
    }

    // الحصول على نقاط المسار
    getRoutePoints(route) {
        const routes = {
            'الرياض → جدة': [
                { city: 'الرياض', lat: 24.7136, lng: 46.6753 },
                { city: 'الطائف', lat: 21.2703, lng: 40.4158 },
                { city: 'مكة', lat: 21.4225, lng: 39.8262 },
                { city: 'جدة', lat: 21.4858, lng: 39.1925 }
            ],
            'جدة → الدمام': [
                { city: 'جدة', lat: 21.4858, lng: 39.1925 },
                { city: 'الرياض', lat: 24.7136, lng: 46.6753 },
                { city: 'الدمام', lat: 26.3993, lng: 50.1137 }
            ],
            'مكة → المدينة': [
                { city: 'مكة', lat: 21.4225, lng: 39.8262 },
                { city: 'المدينة', lat: 24.5247, lng: 39.5692 }
            ]
        };

        return routes[route] || [
            { city: route.from, lat: 0, lng: 0 },
            { city: route.to, lat: 0, lng: 0 }
        ];
    }

    // حساب وقت الوصول المتوقع
    calculateETA(route) {
        const routePoints = this.getRoutePoints(route);
        const baseTime = routePoints.length * 2; // ساعتان لكل نقطة
        const eta = new Date(Date.now() + baseTime * 60 * 60 * 1000);
        return eta.toISOString();
    }

    // الحصول على رسالة الحالة
    getStatusMessage(status, location) {
        const messages = {
            'picked_up': `تم استلام الشحنة من ${location}`,
            'in_transit': `الشحنة في الطريق من ${location}`,
            'arrived': `وصلت الشحنة إلى ${location}`,
            'delivered': `تم تسليم الشحنة في ${location}`,
            'delayed': `تأخر في ${location}`,
            'cancelled': `تم إلغاء الشحنة في ${location}`
        };

        return messages[status] || `تحديث من ${location}`;
    }

    // إشعار الأطراف المعنية
    notifyStakeholders(shipmentId, tracking) {
        // إضافة إشعار للمرسل
        this.addNotification({
            type: 'tracking_update',
            title: 'تحديث الشحنة',
            message: tracking.updates[tracking.updates.length - 1].message,
            shipmentId: shipmentId,
            timestamp: new Date().toISOString()
        });

        // في التطبيق الحقيقي، هنا سنرسل إشعارات push أو SMS
        console.log(`تحديث الشحنة ${shipmentId}: ${tracking.updates[tracking.updates.length - 1].message}`);
    }

    // إضافة إشعار
    addNotification(notification) {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.unshift(notification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    // الحصول على معلومات التتبع
    getTrackingInfo(shipmentId) {
        return this.trackingData.get(shipmentId);
    }

    // الحصول على جميع الشحنات المتتبعة
    getAllTrackedShipments() {
        return Array.from(this.trackingData.values());
    }

    // حفظ بيانات التتبع
    saveTrackingData() {
        const data = Array.from(this.trackingData.entries());
        localStorage.setItem('trackingData', JSON.stringify(data));
    }

    // تحميل بيانات التتبع
    loadTrackingData() {
        const data = localStorage.getItem('trackingData');
        if (data) {
            const entries = JSON.parse(data);
            this.trackingData = new Map(entries);
        }
    }

    // بدء تحديثات التتبع
    startTrackingUpdates() {
        setInterval(() => {
            this.updateAllTrackings();
        }, this.updateInterval);
    }

    // تحديث جميع الشحنات المتتبعة
    updateAllTrackings() {
        this.trackingData.forEach((tracking, shipmentId) => {
            if (tracking.status === 'in_transit') {
                // محاكاة تحديث الموقع
                this.simulateLocationUpdate(shipmentId, tracking);
            }
        });
    }

    // محاكاة تحديث الموقع
    simulateLocationUpdate(shipmentId, tracking) {
        const routePoints = this.getRoutePoints(tracking.route);
        const currentIndex = routePoints.findIndex(point => point.city === tracking.currentLocation);
        
        if (currentIndex < routePoints.length - 1) {
            const nextLocation = routePoints[currentIndex + 1];
            this.updateLocation(shipmentId, nextLocation.city);
        } else if (tracking.status === 'in_transit') {
            // وصلت للوجهة
            this.updateLocation(shipmentId, tracking.route.to, 'arrived');
        }
    }

    // إنهاء التتبع
    endTracking(shipmentId, finalStatus = 'delivered') {
        const tracking = this.trackingData.get(shipmentId);
        if (!tracking) return false;

        tracking.status = finalStatus;
        tracking.progress = 100;
        tracking.endedAt = new Date().toISOString();

        tracking.updates.push({
            timestamp: new Date().toISOString(),
            status: finalStatus,
            location: tracking.route.to,
            message: this.getStatusMessage(finalStatus, tracking.route.to),
            progress: 100
        });

        this.saveTrackingData();
        this.notifyStakeholders(shipmentId, tracking);
        
        return true;
    }

    // إلغاء التتبع
    cancelTracking(shipmentId, reason) {
        const tracking = this.trackingData.get(shipmentId);
        if (!tracking) return false;

        tracking.status = 'cancelled';
        tracking.cancelledAt = new Date().toISOString();
        tracking.cancelReason = reason;

        tracking.updates.push({
            timestamp: new Date().toISOString(),
            status: 'cancelled',
            location: tracking.currentLocation,
            message: `تم إلغاء الشحنة: ${reason}`,
            progress: tracking.progress
        });

        this.saveTrackingData();
        this.notifyStakeholders(shipmentId, tracking);
        
        return true;
    }

    // الحصول على إحصائيات التتبع
    getTrackingStats() {
        const allTrackings = Array.from(this.trackingData.values());
        
        return {
            total: allTrackings.length,
            inTransit: allTrackings.filter(t => t.status === 'in_transit').length,
            delivered: allTrackings.filter(t => t.status === 'delivered').length,
            cancelled: allTrackings.filter(t => t.status === 'cancelled').length,
            averageDeliveryTime: this.calculateAverageDeliveryTime(allTrackings)
        };
    }

    // حساب متوسط وقت التسليم
    calculateAverageDeliveryTime(trackings) {
        const delivered = trackings.filter(t => t.status === 'delivered' && t.endedAt);
        if (delivered.length === 0) return 0;

        const totalTime = delivered.reduce((sum, tracking) => {
            const start = new Date(tracking.createdAt);
            const end = new Date(tracking.endedAt);
            return sum + (end - start);
        }, 0);

        return Math.round(totalTime / delivered.length / (1000 * 60 * 60)); // بالساعات
    }
}

// تهيئة نظام التتبع
window.trackingManager = new TrackingManager();

// دوال مساعدة للواجهة
function showTrackingModal(shipmentId) {
    const tracking = window.trackingManager.getTrackingInfo(shipmentId);
    if (!tracking) {
        showNotification('لا توجد معلومات تتبع لهذه الشحنة', 'error');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-gray-800">تتبع الشحنة</h3>
                <button onclick="closeTrackingModal()" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            
            <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-lg font-semibold">رقم الشحنة: ${tracking.shipmentId}</span>
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${
                        tracking.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        tracking.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                        tracking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }">
                        ${getStatusText(tracking.status)}
                    </span>
                </div>
                
                <div class="mb-4">
                    <div class="flex justify-between text-sm text-gray-600 mb-2">
                        <span>من: ${tracking.route.from}</span>
                        <span>إلى: ${tracking.route.to}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                             style="width: ${tracking.progress}%"></div>
                    </div>
                    <div class="text-center text-sm text-gray-600 mt-1">${tracking.progress}% مكتمل</div>
                </div>
            </div>

            <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-800">سجل التتبع</h4>
                <div class="space-y-3">
                    ${tracking.updates.map(update => `
                        <div class="flex items-start space-x-4 space-x-reverse">
                            <div class="flex-shrink-0 w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                            <div class="flex-1">
                                <div class="flex justify-between items-start">
                                    <p class="text-gray-800 font-medium">${update.message}</p>
                                    <span class="text-sm text-gray-500">${formatTime(update.timestamp)}</span>
                                </div>
                                <p class="text-sm text-gray-600">${update.location}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeTrackingModal() {
    const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    if (modal) {
        modal.remove();
    }
}

function getStatusText(status) {
    const statusTexts = {
        'picked_up': 'تم الاستلام',
        'in_transit': 'في الطريق',
        'arrived': 'وصلت للوجهة',
        'delivered': 'تم التسليم',
        'delayed': 'متأخرة',
        'cancelled': 'ملغاة'
    };
    return statusTexts[status] || status;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// دالة عرض الإشعارات
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}