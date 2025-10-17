// نظام مطابقة المسافرين مع الشحنات - FastShip Platform
// يطابق الشحنات مع أفضل المسافرين المناسبين

class TravelerMatchingSystem {
    constructor() {
        this.travelers = [];
        this.shipments = [];
        this.matchingRules = this.initializeMatchingRules();
        this.init();
    }

    init() {
        this.loadMockData();
        this.setupEventListeners();
    }

    // قواعد المطابقة
    initializeMatchingRules() {
        return {
            // عوامل المطابقة
            factors: {
                capacity: 0.3,      // السعة (30%)
                route: 0.25,        // المسار (25%)
                rating: 0.2,        // التقييم (20%)
                price: 0.15,        // السعر (15%)
                availability: 0.1   // التوفر (10%)
            },
            
            // حدود المطابقة
            limits: {
                minRating: 3.0,     // أقل تقييم مقبول
                maxPriceMultiplier: 2.0, // أعلى سعر (ضعف السعر الأساسي)
                maxDistanceDeviation: 50  // أقصى انحراف في المسافة (كم)
            }
        };
    }

    // تحميل البيانات التجريبية
    loadMockData() {
        this.travelers = [
            {
                id: 't1',
                name: 'خالد السيد',
                type: 'regular_traveler',
                rating: 4.8,
                totalTrips: 156,
                vehicle: {
                    type: 'سيارة',
                    model: 'تويوتا كامري 2020',
                    capacity: 15, // كجم
                    volume: 0.05  // م³
                },
                route: {
                    from: 'riyadh',
                    to: 'jeddah',
                    distance: 870,
                    departureTime: '2024-01-15T14:00:00',
                    arrivalTime: '2024-01-15T22:00:00'
                },
                pricePerKg: 0.8,
                availability: true,
                phone: '+966501234567',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
            },
            {
                id: 't2',
                name: 'محمد أحمد',
                type: 'car_owner',
                rating: 4.6,
                totalTrips: 89,
                vehicle: {
                    type: 'شاحنة صغيرة',
                    model: 'فورد ترانزيت 2019',
                    capacity: 800, // كجم
                    volume: 1.5    // م³
                },
                route: {
                    from: 'jeddah',
                    to: 'dammam',
                    distance: 1340,
                    departureTime: '2024-01-16T09:00:00',
                    arrivalTime: '2024-01-16T18:00:00'
                },
                pricePerKg: 1.2,
                availability: true,
                phone: '+966502345678',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
            },
            {
                id: 't3',
                name: 'فاطمة الزهراني',
                type: 'regular_traveler',
                rating: 4.9,
                totalTrips: 203,
                vehicle: {
                    type: 'سيارة',
                    model: 'هيونداي هونشي 2021',
                    capacity: 20, // كجم
                    volume: 0.08  // م³
                },
                route: {
                    from: 'mecca',
                    to: 'medina',
                    distance: 420,
                    departureTime: '2024-01-15T18:00:00',
                    arrivalTime: '2024-01-15T22:00:00'
                },
                pricePerKg: 0.9,
                availability: true,
                phone: '+966503456789',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
            },
            {
                id: 't4',
                name: 'عبدالله الراشد',
                type: 'truck_owner',
                rating: 4.7,
                totalTrips: 134,
                vehicle: {
                    type: 'فان',
                    model: 'مرسيدس فان 2022',
                    capacity: 2000, // كجم
                    volume: 3.0     // م³
                },
                route: {
                    from: 'dammam',
                    to: 'riyadh',
                    distance: 395,
                    departureTime: '2024-01-15T20:00:00',
                    arrivalTime: '2024-01-16T02:00:00'
                },
                pricePerKg: 1.1,
                availability: true,
                phone: '+966504567890',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
            },
            {
                id: 't5',
                name: 'شركة الشحن السريع',
                type: 'fleet_company',
                rating: 4.9,
                totalTrips: 2500,
                vehicle: {
                    type: 'تريلة',
                    model: 'شاحنة شحن كبيرة',
                    capacity: 25000, // كجم
                    volume: 40       // م³
                },
                route: {
                    from: 'riyadh',
                    to: 'jeddah',
                    distance: 870,
                    departureTime: '2024-01-16T06:00:00',
                    arrivalTime: '2024-01-16T14:00:00'
                },
                pricePerKg: 0.6,
                availability: true,
                phone: '+966505678901',
                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
            }
        ];

        this.shipments = [
            {
                id: 's1',
                type: 'small',
                weight: 5,
                volume: 0.02,
                description: 'مستندات مهمة',
                value: 1000,
                pickupLocation: 'الرياض',
                deliveryLocation: 'جدة',
                pickupDate: '2024-01-15',
                deliveryDate: '2024-01-15',
                urgency: 'express',
                status: 'pending'
            },
            {
                id: 's2',
                type: 'medium',
                weight: 50,
                volume: 0.3,
                description: 'أجهزة إلكترونية',
                value: 5000,
                pickupLocation: 'جدة',
                deliveryLocation: 'الدمام',
                pickupDate: '2024-01-16',
                deliveryDate: '2024-01-16',
                urgency: 'standard',
                status: 'pending'
            },
            {
                id: 's3',
                type: 'large',
                weight: 500,
                volume: 2.5,
                description: 'أثاث منزلي',
                value: 15000,
                pickupLocation: 'الدمام',
                deliveryLocation: 'الرياض',
                pickupDate: '2024-01-15',
                deliveryDate: '2024-01-16',
                urgency: 'standard',
                status: 'pending'
            }
        ];
    }

