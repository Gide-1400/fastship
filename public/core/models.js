// models.js - نماذج البيانات الأساسية لمنصة FastShip

/**
 * أنواع الموصلين في المنصة
 */
const CarrierTypes = {
    REGULAR_TRAVELER: {
        id: 'regular_traveler',
        nameAr: 'مسافر عادي',
        nameEn: 'Regular Traveler',
        icon: '🚶‍♂️',
        minCapacity: 0,        // بالكيلوجرام
        maxCapacity: 20,       // بالكيلوجرام
        vehicles: ['تاكسي', 'حافلة', 'طائرة', 'قطار'],
        description: 'مسافر عادي يحمل حقيبة صغيرة في رحلته',
        pricePerKm: 2,         // ريال لكل كيلومتر
        basePrice: 20          // سعر البداية بالريال
    },
    PRIVATE_CAR: {
        id: 'private_car',
        nameAr: 'صاحب سيارة خاصة',
        nameEn: 'Private Car Owner',
        icon: '🚗',
        minCapacity: 20,
        maxCapacity: 1500,     // 1.5 طن
        vehicles: ['سيارة خاصة', 'بيك أب', 'SUV'],
        description: 'صاحب سيارة خاصة مسافر بين المدن',
        pricePerKm: 1.5,
        basePrice: 50
    },
    TRUCK_OWNER: {
        id: 'truck_owner',
        nameAr: 'صاحب شاحنة',
        nameEn: 'Truck Owner',
        icon: '🚚',
        minCapacity: 1500,
        maxCapacity: 50000,    // 50 طن
        vehicles: ['دينة', 'شاحنة متوسطة', 'شاحنة كبيرة'],
        description: 'سائق شاحنة برحلات منتظمة',
        pricePerKm: 1,
        basePrice: 200
    },
    FLEET_COMPANY: {
        id: 'fleet_company',
        nameAr: 'شركة أساطيل',
        nameEn: 'Fleet Company',
        icon: '🏢',
        minCapacity: 50000,
        maxCapacity: 1000000,  // 1000 طن
        vehicles: ['تريلا', 'طائرة شحن', 'سفينة', 'قطار شحن'],
        description: 'شركات شحن لديها مساحات غير مستغلة',
        pricePerKm: 0.5,
        basePrice: 1000
    }
};

/**
 * أنواع الشحنات في المنصة
 */
const ShipmentTypes = {
    SMALL: {
        id: 'small',
        nameAr: 'شحنة صغيرة',
        nameEn: 'Small Shipment',
        icon: '🎒',
        minWeight: 0,
        maxWeight: 20,
        matchingCarriers: ['regular_traveler'],
        examples: ['مستندات', 'كتب', 'هدايا صغيرة', 'هاتف', 'ساعة'],
        description: 'شحنات خفيفة مناسبة للمسافرين العاديين'
    },
    MEDIUM: {
        id: 'medium',
        nameAr: 'شحنة متوسطة',
        nameEn: 'Medium Shipment',
        icon: '📦',
        minWeight: 20,
        maxWeight: 1500,
        matchingCarriers: ['regular_traveler', 'private_car'],
        examples: ['أجهزة إلكترونية', 'ملابس', 'مشتريات أونلاين', 'أجهزة منزلية صغيرة'],
        description: 'شحنات متوسطة مناسبة لأصحاب السيارات'
    },
    LARGE: {
        id: 'large',
        nameAr: 'شحنة كبيرة',
        nameEn: 'Large Shipment',
        icon: '🚚',
        minWeight: 1500,
        maxWeight: 50000,
        matchingCarriers: ['private_car', 'truck_owner'],
        examples: ['أثاث', 'أجهزة كبيرة', 'بضائع تجارية', 'معدات'],
        description: 'شحنات كبيرة مناسبة للشاحنات'
    },
    GIANT: {
        id: 'giant',
        nameAr: 'شحنة عملاقة',
        nameEn: 'Giant Shipment',
        icon: '🏢',
        minWeight: 50000,
        maxWeight: 1000000,
        matchingCarriers: ['truck_owner', 'fleet_company'],
        examples: ['بضائع تجارية ضخمة', 'مواد بناء', 'معدات ثقيلة', 'حاويات'],
        description: 'شحنات عملاقة مناسبة للشركات والأساطيل'
    }
};

