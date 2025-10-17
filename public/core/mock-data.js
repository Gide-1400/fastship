// mock-data.js - بيانات تجريبية لمنصة FastShip

/**
 * مدن السعودية الرئيسية مع الإحداثيات
 */
const saudiCities = [
    { city: 'الرياض', region: 'الرياض', lat: 24.7136, lng: 46.6753 },
    { city: 'جدة', region: 'مكة المكرمة', lat: 21.5169, lng: 39.2192 },
    { city: 'مكة المكرمة', region: 'مكة المكرمة', lat: 21.3891, lng: 39.8579 },
    { city: 'المدينة المنورة', region: 'المدينة المنورة', lat: 24.5247, lng: 39.5692 },
    { city: 'الدمام', region: 'الشرقية', lat: 26.4207, lng: 50.0888 },
    { city: 'الخبر', region: 'الشرقية', lat: 26.2172, lng: 50.1971 },
    { city: 'الطائف', region: 'مكة المكرمة', lat: 21.2703, lng: 40.4158 },
    { city: 'تبوك', region: 'تبوك', lat: 28.3835, lng: 36.5555 },
    { city: 'بريدة', region: 'القصيم', lat: 26.3260, lng: 43.9750 },
    { city: 'أبها', region: 'عسير', lat: 18.2156, lng: 42.5053 }
];

/**
 * مستخدمين تجريبيين
 */
const mockUsers = [
    {
        id: 'USR-001',
        name: 'أحمد محمد العتيبي',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        accountType: 'shipper',
        rating: 4.8,
        totalShipments: 45,
        joinedDate: '2023-01-15',
        verified: true
    },
    {
        id: 'USR-002',
        name: 'فاطمة الزهراني',
        email: 'fatima@example.com',
        phone: '+966502345678',
        accountType: 'traveler',
        rating: 4.9,
        totalTrips: 120,
        joinedDate: '2022-08-20',
        verified: true
    },
    {
        id: 'USR-003',
        name: 'خالد السيد',
        email: 'khaled@example.com',
        phone: '+966503456789',
        accountType: 'traveler',
        rating: 4.7,
        totalTrips: 85,
        joinedDate: '2023-03-10',
        verified: true
    }
];

/**
 * موصلين تجريبيين
 */
const mockCarriers = [
    {
        id: 'CAR-001',
        userId: 'USR-002',
        type: 'regular_traveler',
        vehicle: 'حافلة',
        vehiclePlate: 'أ ب ج 1234',
        capacity: 20,
        availableSpace: 15,
        licenses: ['رخصة سياقة عامة'],
        insurance: { provider: 'التعاونية', policyNumber: 'INS-12345' },
        rating: 4.9,
        totalTrips: 120,
        isVerified: true
    },
    {
        id: 'CAR-002',
        userId: 'USR-003',
        type: 'private_car',
        vehicle: 'سيارة خاصة',
        vehiclePlate: 'هـ و ز 5678',
        capacity: 500,
        availableSpace: 400,
        licenses: ['رخصة سياقة خاصة'],
        insurance: { provider: 'سلامة', policyNumber: 'INS-67890' },
        rating: 4.7,
        totalTrips: 85,
        isVerified: true
    },
    {
        id: 'CAR-003',
        userId: 'USR-004',
        type: 'truck_owner',
        vehicle: 'شاحنة متوسطة',
        vehiclePlate: 'ح ط ي 9012',
        capacity: 10000,
        availableSpace: 8000,
        licenses: ['رخصة نقل عام', 'رخصة نقل بضائع'],
        insurance: { provider: 'الراجحي', policyNumber: 'INS-34567' },
        rating: 4.8,
        totalTrips: 200,
        isVerified: true
    }
];

/**
 * رحلات تجريبية
 */
const mockTrips = [
    {
        id: 'TRP-001',
        carrierId: 'CAR-001',
        fromLocation: new window.FastShipModels.Location(saudiCities[0]), // الرياض
        toLocation: new window.FastShipModels.Location(saudiCities[1]), // جدة
        departureDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // غداً
        arrivalDate: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
        availableSpace: 15,
        maxShipments: 5,
        shipments: [],
        status: 'active',
        pricing: {
            basePrice: 50,
            pricePerKm: 2
        }
    },
    {
        id: 'TRP-002',
        carrierId: 'CAR-002',
        fromLocation: new window.FastShipModels.Location(saudiCities[4]), // الدمام
        toLocation: new window.FastShipModels.Location(saudiCities[0]), // الرياض
        departureDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // بعد يومين
        arrivalDate: new Date(Date.now() + 54 * 60 * 60 * 1000).toISOString(),
        availableSpace: 400,
        maxShipments: 10,
        shipments: [],
        status: 'active',
        pricing: {
            basePrice: 100,
            pricePerKm: 1.5
        }
    },
    {
        id: 'TRP-003',
        carrierId: 'CAR-003',
        fromLocation: new window.FastShipModels.Location(saudiCities[1]), // جدة
        toLocation: new window.FastShipModels.Location(saudiCities[3]), // المدينة
        departureDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // اليوم
        arrivalDate: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
        availableSpace: 8000,
        maxShipments: 15,
        shipments: [],
        status: 'active',
        pricing: {
            basePrice: 200,
            pricePerKm: 1
        }
    }
];

/**
 * شحنات تجريبية
 */
