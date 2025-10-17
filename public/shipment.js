class ShipmentManager {
    constructor() {
        this.shipments = this.loadShipments();
        this.travelers = this.loadTravelers();
        this.initSampleData();
    }

    // نظام تصنيف الشحنات حسب الوزن والحجم
    classifyShipment(weight, dimensions) {
        if (weight <= 20) return 'small';      // مسافر عادي
        if (weight <= 1500) return 'medium';   // صاحب سيارة
        if (weight <= 50000) return 'large';   // صاحب شاحنة
        return 'x-large';                      // أساطيل
    }

    // نظام تصنيف الموصلين حسب السعة ونوع المركبة
    classifyTraveler(capacity, vehicleType) {
        const types = {
            'taxi': 'small', 'bus': 'small', 'plane': 'small', 'train': 'small',
            'car': 'medium', 'suv': 'medium', 'pickup': 'medium',
            'truck': 'large', 'van': 'large', 'trailer': 'large',
            'fleet': 'x-large', 'airline': 'x-large', 'shipping': 'x-large'
        };
        return types[vehicleTyp    // خوارزمية المطابقة الذكية المحسنة بين الشحنات والموصلين
    findMatchingTravelers(shipment) {
        const shipmentType = this.classifyShipment(shipment.weight, shipment.dimensions);
        
        return this.travelers.filter(traveler => {
            const travelerType = this.classifyTraveler(traveler.capacity, traveler.vehicleType);
            
            // المطابقة حسب نوع الشحنة والموصل
            const typeMatch = 
                (shipmentType === 'small' && travelerType === 'small') ||
                (shipmentType === 'medium' && travelerType === 'medium') ||
                (shipmentType === 'large' && travelerType === 'large') ||
                (shipmentType === 'x-large' && travelerType === 'x-large');

            // المطابقة حسب المسار (مرونة أكبر)
            const routeMatch = this.checkRouteMatch(traveler, shipment);

            // المطابقة حسب التوقيت (مرونة أكبر)
            const timeMatch = this.checkTimeMatch(traveler, shipment);

            // المطابقة حسب السعة المتاحة
            const capacityMatch = this.checkCapacityMatch(traveler, shipment);

            // المطابقة حسب التقييم
            const ratingMatch = traveler.rating >= 3.0;

            return typeMatch && routeMatch && timeMatch && capacityMatch && ratingMatch;
        }).map(traveler => {
            // حساب نقاط المطابقة
            const matchScore = this.calculateMatchScore(traveler, shipment);
            return { ...traveler, matchScore };
        }).sort((a, b) => {
            // ترتيب حسب نقاط المطابقة ثم السعر
            return b.matchScore - a.matchScore || a.price - b.price;
        });
    }

    // فحص مطابقة المسار مع مرونة
    checkRouteMatch(traveler, shipment) {
        // مطابقة مباشرة
        if (traveler.fromCity === shipment.fromCity && traveler.toCity === shipment.toCity) {
            return true;
        }

        // مطابقة جزئية (نفس المدينة أو قريبة)
        const fromMatch = this.isCityNearby(traveler.fromCity, shipment.fromCity);
        const toMatch = this.isCityNearby(traveler.toCity, shipment.toCity);
        
        return fromMatch && toMatch;
    }

    // فحص مطابقة التوقيت مع مرونة
    checkTimeMatch(traveler, shipment) {
        const travelerTime = new Date(traveler.departureTime);
        const shipmentTime = new Date(shipment.preferredDate);
        
        // مطابقة مباشرة
        if (travelerTime >= shipmentTime) {
            return true;
        }

        // مرونة زمنية (ساعتان قبل أو بعد)
        const timeDiff = Math.abs(travelerTime - shipmentTime);
        const twoHours = 2 * 60 * 60 * 1000;
        
        return timeDiff <= twoHours;
    }

    // فحص مطابقة السعة
    checkCapacityMatch(traveler, shipment) {
        const availableCapacity = traveler.maxCapacity - (traveler.usedCapacity || 0);
        return availableCapacity >= shipment.weight;
    }

    // حساب نقاط المطابقة
    calculateMatchScore(traveler, shipment) {
        let score = 0;

        // نقاط المسار (40 نقطة)
        if (traveler.fromCity === shipment.fromCity && traveler.toCity === shipment.toCity) {
            score += 40;
        } else if (this.isCityNearby(traveler.fromCity, shipment.fromCity) && 
                   this.isCityNearby(traveler.toCity, shipment.toCity)) {
            score += 30;
        }

        // نقاط التوقيت (25 نقطة)
        const timeDiff = Math.abs(new Date(traveler.departureTime) - new Date(shipment.preferredDate));
        const oneHour = 60 * 60 * 1000;
        if (timeDiff <= oneHour) {
            score += 25;
        } else if (timeDiff <= 2 * oneHour) {
            score += 20;
        } else if (timeDiff <= 4 * oneHour) {
            score += 15;
        }

        // نقاط التقييم (20 نقطة)
        score += Math.min(traveler.rating * 4, 20);

        // نقاط السعر (15 نقطة)
        const priceScore = Math.max(0, 15 - (traveler.price - shipment.budget) / 10);
        score += priceScore;

        return Math.round(score);
    }

    // فحص قرب المدن
    isCityNearby(city1, city2) {
        const nearbyCities = {
            'الرياض': ['الرياض', 'الخرج', 'الدرعية'],
            'جدة': ['جدة', 'مكة', 'الطائف'],
            'الدمام': ['الدمام', 'الخبر', 'القطيف'],
            'مكة': ['مكة', 'جدة', 'الطائف'],
            'المدينة': ['المدينة', 'ينبع', 'العلا']
        };

        return nearbyCities[city1]?.includes(city2) || city1 === city2;
    } - b.price || b.rating - a.rati    // البحث عن شحنات متطابقة للموصل (محسن)
    findMatchingShipments(traveler) {
        const travelerType = this.classifyTraveler(traveler.capacity, traveler.vehicleType);
        
        return this.shipments.filter(shipment => {
            const shipmentType = this.classifyShipment(shipment.weight, shipment.dimensions);
            
            // المطابقة حسب النوع
            const typeMatch = 
                (travelerType === 'small' && shipmentType === 'small') ||
                (travelerType === 'medium' && shipmentType === 'medium') ||
                (travelerType === 'large' && shipmentType === 'large') ||
                (travelerType === 'x-large' && shipmentType === 'x-large');

            // المطابقة حسب المسار (مرونة أكبر)
            const routeMatch = this.checkRouteMatch(traveler, shipment);

            // المطابقة حسب التوقيت (مرونة أكبر)
            const timeMatch = this.checkTimeMatch(traveler, shipment);

            // المطابقة حسب السعة المتاحة
            const capacityMatch = this.checkCapacityMatch(traveler, shipment);

            // المطابقة حسب الميزانية
            const budgetMatch = shipment.budget >= traveler.price;

            return typeMatch && routeMatch && timeMatch && capacityMatch && budgetMatch && shipment.status === 'pending';
        }).map(shipment => {
            // حساب نقاط المطابقة
            const matchScore = this.calculateMatchScore(traveler, shipment);
            return { ...shipment, matchScore };
        }).sort((a, b) => {
            // ترتيب حسب نقاط المطابقة ثم السعر
            return b.matchScore - a.matchScore || b.offerPrice - a.offerPrice;
        });
    }.offerPrice || a.weight - b.weig    // إنشاء شحنة جديدة مع الربط التلقائي
    createShipment(shipmentData) {
        const shipment = {
            id: Date.now().toString(),
            ...shipmentData,
            type: this.classifyShipment(shipmentData.weight, shipmentData.dimensions),
            status: 'pending',
            createdAt: new Date().toISOString(),
            trackingNumber: 'SH' + Date.now().toString().slice(-6),
            matchingTravelers: [],
            recommendations: []
        };

        // البحث عن موصلين متطابقين
        const matchingTravelers = this.findMatchingTravelers(shipment);
        shipment.matchingTravelers = matchingTravelers.map(t => t.id);

        // إنشاء توصيات ذكية
        shipment.recommendations = this.generateRecommendations(shipment, matchingTravelers);

        this.shipments.push(shipment);
        this.saveShipments();

        // إشعار الموصلين المناسبين
        this.notifyMatchingTravelers(shipment, matchingTravelers);
        
        return {
            shipment,
            matchingTravelers,
            message: `تم العثور على ${matchingTravelers.length} موصل متطابق`
        };
    }

    // إنشاء توصيات ذكية
    generateRecommendations(shipment, matchingTravelers) {
        const recommendations = [];

        // توصية أفضل موصل
        if (matchingTravelers.length > 0) {
            const bestMatch = matchingTravelers[0];
            recommendations.push({
                type: 'best_match',
                title: 'أفضل موصل',
                description: `${bestMatch.name} - تقييم ${bestMatch.rating} نجوم`,
                traveler: bestMatch,
                confidence: bestMatch.matchScore / 100
            });
        }

        // توصية توفير المال
        const cheapestOption = matchingTravelers.reduce((cheapest, current) => 
            current.price < cheapest.price ? current : cheapest, matchingTravelers[0]);
        
        if (cheapestOption && cheapestOption !== matchingTravelers[0]) {
            recommendations.push({
                type: 'cost_saving',
                title: 'توفير المال',
                description: `وفر ${matchingTravelers[0].price - cheapestOption.price} ريال مع ${cheapestOption.name}`,
                traveler: cheapestOption,
                savings: matchingTravelers[0].price - cheapestOption.price
            });
        }

        // توصية السرعة
        const fastestOption = matchingTravelers.reduce((fastest, current) => 
            current.estimatedTime < fastest.estimatedTime ? current : fastest, matchingTravelers[0]);
        
        if (fastestOption && fastestOption !== matchingTravelers[0]) {
            recommendations.push({
                type: 'speed',
                title: 'أسرع توصيل',
                description: `${fastestOption.name} - ${fastestOption.estimatedTime} ساعة`,
                traveler: fastestOption,
                timeSaved: matchingTravelers[0].estimatedTime - fastestOption.estimatedTime
            });
        }

        return recommendations;
    }

    // إشعار الموصلين المناسبين
    notifyMatchingTravelers(shipment, matchingTravelers) {
        matchingTravelers.forEach(traveler => {
            // إضافة إشعار للموصل
            this.addNotification({
                type: 'new_shipment_match',
                title: 'شحنة جديدة مناسبة لك',
                message: `شحنة ${shipment.type} من ${shipment.fromCity} إلى ${shipment.toCity}`,
                shipmentId: shipment.id,
                travelerId: traveler.id,
                timestamp: new Date().toISOString()
            });
        });
    }

    // إضافة إشعار
    addNotification(notification) {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.unshift(notification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    // الحصول على إحصائيات المنصة
    getPlatformStats() {
        const totalShipments = this.shipments.length;
        const completedShipments = this.shipments.filter(s => s.status === 'delivered').length;
        const activeTravelers = this.travelers.filter(t => t.status === 'available').length;
        const totalRevenue = this.shipments
            .filter(s => s.status === 'delivered')
            .reduce((sum, s) => sum + (s.offerPrice * 0.1), 0); // 10% عمولة

        return {
            totalShipments,
            completedShipments,
            activeTravelers,
            totalRevenue,
            completionRate: totalShipments > 0 ? (completedShipments / totalShipments) * 100 : 0
        };
    }

    // البحث المتقدم
    advancedSearch(filters) {
        let results = [...this.shipments];

        // فلترة حسب المدينة
        if (filters.fromCity) {
            results = results.filter(s => s.fromCity === filters.fromCity);
        }
        if (filters.toCity) {
            results = results.filter(s => s.toCity === filters.toCity);
        }

        // فلترة حسب النوع
        if (filters.type) {
            results = results.filter(s => s.type === filters.type);
        }

        // فلترة حسب الوزن
        if (filters.minWeight) {
            results = results.filter(s => s.weight >= filters.minWeight);
        }
        if (filters.maxWeight) {
            results = results.filter(s => s.weight <= filters.maxWeight);
        }

        // فلترة حسب السعر
        if (filters.minPrice) {
            results = results.filter(s => s.offerPrice >= filters.minPrice);
        }
        if (filters.maxPrice) {
            results = results.filter(s => s.offerPrice <= filters.maxPrice);
        }

        // فلترة حسب التاريخ
        if (filters.dateFrom) {
            results = results.filter(s => new Date(s.preferredDate) >= new Date(filters.dateFrom));
        }
        if (filters.dateTo) {
            results = results.filter(s => new Date(s.preferredDate) <= new Date(filters.dateTo));
        }

        // ترتيب النتائج
        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'price_asc':
                    results.sort((a, b) => a.offerPrice - b.offerPrice);
                    break;
                case 'price_desc':
                    results.sort((a, b) => b.offerPrice - a.offerPrice);
                    break;
                case 'date_asc':
                    results.sort((a, b) => new Date(a.preferredDate) - new Date(b.preferredDate));
                    break;
                case 'date_desc':
                    results.sort((a, b) => new Date(b.preferredDate) - new Date(a.preferredDate));
                    break;
                case 'weight_asc':
                    results.sort((a, b) => a.weight - b.weight);
                    break;
                case 'weight_desc':
                    results.sort((a, b) => b.weight - a.weight);
                    break;
            }
        }

        return results;
    }ngTravelers.length} موصل متط    // إنشاء رحلة موصل جديدة
    createTraveler(travelerData) {
        const traveler = {
            id: Date.now().toString(),
            ...travelerData,
            type: this.classifyTraveler(travelerData.capacity, travelerData.vehicleType),
            status: 'available',
            createdAt: new Date().toISOString(),
            rating: 5.0,
            completedTrips: 0,
            matchingShipments: [],
            recommendations: []
        };

        // البحث عن شحنات متطابقة
        const matchingShipments = this.findMatchingShipments(traveler);
        traveler.matchingShipments = matchingShipments.map(s => s.id);

        // إنشاء توصيات ذكية
        traveler.recommendations = this.generateTravelerRecommendations(traveler, matchingShipments);

        this.travelers.push(traveler);
        this.saveTravelers();

        // إشعار العملاء المناسبين
        this.notifyMatchingClients(traveler, matchingShipments);
        
        return {
            traveler,
            matchingShipments,
            message: `تم العثور على ${matchingShipments.length} شحنة متطابقة`
        };
    }

    // إنشاء توصيات ذكية للموصل
    generateTravelerRecommendations(traveler, matchingShipments) {
        const recommendations = [];

        // توصية أفضل شحنة
        if (matchingShipments.length > 0) {
            const bestMatch = matchingShipments[0];
            recommendations.push({
                type: 'best_shipment',
                title: 'أفضل شحنة',
                description: `شحنة ${bestMatch.type} من ${bestMatch.fromCity} إلى ${bestMatch.toCity}`,
                shipment: bestMatch,
                confidence: bestMatch.matchScore / 100
            });
        }

        // توصية أعلى ربح
        const highestProfit = matchingShipments.reduce((highest, current) => 
            current.offerPrice > highest.offerPrice ? current : highest, matchingShipments[0]);
        
        if (highestProfit && highestProfit !== matchingShipments[0]) {
            recommendations.push({
                type: 'highest_profit',
                title: 'أعلى ربح',
                description: `اكسب ${highestProfit.offerPrice} ريال مع ${highestProfit.type}`,
                shipment: highestProfit,
                profit: highestProfit.offerPrice
            });
        }

        // توصية أقرب مسافة
        const shortestDistance = matchingShipments.reduce((shortest, current) => 
            current.distance < shortest.distance ? current : shortest, matchingShipments[0]);
        
        if (shortestDistance && shortestDistance !== matchingShipments[0]) {
            recommendations.push({
                type: 'shortest_distance',
                title: 'أقرب مسافة',
                description: `${shortestDistance.distance} كم - ${shortestDistance.type}`,
                shipment: shortestDistance,
                distance: shortestDistance.distance
            });
        }

        return recommendations;
    }

    // إشعار العملاء المناسبين
    notifyMatchingClients(traveler, matchingShipments) {
        matchingShipments.forEach(shipment => {
            // إضافة إشعار للعميل
            this.addNotification({
                type: 'new_traveler_match',
                title: 'موصل جديد متاح',
                message: `${traveler.name} متاح لنقل شحنتك`,
                shipmentId: shipment.id,
                travelerId: traveler.id,
                timestamp: new Date().toISOString()
            });
        });
    }ngShipments.length} شحنة متطا    // قبول شحنة من قبل موصل
    acceptShipment(travelerId, shipmentId) {
        const shipment = this.shipments.find(s => s.id === shipmentId);
        const traveler = this.travelers.find(t => t.id === travelerId);
        
        if (shipment && traveler) {
            shipment.status = 'accepted';
            shipment.acceptedBy = travelerId;
            shipment.acceptedAt = new Date().toISOString();
            
            traveler.matchingShipments = traveler.matchingShipments.filter(id => id !== shipmentId);
            traveler.completedTrips += 1;
            
            // بدء التتبع
            if (window.trackingManager) {
                window.trackingManager.startTracking(shipmentId, travelerId, {
                    from: shipment.fromCity,
                    to: shipment.toCity
                });
            }

            // إنشاء فاتورة
            if (window.paymentManager) {
                const pricing = window.paymentManager.calculatePrice(shipment.offerPrice);
                window.paymentManager.createInvoice(shipment, traveler, pricing);
            }

            // بدء محادثة
            if (window.messagingManager) {
                const conversationId = window.messagingManager.startConversation(shipmentId, [
                    shipment.userId, travelerId
                ]);
                
                // إرسال رسالة ترحيب
                window.messagingManager.sendTextMessage(conversationId, travelerId, 
                    `مرحباً! تم قبول شحنتك. سأتواصل معك قريباً.`);
            }
            
            this.saveShipments();
            this.saveTravelers();
            
            return true;
        }
        return false;
    }true;
        }
        return false;
    }

    // بيانات نموذجية للاختبار
    initSampleData() {
        if (this.shipments.length === 0) {
            const sampleShipments = [
                {
                    id: '1',
                    userId: 'client1',
                    type: 'small',
                    description: 'مستندات مهمة',
                    weight: 2,
                    dimensions: '30x20x5',
                    fromCity: 'الرياض',
                    toCity: 'جدة',
                    preferredDate: new Date(Date.now() + 86400000).toISOString(),
                    offerPrice: 80,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    userId: 'client2',
                    type: 'medium',
                    description: 'لابتوب وأجهزة إلكترونية',
                    weight: 8,
                    dimensions: '50x40x20',
                    fromCity: 'الدمام',
                    toCity: 'الرياض',
                    preferredDate: new Date(Date.now() + 172800000).toISOString(),
                    offerPrice: 150,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                }
            ];
            this.shipments.push(...sampleShipments);
        }

        if (this.travelers.length === 0) {
            const sampleTravelers = [
                {
                    id: '1',
                    userId: 'traveler1',
                    type: 'small',
                    name: 'أحمد محمد',
                    vehicleType: 'taxi',
                    capacity: 20,
                    fromCity: 'الرياض',
                    toCity: 'جدة',
                    departureTime: new Date(Date.now() + 86400000).toISOString(),
                    price: 70,
                    rating: 4.8,
                    completedTrips: 12
                },
                {
                    id: '2',
                    userId: 'traveler2',
                    type: 'medium',
                    name: 'خالد السيد',
                    vehicleType: 'car',
                    capacity: 500,
                    fromCity: 'الدمام',
                    toCity: 'الرياض',
                    departureTime: new Date(Date.now() + 172800000).toISOString(),
                    price: 120,
                    rating: 4.9,
                    completedTrips: 8
                }
            ];
            this.travelers.push(...sampleTravelers);
        }
        
        this.saveShipments();
        this.saveTravelers();
    }

    // الحصول على شحنة بواسطة ID
    getShipmentById(id) {
        return this.shipments.find(s => s.id === id);
    }

    // الحصول على موصل بواسطة ID
    getTravelerById(id) {
        return this.travelers.find(t => t.id === id);
    }

    // الحصول على شحنات المستخدم
    getUserShipments(userId) {
        return this.shipments.filter(s => s.userId === userId);
    }

    // الحصول على رحلات المستخدم
    getUserTravelers(userId) {
        return this.travelers.filter(t => t.userId === userId);
    }

    // حفظ البيانات في localStorage
    saveShipments() {
        localStorage.setItem('fastship_shipments', JSON.stringify(this.shipments));
    }

    loadShipments() {
        return JSON.parse(localStorage.getItem('fastship_shipments') || '[]');
    }

    saveTravelers() {
        localStorage.setItem('fastship_travelers', JSON.stringify(thi    // جعل النظام متاحاً globally
    window.shipmentManager = new ShipmentManager();

    // دوال مساعدة للواجهة
    function showRecommendations(shipmentId) {
        const shipment = window.shipmentManager.shipments.find(s => s.id === shipmentId);
        if (!shipment || !shipment.recommendations) return;

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-800">توصيات ذكية</h3>
                    <button onclick="closeRecommendationsModal()" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                </div>
                
                <div class="space-y-4">
                    ${shipment.recommendations.map(rec => `
                        <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="text-lg font-semibold text-gray-800">${rec.title}</h4>
                                <span class="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    ${Math.round(rec.confidence * 100)}% تطابق
                                </span>
                            </div>
                            <p class="text-gray-600 mb-3">${rec.description}</p>
                            <div class="flex gap-2">
                                <button onclick="selectRecommendation('${rec.traveler.id}')" 
                                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                                    اختيار
                                </button>
                                <button onclick="viewTravelerDetails('${rec.traveler.id}')" 
                                        class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold">
                                    تفاصيل
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    function closeRecommendationsModal() {
        const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
        if (modal) {
            modal.remove();
        }
    }

    function selectRecommendation(travelerId) {
        // في التطبيق الحقيقي، هنا سنقوم بقبول الشحنة
        showNotification('تم اختيار الموصل بنجاح!', 'success');
        closeRecommendationsModal();
    }

    function viewTravelerDetails(travelerId) {
        // في التطبيق الحقيقي، هنا سنعرض تفاصيل الموصل
        showNotification('عرض تفاصيل الموصل', 'info');
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
    }alStorage.getItem('fastship_travelers') || '[]');
    }
}

// جعل النظام متاحاً globally
window.shipmentManager = new ShipmentManager();
[file content end]

[file name]: index.html
[file content begin]
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>الشحنة السريعة - منصة الشحن الذكية</title>
    <meta name="description" content="منصة إلكترونية تربط بين أصحاب الشحنات والمسافرين لاستغلال المساحة الفارغة وتسهيل نقل الشحنات حول العالم">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Custom Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Firebase -->
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
        
        const firebaseConfig = {
            apiKey: "AIzaSyChPGP2JICwH_IGs7BT-DDZH2LzuK7_L58",
            authDomain: "fastship-2026.firebaseapp.com",
            projectId: "fastship-2026",
            storageBucket: "fastship-2026.firebasestorage.app",
            messagingSenderId: "646769615933",
            appId: "1:646769615933:web:5fd3c82c31969192f9f654"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        
        window.firebaseAuth = auth;
        window.firebaseOnAuthStateChanged = onAuthStateChanged;
        window.firebaseSignOut = signOut;
    </script>
    
    <style>
        body {
            font-family: 'Tajawal', 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .hero-bg {
            background: linear-gradient(rgba(26, 54, 93, 0.8), rgba(26, 54, 93, 0.8)), url('resources/hero-logistics.jpg');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
        }
        
        .gradient-text {
            background: linear-gradient(45deg, #ed8936, #1a365d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .card-hover {
            transition: all 0.3s ease;
        }
        
        .card-hover:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .rtl {
            direction: rtl;
        }
        
        .ltr {
            direction: ltr;
        }
        
        .type-badge {
            font-size: 0.75rem;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-weight: 600;
        }
        
        .type-small { background: #dbeafe; color: #1e40af; }
        .type-medium { background: #fef3c7; color: #92400e; }
        .type-large { background: #dcfce7; color: #166534; }
        .type-x-large { background: #fae8ff; color: #86198f; }
    </style>
</head>
<body class="rtl">
    <!-- Navigation -->
    <nav class="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <h1 class="text-2xl font-bold gradient-text">الشحنة السريعة</h1>
                    </div>
                </div>
                
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4 space-x-reverse">
                        <a href="index.html" class="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-blue-600">الرئيسية</a>
                        <a href="travelers.html" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">المسافرون</a>
                        <a href="dashboard.html" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">لوحة التحكم</a>
                        <a href="support.html" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">الدعم</a>
                    </div>
                </div>
                
                <div class="flex items-center space-x-4 space-x-reverse">
                    <a href="login.html" id="login-btn" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                        تسجيل الدخول
                    </a>
                    <a href="register.html" id="register-btn" class="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        إنشاء حساب
                    </a>
                    <div id="user-menu" class="hidden flex items-center space-x-4 space-x-reverse">
                        <div class="flex items-center">
                            <img id="user-avatar" src="https://kimi-web-img.moonshot.cn/img/www.dropoff.com/55cca0b187c44c02ad7d55fdd54a23b1061a7806.jpeg" alt="الملف الشخصي" class="w-8 h-8 rounded-full object-cover ml-2">
                            <div class="text-right">
                                <div id="user-name" class="text-sm font-medium text-gray-700"></div>
                                <div id="user-type" class="text-xs text-gray-500"></div>
                            </div>
                        </div>
                        <button onclick="logout()" class="text-gray-700 hover:text-blue-600 text-sm">
                            تسجيل الخروج
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-bg min-h-screen flex items-center pt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div class="text-center text-white">
                <h1 class="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    الربط الذكي بين الشحنات والموصلين
                    <br>
                    <span class="gradient-text">من 1 جرام إلى 1000 طن</span>
                </h1>
                <p class="text-xl mb-12 text-gray-200 leading-relaxed max-w-3xl mx-auto">
                    منصة إلكترونية ذكية تربط بين أصحاب الشحنات والموصلين حسب الحجم، المسار، والتوقيت المناسب
                </p>
                
                <!-- نظام التصنيف الجديد -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
                    <!-- قسم أصحاب الشحنات -->
                    <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                        <div class="text-center mb-6">
                            <div class="text-6xl mb-4">🎒</div>
                            <h3 class="text-3xl font-bold text-white mb-4">لأصحاب الشحنات</h3>
                        </div>
                        
                        <div class="space-y-4">
                            <div class="bg-white/20 rounded-xl p-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="type-badge type-small">صغيرة</span>
                                    <span class="text-white font-semibold">حتى 20 كجم</span>
                                </div>
                                <p class="text-gray-200 text-sm">مستندات، كتب، هدايا صغيرة</p>
                                <p class="text-green-300 text-xs mt-1">↳ مع: مسافرين عاديين</p>
                            </div>
                            
                            <div class="bg-white/20 rounded-xl p-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="type-badge type-medium">متوسطة</span>
                                    <span class="text-white font-semibold">حتى 1.5 طن</span>
                                </div>
                                <p class="text-gray-200 text-sm">أجهزة إلكترونية، ملابس، أطعمة</p>
                                <p class="text-green-300 text-xs mt-1">↳ مع: أصحاب سيارات</p>
                            </div>
                            
                            <div class="bg-white/20 rounded-xl p-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="type-badge type-large">كبيرة</span>
                                    <span class="text-white font-semibold">حتى 50 طن</span>
                                </div>
                                <p class="text-gray-200 text-sm">أثاث، أجهزة، بضائع متوسطة</p>
                                <p class="text-green-300 text-xs mt-1">↳ مع: أصحاب شاحنات</p>
                            </div>
                            
                            <div class="bg-white/20 rounded-xl p-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="type-badge type-x-large">عملاقة</span>
                                    <span class="text-white font-semibold">فوق 50 طن</span>
                                </div>
                                <p class="text-gray-200 text-sm">معدات، بضائع كبيرة، حاويات</p>
                                <p class="text-green-300 text-xs mt-1">↳ مع: أساطيل الشحن</p>
                            </div>
                        </div>
                        
                        <div class="mt-6 text-center">
                            <button onclick="handleSendShipment()" class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
                                أرسل شحنتك
                            </button>
                        </div>
                    </div>

                    <!-- قسم الموصلين -->
                    <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                        <div class="text-center mb-6">
                            <div class="text-6xl mb-4">🚗</div>
                            <h3 class="text-3xl font-bold text-white mb-4">للموصلين</h3>
                        </div>
                        
                        <div class="space-y-4">
                            <div class="bg-white/20 rounded-xl p-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="type-badge type-small">مسافر عادي</span>
                                    <span class="text-white font-semibold">تاكسي/باص</span>
                                </div>
                                <p class="text-gray-200 text-sm">تاكسي، حافلة، طائرة، قطار</p>
                                <p class="text-blue-300 text-xs mt-1">↳ ينقل: شحنات صغيرة</p>
                            </div>
                            
                            <div class="bg-white/20 rounded-xl p-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="type-badge type-medium">صاحب سيارة</span>
                                    <span class="text-white font-semibold">سيارات خاصة</span>
                                </div>
                                <p class="text-gray-200 text-sm">سيارات خاصة، بيك اب، سيارات عائلية</p>
                                <p class="text-blue-300 text-xs mt-1">↳ ينقل: شحنات متوسطة</p>
                            </div>
                            
                            <div class="bg-white/20 rounded-xl p-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="type-badge type-large">صاحب شاحنة</span>
                                    <span class="text-white font-semibold">شاحنات</span>
                                </div>
                                <p class="text-gray-200 text-sm">شاحنات، دينات، تريلات، مقطورات</p>
                                <p class="text-blue-300 text-xs mt-1">↳ ينقل: شحنات كبيرة</p>
                            </div>
                            
                            <div class="bg-white/20 rounded-xl p-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="type-badge type-x-large">أساطيل</span>
                                    <span class="text-white font-semibold">شركات شحن</span>
                                </div>
                                <p class="text-gray-200 text-sm">شركات شحن، طائرات، سفن، قطارات</p>
                                <p class="text-blue-300 text-xs mt-1">↳ تنقل: شحنات عملاقة</p>
                            </div>
                        </div>
                        
                        <div class="mt-6 text-center">
                            <button onclick="handleDeliverShipments()" class="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
                                كن موصلًا
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Trust Indicators -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mt-12">
                    <div>
                        <div class="text-4xl font-bold counter" data-target="15000">0</div>
                        <div class="text-lg text-gray-300">شحنة تم توصيلها</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold counter" data-target="2500">0</div>
                        <div class="text-lg text-gray-300">موصل نشط</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold counter" data-target="98">0</div>
                        <div class="text-lg text-gray-300">نسبة الرضا</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold counter" data-target="500">0</div>
                        <div class="text-lg text-gray-300">مدينة مغطاة</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- نظام الربط الذكي -->
    <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">كيف يعمل نظام الربط الذكي؟</h2>
                <p class="text-xl text-gray-600">خوارزمية متطورة تربط بين الشحنات والموصلين المناسبين</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="text-center card-hover bg-gray-50 rounded-2xl p-8">
                    <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span class="text-3xl">⚡</span>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">التصنيف التلقائي</h3>
                    <p class="text-gray-600 leading-relaxed">نصنف الشحنات والموصلين تلقائياً حسب الحجم، الوزن، ونوع المركبة</p>
                </div>
                
                <div class="text-center card-hover bg-gray-50 rounded-2xl p-8">
                    <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span class="text-3xl">🎯</span>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">مطابقة ذكية</h3>
                    <p class="text-gray-600 leading-relaxed">نربط الشحنات مع الموصلين المناسبين حسب المسار، التوقيت، والسعة</p>
                </div>
                
                <div class="text-center card-hover bg-gray-50 rounded-2xl p-8">
                    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span class="text-3xl">🚀</span>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">توصيل فعال</h3>
                    <p class="text-gray-600 leading-relaxed">نضمن توصيل الشحنات بأفضل الأسعار وأسرع الأوقات مع الموثوقية الكاملة</p>
                </div>
            </div>
        </div>
    </section>

    <!-- أمثلة حية على الربط -->
    <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">أمثلة على الربط الذكي</h2>
                <p class="text-xl text-gray-600">شاهد كيف نربط بين الشحنات والموصلين بشكل ذكي</p>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- مثال 1 -->
                <div class="bg-white rounded-2xl p-6 card-hover">
                    <div class="flex items-center justify-between mb-4">
                        <span class="type-badge type-small">شحنة صغيرة</span>
                        <span class="type-badge type-small">موصل صغير</span>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">الوزن:</span>
                            <span class="font-semibold">2 كجم</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">المسار:</span>
                            <span class="font-semibold">الرياض → جدة</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">الموصل:</span>
                            <span class="font-semibold">تاكسي مسافر</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">السعر:</span>
                            <span class="font-semibold text-green-600">80 ريال</span>
                        </div>
                    </div>
                </div>
                
                <!-- مثال 2 -->
                <div class="bg-white rounded-2xl p-6 card-hover">
                    <div class="flex items-center justify-between mb-4">
                        <span class="type-badge type-medium">شحنة متوسطة</span>
                        <span class="type-badge type-medium">موصل متوسط</span>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">الوزن:</span>
                            <span class="font-semibold">500 كجم</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">المسار:</span>
                            <span class="font-semibold">الدمام → الرياض</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">الموصل:</span>
                            <span class="font-semibold">صاحب بيك اب</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">السعر:</span>
                            <span class="font-semibold text-green-600">250 ريال</span>
                        </div>
                    </div>
                </div>
                
                <!-- مثال 3 -->
                <div class="bg-white rounded-2xl p-6 card-hover">
                    <div class="flex items-center justify-between mb-4">
                        <span class="type-badge type-large">شحنة كبيرة</span>
                        <span class="type-badge type-large">موصل كبير</span>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">الوزن:</span>
                            <span class="font-semibold">5 أطنان</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">المسار:</span>
                            <span class="font-semibold">جدة → أبها</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">الموصل:</span>
                            <span class="font-semibold">شاحنة دينة</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">السعر:</span>
                            <span class="font-semibold text-green-600">800 ريال</span>
                        </div>
                    </div>
                </div>
                
                <!-- مثال 4 -->
                <div class="bg-white rounded-2xl p-6 card-hover">
                    <div class="flex items-center justify-between mb-4">
                        <span class="type-badge type-x-large">شحنة عملاقة</span>
                        <span class="type-badge type-x-large">موصل عملاق</span>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">الوزن:</span>
                            <span class="font-semibold">100 طن</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">المسار:</span>
                            <span class="font-semibold">الرياض → دبي</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">الموصل:</span>
                            <span class="font-semibold">أسطول شحن</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">السعر:</span>
                            <span class="font-semibold text-green-600">5,000 ريال</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-2xl font-bold gradient-text mb-4">الشحنة السريعة</h3>
                    <p class="text-gray-400 leading-relaxed">
                        منصة إلكترونية ذكية تربط بين أصحاب الشحنات والموصلين لاستغلال المساحات الفارغة وتسهيل نقل الشحنات.
                    </p>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-4">روابط سريعة</h4>
                    <ul class="space-y-2">
                        <li><a href="index.html" class="text-gray-400 hover:text-white transition-colors">الرئيسية</a></li>
                        <li><a href="travelers.html" class="text-gray-400 hover:text-white transition-colors">المسافرون</a></li>
                        <li><a href="dashboard.html" class="text-gray-400 hover:text-white transition-colors">لوحة التحكم</a></li>
                        <li><a href="support.html" class="text-gray-400 hover:text-white transition-colors">الدعم الفني</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-4">المساعدة</h4>
                    <ul class="space-y-2">
                        <li><a href="support.html" class="text-gray-400 hover:text-white transition-colors">الأسئلة الشائعة</a></li>
                        <li><a href="terms.html" class="text-gray-400 hover:text-white transition-colors">الشروط والأحكام</a></li>
                        <li><a href="privacy.html" class="text-gray-400 hover:text-white transition-colors">سياسة الخصوصية</a></li>
                        <li><a href="support.html" class="text-gray-400 hover:text-white transition-colors">اتصل بنا</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-4">معلومات التواصل</h4>
                    <div class="space-y-2 text-gray-400">
                        <p>📧 gide1979@gmail.com</p>
                        <p>📞 +966551519723</p>
                        <p>📍 المملكة العربية السعودية</p>
                    </div>
                    <div class="mt-4">
                        <p class="text-sm text-gray-400">
                            صاحب الفكرة: قايد صالح المصعبي
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="border-t border-gray-800 mt-8 pt-8 text-center">
                <p class="text-gray-400">
                    © 2024 الشحنة السريعة. جميع الحقوق محفوظة | قايد صالح المصعبي
                </p>
            </div>
        </div>
    </footer>

    <!-- JavaScript -->
    <script src="shipment.js"></script>
    <script>
        // تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
        function updateAuthUI(user) {
            const loginBtn = document.getElementById('login-btn');
            const registerBtn = document.getElementById('register-btn');
            const userMenu = document.getElementById('user-menu');
            const userName = document.getElementById('user-name');
            const userType = document.getElementById('user-type');
            const userAvatar = document.getElementById('user-avatar');

            if (user) {
                if (loginBtn) loginBtn.style.display = 'none';
                if (registerBtn) registerBtn.style.display = 'none';
                if (userMenu) userMenu.classList.remove('hidden');
                if (userName) userName.textContent = user.displayName || user.email;
                if (userType) userType.textContent = 'مستخدم';
                if (userAvatar) userAvatar.src = user.photoURL || 'https://kimi-web-img.moonshot.cn/img/www.dropoff.com/55cca0b187c44c02ad7d55fdd54a23b1061a7806.jpeg';
            } else {
                if (loginBtn) loginBtn.style.display = 'block';
                if (registerBtn) registerBtn.style.display = 'block';
                if (userMenu) userMenu.classList.add('hidden');
            }
        }

        // تسجيل الخروج
        async function logout() {
            try {
                await window.firebaseSignOut(window.firebaseAuth);
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('خطأ في تسجيل الخروج:', error);
            }
        }

        // معالجة زر إرسال شحنة
        function handleSendShipment() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            if (currentUser && currentUser.uid) {
                window.location.href = 'dashboard.html?action=create-shipment';
            } else {
                window.location.href = 'register.html?type=client';
            }
        }

        // معالجة زر كن موصلًا
        function handleDeliverShipments() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            if (currentUser && currentUser.uid) {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'register.html?type=traveler';
            }
        }

        // التحقق من حالة المصادقة عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', function() {
            window.firebaseOnAuthStateChanged(window.firebaseAuth, (user) => {
                if (user) {
                    const userData = {
                        uid: user.uid,
                        email: user.email,
                        emailVerified: user.emailVerified,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    };
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    updateAuthUI(userData);
                } else {
                    localStorage.removeItem('currentUser');
                    updateAuthUI(null);
                }
            });

            // تحميل بيانات المستخدم من localStorage
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                updateAuthUI(JSON.parse(savedUser));
            }

            // تفعيل العدادات
            const counters = document.querySelectorAll('.counter');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const increment = target / 100;
                let current = 0;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            updateCounter();
                            observer.unobserve(entry.target);
                        }
                    });
                });

                observer.observe(counter);
            });

            console.log('تم تحميل نظام الشحنة السريعة بنجاح!');
        });
    </script>
</body>
</html>
[file content end]

[file name]: dashboard.html
[file content begin]
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لوحة التحكم - الشحنة السريعة</title>
    <meta name="description" content="إدارة شحناتك، حسابك، ومتابعة نشاطك على منصة الشحنة السريعة">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Custom Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Firebase -->
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
        const firebaseConfig = {
            apiKey: "AIzaSyChPGP2JICwH_IGs7BT-DDZH2LzuK7_L58",
            authDomain: "fastship-2026.firebaseapp.com",
            projectId: "fastship-2026",
            storageBucket: "fastship-2026.firebasestorage.app",
            messagingSenderId: "646769615933",
            appId: "1:646769615933:web:5fd3c82c31969192f9f654"
        };
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        window.firebaseAuth = auth;
        window.firebaseOnAuthStateChanged = onAuthStateChanged;
        window.firebaseSignOut = signOut;
    </script>
    
    <style>
        body {
            font-family: 'Tajawal', 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .gradient-text {
            background: linear-gradient(45deg, #ed8936, #1a365d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .card-hover {
            transition: all 0.3s ease;
        }
        .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }
        .dashboard-tab {
            transition: all 0.3s ease;
        }
        .dashboard-tab.active {
            background-color: #3b82f6;
            color: white;
        }
        .tab-content {
            animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .rtl {
            direction: rtl;
        }
        .ltr {
            direction: ltr;
        }
        .status-badge {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-weight: 500;
        }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-in-transit { background-color: #dbeafe; color: #1e40af; }
        .status-delivered { background-color: #d1fae5; color: #065f46; }
        .status-cancelled { background-color: #fee2e2; color: #991b1b; }
        .type-badge {
            font-size: 0.7rem;
            padding: 0.2rem 0.6rem;
            border-radius: 1rem;
            font-weight: 600;
        }
        .type-small { background: #dbeafe; color: #1e40af; }
        .type-medium { background: #fef3c7; color: #92400e; }
        .type-large { background: #dcfce7; color: #166534; }
        .type-x-large { background: #fae8ff; color: #86198f; }
    </style>
</head>
<body class="rtl">
    <!-- Navigation -->
    <nav class="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <h1 class="text-2xl font-bold gradient-text">الشحنة السريعة</h1>
                    </div>
                </div>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4 space-x-reverse">
                        <a href="index.html" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">الرئيسية</a>
                        <a href="travelers.html" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">المسافرون</a>
                        <a href="dashboard.html" class="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-blue-600">لوحة التحكم</a>
                        <a href="support.html" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">الدعم</a>
                    </div>
                </div>
                <div class="flex items-center space-x-4 space-x-reverse">
                    <a href="login.html" id="login-btn" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">تسجيل الدخول</a>
                    <a href="register.html" id="register-btn" class="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">إنشاء حساب</a>
                    <div id="user-menu" class="hidden flex items-center space-x-4 space-x-reverse">
                        <img id="user-avatar" src="https://kimi-web-img.moonshot.cn/img/www.dropoff.com/55cca0b187c44c02ad7d55fdd54a23b1061a7806.jpeg" alt="الملف الشخصي" class="w-8 h-8 rounded-full object-cover ml-2">
                        <div class="text-right">
                            <div id="user-name" class="text-sm font-medium text-gray-700"></div>
                            <div id="user-type" class="text-xs text-gray-500"></div>
                        </div>
                        <button onclick="logout()" class="text-gray-700 hover:text-blue-600 text-sm">تسجيل الخروج</button>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Header Section -->
    <section class="pt-24 pb-8 bg-gradient-to-br from-blue-600 to-purple-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-white">
                <h1 class="text-3xl lg:text-4xl font-bold mb-2" id="welcome-message">مرحباً!</h1>
                <p class="text-blue-100">إدارة شحناتك ومتابعة نشاطك على المنصة</p>
            </div>
        </div>
    </section>

    <!-- Main Dashboard -->
    <section class="py-8 bg-gray-50 min-h-screen">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- رسالة تسجيل الدخول -->
            <div id="login-required" class="bg-white rounded-2xl p-8 shadow-lg text-center mb-8">
                <div class="text-6xl mb-4">🔒</div>
                <h3 class="text-2xl font-bold text-gray-800 mb-4">يجب تسجيل الدخول</h3>
                <p class="text-gray-600 mb-6">يجب عليك تسجيل الدخول للوصول إلى لوحة التحكم</p>
                <div class="flex justify-center gap-4">
                    <a href="login.html" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">تسجيل الدخول</a>
                    <a href="register.html" class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">إنشاء حساب</a>
                </div>
            </div>

            <!-- لوحة التحكم للمستخدمين المسجلين -->
            <div id="dashboard-content" class="hidden">
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <!-- Sidebar -->
                    <div class="lg:col-span-1">
                        <div class="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
                            <!-- User Profile -->
                            <div class="text-center mb-8">
                                <img id="profile-image" src="https://kimi-web-img.moonshot.cn/img/www.dropoff.com/55cca0b187c44c02ad7d55fdd54a23b1061a7806.jpeg" alt="الملف الشخصي" class="w-20 h-20 rounded-full object-cover mx-auto mb-4">
                                <h3 id="sidebar-user-name" class="text-lg font-bold text-gray-800">زائر</h3>
                                <p id="member-since" class="text-sm text-gray-600">يرجى تسجيل الدخول</p>
                                <div class="flex items-center justify-center mt-2">
                                    <span class="text-yellow-500 ml-1">★</span>
                                    <span id="user-rating" class="text-sm text-gray-600">-</span>
                                </div>
                            </div>
                            
                            <!-- Quick Stats -->
                            <div class="grid grid-cols-2 gap-4 mb-8">
                                <div class="text-center">
                                    <div id="completed-shipments" class="text-2xl font-bold text-blue-600">0</div>
                                    <div class="text-xs text-gray-600">شحنة مكتملة</div>
                                </div>
                                <div class="text-center">
                                    <div id="total-earnings" class="text-2xl font-bold text-green-600">0</div>
                                    <div class="text-xs text-gray-600">ريال مدفوع</div>
                                </div>
                            </div>
                            
                            <!-- Navigation Tabs -->
                            <nav class="space-y-2">
                                <button class="dashboard-tab w-full text-right px-4 py-3 rounded-lg bg-blue-500 text-white font-medium transition-colors" data-tab="overview">📊 نظرة عامة</button>
                                <button class="dashboard-tab w-full text-right px-4 py-3 rounded-lg bg-gray-200 text-gray-700 font-medium transition-colors hover:bg-gray-300" data-tab="shipments">📦 شحناتي</button>
                                <button class="dashboard-tab w-full text-right px-4 py-3 rounded-lg bg-gray-200 text-gray-700 font-medium transition-colors hover:bg-gray-300" data-tab="travelers">🚗 رحلاتي</button>
                                <button class="dashboard-tab w-full text-right px-4 py-3 rounded-lg bg-gray-200 text-gray-700 font-medium transition-colors hover:bg-gray-300" data-tab="messages">💬 الرسائل</button>
                                <button class="dashboard-tab w-full text-right px-4 py-3 rounded-lg bg-gray-200 text-gray-700 font-medium transition-colors hover:bg-gray-300" data-tab="profile">👤 الملف الشخصي</button>
                            </nav>
                        </div>
                    </div>
                    
                    <!-- Main Content -->
                    <div class="lg:col-span-3">
                        <!-- Overview Tab -->
                        <div id="overview-content" class="tab-content">
                            <!-- Quick Actions -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <!-- لأصحاب الشحنات -->
                                <div class="bg-white rounded-2xl p-6 shadow-lg">
                                    <h3 class="text-lg font-bold text-gray-800 mb-4">🎒 لأصحاب الشحنات</h3>
                                    <div class="space-y-4">
                                        <button onclick="showCreateShipmentForm()" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-right">
                                            📦 إرسال شحنة جديدة
                                        </button>
                                        <button onclick="showMatchingTravelers()" class="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-right">
                                            🔍 البحث عن موصلين
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- للموصلين -->
                                <div class="bg-white rounded-2xl p-6 shadow-lg">
                                    <h3 class="text-lg font-bold text-gray-800 mb-4">🚗 للموصلين</h3>
                                    <div class="space-y-4">
                                        <button onclick="showCreateTravelerForm()" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-right">
                                            🚀 إضافة رحلة جديدة
                                        </button>
                                        <button onclick="showMatchingShipments()" class="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-right">
                                            📋 الشحنات المتطابقة
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- نظام التصنيف -->
                            <div class="bg-white rounded-2xl p-6 shadow-lg mb-8">
                                <h3 class="text-lg font-bold text-gray-800 mb-4">🎯 نظام التصنيف والربط</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div class="space-y-2">
                                        <div class="flex justify-between items-center p-2 bg-blue-50 rounded">
                                            <span class="type-badge type-small">صغيرة</span>
                                            <span>← مسافر عادي</span>
                                        </div>
                                        <div class="flex justify-between items-center p-2 bg-yellow-50 rounded">
                                            <span class="type-badge type-medium">متوسطة</span>
                                            <span>← صاحب سيارة</span>
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        <div class="flex justify-between items-center p-2 bg-green-50 rounded">
                                            <span class="type-badge type-large">كبيرة</span>
                                            <span>← صاحب شاحنة</span>
                                        </div>
                                        <div class="flex justify-between items-center p-2 bg-purple-50 rounded">
                                            <span class="type-badge type-x-large">عملاقة</span>
                                            <span>← أساطيل الشحن</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- الإحصائيات -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div class="bg-white rounded-2xl p-6 shadow-lg text-center">
                                    <div class="text-3xl font-bold text-blue-600 mb-2" id="stats-total-shipments">0</div>
                                    <div class="text-gray-600">إجمالي الشحنات</div>
                                </div>
                                <div class="bg-white rounded-2xl p-6 shadow-lg text-center">
                                    <div class="text-3xl font-bold text-green-600 mb-2" id="stats-completed">0</div>
                                    <div class="text-gray-600">مكتملة</div>
                                </div>
                                <div class="bg-white rounded-2xl p-6 shadow-lg text-center">
                                    <div class="text-3xl font-bold text-orange-600 mb-2" id="stats-pending">0</div>
                                    <div class="text-gray-600">قيد الانتظار</div>
                                </div>
                            </div>
                        </div>

                        <!-- Shipments Tab -->
                        <div id="shipments-content" class="tab-content hidden">
                            <div class="bg-white rounded-2xl p-6 shadow-lg">
                                <div class="flex justify-between items-center mb-6">
                                    <h3 class="text-lg font-bold text-gray-800">شحناتي</h3>
                                    <button onclick="showCreateShipmentForm()" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                                        + إضافة شحنة
                                    </button>
                                </div>
                                <div id="shipments-list"></div>
                            </div>
                        </div>

                        <!-- Travelers Tab -->
                        <div id="travelers-content" class="tab-content hidden">
                            <div class="bg-white rounded-2xl p-6 shadow-lg">
                                <div class="flex justify-between items-center mb-6">
                                    <h3 class="text-lg font-bold text-gray-800">رحلاتي</h3>
                                    <button onclick="showCreateTravelerForm()" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                                        + إضافة رحلة
                                    </button>
                                </div>
                                <div id="travelers-list"></div>
                            </div>
                        </div>

                        <!-- باقي التبويبات -->
                        <div id="messages-content" class="tab-content hidden">
                            <div class="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 class="text-lg font-bold text-gray-800 mb-6">الرسائل</h3>
                                <p class="text-gray-600 text-center py-8">سيتم تفعيل نظام الرسائل قريباً</p>
                            </div>
                        </div>
                        
                        <div id="profile-content" class="tab-content hidden">
                            <div class="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 class="text-lg font-bold text-gray-800 mb-6">الملف الشخصي</h3>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                                        <input type="email" id="profile-email" class="w-full px-3 py-2 border border-gray-300 rounded-lg" readonly>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">نوع الحساب</label>
                                        <input type="text" id="profile-type" class="w-full px-3 py-2 border border-gray-300 rounded-lg" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-2xl font-bold gradient-text mb-4">الشحنة السريعة</h3>
                    <p class="text-gray-400 leading-relaxed">
                        منصة إلكترونية تربط بين أصحاب الشحنات والمسافرين لاستغلال الحمولة الفارغة وتسهيل نقل الشحنات داخل المملكة وخارجها.
                    </p>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-4">روابط سريعة</h4>
                    <ul class="space-y-2">
                        <li><a href="index.html" class="text-gray-400 hover:text-white transition-colors">الرئيسية</a></li>
                        <li><a href="travelers.html" class="text-gray-400 hover:text-white transition-colors">المسافرون</a></li>
                        <li><a href="dashboard.html" class="text-gray-400 hover:text-white transition-colors">لوحة التحكم</a></li>
                        <li><a href="support.html" class="text-gray-400 hover:text-white transition-colors">الدعم الفني</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-4">المساعدة</h4>
                    <ul class="space-y-2">
                        <li><a href="support.html" class="text-gray-400 hover:text-white transition-colors">الأسئلة الشائعة</a></li>
                        <li><a href="terms.html" class="text-gray-400 hover:text-white transition-colors">الشروط والأحكام</a></li>
                        <li><a href="privacy.html" class="text-gray-400 hover:text-white transition-colors">سياسة الخصوصية</a></li>
                        <li><a href="support.html" class="text-gray-400 hover:text-white transition-colors">اتصل بنا</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-4">معلومات التواصل</h4>
                    <div class="space-y-2 text-gray-400">
                        <p>📧 gide1979@gmail.com</p>
                        <p>📞 +966551519723</p>
                        <p>📍 المملكة العربية السعودية</p>
                    </div>
                    <div class="mt-4">
                        <p class="text-sm text-gray-400">
                            صاحب الفكرة: قايد صالح المصعبي
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="border-t border-gray-800 mt-8 pt-8 text-center">
                <p class="text-gray-400">
                    © 2024 الشحنة السريعة. جميع الحقوق محفوظة | قايد صالح المصعبي
                </p>
            </div>
        </div>
    </footer>

    <!-- JavaScript -->
    <script src="shipment.js"></script>
    <script>
        // تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
        function updateAuthUI(user) {
            const loginBtn = document.getElementById('login-btn');
            const registerBtn = document.getElementById('register-btn');
            const userMenu = document.getElementById('user-menu');
            const userName = document.getElementById('user-name');
            const userType = document.getElementById('user-type');
            const userAvatar = document.getElementById('user-avatar');

            if (user) {
                if (loginBtn) loginBtn.style.display = 'none';
                if (registerBtn) registerBtn.style.display = 'none';
                if (userMenu) userMenu.classList.remove('hidden');
                if (userName) userName.textContent = user.displayName || user.email;
                if (userType) userType.textContent = 'مستخدم';
                if (userAvatar) userAvatar.src = user.photoURL || 'https://kimi-web-img.moonshot.cn/img/www.dropoff.com/55cca0b187c44c02ad7d55fdd54a23b1061a7806.jpeg';
            } else {
                if (loginBtn) loginBtn.style.display = 'block';
                if (registerBtn) registerBtn.style.display = 'block';
                if (userMenu) userMenu.classList.add('hidden');
            }
        }

        // تسجيل الخروج
        async function logout() {
            try {
                await window.firebaseSignOut(window.firebaseAuth);
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('خطأ في تسجيل الخروج:', error);
            }
        }

        // دوال لوحة التحكم
        document.addEventListener('DOMContentLoaded', function() {
            // التحقق من حالة المصادقة
            window.firebaseOnAuthStateChanged(window.firebaseAuth, (user) => {
                if (user) {
                    const userData = {
                        uid: user.uid,
                        email: user.email,
                        emailVerified: user.emailVerified,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    };
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    updateAuthUI(userData);
                    
                    // إظهار لوحة التحكم
                    document.getElementById('login-required').style.display = 'none';
                    document.getElementById('dashboard-content').classList.remove('hidden');
                    
                    // تحديث معلومات المستخدم
                    updateUserInfo(userData);
                    setupTabs();
                    loadUserData();
                } else {
                    localStorage.removeItem('currentUser');
                    updateAuthUI(null);
                    document.getElementById('login-required').style.display = 'block';
                    document.getElementById('dashboard-content').classList.add('hidden');
                }
            });

            // تحميل بيانات المستخدم من localStorage
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                updateAuthUI(JSON.parse(savedUser));
            }

            function updateUserInfo(user) {
                document.getElementById('welcome-message').textContent = `مرحباً ${user.displayName || user.email}!`;
                document.getElementById('sidebar-user-name').textContent = user.displayName || user.email;
                document.getElementById('profile-image').src = user.photoURL || 'https://kimi-web-img.moonshot.cn/img/www.dropoff.com/55cca0b187c44c02ad7d55fdd54a23b1061a7806.jpeg';
                document.getElementById('member-since').textContent = `عضو منذ ${new Date().getFullYear()}`;
                document.getElementById('profile-email').value = user.email;
                document.getElementById('profile-type').value = user.accountType || 'عميل';
            }

            function setupTabs() {
                const tabs = document.querySelectorAll('.dashboard-tab');
                tabs.forEach(tab => {
                    tab.addEventListener('click', function() {
                        tabs.forEach(t => {
                            t.classList.remove('bg-blue-500', 'text-white');
                            t.classList.add('bg-gray-200', 'text-gray-700');
                        });
                        this.classList.remove('bg-gray-200', 'text-gray-700');
                        this.classList.add('bg-blue-500', 'text-white');
                        
                        const tabName = this.dataset.tab;
                        document.querySelectorAll('.tab-content').forEach(content => {
                            content.classList.add('hidden');
                        });
                        document.getElementById(`${tabName}-content`).classList.remove('hidden');
                    });
                });
            }

            function loadUserData() {
                const user = JSON.parse(localStorage.getItem('currentUser'));
                if (!user) return;

                // تحميل الشحنات والرحلات
                const userShipments = window.shipmentManager.getUserShipments(user.uid);
                const userTravelers = window.shipmentManager.getUserTravelers(user.uid);

                // تحديث الإحصائيات
                document.getElementById('stats-total-shipments').textContent = userShipments.length;
                document.getElementById('stats-completed').textContent = userShipments.filter(s => s.status === 'delivered').length;
                document.getElementById('stats-pending').textContent = userShipments.filter(s => s.status === 'pending').length;
                document.getElementById('completed-shipments').textContent = userShipments.filter(s => s.status === 'delivered').length;
                
                // حساب الإيرادات
                const totalEarnings = userTravelers.reduce((sum, traveler) => sum + (traveler.earnings || 0), 0);
                document.getElementById('total-earnings').textContent = totalEarnings.toLocaleString();

                // عرض الشحنات
                displayShipments(userShipments);
                displayTravelers(userTravelers);
            }

            function displayShipments(shipments) {
                const container = document.getElementById('shipments-list');
                if (shipments.length === 0) {
                    container.innerHTML = '<p class="text-gray-600 text-center py-8">لا توجد شحنات</p>';
                    return;
                }

                container.innerHTML = shipments.map(shipment => `
                    <div class="border border-gray-200 rounded-lg p-4 mb-4">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <span class="font-semibold">${shipment.trackingNumber}</span>
                                <span class="type-badge type-${shipment.type} mr-2">${getTypeText(shipment.type)}</span>
                            </div>
                            <span class="status-badge status-${shipment.status}">${getStatusText(shipment.status)}</span>
                        </div>
                        <div class="text-sm text-gray-600">
                            <div>${shipment.description}</div>
                            <div>${shipment.fromCity} → ${shipment.toCity}</div>
                            <div>الوزن: ${shipment.weight} كجم</div>
                            <div>السعر: ${shipment.offerPrice} ريال</div>
                        </div>
                    </div>
                `).join('');
            }

            function displayTravelers(travelers) {
                const container = document.getElementById('travelers-list');
                if (travelers.length === 0) {
                    container.innerHTML = '<p class="text-gray-600 text-center py-8">لا توجد رحلات</p>';
                    return;
                }

                container.innerHTML = travelers.map(traveler => `
                    <div class="border border-gray-200 rounded-lg p-4 mb-4">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <span class="font-semibold">${traveler.name || 'رحلة'}</span>
                                <span class="type-badge type-${traveler.type} mr-2">${getTypeText(traveler.type)}</span>
                            </div>
                            <span class="status-badge status-${traveler.status}">${getStatusText(traveler.status)}</span>
                        </div>
                        <div class="text-sm text-gray-600">
                            <div>${traveler.vehicleType} - سعة ${traveler.capacity} كجم</div>
                            <div>${traveler.fromCity} → ${traveler.toCity}</div>
                            <div>السعر: ${traveler.price} ريال</div>
                            <div>التقييم: ${traveler.rating} ★</div>
                        </div>
                    </div>
                `).join('');
            }

            function getTypeText(type) {
                const types = {
                    'small': 'صغيرة',
                    'medium': 'متوسطة', 
                    'large': 'كبيرة',
                    'x-large': 'عملاقة'
                };
                return types[type] || type;
            }

            function getStatusText(status) {
                const statuses = {
                    'pending': 'قيد الانتظار',
                    'accepted': 'مقبولة',
                    'in-transit': 'في الطريق',
                    'delivered': 'تم التوصيل',
                    'cancelled': 'ملغية'
                };
                return statuses[status] || status;
            }
        });

        // دوال الإجراءات
        function showCreateShipmentForm() {
            alert('سيتم فتح نموذج إضافة شحنة جديدة');
            // في التطبيق الحقيقي: فتح modal أو الانتقال لصفحة إنشاء شحنة
        }

        function showCreateTravelerForm() {
            alert('سيتم فتح نموذج إضافة رحلة جديدة');
            // في التطبيق الحقيقي: فتح modal أو الانتقال لصفحة إنشاء رحلة
        }

        function showMatchingTravelers() {
            alert('جاري البحث عن الموصلين المتطابقين...');
        }

        function showMatchingShipments() {
            alert('جاري البحث عن الشحنات المتطابقة...');
        }
    </script>
</body>
</html>
[file content end]

[file name]: register.html
[file content begin]
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إنشاء حساب - الشحنة السريعة</title>
    <meta name="description" content="أنشئ حسابك الجديد في منصة الشحنة السريعة">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Custom Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>

    <script>
        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyChPGP2JICwH_IGs7BT-DDZH2LzuK7_L58",
            authDomain: "fastship-2026.firebaseapp.com",
            projectId: "fastship-2026",
            storageBucket: "fastship-2026.firebasestorage.app",
            messagingSenderId: "646769615933",
            appId: "1:646769615933:web:5fd3c82c31969192f9f654"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
    </script>
    
    <style>
        body {
            font-family: 'Tajawal', 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .gradient-text {
            background: linear-gradient(45deg, #ed8936, #1a365d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .card-hover {
            transition: all 0.3s ease;
        }
        
        .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }
        
        .rtl {
            direction: rtl;
        }
        
        .ltr {
            direction: ltr;
        }
        
        .step-indicator {
            transition: all 0.3s ease;
        }
        
        .step-indicator.active {
            background-color: #3b82f6;
            color: white;
        }
        
        .type-badge {
            font-size: 0.7rem;
            padding: 0.2rem 0.6rem;
            border-radius: 1rem;
            font-weight: 600;
        }
        .type-small { background: #dbeafe; color: #1e40af; }
        .type-medium { background: #fef3c7; color: #92400e; }
        .type-large { background: #dcfce7; color: #166534; }
        .type-x-large { background: #fae8ff; color: #86198f; }
    </style>
</head>
<body class="rtl">
    <!-- Navigation -->
    <nav class="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <a href="index.html" class="text-2xl font-bold gradient-text">الشحنة السريعة</a>
                    </div>
                </div>
                
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4 space-x-reverse">
                        <a href="index.html" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">الرئيسية</a>
                        <a href="travelers.html" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">المسافرون</a>
                        <a href="dashboard.html" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">لوحة التحكم</a>
                        <a href="support.html" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">الدعم الفني</a>
                    </div>
                </div>
                
                <div class="flex items-center space-x-4 space-x-reverse">
                    <a href="login.html" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                        تسجيل الدخول
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Registration Section -->
    <section class="min-h-screen flex items-center justify-center pt-16 pb-12">
        <div class="max-w-2xl w-full mx-4">
            <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl card-hover">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold gradient-text mb-2">إنشاء حساب جديد</h1>
                    <p class="text-gray-600">انضم إلى منصة الشحنة السريعة وابدأ رحلتك</p>
                </div>

                <!-- Step Indicator -->
                <div class="flex justify-between mb-8">
                    <div class="step-indicator flex-1 text-center py-2 rounded-lg bg-blue-500 text-white font-medium">
                        1. المعلومات الأساسية
                    </div>
                    <div class="step-indicator flex-1 text-center py-2 rounded-lg bg-gray-200 text-gray-700 font-medium mx-2">
                        2. نوع الحساب
                    </div>
                    <div class="step-indicator flex-1 text-center py-2 rounded-lg bg-gray-200 text-gray-700 font-medium">
                        3. التأكيد
                    </div>
                </div>

                <form id="registerForm" class="space-y-6">
                    <!-- Step 1: Basic Information -->
                    <div id="step-1" class="step-content">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">الاسم الأول</label>
                                <input type="text" id="firstName" name="firstName" required 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                       placeholder="الاسم الأول">
                                <div id="firstName-error" class="text-red-500 text-sm mt-1 hidden"></div>
                            </div>
                            
                            <div>
                                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">اسم العائلة</label>
                                <input type="text" id="lastName" name="lastName" required 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                       placeholder="اسم العائلة">
                                <div id="lastName-error" class="text-red-500 text-sm mt-1 hidden"></div>
                            </div>
                        </div>

                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                            <input type="email" id="email" name="email" required 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                   placeholder="أدخل بريدك الإلكتروني">
                            <div id="email-error" class="text-red-500 text-sm mt-1 hidden"></div>
                        </div>

                        <div>
                            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">رقم الجوال</label>
                            <input type="tel" id="phone" name="phone" required 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                   placeholder="05XXXXXXXX">
                            <div id="phone-error" class="text-red-500 text-sm mt-1 hidden"></div>
                        </div>

                        <div>
                            <label for="city" class="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                            <select id="city" name="city" required 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
                                <option value="">اختر المدينة</option>
                                <option value="الرياض">الرياض</option>
                                <option value="جدة">جدة</option>
                                <option value="مكة">مكة</option>
                                <option value="المدينة">المدينة المنورة</option>
                                <option value="الدمام">الدمام</option>
                                <option value="أبها">أبها</option>
                                <option value="الطائف">الطائف</option>
                                <option value="تبوك">تبوك</option>
                            </select>
                            <div id="city-error" class="text-red-500 text-sm mt-1 hidden"></div>
                        </div>

                        <div class="flex justify-end">
                            <button type="button" onclick="nextStep(2)" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                التالي
                            </button>
                        </div>
                    </div>

                    <!-- Step 2: Account Type -->
                    <div id="step-2" class="step-content hidden">
                        <div class="text-center mb-6">
                            <h3 class="text-xl font-semibold text-gray-800">اختر نوع حسابك</h3>
                            <p class="text-gray-600">اختر الدور المناسب لك على المنصة</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <!-- عميل - صاحب شحنات -->
                            <div class="account-type border-2 border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors" data-type="client">
                                <div class="text-4xl mb-4">🎒</div>
                                <h4 class="text-lg font-semibold text-gray-800 mb-2">عميل</h4>
                                <p class="text-sm text-gray-600 mb-4">أريد إرسال شحنات</p>
                                <div class="space-y-2 text-xs text-gray-500 text-right">
                                    <div class="flex justify-between items-center">
                                        <span class="type-badge type-small">صغيرة</span>
                                        <span>مستندات، هدايا</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="type-badge type-medium">متوسطة</span>
                                        <span>أجهزة، ملابس</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="type-badge type-large">كبيرة</span>
                                        <span>أثاث، أجهزة</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="type-badge type-x-large">عملاقة</span>
                                        <span>معدات، بضائع</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- مسافر - موصل -->
                            <div class="account-type border-2 border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 transition-colors" data-type="traveler">
                                <div class="text-4xl mb-4">🚗</div>
                                <h4 class="text-lg font-semibold text-gray-800 mb-2">موصل</h4>
                                <p class="text-sm text-gray-600 mb-4">أريد نقل شحنات</p>
                                <div class="space-y-2 text-xs text-gray-500 text-right">
                                    <div class="flex justify-between items-center">
                                        <span class="type-badge type-small">مسافر عادي</span>
                                        <span>تاكسي، باص</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="type-badge type-medium">صاحب سيارة</span>
                                        <span>سيارات خاصة</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="type-badge type-large">صاحب شاحنة</span>
                                        <span>شاحنات</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="type-badge type-x-large">أساطيل</span>
                                        <span>شركات شحن</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Traveler Additional Info -->
                        <div id="traveler-info" class="hidden space-y-4">
                            <div class="bg-orange-50 rounded-lg p-4">
                                <h4 class="font-semibold text-orange-800 mb-2">معلومات المركبة</h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label for="vehicleType" class="block text-sm font-medium text-gray-700 mb-2">نوع المركبة</label>
                                        <select id="vehicleType" name="vehicleType" 
                                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
                                            <option value="">اختر نوع المركبة</option>
                                            <option value="taxi">تاكسي</option>
                                            <option value="bus">باص</option>
                                            <option value="car">سيارة خاصة</option>
                                            <option value="suv">SUV</option>
                                            <option value="pickup">بيك اب</option>
                                            <option value="truck">شاحنة</option>
                                            <option value="van">فان</option>
                                            <option value="trailer">تريلا</option>
                                            <option value="fleet">أسطول شحن</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label for="vehicleModel" class="block text-sm font-medium text-gray-700 mb-2">موديل المركبة</label>
                                        <input type="text" id="vehicleModel" name="vehicleModel" 
                                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                               placeholder="موديل المركبة">
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label for="capacity" class="block text-sm font-medium text-gray-700 mb-2">السعة (كجم)</label>
                                        <input type="number" id="capacity" name="capacity" 
                                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                               placeholder="الحد الأقصى للوزن">
                                    </div>
                                    
                                    <div>
                                        <label for="licenseNumber" class="block text-sm font-medium text-gray-700 mb-2">رقم رخصة القيادة</label>
                                        <input type="text" id="licenseNumber" name="licenseNumber" 
                                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                               placeholder="رقم رخصة القيادة">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-between">
                            <button type="button" onclick="prevStep(1)" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                السابق
                            </button>
                            <button type="button" onclick="nextStep(3)" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                التالي
                            </button>
                        </div>
                    </div>

                    <!-- Step 3: Password & Confirmation -->
                    <div id="step-3" class="step-content hidden">
                        <div class="space-y-4">
                            <div>
                                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                                <input type="password" id="password" name="password" required 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                       placeholder="كلمة المرور (8 أحرف على الأقل)">
                                <div id="password-error" class="text-red-500 text-sm mt-1 hidden"></div>
                            </div>

                            <div>
                                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">تأكيد كلمة المرور</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" required 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                       placeholder="أعد إدخال كلمة المرور">
                                <div id="confirmPassword-error" class="text-red-500 text-sm mt-1 hidden"></div>
                            </div>

                            <div class="flex items-center">
                                <input type="checkbox" id="terms" name="terms" required class="ml-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <label for="terms" class="text-sm text-gray-600">
                                    أوافق على 
                                    <a href="terms.html" class="text-blue-600 hover:text-blue-800">الشروط والأحكام</a>
                                    و
                                    <a href="privacy.html" class="text-blue-600 hover:text-blue-800">سياسة الخصوصية</a>
                                </label>
                            </div>
                            <div id="terms-error" class="text-red-500 text-sm mt-1 hidden"></div>
                        </div>

                        <div class="flex justify-between mt-6">
                            <button type="button" onclick="prevStep(2)" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                السابق
                            </button>
                            <button type="submit" class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center">
                                <span id="register-text">إنشاء الحساب</span>
                                <div id="register-spinner" class="hidden animate-spin ml-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            </button>
                        </div>
                    </div>
                </form>

                <div class="text-center mt-6">
                    <span class="text-sm text-gray-600">لديك حساب بالفعل؟</span>
                    <a href="login.html" class="text-sm text-blue-600 hover:text-blue-800 font-semibold mr-2">سجل الدخول هنا</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <p class="text-gray-400">
                    © 2024 الشحنة السريعة. جميع الحقوق محفوظة | قايد صالح المصعبي
                </p>
            </div>
        </div>
    </footer>

    <!-- JavaScript -->
    <script>
        let currentStep = 1;
        let selectedAccountType = '';

        function nextStep(step) {
            if (validateStep(currentStep)) {
                document.getElementById(`step-${currentStep}`).classList.add('hidden');
                document.querySelectorAll('.step-indicator')[currentStep - 1].classList.remove('bg-blue-500', 'text-white');
                document.querySelectorAll('.step-indicator')[currentStep - 1].classList.add('bg-gray-200', 'text-gray-700');
                
                currentStep = step;
                
                document.getElementById(`step-${currentStep}`).classList.remove('hidden');
                document.querySelectorAll('.step-indicator')[currentStep - 1].classList.remove('bg-gray-200', 'text-gray-700');
                document.querySelectorAll('.step-indicator')[currentStep - 1].classList.add('bg-blue-500', 'text-white');
            }
        }

        function prevStep(step) {
            document.getElementById(`step-${currentStep}`).classList.add('hidden');
            document.querySelectorAll('.step-indicator')[currentStep - 1].classList.remove('bg-blue-500', 'text-white');
            document.querySelectorAll('.step-indicator')[currentStep - 1].classList.add('bg-gray-200', 'text-gray-700');
            
            currentStep = step;
            
            document.getElementById(`step-${currentStep}`).classList.remove('hidden');
            document.querySelectorAll('.step-indicator')[currentStep - 1].classList.remove('bg-gray-200', 'text-gray-700');
            document.querySelectorAll('.step-indicator')[currentStep - 1].classList.add('bg-blue-500', 'text-white');
        }

        function validateStep(step) {
            let isValid = true;
            
            // Clear previous errors
            document.querySelectorAll('[id$="-error"]').forEach(error => {
                error.classList.add('hidden');
            });

            if (step === 1) {
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const city = document.getElementById('city').value;

                if (!firstName) {
                    document.getElementById('firstName-error').textContent = 'الاسم الأول مطلوب';
                    document.getElementById('firstName-error').classList.remove('hidden');
                    isValid = false;
                }

                if (!lastName) {
                    document.getElementById('lastName-error').textContent = 'اسم العائلة مطلوب';
                    document.getElementById('lastName-error').classList.remove('hidden');
                    isValid = false;
                }

                if (!email || !/\S+@\S+\.\S+/.test(email)) {
                    document.getElementById('email-error').textContent = 'البريد الإلكتروني غير صحيح';
                    document.getElementById('email-error').classList.remove('hidden');
                    isValid = false;
                }

                if (!phone || !/^05\d{8}$/.test(phone)) {
                    document.getElementById('phone-error').textContent = 'رقم الجوال غير صحيح';
                    document.getElementById('phone-error').classList.remove('hidden');
                    isValid = false;
                }

                if (!city) {
                    document.getElementById('city-error').textContent = 'المدينة مطلوبة';
                    document.getElementById('city-error').classList.remove('hidden');
                    isValid = false;
                }
            }

            return isValid;
        }

        // Account type selection
        document.querySelectorAll('.account-type').forEach(type => {
            type.addEventListener('click', function() {
                document.querySelectorAll('.account-type').forEach(t => {
                    t.classList.remove('border-blue-500', 'border-orange-500', 'bg-blue-50', 'bg-orange-50');
                });
                
                selectedAccountType = this.dataset.type;
                if (selectedAccountType === 'client') {
                    this.classList.add('border-blue-500', 'bg-blue-50');
                    document.getElementById('traveler-info').classList.add('hidden');
                } else {
                    this.classList.add('border-orange-500', 'bg-orange-50');
                    document.getElementById('traveler-info').classList.remove('hidden');
                }
            });
        });

        // Form submission
        document.getElementById('registerForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (typeof firebase === 'undefined' || !firebase.apps.length) {
                alert('خطأ في تحميل النظام. يرجى تحديث الصفحة.');
                return;
            }
            
            if (!selectedAccountType) {
                alert('يرجى اختيار نوع الحساب');
                return;
            }

            if (!validateStep(3)) {
                return;
            }

            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;

            if (password.length < 8) {
                document.getElementById('password-error').textContent = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
                document.getElementById('password-error').classList.remove('hidden');
                return;
            }

            if (password !== confirmPassword) {
                document.getElementById('confirmPassword-error').textContent = 'كلمات المرور غير متطابقة';
                document.getElementById('confirmPassword-error').classList.remove('hidden');
                return;
            }

            if (!terms) {
                document.getElementById('terms-error').textContent = 'يجب الموافقة على الشروط والأحكام';
                document.getElementById('terms-error').classList.remove('hidden');
                return;
            }

            // Show loading state
            document.getElementById('register-text').classList.add('hidden');
            document.getElementById('register-spinner').classList.remove('hidden');

            // Collect form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                city: document.getElementById('city').value,
                accountType: selectedAccountType,
                password: password,
                vehicleType: document.getElementById('vehicleType').value,
                vehicleModel: document.getElementById('vehicleModel').value,
                capacity: document.getElementById('capacity').value,
                licenseNumber: document.getElementById('licenseNumber').value,
                createdAt: new Date().toISOString(),
                profileImage: 'https://kimi-web-img.moonshot.cn/img/www.dropoff.com/55cca0b187c44c02ad7d55fdd54a23b1061a7806.jpeg'
            };

            try {
                // إنشاء المستخدم في Firebase Authentication
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password);
                const user = userCredential.user;

                // تحديث ملف المستخدم
                await user.updateProfile({
                    displayName: `${formData.firstName} ${formData.lastName}`,
                    photoURL: formData.profileImage
                });

                // حفظ البيانات الإضافية في Firestore
                const userData = {
                    uid: user.uid,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    city: formData.city,
                    accountType: formData.accountType,
                    vehicleType: formData.vehicleType,
                    vehicleModel: formData.vehicleModel,
                    capacity: formData.capacity,
                    licenseNumber: formData.licenseNumber,
                    createdAt: formData.createdAt,
                    profileImage: formData.profileImage,
                    isActive: true,
                    rating: formData.accountType === 'traveler' ? 5.0 : null,
                    completedTrips: formData.accountType === 'traveler' ? 0 : null
                };

                await firebase.firestore().collection("users").doc(user.uid).set(userData);

                // حفظ بيانات المستخدم في localStorage
                localStorage.setItem('currentUser', JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    accountType: formData.accountType
                }));

                alert('تم إنشاء الحساب بنجاح! سيتم تحويلك إلى لوحة التحكم.');
                window.location.href = 'dashboard.html';

            } catch (error) {
                console.error('خطأ في إنشاء الحساب:', error);
                
                let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';
                
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'البريد الإلكتروني مسجل مسبقاً';
                    document.getElementById('email-error').textContent = errorMessage;
                    document.getElementById('email-error').classList.remove('hidden');
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'البريد الإلكتروني غير صحيح';
                    document.getElementById('email-error').textContent = errorMessage;
                    document.getElementById('email-error').classList.remove('hidden');
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'كلمة المرور ضعيفة، يجب أن تكون 8 أحرف على الأقل';
                    document.getElementById('password-error').textContent = errorMessage;
                    document.getElementById('password-error').classList.remove('hidden');
                } else {
                    document.getElementById('email-error').textContent = errorMessage;
                    document.getElementById('email-error').classList.remove('hidden');
                }
                
                // Reset loading state
                document.getElementById('register-text').classList.remove('hidden');
                document.getElementById('register-spinner').classList.add('hidden');
            }
        });

        // التأكد من تحميل Firebase بشكل صحيح
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof firebase === 'undefined') {
                console.error('Firebase لم يتم تحميله بشكل صحيح');
                alert('حدث خطأ في تحميل النظام. يرجى تحديث الصفحة.');
            }
        });
    </script>
</body>
</html>