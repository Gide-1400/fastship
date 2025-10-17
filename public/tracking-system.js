// نظام تتبع الشحنات - FastShip Platform
// تتبع متقدم للشحنات مع خرائط تفاعلية وتحديثات لحظية

class TrackingSystem {
    constructor() {
        this.trackingData = {};
        this.map = null;
        this.markers = [];
        this.updateInterval = null;
        this.init();
    }

    init() {
        this.loadTrackingData();
        this.setupEventListeners();
    }

    // تحميل بيانات التتبع
    loadTrackingData() {
        this.trackingData = {
            's1': {
                id: 's1',
                status: 'in_transit',
                currentLocation: {
                    lat: 24.7136,
                    lng: 46.6753,
                    address: 'الرياض، المملكة العربية السعودية'
                },
                pickupLocation: {
                    lat: 24.7136,
                    lng: 46.6753,
                    address: 'الرياض، المملكة العربية السعودية'
                },
                deliveryLocation: {
                    lat: 21.4858,
                    lng: 39.1925,
                    address: 'جدة، المملكة العربية السعودية'
                },
                route: [
                    { lat: 24.7136, lng: 46.6753, timestamp: '2024-01-15T10:00:00', status: 'picked_up' },
                    { lat: 24.5, lng: 46.8, timestamp: '2024-01-15T11:30:00', status: 'in_transit' },
                    { lat: 24.2, lng: 47.1, timestamp: '2024-01-15T13:00:00', status: 'in_transit' },
                    { lat: 23.8, lng: 47.5, timestamp: '2024-01-15T14:30:00', status: 'in_transit' },
                    { lat: 23.2, lng: 48.0, timestamp: '2024-01-15T16:00:00', status: 'in_transit' },
                    { lat: 22.5, lng: 48.5, timestamp: '2024-01-15T17:30:00', status: 'in_transit' },
                    { lat: 21.8, lng: 39.0, timestamp: '2024-01-15T19:00:00', status: 'in_transit' },
                    { lat: 21.4858, lng: 39.1925, timestamp: '2024-01-15T20:00:00', status: 'delivered' }
                ],
                estimatedDelivery: '2024-01-15T20:00:00',
                actualDelivery: null,
                driver: {
                    name: 'خالد السيد',
                    phone: '+966501234567',
                    vehicle: 'تويوتا كامري 2020'
                },
                updates: [
                    {
                        timestamp: '2024-01-15T10:00:00',
                        status: 'picked_up',
                        message: 'تم استلام الشحنة من المرسل',
                        location: 'الرياض'
                    },
                    {
                        timestamp: '2024-01-15T11:30:00',
                        status: 'in_transit',
                        message: 'الشحنة في الطريق إلى الوجهة',
                        location: 'طريق الرياض - جدة'
                    },
                    {
                        timestamp: '2024-01-15T13:00:00',
                        status: 'in_transit',
                        message: 'الشحنة تمر عبر نقطة التفتيش',
                        location: 'نقطة تفتيش الطريق السريع'
                    },
                    {
                        timestamp: '2024-01-15T16:00:00',
                        status: 'in_transit',
                        message: 'الشحنة في منتصف الطريق',
                        location: 'منتصف الطريق بين الرياض وجدة'
                    },
                    {
                        timestamp: '2024-01-15T19:00:00',
                        status: 'in_transit',
                        message: 'الشحنة قريبة من الوجهة',
                        location: 'مدخل جدة'
                    }
                ]
            },
            's2': {
                id: 's2',
                status: 'delivered',
                currentLocation: {
                    lat: 21.4858,
                    lng: 39.1925,
                    address: 'جدة، المملكة العربية السعودية'
                },
                pickupLocation: {
                    lat: 21.4858,
                    lng: 39.1925,
                    address: 'جدة، المملكة العربية السعودية'
                },
                deliveryLocation: {
                    lat: 26.3993,
                    lng: 50.1137,
                    address: 'الدمام، المملكة العربية السعودية'
                },
                route: [
                    { lat: 21.4858, lng: 39.1925, timestamp: '2024-01-14T08:00:00', status: 'picked_up' },
                    { lat: 21.8, lng: 39.5, timestamp: '2024-01-14T09:30:00', status: 'in_transit' },
                    { lat: 22.5, lng: 40.2, timestamp: '2024-01-14T11:00:00', status: 'in_transit' },
                    { lat: 23.5, lng: 41.0, timestamp: '2024-01-14T13:00:00', status: 'in_transit' },
                    { lat: 24.5, lng: 42.0, timestamp: '2024-01-14T15:00:00', status: 'in_transit' },
                    { lat: 25.5, lng: 43.0, timestamp: '2024-01-14T17:00:00', status: 'in_transit' },
                    { lat: 26.0, lng: 49.5, timestamp: '2024-01-14T19:00:00', status: 'in_transit' },
                    { lat: 26.3993, lng: 50.1137, timestamp: '2024-01-14T20:30:00', status: 'delivered' }
                ],
                estimatedDelivery: '2024-01-14T20:00:00',
                actualDelivery: '2024-01-14T20:30:00',
                driver: {
                    name: 'محمد أحمد',
                    phone: '+966502345678',
                    vehicle: 'فورد ترانزيت 2019'
                },
                updates: [
                    {
                        timestamp: '2024-01-14T08:00:00',
                        status: 'picked_up',
                        message: 'تم استلام الشحنة من المرسل',
                        location: 'جدة'
                    },
                    {
                        timestamp: '2024-01-14T11:00:00',
                        status: 'in_transit',
                        message: 'الشحنة في الطريق إلى الوجهة',
                        location: 'طريق جدة - الدمام'
                    },
                    {
                        timestamp: '2024-01-14T15:00:00',
                        status: 'in_transit',
                        message: 'الشحنة تمر عبر نقطة التفتيش',
                        location: 'نقطة تفتيش الطريق السريع'
                    },
                    {
                        timestamp: '2024-01-14T19:00:00',
                        status: 'in_transit',
                        message: 'الشحنة قريبة من الوجهة',
                        location: 'مدخل الدمام'
                    },
                    {
                        timestamp: '2024-01-14T20:30:00',
                        status: 'delivered',
                        message: 'تم تسليم الشحنة للمستلم',
                        location: 'الدمام'
                    }
                ]
            }
        };
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // البحث عن شحنة
        document.getElementById('track-shipment-btn')?.addEventListener('click', () => {
            this.trackShipment();
        });

        // تحديث التتبع
        document.getElementById('refresh-tracking-btn')?.addEventListener('click', () => {
            this.refreshTracking();
        });
    }

