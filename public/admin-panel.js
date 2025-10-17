// مدير لوحة الإدارة - FastShip Platform
// إدارة شاملة للشركات والأساطيل

class AdminPanelManager {
    constructor() {
        this.currentUser = null;
        this.fleet = [];
        this.shipments = [];
        this.drivers = [];
        this.analytics = {};
        this.init();
    }

    init() {
        this.loadUserData();
        this.loadFleetData();
        this.loadShipmentsData();
        this.loadDriversData();
        this.loadAnalyticsData();
        this.setupEventListeners();
    }

    // تحميل بيانات المستخدم
    loadUserData() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    // تحميل بيانات الأسطول
    loadFleetData() {
        this.fleet = [
            {
                id: 'v1',
                type: 'truck',
                name: 'شاحنة فورد ترانزيت',
                plateNumber: 'ABC-123',
                capacity: 2000,
                volume: 3.0,
                status: 'active',
                driver: {
                    id: 'd1',
                    name: 'محمد أحمد',
                    phone: '+966501234567'
                },
                location: {
                    city: 'الرياض',
                    coordinates: [24.7136, 46.6753]
                },
                lastMaintenance: '2024-01-01',
                nextMaintenance: '2024-04-01',
                mileage: 45000,
                fuelEfficiency: 8.5
            },
            {
                id: 'v2',
                type: 'trailer',
                name: 'تريلة مرسيدس',
                plateNumber: 'XYZ-789',
                capacity: 25000,
                volume: 40.0,
                status: 'in_transit',
                driver: {
                    id: 'd2',
                    name: 'عبدالله الراشد',
                    phone: '+966502345678'
                },
                location: {
                    city: 'جدة',
                    coordinates: [21.4858, 39.1925]
                },
                lastMaintenance: '2023-12-15',
                nextMaintenance: '2024-03-15',
                mileage: 120000,
                fuelEfficiency: 12.0
            },
            {
                id: 'v3',
                type: 'plane',
                name: 'طائرة شحن',
                registration: 'FS-001',
                capacity: 50000,
                volume: 100.0,
                status: 'maintenance',
                pilot: {
                    id: 'p1',
                    name: 'أحمد الطيار',
                    license: 'ATPL-12345'
                },
                location: {
                    city: 'الرياض',
                    coordinates: [24.7136, 46.6753]
                },
                lastMaintenance: '2024-01-10',
                nextMaintenance: '2024-01-20',
                flightHours: 2500,
                fuelEfficiency: 150.0
            }
        ];
    }

    // تحميل بيانات الشحنات
    loadShipmentsData() {
        this.shipments = [
            {
                id: 's1',
                type: 'medium',
                description: 'أجهزة إلكترونية',
                weight: 50,
                volume: 0.3,
                value: 5000,
                pickupLocation: 'الرياض',
                deliveryLocation: 'جدة',
                status: 'completed',
                createdAt: '2024-01-15T10:00:00',
                completedAt: '2024-01-15T18:00:00',
                vehicle: 'v1',
                driver: 'محمد أحمد',
                estimatedPrice: 45.00,
                actualPrice: 45.00
            },
            {
                id: 's2',
                type: 'large',
                description: 'أثاث منزلي',
                weight: 500,
                volume: 2.5,
                value: 15000,
                pickupLocation: 'جدة',
                deliveryLocation: 'الدمام',
                status: 'in_transit',
                createdAt: '2024-01-16T08:00:00',
                vehicle: 'v2',
                driver: 'عبدالله الراشد',
                estimatedPrice: 180.00,
                actualPrice: 180.00
            },
            {
                id: 's3',
                type: 'small',
                description: 'مستندات مهمة',
                weight: 5,
                volume: 0.01,
                value: 1000,
                pickupLocation: 'الدمام',
                deliveryLocation: 'الرياض',
                status: 'pending',
                createdAt: '2024-01-17T14:00:00',
                estimatedPrice: 15.00
            }
        ];
    }

    // تحميل بيانات السائقين
    loadDriversData() {
        this.drivers = [
            {
                id: 'd1',
                name: 'محمد أحمد',
                phone: '+966501234567',
                licenseNumber: 'DL-12345',
                licenseType: 'heavy_vehicle',
                experience: 5,
                rating: 4.8,
                totalTrips: 156,
                status: 'active',
                vehicle: 'v1',
                joinDate: '2023-01-15',
                lastTrip: '2024-01-15T18:00:00'
            },
            {
                id: 'd2',
                name: 'عبدالله الراشد',
                phone: '+966502345678',
                licenseNumber: 'DL-67890',
                licenseType: 'heavy_vehicle',
                experience: 8,
                rating: 4.9,
                totalTrips: 203,
                status: 'active',
                vehicle: 'v2',
                joinDate: '2022-06-10',
                lastTrip: '2024-01-16T12:00:00'
            },
            {
                id: 'p1',
                name: 'أحمد الطيار',
                phone: '+966503456789',
                licenseNumber: 'ATPL-12345',
                licenseType: 'aircraft',
                experience: 12,
                rating: 4.9,
                totalTrips: 89,
                status: 'maintenance',
                vehicle: 'v3',
                joinDate: '2021-03-20',
                lastTrip: '2024-01-10T16:00:00'
            }
        ];
    }

