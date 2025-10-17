// FastShip API Interface - واجهة برمجة التطبيقات لمنصة FastShip
// تربط بين الواجهة الأمامية والنظام الأساسي

class FastShipAPI {
    constructor() {
        this.core = window.FastShipEnhanced || window.FastShip;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.setupEventListeners();
    }

    // ===== إدارة المستخدمين =====

    // تسجيل مستخدم جديد
    async registerUser(userData) {
        try {
            // التحقق من صحة البيانات
            if (!this.validateUserData(userData)) {
                throw new Error('بيانات المستخدم غير صحيحة');
            }

            // إنشاء المستخدم
            const user = this.core.createUser(userData);
            this.core.users.push(user);

            // إنشاء موصل إذا كان النوع مناسباً
            if (userData.accountType === 'carrier' || userData.accountType === 'both') {
                if (userData.carrierInfo) {
                    const carrier = this.core.createCarrier({
                        userId: user.id,
                        ...userData.carrierInfo
                    });
                    this.core.carriers.push(carrier);
                }
            }

            this.core.saveData();
            
            // إرسال إشعار ترحيب
            this.core.addNotification(
                user.id,
                'system',
                'مرحباً بك في FastShip',
                'تم إنشاء حسابك بنجاح. ابدأ الآن في إرسال أو نقل الشحنات!'
            );

            return { success: true, user: user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // تسجيل الدخول
    async loginUser(email, password) {
        try {
            // البحث عن المستخدم
            const user = this.core.users.find(u => u.email === email);
            if (!user) {
                throw new Error('البريد الإلكتروني غير مسجل');
            }

            // في التطبيق الحقيقي، سيتم التحقق من كلمة المرور
            // هنا نقوم بمحاكاة تسجيل الدخول الناجح
            
            this.currentUser = user;
            this.saveCurrentUser();
            
            // تحديث آخر نشاط
            user.lastActive = new Date().toISOString();
            this.core.saveData();

            return { success: true, user: user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // تسجيل الخروج
    logout() {
        this.currentUser = null;
        localStorage.removeItem('fastship_current_user');
        window.location.href = 'index.html';
    }

    // الحصول على المستخدم الحالي
    getCurrentUser() {
        return this.currentUser;
    }

    // ===== إدارة الشحنات =====

    // إنشاء شحنة جديدة
    async createShipment(shipmentData) {
        try {
            if (!this.currentUser) {
                throw new Error('يجب تسجيل الدخول أولاً');
            }

            // إضافة معرف المرسل
            shipmentData.senderId = this.currentUser.id;

            // إنشاء الشحنة
            const shipment = this.core.createShipment(shipmentData);
            this.core.shipments.push(shipment);

            // البحث عن موصلين مناسبين
            const matchingCarriers = this.core.findMatchingCarriers(shipment.id);
            shipment.matchingCarriers = matchingCarriers.map(c => c.id);

            // إرسال إشعارات للموصلين المناسبين
            matchingCarriers.slice(0, 5).forEach(carrier => { // أفضل 5 موصلين
                const carrierUser = this.core.getUser(carrier.userId);
                if (carrierUser) {
                    this.core.addNotification(
                        carrierUser.id,
                        'match',
                        'شحنة جديدة مناسبة لك',
                        `شحنة من ${shipment.pickup.city} إلى ${shipment.delivery.city} - ${shipment.weight} كيلو`,
                        { shipmentId: shipment.id }
                    );
                }
            });

            this.core.saveData();

            return { success: true, shipment: shipment, matches: matchingCarriers.length };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // الحصول على شحنات المستخدم
    getUserShipments(userId = null) {
        const targetUserId = userId || this.currentUser?.id;
        if (!targetUserId) return [];

        return this.core.shipments.filter(s => s.senderId === targetUserId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // الحصول على الشحنات المتاحة للموصل
    getAvailableShipments(carrierId = null) {
        if (!carrierId && this.currentUser) {
            const userCarrier = this.core.carriers.find(c => c.userId === this.currentUser.id);
            carrierId = userCarrier?.id;
        }

        if (!carrierId) return [];

        return this.core.findMatchingShipments(carrierId);
    }

    // قبول شحنة من قبل الموصل
    async acceptShipment(shipmentId, carrierId = null) {
        try {
            if (!carrierId && this.currentUser) {
                const userCarrier = this.core.carriers.find(c => c.userId === this.currentUser.id);
                carrierId = userCarrier?.id;
            }

            if (!carrierId) {
                throw new Error('لم يتم العثور على بيانات الموصل');
            }

            const shipment = this.core.getShipment(shipmentId);
            const carrier = this.core.getCarrier(carrierId);

            if (!shipment || !carrier) {
                throw new Error('بيانات غير صحيحة');
            }

            if (shipment.status !== 'pending') {
                throw new Error('هذه الشحنة غير متاحة');
            }

            // التحقق من السعة
            if (!this.core.canAcceptShipment(carrierId, shipmentId)) {
                throw new Error('لا توجد سعة كافية لهذه الشحنة');
            }

            // تحديث الشحنة
            shipment.selectedCarrier = carrierId;
            shipment.status = 'matched';
            shipment.updatedAt = new Date().toISOString();

            // تحديث حالة الموصل
            carrier.availability.status = 'busy';

            // إرسال إشعار للمرسل
            this.core.addNotification(
                shipment.senderId,
                'match',
                'تم العثور على موصل لشحنتك',
                `تم قبول شحنتك ${shipment.trackingNumber} من قبل موصل محترف`,
                { shipmentId: shipmentId, carrierId: carrierId }
            );

            // بدء التتبع الفوري
            this.core.startRealTimeTracking(shipmentId);

            this.core.saveData();

            return { success: true, shipment: shipment };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // تحديث حالة الشحنة
    async updateShipmentStatus(shipmentId, newStatus, location = null) {
        try {
            const shipment = this.core.getShipment(shipmentId);
            if (!shipment) {
                throw new Error('الشحنة غير موجودة');
            }

            // التحقق من الصلاحية
            if (!this.canUpdateShipmentStatus(shipment, newStatus)) {
                throw new Error('لا يمكن تحديث حالة الشحنة');
            }

            // تحديث الحالة
            this.core.updateShipmentStatus(shipmentId, newStatus);

            // تحديث الموقع إذا تم توفيره
            if (location) {
                this.core.updateShipmentLocation(shipmentId, location, newStatus);
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ===== إدارة الموصلين =====

    // تسجيل موصل جديد
    async registerCarrier(carrierData) {
        try {
            if (!this.currentUser) {
                throw new Error('يجب تسجيل الدخول أولاً');
            }

            carrierData.userId = this.currentUser.id;
            const carrier = this.core.createCarrier(carrierData);
            this.core.carriers.push(carrier);

            // تحديث نوع حساب المستخدم
            if (this.currentUser.accountType === 'shipper') {
                this.currentUser.accountType = 'both';
            } else if (this.currentUser.accountType !== 'both') {
                this.currentUser.accountType = 'carrier';
            }

            this.core.saveData();

            return { success: true, carrier: carrier };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // الحصول على بيانات الموصل للمستخدم الحالي
    getCurrentUserCarrier() {
        if (!this.currentUser) return null;
        return this.core.carriers.find(c => c.userId === this.currentUser.id);
    }

    // تحديث توفر الموصل
    updateCarrierAvailability(status, nextAvailable = null) {
        const carrier = this.getCurrentUserCarrier();
        if (!carrier) return false;

        carrier.availability.status = status;
        if (nextAvailable) {
            carrier.availability.nextAvailable = nextAvailable;
        }

        this.core.saveData();
        return true;
    }

    // ===== البحث والتصفية =====

    // البحث عن موصلين
    searchCarriers(filters = {}) {
        let carriers = this.core.carriers.filter(c => c.isActive);

        // تصفية حسب النوع
        if (filters.vehicleType) {
            carriers = carriers.filter(c => c.vehicle.type === filters.vehicleType);
        }

        // تصفية حسب المنطقة
        if (filters.city) {
            carriers = carriers.filter(c => 
                c.serviceAreas.some(area => area.city === filters.city)
            );
        }

        // تصفية حسب التقييم
        if (filters.minRating) {
            carriers = carriers.filter(c => c.stats.rating >= filters.minRating);
        }

        // تصفية حسب السعر
        if (filters.maxPrice) {
            carriers = carriers.filter(c => c.pricing.baseRate <= filters.maxPrice);
        }

        // ترتيب النتائج
        const sortBy = filters.sortBy || 'rating';
        carriers.sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return a.pricing.baseRate - b.pricing.baseRate;
                case 'rating':
                    return b.stats.rating - a.stats.rating;
                case 'distance':
                    // يحتاج إلى موقع المستخدم للحساب
                    return 0;
                default:
                    return 0;
            }
        });

        return carriers;
    }

    // البحث عن شحنات
    searchShipments(filters = {}) {
        let shipments = this.core.shipments.filter(s => s.status === 'pending');

        // تصفية حسب الوزن
        if (filters.maxWeight) {
            shipments = shipments.filter(s => s.weight <= filters.maxWeight);
        }

        // تصفية حسب المسار
        if (filters.fromCity) {
            shipments = shipments.filter(s => s.pickup.city === filters.fromCity);
        }

        if (filters.toCity) {
            shipments = shipments.filter(s => s.delivery.city === filters.toCity);
        }

        // تصفية حسب السعر
        if (filters.minPrice) {
            shipments = shipments.filter(s => s.maxBudget >= filters.minPrice);
        }

        return shipments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // ===== الإحصائيات والتقارير =====

    // إحصائيات المستخدم
    getUserStats(userId = null) {
        const targetUserId = userId || this.currentUser?.id;
        if (!targetUserId) return null;

        const userShipments = this.getUserShipments(targetUserId);
        const carrier = this.core.carriers.find(c => c.userId === targetUserId);

        return {
            shipments: {
                total: userShipments.length,
                pending: userShipments.filter(s => s.status === 'pending').length,
                completed: userShipments.filter(s => s.status === 'delivered').length,
                cancelled: userShipments.filter(s => s.status === 'cancelled').length
            },
            carrier: carrier ? {
                totalTrips: carrier.stats.totalTrips,
                rating: carrier.stats.rating,
                earnings: carrier.stats.totalEarnings,
                completionRate: carrier.stats.completionRate
            } : null
        };
    }

    // إحصائيات المنصة العامة
    getPlatformStats() {
        return {
            totalUsers: this.core.users.length,
            totalCarriers: this.core.carriers.length,
            totalShipments: this.core.shipments.length,
            activeShipments: this.core.shipments.filter(s => 
                ['matched', 'picked_up', 'in_transit'].includes(s.status)
            ).length,
            completedShipments: this.core.shipments.filter(s => s.status === 'delivered').length
        };
    }

    // ===== وظائف مساعدة =====

    // التحقق من صحة بيانات المستخدم
    validateUserData(userData) {
        const required = ['email', 'phone', 'firstName', 'lastName', 'accountType'];
        return required.every(field => userData[field]);
    }

    // التحقق من إمكانية تحديث حالة الشحنة
    canUpdateShipmentStatus(shipment, newStatus) {
        if (!this.currentUser) return false;

        // المرسل يمكنه إلغاء الشحنة فقط
        if (shipment.senderId === this.currentUser.id) {
            return newStatus === 'cancelled';
        }

        // الموصل يمكنه تحديث حالات معينة
        const carrier = this.core.carriers.find(c => 
            c.userId === this.currentUser.id && c.id === shipment.selectedCarrier
        );

        if (carrier) {
            const allowedTransitions = {
                'matched': ['picked_up', 'cancelled'],
                'picked_up': ['in_transit'],
                'in_transit': ['delivered']
            };

            return allowedTransitions[shipment.status]?.includes(newStatus) || false;
        }

        return false;
    }

    // حفظ المستخدم الحالي
    saveCurrentUser() {
        if (this.currentUser) {
            localStorage.setItem('fastship_current_user', JSON.stringify(this.currentUser));
        }
    }

    // تحميل المستخدم الحالي
    loadCurrentUser() {
        const savedUser = localStorage.getItem('fastship_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // مستمع لتحديثات الشحنات
        document.addEventListener('shipmentStatusChanged', (event) => {
            this.handleShipmentStatusChange(event.detail);
        });

        // مستمع لتحديثات الموصلين
        document.addEventListener('carrierAvailabilityChanged', (event) => {
            this.handleCarrierAvailabilityChange(event.detail);
        });
    }

    // معالجة تغيير حالة الشحنة
    handleShipmentStatusChange(data) {
        // تحديث الواجهة أو إرسال إشعارات
        console.log('تم تغيير حالة الشحنة:', data);
    }

    // معالجة تغيير توفر الموصل
    handleCarrierAvailabilityChange(data) {
        // تحديث الواجهة أو إرسال إشعارات
        console.log('تم تغيير توفر الموصل:', data);
    }

    // ===== وظائف الواجهة =====

    // تحديث واجهة المستخدم
    updateUI() {
        // تحديث شريط التنقل
        this.updateNavigation();
        
        // تحديث المحتوى حسب نوع الصفحة
        const currentPage = window.location.pathname.split('/').pop();
        
        switch (currentPage) {
            case 'dashboard.html':
                this.updateDashboard();
                break;
            case 'travelers.html':
                this.updateTravelersPage();
                break;
            default:
                this.updateHomePage();
        }
    }

    // تحديث شريط التنقل
    updateNavigation() {
        const loginBtn = document.getElementById('loginBtn');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            if (userName) userName.textContent = this.currentUser.firstName;
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    // تحديث لوحة التحكم
    updateDashboard() {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        const stats = this.getUserStats();
        
        // تحديث الإحصائيات
        this.updateElement('totalShipments', stats.shipments.total);
        this.updateElement('pendingShipments', stats.shipments.pending);
        this.updateElement('completedShipments', stats.shipments.completed);

        if (stats.carrier) {
            this.updateElement('totalTrips', stats.carrier.totalTrips);
            this.updateElement('userRating', stats.carrier.rating.toFixed(1));
            this.updateElement('totalEarnings', stats.carrier.earnings);
        }

        // تحديث قائمة الشحنات
        this.updateShipmentsList();
    }

    // تحديث صفحة الموصلين
    updateTravelersPage() {
        const carriers = this.searchCarriers();
        this.displayCarriers(carriers);
    }

    // تحديث الصفحة الرئيسية
    updateHomePage() {
        const stats = this.getPlatformStats();
        
        this.updateElement('platformUsers', stats.totalUsers);
        this.updateElement('platformCarriers', stats.totalCarriers);
        this.updateElement('platformShipments', stats.totalShipments);
    }

    // تحديث عنصر في الصفحة
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // تحديث قائمة الشحنات
    updateShipmentsList() {
        const container = document.getElementById('shipmentsContainer');
        if (!container) return;

        const shipments = this.getUserShipments();
        
        container.innerHTML = shipments.map(shipment => `
            <div class="shipment-card bg-white rounded-lg shadow-md p-4 mb-4">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-semibold text-lg">${shipment.trackingNumber}</h3>
                    <span class="status-badge status-${shipment.status} px-2 py-1 rounded text-sm">
                        ${this.getStatusText(shipment.status)}
                    </span>
                </div>
                <div class="text-gray-600 mb-2">
                    <p>من: ${shipment.pickup.city}</p>
                    <p>إلى: ${shipment.delivery.city}</p>
                    <p>الوزن: ${shipment.weight} كيلو</p>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-lg font-bold text-blue-600">${shipment.estimatedPrice} ريال</span>
                    <button onclick="fastshipAPI.viewShipmentDetails('${shipment.id}')" 
                            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        عرض التفاصيل
                    </button>
                </div>
            </div>
        `).join('');
    }

    // عرض الموصلين
    displayCarriers(carriers) {
        const container = document.getElementById('carriersContainer');
        if (!container) return;

        container.innerHTML = carriers.map(carrier => `
            <div class="carrier-card bg-white rounded-lg shadow-md p-4 mb-4">
                <div class="flex items-center mb-3">
                    <div class="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                        <h3 class="font-semibold">${this.getCarrierName(carrier)}</h3>
                        <div class="flex items-center">
                            <span class="text-yellow-500">★</span>
                            <span class="text-sm text-gray-600 mr-1">${carrier.stats.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                <div class="text-gray-600 mb-3">
                    <p>نوع المركبة: ${this.getVehicleTypeText(carrier.vehicle.type)}</p>
                    <p>السعة: ${carrier.vehicle.capacity.weight} كيلو</p>
                    <p>السعر: ${carrier.pricing.baseRate} ريال/كم</p>
                </div>
                <button onclick="fastshipAPI.contactCarrier('${carrier.id}')" 
                        class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                    تواصل مع الموصل
                </button>
            </div>
        `).join('');
    }

    // الحصول على اسم الموصل
    getCarrierName(carrier) {
        const user = this.core.getUser(carrier.userId);
        return user ? `${user.firstName} ${user.lastName}` : 'موصل';
    }

    // الحصول على نص حالة الشحنة
    getStatusText(status) {
        const statusTexts = {
            'pending': 'في الانتظار',
            'matched': 'تم المطابقة',
            'picked_up': 'تم الاستلام',
            'in_transit': 'في الطريق',
            'delivered': 'تم التسليم',
            'cancelled': 'ملغي'
        };
        return statusTexts[status] || status;
    }

    // الحصول على نص نوع المركبة
    getVehicleTypeText(type) {
        const typeTexts = {
            'car': 'سيارة',
            'suv': 'سيارة دفع رباعي',
            'pickup': 'بيك أب',
            'van': 'فان',
            'truck': 'شاحنة',
            'trailer': 'تريلا'
        };
        return typeTexts[type] || type;
    }

    // عرض تفاصيل الشحنة
    viewShipmentDetails(shipmentId) {
        const shipment = this.core.getShipment(shipmentId);
        if (!shipment) return;

        // يمكن فتح نافذة منبثقة أو الانتقال لصفحة التفاصيل
        console.log('عرض تفاصيل الشحنة:', shipment);
    }

    // التواصل مع الموصل
    contactCarrier(carrierId) {
        const carrier = this.core.getCarrier(carrierId);
        if (!carrier) return;

        // يمكن فتح نافذة دردشة أو نموذج تواصل
        console.log('التواصل مع الموصل:', carrier);
    }
}

// إنشاء مثيل عام من API
window.fastshipAPI = new FastShipAPI();

// تصدير الفئة
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FastShipAPI;
}