/**
 * فئات الشحنات حسب النوع
 */
const ShipmentCategories = {
    DOCUMENTS: {
        id: 'documents',
        nameAr: 'مستندات',
        icon: '📄',
        maxWeight: 5,
        fragile: false,
        requiresSpecialCare: false
    },
    ELECTRONICS: {
        id: 'electronics',
        nameAr: 'إلكترونيات',
        icon: '📱',
        maxWeight: 100,
        fragile: true,
        requiresSpecialCare: true
    },
    CLOTHES: {
        id: 'clothes',
        nameAr: 'ملابس',
        icon: '👕',
        maxWeight: 500,
        fragile: false,
        requiresSpecialCare: false
    },
    FOOD: {
        id: 'food',
        nameAr: 'أطعمة',
        icon: '🍕',
        maxWeight: 200,
        fragile: false,
        requiresSpecialCare: true,
        requiresRefrigeration: false
    },
    BOOKS: {
        id: 'books',
        nameAr: 'كتب',
        icon: '📚',
        maxWeight: 300,
        fragile: false,
        requiresSpecialCare: false
    },
    MEDICINE: {
        id: 'medicine',
        nameAr: 'أدوية',
        icon: '💊',
        maxWeight: 50,
        fragile: true,
        requiresSpecialCare: true,
        requiresRefrigeration: true
    },
    FURNITURE: {
        id: 'furniture',
        nameAr: 'أثاث',
        icon: '🛋️',
        maxWeight: 50000,
        fragile: true,
        requiresSpecialCare: true
    },
    OTHER: {
        id: 'other',
        nameAr: 'أخرى',
        icon: '📦',
        maxWeight: 1000000,
        fragile: false,
        requiresSpecialCare: false
    }
};

/**
 * حالات الشحنة
 */
const ShipmentStatus = {
    PENDING: { id: 'pending', nameAr: 'قيد الانتظار', color: '#FFA500' },
    ACCEPTED: { id: 'accepted', nameAr: 'تم القبول', color: '#4CAF50' },
    IN_TRANSIT: { id: 'in_transit', nameAr: 'في الطريق', color: '#2196F3' },
    DELIVERED: { id: 'delivered', nameAr: 'تم التوصيل', color: '#4CAF50' },
    CANCELLED: { id: 'cancelled', nameAr: 'ملغي', color: '#F44336' }
};

/**
 * class للشحنة
 */
class Shipment {
    constructor({
        id,
        senderId,
        category,
        weight,
        dimensions = { length: 0, width: 0, height: 0 },
        fromLocation,
        toLocation,
        pickupDate,
        deliveryDate,
        description = '',
        images = [],
        specialInstructions = '',
        value = 0,
        insuranceRequired = false
    }) {
        this.id = id || this.generateId();
        this.senderId = senderId;
        this.category = category;
        this.weight = weight;
        this.dimensions = dimensions;
        this.fromLocation = fromLocation;
        this.toLocation = toLocation;
        this.pickupDate = pickupDate;
        this.deliveryDate = deliveryDate;
        this.description = description;
        this.images = images;
        this.specialInstructions = specialInstructions;
        this.value = value;
        this.insuranceRequired = insuranceRequired;
        this.status = ShipmentStatus.PENDING.id;
        this.createdAt = new Date().toISOString();
        
        // تحديد نوع الشحنة بناءً على الوزن
        this.type = this.determineShipmentType();
    }
    