    // تحميل بيانات التحليلات
    loadAnalyticsData() {
        this.analytics = {
            totalVehicles: this.fleet.length,
            activeVehicles: this.fleet.filter(v => v.status === 'active').length,
            totalShipments: this.shipments.length,
            completedShipments: this.shipments.filter(s => s.status === 'completed').length,
            pendingShipments: this.shipments.filter(s => s.status === 'pending').length,
            inTransitShipments: this.shipments.filter(s => s.status === 'in_transit').length,
            totalRevenue: this.calculateTotalRevenue(),
            monthlyRevenue: this.getMonthlyRevenue(),
            averageRating: this.calculateAverageRating(),
            fuelEfficiency: this.calculateFuelEfficiency(),
            maintenanceSchedule: this.getMaintenanceSchedule()
        };
    }

    // حساب إجمالي الإيرادات
    calculateTotalRevenue() {
        return this.shipments
            .filter(s => s.status === 'completed')
            .reduce((total, s) => total + s.actualPrice, 0);
    }

    // الحصول على الإيرادات الشهرية
    getMonthlyRevenue() {
        return {
            current: 45678,
            previous: 42345,
            growth: 7.9
        };
    }

    // حساب متوسط التقييم
    calculateAverageRating() {
        if (this.drivers.length === 0) return 0;
        const totalRating = this.drivers.reduce((sum, d) => sum + d.rating, 0);
        return totalRating / this.drivers.length;
    }

    // حساب كفاءة الوقود
    calculateFuelEfficiency() {
        if (this.fleet.length === 0) return 0;
        const totalEfficiency = this.fleet.reduce((sum, v) => sum + v.fuelEfficiency, 0);
        return totalEfficiency / this.fleet.length;
    }

    // الحصول على جدول الصيانة
    getMaintenanceSchedule() {
        return this.fleet
            .filter(v => v.nextMaintenance)
            .map(v => ({
                vehicle: v.name,
                nextMaintenance: v.nextMaintenance,
                daysUntil: this.daysUntil(v.nextMaintenance)
            }))
            .sort((a, b) => a.daysUntil - b.daysUntil);
    }

    // حساب الأيام المتبقية
    daysUntil(dateString) {
        const today = new Date();
        const targetDate = new Date(dateString);
        const diffTime = targetDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // يمكن إضافة مستمعي الأحداث الإضافية هنا
    }

    // إضافة مركبة جديدة
    addVehicle(vehicleData) {
        const newVehicle = {
            id: 'v' + (this.fleet.length + 1),
            ...vehicleData,
            status: 'active',
            mileage: 0,
            fuelEfficiency: 0
        };
        
        this.fleet.push(newVehicle);
        this.updateFleetDisplay();
        return newVehicle;
    }

    // تحديث عرض الأسطول
    updateFleetDisplay() {
        const container = document.getElementById('fleet-list');
        if (!container) return;

        container.innerHTML = this.fleet.map(vehicle => this.createVehicleCard(vehicle)).join('');
    }

    // إنشاء بطاقة المركبة
    createVehicleCard(vehicle) {
        const statusColors = {
            'active': 'text-green-600',
            'in_transit': 'text-blue-600',
            'maintenance': 'text-yellow-600',
            'inactive': 'text-red-600'
        };

        const statusNames = {
            'active': 'نشطة',
            'in_transit': 'في الطريق',
            'maintenance': 'صيانة',
            'inactive': 'غير نشطة'
        };

        return `
            <div class="fleet-vehicle p-6">
                <div class="flex items-center mb-4">
                    <div class="text-3xl ml-3">${this.getVehicleIcon(vehicle.type)}</div>
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">${vehicle.name}</h3>
                        <p class="text-sm text-gray-600">${vehicle.plateNumber || vehicle.registration}</p>
                    </div>
                </div>
                <div class="space-y-2 mb-4">
                    <div class="flex justify-between">
                        <span class="text-gray-600">السعة:</span>
                        <span class="font-semibold">${vehicle.capacity.toLocaleString()} كجم</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">الحالة:</span>
                        <span class="${statusColors[vehicle.status]} font-semibold">${statusNames[vehicle.status]}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">السائق:</span>
                        <span class="font-semibold">${vehicle.driver?.name || vehicle.pilot?.name || 'غير محدد'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">الموقع:</span>
                        <span class="font-semibold">${vehicle.location.city}</span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors" 
                            onclick="editVehicle('${vehicle.id}')">
                        تعديل
                    </button>
                    <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm transition-colors" 
                            onclick="viewVehicleDetails('${vehicle.id}')">
                        تفاصيل
                    </button>
                </div>
            </div>
        `;
    }

    // الحصول على أيقونة المركبة
    getVehicleIcon(type) {
        const icons = {
            'truck': '🚚',
            'trailer': '🚛',
            'van': '🚐',
            'car': '🚗',
            'plane': '✈️',
            'ship': '🚢',
            'train': '🚂'
        };
        return icons[type] || '🚚';
    }