const mockShipments = [
    {
        id: 'SHP-001',
        senderId: 'USR-001',
        category: 'electronics',
        weight: 5,
        dimensions: { length: 30, width: 20, height: 10 },
        fromLocation: new window.FastShipModels.Location(saudiCities[0]), // الرياض
        toLocation: new window.FastShipModels.Location(saudiCities[1]), // جدة
        pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        deliveryDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        description: 'جهاز لابتوب - Dell XPS 15',
        images: [],
        specialInstructions: 'يرجى التعامل بحذر - جهاز هش',
        value: 5000,
        insuranceRequired: true,
        status: 'pending',
        createdAt: new Date().toISOString()
    },
    {
        id: 'SHP-002',
        senderId: 'USR-001',
        category: 'documents',
        weight: 2,
        dimensions: { length: 30, width: 21, height: 5 },
        fromLocation: new window.FastShipModels.Location(saudiCities[4]), // الدمام
        toLocation: new window.FastShipModels.Location(saudiCities[0]), // الرياض
        pickupDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        deliveryDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        description: 'مستندات رسمية - عقود',
        images: [],
        specialInstructions: 'مستندات مهمة - سرية',
        value: 0,
        insuranceRequired: false,
        status: 'pending',
        createdAt: new Date().toISOString()
    },
    {
        id: 'SHP-003',
        senderId: 'USR-001',
        category: 'clothes',
        weight: 30,
        dimensions: { length: 60, width: 40, height: 30 },
        fromLocation: new window.FastShipModels.Location(saudiCities[1]), // جدة
        toLocation: new window.FastShipModels.Location(saudiCities[3]), // المدينة
        pickupDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        description: 'ملابس - 3 صناديق',
        images: [],
        specialInstructions: '',
        value: 1500,
        insuranceRequired: false,
        status: 'pending',
        createdAt: new Date().toISOString()
    }
];

/**
 * تقييمات تجريبية
 */
const mockReviews = [
    {
        id: 'REV-001',
        shipmentId: 'SHP-001',
        reviewerId: 'USR-001',
        revieweeId: 'USR-002',
        rating: 5,
        comment: 'خدمة ممتازة! وصلت الشحنة في الوقت المحدد وبحالة ممتازة.',
        createdAt: '2024-01-15T10:30:00Z'
    },
    {
        id: 'REV-002',
        shipmentId: 'SHP-002',
        reviewerId: 'USR-001',
        revieweeId: 'USR-003',
        rating: 4,
        comment: 'جيد جداً، لكن كان هناك تأخير بسيط في التوصيل.',
        createdAt: '2024-01-20T14:20:00Z'
    }
];

/**
 * إشعارات تجريبية
 */
const mockNotifications = [
    {
        id: 'NOT-001',
        userId: 'USR-001',
        type: 'shipment_accepted',
        title: 'تم قبول شحنتك',
        message: 'تم قبول شحنتك SHP-001 من قبل الموصل فاطمة الزهراني',
        read: false,
        createdAt: new Date().toISOString()
    },
    {
        id: 'NOT-002',
        userId: 'USR-002',
        type: 'new_shipment_request',
        title: 'طلب شحنة جديد',
        message: 'لديك طلب شحنة جديد من الرياض إلى جدة',
        read: false,
        createdAt: new Date().toISOString()
    }
];

/**
 * دالة لتهيئة البيانات التجريبية
 */
function initializeMockData() {
    // تهيئة الموصلين
    if (window.FastShipMatchingEngine) {
        const carriers = mockCarriers.map(data => {
            return new window.FastShipModels.Carrier(data);
        });
        window.FastShipMatchingEngine.updateCarriers(carriers);
    }
    
    // تهيئة الرحلات
    if (window.FastShipTripManager) {
        mockTrips.forEach(tripData => {
            const trip = new window.FastShipModels.Trip(tripData);
            window.FastShipTripManager.trips.push(trip);
        });
    }
    
    // تهيئة الشحنات
    if (window.FastShipMatchingEngine) {
        const shipments = mockShipments.map(data => {
            return new window.FastShipModels.Shipment(data);
        });
        window.FastShipMatchingEngine.updateShipments(shipments);
    }
    
    console.log('✅ تم تحميل البيانات التجريبية بنجاح');
    console.log(`📦 ${mockShipments.length} شحنات`);
    console.log(`🚗 ${mockCarriers.length} موصلين`);
    console.log(`🛣️ ${mockTrips.length} رحلات`);
}

/**
 * دالة لتوليد بيانات تجريبية عشوائية
 */
function generateRandomShipment(fromCity, toCity) {
    const categories = Object.keys(window.FastShipModels.ShipmentCategories);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const weight = Math.random() * 100 + 1;
    
    const fromLocation = saudiCities.find(c => c.city === fromCity);
    const toLocation = saudiCities.find(c => c.city === toCity);
    
    return new window.FastShipModels.Shipment({
        senderId: mockUsers[0].id,
        category,
        weight,
        dimensions: {
            length: Math.random() * 100,
            width: Math.random() * 100,
            height: Math.random() * 100
        },
        fromLocation: new window.FastShipModels.Location(fromLocation),
        toLocation: new window.FastShipModels.Location(toLocation),
        pickupDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        deliveryDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'شحنة تجريبية',
        value: Math.random() * 10000,
        insuranceRequired: Math.random() > 0.5
    });
}

// تصدير البيانات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saudiCities,
        mockUsers,
        mockCarriers,
        mockTrips,
        mockShipments,
        mockReviews,
        mockNotifications,
        initializeMockData,
        generateRandomShipment
    };
}

// جعل البيانات متاحة عالمياً
if (typeof window !== 'undefined') {
    window.FastShipMockData = {
        saudiCities,
        mockUsers,
        mockCarriers,
        mockTrips,
        mockShipments,
        mockReviews,
        mockNotifications,
        initializeMockData,
        generateRandomShipment
    };
    
    // تهيئة البيانات تلقائياً
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMockData);
    } else {
        initializeMockData();
    }
}