    setupEventListeners() {
        // البحث عن المسافرين
        document.getElementById('search-travelers')?.addEventListener('click', () => {
            this.searchTravelers();
        });

        // فلترة المسافرين
        document.querySelectorAll('.traveler-filter').forEach(filter => {
            filter.addEventListener('change', () => {
                this.filterTravelers();
            });
        });

        // اختيار مسافر
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('select-traveler-btn')) {
                const travelerId = e.target.dataset.travelerId;
                this.selectTraveler(travelerId);
            }
        });
    }

    // البحث عن المسافرين المناسبين
    searchTravelers(shipmentData) {
        if (!shipmentData) {
            shipmentData = this.getShipmentDataFromForm();
        }

        if (!shipmentData) {
            alert('يرجى ملء بيانات الشحنة أولاً');
            return;
        }

        const compatibleTravelers = this.findCompatibleTravelers(shipmentData);
        this.displayTravelers(compatibleTravelers);
    }

    // الحصول على بيانات الشحنة من النموذج
    getShipmentDataFromForm() {
        const weight = parseFloat(document.getElementById('shipment-weight')?.value);
        const volume = parseFloat(document.getElementById('shipment-volume')?.value);
        const pickupCity = document.getElementById('pickup-city')?.value;
        const deliveryCity = document.getElementById('delivery-city')?.value;
        const urgency = document.getElementById('shipment-urgency')?.value;

        if (!weight || !volume || !pickupCity || !deliveryCity) {
            return null;
        }

        return {
            weight,
            volume,
            pickupCity,
            deliveryCity,
            urgency: urgency || 'standard'
        };
    }

    // العثور على المسافرين المتوافقين
    findCompatibleTravelers(shipmentData) {
        const compatibleTravelers = [];

        for (const traveler of this.travelers) {
            if (!traveler.availability) continue;

            const compatibilityScore = this.calculateCompatibilityScore(shipmentData, traveler);
            
            if (compatibilityScore > 0.5) { // حد أدنى للتوافق
                compatibleTravelers.push({
                    ...traveler,
                    compatibilityScore,
                    estimatedPrice: this.calculateEstimatedPrice(shipmentData, traveler)
                });
            }
        }

        // ترتيب حسب درجة التوافق
        return compatibleTravelers.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    }

    // حساب درجة التوافق
    calculateCompatibilityScore(shipmentData, traveler) {
        const factors = this.matchingRules.factors;
        let score = 0;

        // 1. السعة (30%)
        const capacityScore = this.calculateCapacityScore(shipmentData, traveler);
        score += capacityScore * factors.capacity;

        // 2. المسار (25%)
        const routeScore = this.calculateRouteScore(shipmentData, traveler);
        score += routeScore * factors.route;

        // 3. التقييم (20%)
        const ratingScore = traveler.rating / 5.0;
        score += ratingScore * factors.rating;

        // 4. السعر (15%)
        const priceScore = this.calculatePriceScore(shipmentData, traveler);
        score += priceScore * factors.price;

        // 5. التوفر (10%)
        const availabilityScore = traveler.availability ? 1.0 : 0.0;
        score += availabilityScore * factors.availability;

        return Math.min(score, 1.0);
    }

    // حساب درجة السعة
    calculateCapacityScore(shipmentData, traveler) {
        const weightCapacity = Math.min(shipmentData.weight / traveler.vehicle.capacity, 1.0);
        const volumeCapacity = Math.min(shipmentData.volume / traveler.vehicle.volume, 1.0);
        
        // إذا كانت الشحنة أكبر من السعة، العودة إلى 0
        if (shipmentData.weight > traveler.vehicle.capacity || 
            shipmentData.volume > traveler.vehicle.volume) {
            return 0;
        }

        // حساب متوسط السعة (مع إعطاء وزن أكبر للوزن)
        return (weightCapacity * 0.7 + volumeCapacity * 0.3);
    }

    // حساب درجة المسار
    calculateRouteScore(shipmentData, traveler) {
        const shipmentRoute = `${shipmentData.pickupCity}-${shipmentData.deliveryCity}`;
        const travelerRoute = `${traveler.route.from}-${traveler.route.to}`;
        const reverseTravelerRoute = `${traveler.route.to}-${traveler.route.from}`;

        // مطابقة مباشرة
        if (shipmentRoute === travelerRoute) {
            return 1.0;
        }

        // مطابقة عكسية
        if (shipmentRoute === reverseTravelerRoute) {
            return 0.9;
        }

        // مطابقة جزئية (نفس نقطة البداية أو النهاية)
        if (shipmentData.pickupCity === traveler.route.from || 
            shipmentData.deliveryCity === traveler.route.to) {
            return 0.6;
        }

        // مطابقة جزئية عكسية
        if (shipmentData.pickupCity === traveler.route.to || 
            shipmentData.deliveryCity === traveler.route.from) {
            return 0.5;
        }

        // لا توجد مطابقة
        return 0.0;
    }

    // حساب درجة السعر
    calculatePriceScore(shipmentData, traveler) {
        const estimatedPrice = this.calculateEstimatedPrice(shipmentData, traveler);
        const basePrice = shipmentData.weight * traveler.pricePerKg;
        
        // إذا كان السعر أعلى من الحد المسموح
        if (estimatedPrice > basePrice * this.matchingRules.limits.maxPriceMultiplier) {
            return 0;
        }

        // حساب درجة السعر (كلما كان أقل، كلما كان أفضل)
        const priceRatio = basePrice / estimatedPrice;
        return Math.min(priceRatio, 1.0);
    }

    // حساب السعر المقدر
    calculateEstimatedPrice(shipmentData, traveler) {
        const basePrice = shipmentData.weight * traveler.pricePerKg;
        
        // تطبيق عوامل إضافية
        let multiplier = 1.0;
        
        // عامل الأولوية
        if (shipmentData.urgency === 'express') {
            multiplier *= 1.5;
        } else if (shipmentData.urgency === 'same_day') {
            multiplier *= 2.0;
        }

        // عامل المسافة
        const distance = this.getDistanceBetweenCities(shipmentData.pickupCity, shipmentData.deliveryCity);
        if (distance > 500) {
            multiplier *= 1.2;
        }

        return basePrice * multiplier;
    }

    // الحصول على المسافة بين المدن
    getDistanceBetweenCities(city1, city2) {
        const distances = {
            'riyadh-jeddah': 870,
            'riyadh-dammam': 395,
            'riyadh-mecca': 870,
            'riyadh-medina': 850,
            'jeddah-dammam': 1340,
            'jeddah-mecca': 80,
            'jeddah-medina': 420,
            'dammam-mecca': 1340,
            'dammam-medina': 1320
        };
        
        const key = `${city1}-${city2}`;
        const reverseKey = `${city2}-${city1}`;
        
        return distances[key] || distances[reverseKey] || 100;
    }

    // عرض المسافرين
    displayTravelers(travelers) {
        const container = document.getElementById('travelers-results');
        if (!container) return;

        if (travelers.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">😔</div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">لا توجد نتائج</h3>
                    <p class="text-gray-600">لم نجد مسافرين مناسبين لشحنتك. جرب تعديل معايير البحث.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${travelers.map(traveler => this.createTravelerCard(traveler)).join('')}
            </div>
        `;
    }

    // إنشاء بطاقة المسافر
    createTravelerCard(traveler) {
        const compatibilityPercentage = Math.round(traveler.compatibilityScore * 100);
        const ratingStars = '★'.repeat(Math.floor(traveler.rating)) + '☆'.repeat(5 - Math.floor(traveler.rating));
        
        return `
            <div class="traveler-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="flex items-center mb-4">
                    <img src="${traveler.image}" alt="${traveler.name}" class="w-16 h-16 rounded-full object-cover ml-4">
                    <div class="flex-1">
                        <h3 class="text-lg font-bold text-gray-800">${traveler.name}</h3>
                        <div class="flex items-center mb-1">
                            <span class="text-yellow-500 ml-1">${ratingStars}</span>
                            <span class="text-sm text-gray-600">${traveler.rating}</span>
                            <span class="text-sm text-gray-500 mx-2">•</span>
                            <span class="text-sm text-gray-500">${traveler.totalTrips} رحلة</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                ${traveler.vehicle.type}
                            </span>
                            <span class="text-sm font-bold text-green-600">
                                ${compatibilityPercentage}% توافق
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <div class="flex items-center mb-2">
                        <span class="text-gray-600 text-sm ml-2">🚗</span>
                        <span class="text-sm text-gray-700">${traveler.vehicle.model}</span>
                    </div>
                    <div class="flex items-center mb-2">
                        <span class="text-gray-600 text-sm ml-2">📍</span>
                        <span class="text-sm text-gray-700">${this.getCityName(traveler.route.from)} → ${this.getCityName(traveler.route.to)}</span>
                    </div>
                    <div class="flex items-center mb-2">
                        <span class="text-gray-600 text-sm ml-2">⏰</span>
                        <span class="text-sm text-gray-700">${this.formatDateTime(traveler.route.departureTime)}</span>
                    </div>
                    <div class="flex items-center mb-2">
                        <span class="text-gray-600 text-sm ml-2">💰</span>
                        <span class="text-sm font-bold text-green-600">${traveler.estimatedPrice.toFixed(2)} ريال</span>
                    </div>
                    <div class="flex items-center">
                        <span class="text-gray-600 text-sm ml-2">📦</span>
                        <span class="text-sm text-gray-700">سعة: ${traveler.vehicle.capacity} كجم</span>
                    </div>
                </div>
                
                <div class="flex gap-3">
                    <button class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors select-traveler-btn" 
                            data-traveler-id="${traveler.id}">
                        اختيار المسافر
                    </button>
                    <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition-colors" 
                            onclick="showTravelerDetails('${traveler.id}')">
                        👁️
                    </button>
                </div>
            </div>
        `;
    }

    // الحصول على اسم المدينة
    getCityName(cityCode) {
        const cities = {
            'riyadh': 'الرياض',
            'jeddah': 'جدة',
            'dammam': 'الدمام',
            'mecca': 'مكة المكرمة',
            'medina': 'المدينة المنورة',
            'taif': 'الطائف',
            'buraidah': 'بريدة',
            'tabuk': 'تبوك',
            'hail': 'حائل',
            'khamis_mushait': 'خميس مشيط',
            'hafr_al_batin': 'حفر الباطن',
            'jubail': 'الجبيل',
            'yanbu': 'ينبع',
            'al_kharj': 'الخرج',
            'qatif': 'القطيف'
        };
        return cities[cityCode] || cityCode;
    }

    // تنسيق التاريخ والوقت
    formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('ar-SA') + ' ' + date.toLocaleTimeString('ar-SA', {hour: '2-digit', minute: '2-digit'});
    }

    // اختيار مسافر
    selectTraveler(travelerId) {
        const traveler = this.travelers.find(t => t.id === travelerId);
        if (!traveler) return;

        // إظهار تأكيد الاختيار
        if (confirm(`هل تريد اختيار ${traveler.name} لنقل شحنتك؟`)) {
            this.confirmTravelerSelection(traveler);
        }
    }

    // تأكيد اختيار المسافر
    confirmTravelerSelection(traveler) {
        // إظهار رسالة النجاح
        alert(`تم اختيار ${traveler.name} بنجاح! سيتم التواصل معك قريباً.`);
        
        // يمكن إضافة منطق إضافي هنا مثل:
        // - إرسال إشعار للمسافر
        // - إنشاء طلب شحن
        // - تحديث حالة الشحنة
        // - إرسال تفاصيل الاتصال
    }

    // فلترة المسافرين
    filterTravelers() {
        const filters = this.getActiveFilters();
        const allTravelers = this.travelers.filter(t => t.availability);
        const filteredTravelers = this.applyFilters(allTravelers, filters);
        this.displayTravelers(filteredTravelers);
    }

    // الحصول على الفلاتر النشطة
    getActiveFilters() {
        const filters = {};
        
        // فلتر نوع المركبة
        const vehicleTypes = Array.from(document.querySelectorAll('input[name="vehicle-type"]:checked'))
            .map(input => input.value);
        if (vehicleTypes.length > 0) {
            filters.vehicleTypes = vehicleTypes;
        }

        // فلتر التقييم
        const minRating = document.getElementById('min-rating')?.value;
        if (minRating) {
            filters.minRating = parseFloat(minRating);
        }

        // فلتر السعر
        const maxPrice = document.getElementById('max-price')?.value;
        if (maxPrice) {
            filters.maxPrice = parseFloat(maxPrice);
        }

        return filters;
    }

    // تطبيق الفلاتر
    applyFilters(travelers, filters) {
        return travelers.filter(traveler => {
            // فلتر نوع المركبة
            if (filters.vehicleTypes && !filters.vehicleTypes.includes(traveler.vehicle.type)) {
                return false;
            }

            // فلتر التقييم
            if (filters.minRating && traveler.rating < filters.minRating) {
                return false;
            }

            // فلتر السعر
            if (filters.maxPrice && traveler.pricePerKg > filters.maxPrice) {
                return false;
            }

            return true;
        });
    }
}

// إنشاء مثيل عام للنظام
window.travelerMatchingSystem = new TravelerMatchingSystem();

// تصدير الكلاس للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TravelerMatchingSystem;
}