    generateId() {
        return 'SHP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    determineShipmentType() {
        if (this.weight <= 20) return ShipmentTypes.SMALL.id;
        if (this.weight <= 1500) return ShipmentTypes.MEDIUM.id;
        if (this.weight <= 50000) return ShipmentTypes.LARGE.id;
        return ShipmentTypes.GIANT.id;
    }
    
    getMatchingCarriers() {
        const shipmentType = Object.values(ShipmentTypes).find(t => t.id === this.type);
        return shipmentType ? shipmentType.matchingCarriers : [];
    }
    
    calculateVolume() {
        const { length, width, height } = this.dimensions;
        return length * width * height / 1000000; // متر مكعب
    }
}

/**
 * class للموصل (Carrier)
 */
class Carrier {
    constructor({
        id,
        userId,
        type,
        vehicle,
        vehiclePlate,
        capacity,
        availableSpace,
        licenses = [],
        insurance = null,
        rating = 0,
        totalTrips = 0,
        isVerified = false
    }) {
        this.id = id || this.generateId();
        this.userId = userId;
        this.type = type;
        this.vehicle = vehicle;
        this.vehiclePlate = vehiclePlate;
        this.capacity = capacity;
        this.availableSpace = availableSpace;
        this.licenses = licenses;
        this.insurance = insurance;
        this.rating = rating;
        this.totalTrips = totalTrips;
        this.isVerified = isVerified;
        this.createdAt = new Date().toISOString();
    }
    
    generateId() {
        return 'CAR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    canAcceptShipment(shipment) {
        const carrierType = CarrierTypes[this.type.toUpperCase()];
        if (!carrierType) return false;
        
        // التحقق من السعة المتاحة
        if (this.availableSpace < shipment.weight) return false;
        
        // التحقق من نطاق السعة
        if (shipment.weight < carrierType.minCapacity || shipment.weight > carrierType.maxCapacity) {
            return false;
        }
        
        return true;
    }
    
    updateAvailableSpace(usedSpace) {
        this.availableSpace -= usedSpace;
    }
}

/**
 * class للرحلة
 */
class Trip {
    constructor({
        id,
        carrierId,
        fromLocation,
        toLocation,
        departureDate,
        arrivalDate,
        availableSpace,
        maxShipments = 10,
        status = 'active'
    }) {
        this.id = id || this.generateId();
        this.carrierId = carrierId;
        this.fromLocation = fromLocation;
        this.toLocation = toLocation;
        this.departureDate = departureDate;
        this.arrivalDate = arrivalDate;
        this.availableSpace = availableSpace;
        this.maxShipments = maxShipments;
        this.shipments = [];
        this.status = status;
        this.createdAt = new Date().toISOString();
    }
    
    generateId() {
        return 'TRP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    addShipment(shipmentId, weight) {
        if (this.availableSpace >= weight && this.shipments.length < this.maxShipments) {
            this.shipments.push(shipmentId);
            this.availableSpace -= weight;
            return true;
        }
        return false;
    }
    
    removeShipment(shipmentId, weight) {
        const index = this.shipments.indexOf(shipmentId);
        if (index > -1) {
            this.shipments.splice(index, 1);
            this.availableSpace += weight;
            return true;
        }
        return false;
    }
}

/**
 * class للموقع
 */
class Location {
    constructor({ city, region, country = 'السعودية', lat = 0, lng = 0, address = '' }) {
        this.city = city;
        this.region = region;
        this.country = country;
        this.lat = lat;
        this.lng = lng;
        this.address = address;
    }
    
    toString() {
        return `${this.city}, ${this.region}, ${this.country}`;
    }
}

// تصدير النماذج
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CarrierTypes,
        ShipmentTypes,
        ShipmentCategories,
        ShipmentStatus,
        Shipment,
        Carrier,
        Trip,
        Location
    };
}

// جعل النماذج متاحة عالمياً
if (typeof window !== 'undefined') {
    window.FastShipModels = {
        CarrierTypes,
        ShipmentTypes,
        ShipmentCategories,
        ShipmentStatus,
        Shipment,
        Carrier,
        Trip,
        Location
    };
}