    // تحديث حالة المركبة
    updateVehicleStatus(vehicleId, newStatus) {
        const vehicle = this.fleet.find(v => v.id === vehicleId);
        if (vehicle) {
            vehicle.status = newStatus;
            this.updateFleetDisplay();
        }
    }

    // إضافة سائق جديد
    addDriver(driverData) {
        const newDriver = {
            id: 'd' + (this.drivers.length + 1),
            ...driverData,
            status: 'active',
            rating: 5.0,
            totalTrips: 0,
            joinDate: new Date().toISOString().split('T')[0]
        };
        
        this.drivers.push(newDriver);
        this.updateDriversDisplay();
        return newDriver;
    }

    // تحديث عرض السائقين
    updateDriversDisplay() {
        const container = document.getElementById('drivers-list');
        if (!container) return;

        container.innerHTML = this.drivers.map(driver => this.createDriverCard(driver)).join('');
    }

    // إنشاء بطاقة السائق
    createDriverCard(driver) {
        const ratingStars = '★'.repeat(Math.floor(driver.rating)) + '☆'.repeat(5 - Math.floor(driver.rating));
        
        return `
            <div class="admin-card p-6">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                        <span class="text-blue-600 font-bold">${driver.name.charAt(0)}</span>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-lg font-bold text-gray-800">${driver.name}</h3>
                        <p class="text-sm text-gray-600">${driver.phone}</p>
                    </div>
                </div>
                
                <div class="space-y-2 mb-4">
                    <div class="flex justify-between">
                        <span class="text-gray-600">رخصة القيادة:</span>
                        <span class="font-semibold">${driver.licenseNumber}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">الخبرة:</span>
                        <span class="font-semibold">${driver.experience} سنوات</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">التقييم:</span>
                        <span class="font-semibold">${ratingStars} ${driver.rating}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">إجمالي الرحلات:</span>
                        <span class="font-semibold">${driver.totalTrips}</span>
                    </div>
                </div>
                
                <div class="flex gap-2">
                    <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors" 
                            onclick="editDriver('${driver.id}')">
                        تعديل
                    </button>
                    <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm transition-colors" 
                            onclick="viewDriverDetails('${driver.id}')">
                        تفاصيل
                    </button>
                </div>
            </div>
        `;
    }

    // تحديث عرض الشحنات
    updateShipmentsDisplay() {
        const container = document.getElementById('shipments-list');
        if (!container) return;

        container.innerHTML = this.shipments.map(shipment => this.createShipmentRow(shipment)).join('');
    }

    // إنشاء صف الشحنة
    createShipmentRow(shipment) {
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'in_transit': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };

        const statusNames = {
            'pending': 'معلقة',
            'in_transit': 'قيد النقل',
            'completed': 'مكتملة',
            'cancelled': 'ملغاة'
        };

        return `
            <tr class="border-b border-gray-100">
                <td class="py-3 px-4">#${shipment.id}</td>
                <td class="py-3 px-4">${this.getShipmentTypeIcon(shipment.type)} ${this.getShipmentTypeName(shipment.type)}</td>
                <td class="py-3 px-4">${shipment.weight} كجم</td>
                <td class="py-3 px-4">${shipment.pickupLocation}</td>
                <td class="py-3 px-4">${shipment.deliveryLocation}</td>
                <td class="py-3 px-4">
                    <span class="${statusColors[shipment.status]} text-xs px-2 py-1 rounded-full">${statusNames[shipment.status]}</span>
                </td>
                <td class="py-3 px-4">
                    <button class="text-blue-600 hover:text-blue-800 text-sm" onclick="viewShipmentDetails('${shipment.id}')">عرض</button>
                </td>
            </tr>
        `;
    }

    // الحصول على أيقونة نوع الشحنة
    getShipmentTypeIcon(type) {
        const icons = {
            'small': '🎒',
            'medium': '📦',
            'large': '🚚',
            'massive': '🏢'
        };
        return icons[type] || '📦';
    }

    // الحصول على اسم نوع الشحنة
    getShipmentTypeName(type) {
        const names = {
            'small': 'صغيرة',
            'medium': 'متوسطة',
            'large': 'كبيرة',
            'massive': 'عملاقة'
        };
        return names[type] || 'غير محدد';
    }

    // تحديث الإحصائيات
    updateAnalytics() {
        this.loadAnalyticsData();
        this.updateAnalyticsDisplay();
    }

    // تحديث عرض التحليلات
    updateAnalyticsDisplay() {
        // تحديث البطاقات الإحصائية
        document.getElementById('total-vehicles').textContent = this.analytics.totalVehicles;
        document.getElementById('active-vehicles').textContent = this.analytics.activeVehicles;
        document.getElementById('total-shipments').textContent = this.analytics.totalShipments;
        document.getElementById('completed-shipments').textContent = this.analytics.completedShipments;
        document.getElementById('total-revenue').textContent = this.analytics.totalRevenue.toLocaleString();
    }
}

// إنشاء مثيل عام للمدير
window.adminPanelManager = new AdminPanelManager();

// تصدير الكلاس للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminPanelManager;
}