    // تتبع شحنة
    trackShipment() {
        const trackingNumber = document.getElementById('tracking-number')?.value;
        if (!trackingNumber) {
            alert('يرجى إدخال رقم التتبع');
            return;
        }

        const shipment = this.trackingData[trackingNumber];
        if (!shipment) {
            alert('رقم التتبع غير صحيح');
            return;
        }

        this.displayTrackingInfo(shipment);
        this.initializeMap(shipment);
        this.startRealTimeTracking(shipment);
    }

    // عرض معلومات التتبع
    displayTrackingInfo(shipment) {
        const container = document.getElementById('tracking-info');
        if (!container) return;

        const statusNames = {
            'pending': 'في الانتظار',
            'picked_up': 'تم الاستلام',
            'in_transit': 'قيد النقل',
            'delivered': 'تم التسليم',
            'cancelled': 'ملغاة'
        };

        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'picked_up': 'bg-blue-100 text-blue-800',
            'in_transit': 'bg-blue-100 text-blue-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };

        container.innerHTML = `
            <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">رقم التتبع: #${shipment.id}</h3>
                        <p class="text-gray-600">آخر تحديث: ${this.formatDateTime(shipment.updates[shipment.updates.length - 1]?.timestamp)}</p>
                    </div>
                    <span class="${statusColors[shipment.status]} text-sm px-3 py-1 rounded-full font-semibold">
                        ${statusNames[shipment.status]}
                    </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <h4 class="font-semibold text-gray-800 mb-2">من</h4>
                        <p class="text-gray-600">${shipment.pickupLocation.address}</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-800 mb-2">إلى</h4>
                        <p class="text-gray-600">${shipment.deliveryLocation.address}</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-800 mb-2">السائق</h4>
                        <p class="text-gray-600">${shipment.driver.name}</p>
                        <p class="text-sm text-gray-500">${shipment.driver.phone}</p>
                    </div>
                </div>

                <div class="mb-6">
                    <h4 class="font-semibold text-gray-800 mb-3">الموقع الحالي</h4>
                    <div class="bg-gray-50 rounded-lg p-4">
                        <div class="flex items-center">
                            <span class="text-2xl ml-3">📍</span>
                            <div>
                                <p class="font-semibold">${shipment.currentLocation.address}</p>
                                <p class="text-sm text-gray-600">آخر تحديث: ${this.formatDateTime(shipment.updates[shipment.updates.length - 1]?.timestamp)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-6">
                    <h4 class="font-semibold text-gray-800 mb-3">توقيت التسليم</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-600">التوقيت المتوقع</p>
                            <p class="font-semibold">${this.formatDateTime(shipment.estimatedDelivery)}</p>
                        </div>
                        ${shipment.actualDelivery ? `
                            <div>
                                <p class="text-sm text-gray-600">التوقيت الفعلي</p>
                                <p class="font-semibold text-green-600">${this.formatDateTime(shipment.actualDelivery)}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="mb-6">
                    <h4 class="font-semibold text-gray-800 mb-3">تحديثات الشحنة</h4>
                    <div class="space-y-4">
                        ${shipment.updates.map(update => `
                            <div class="flex items-start">
                                <div class="w-3 h-3 bg-blue-500 rounded-full mt-2 ml-3"></div>
                                <div class="flex-1">
                                    <div class="flex items-center justify-between">
                                        <p class="font-semibold">${update.message}</p>
                                        <span class="text-sm text-gray-500">${this.formatDateTime(update.timestamp)}</span>
                                    </div>
                                    <p class="text-sm text-gray-600">${update.location}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // تهيئة الخريطة
    initializeMap(shipment) {
        const mapContainer = document.getElementById('tracking-map');
        if (!mapContainer) return;

        // إنشاء الخريطة
        this.map = L.map('tracking-map').setView([shipment.currentLocation.lat, shipment.currentLocation.lng], 8);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // إضافة العلامات
        this.addMapMarkers(shipment);
        
        // إضافة المسار
        this.addRoute(shipment);
    }

    // إضافة علامات الخريطة
    addMapMarkers(shipment) {
        // علامة نقطة الاستلام
        const pickupMarker = L.marker([shipment.pickupLocation.lat, shipment.pickupLocation.lng])
            .addTo(this.map)
            .bindPopup(`
                <div class="text-center">
                    <h3 class="font-bold text-green-600">نقطة الاستلام</h3>
                    <p>${shipment.pickupLocation.address}</p>
                </div>
            `);
        pickupMarker.setIcon(L.divIcon({
            className: 'custom-marker pickup-marker',
            html: '<div class="marker-icon pickup">📦</div>',
            iconSize: [30, 30]
        }));

        // علامة نقطة التسليم
        const deliveryMarker = L.marker([shipment.deliveryLocation.lat, shipment.deliveryLocation.lng])
            .addTo(this.map)
            .bindPopup(`
                <div class="text-center">
                    <h3 class="font-bold text-red-600">نقطة التسليم</h3>
                    <p>${shipment.deliveryLocation.address}</p>
                </div>
            `);
        deliveryMarker.setIcon(L.divIcon({
            className: 'custom-marker delivery-marker',
            html: '<div class="marker-icon delivery">🎯</div>',
            iconSize: [30, 30]
        }));

        // علامة الموقع الحالي
        const currentMarker = L.marker([shipment.currentLocation.lat, shipment.currentLocation.lng])
            .addTo(this.map)
            .bindPopup(`
                <div class="text-center">
                    <h3 class="font-bold text-blue-600">الموقع الحالي</h3>
                    <p>${shipment.currentLocation.address}</p>
                    <p class="text-sm text-gray-600">آخر تحديث: ${this.formatDateTime(shipment.updates[shipment.updates.length - 1]?.timestamp)}</p>
                </div>
            `);
        currentMarker.setIcon(L.divIcon({
            className: 'custom-marker current-marker',
            html: '<div class="marker-icon current">🚚</div>',
            iconSize: [30, 30]
        }));

        this.markers = [pickupMarker, deliveryMarker, currentMarker];
    }

    // إضافة المسار
    addRoute(shipment) {
        if (shipment.route && shipment.route.length > 1) {
            const routeCoordinates = shipment.route.map(point => [point.lat, point.lng]);
            
            const route = L.polyline(routeCoordinates, {
                color: '#3b82f6',
                weight: 3,
                opacity: 0.7
            }).addTo(this.map);

            // إضافة نقاط المسار
            shipment.route.forEach((point, index) => {
                if (point.status === 'in_transit') {
                    L.circleMarker([point.lat, point.lng], {
                        radius: 4,
                        color: '#3b82f6',
                        fillColor: '#3b82f6',
                        fillOpacity: 0.7
                    }).addTo(this.map).bindPopup(`
                        <div class="text-center">
                            <p class="text-sm font-semibold">نقطة المسار ${index + 1}</p>
                            <p class="text-xs text-gray-600">${this.formatDateTime(point.timestamp)}</p>
                        </div>
                    `);
                }
            });
        }
    }

    // بدء التتبع في الوقت الفعلي
    startRealTimeTracking(shipment) {
        if (shipment.status === 'delivered') return;

        this.updateInterval = setInterval(() => {
            this.updateTracking(shipment);
        }, 30000); // تحديث كل 30 ثانية
    }

    // تحديث التتبع
    updateTracking(shipment) {
        if (shipment.status === 'delivered') {
            clearInterval(this.updateInterval);
            return;
        }

        // محاكاة تحديث الموقع
        this.simulateLocationUpdate(shipment);
        this.updateMap(shipment);
        this.updateTrackingInfo(shipment);
    }

    // محاكاة تحديث الموقع
    simulateLocationUpdate(shipment) {
        const currentIndex = shipment.route.findIndex(point => 
            point.lat === shipment.currentLocation.lat && 
            point.lng === shipment.currentLocation.lng
        );

        if (currentIndex < shipment.route.length - 1) {
            const nextPoint = shipment.route[currentIndex + 1];
            shipment.currentLocation = {
                lat: nextPoint.lat,
                lng: nextPoint.lng,
                address: this.getAddressFromCoordinates(nextPoint.lat, nextPoint.lng)
            };

            // إضافة تحديث جديد
            shipment.updates.push({
                timestamp: new Date().toISOString(),
                status: nextPoint.status,
                message: this.getStatusMessage(nextPoint.status),
                location: shipment.currentLocation.address
            });

            // تحديث حالة الشحنة
            if (nextPoint.status === 'delivered') {
                shipment.status = 'delivered';
                shipment.actualDelivery = new Date().toISOString();
            }
        }
    }

    // الحصول على عنوان من الإحداثيات
    getAddressFromCoordinates(lat, lng) {
        // محاكاة الحصول على العنوان
        const addresses = [
            'الرياض، المملكة العربية السعودية',
            'طريق الرياض - جدة',
            'نقطة تفتيش الطريق السريع',
            'منتصف الطريق بين الرياض وجدة',
            'مدخل جدة',
            'جدة، المملكة العربية السعودية'
        ];
        
        return addresses[Math.floor(Math.random() * addresses.length)];
    }

    // الحصول على رسالة الحالة
    getStatusMessage(status) {
        const messages = {
            'picked_up': 'تم استلام الشحنة من المرسل',
            'in_transit': 'الشحنة في الطريق إلى الوجهة',
            'delivered': 'تم تسليم الشحنة للمستلم'
        };
        
        return messages[status] || 'الشحنة في الطريق';
    }

    // تحديث الخريطة
    updateMap(shipment) {
        if (!this.map) return;

        // تحديث موقع العلامة الحالية
        const currentMarker = this.markers[2];
        if (currentMarker) {
            currentMarker.setLatLng([shipment.currentLocation.lat, shipment.currentLocation.lng]);
            currentMarker.bindPopup(`
                <div class="text-center">
                    <h3 class="font-bold text-blue-600">الموقع الحالي</h3>
                    <p>${shipment.currentLocation.address}</p>
                    <p class="text-sm text-gray-600">آخر تحديث: ${this.formatDateTime(shipment.updates[shipment.updates.length - 1]?.timestamp)}</p>
                </div>
            `);
        }
    }

    // تحديث معلومات التتبع
    updateTrackingInfo(shipment) {
        this.displayTrackingInfo(shipment);
    }

    // تحديث التتبع
    refreshTracking() {
        const trackingNumber = document.getElementById('tracking-number')?.value;
        if (trackingNumber && this.trackingData[trackingNumber]) {
            this.trackShipment();
        }
    }

    // تنسيق التاريخ والوقت
    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA') + ' ' + date.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // إيقاف التتبع
    stopTracking() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // تنظيف الموارد
    cleanup() {
        this.stopTracking();
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        this.markers = [];
    }
}

// إنشاء مثيل عام للنظام
window.trackingSystem = new TrackingSystem();

// تصدير الكلاس للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrackingSystem;
}