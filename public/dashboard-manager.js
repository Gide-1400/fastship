// مدير لوحة التحكم - FastShip Platform
// يدعم جميع أنواع المستخدمين مع واجهات مخصصة

class DashboardManager {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'shipments';
        this.shipments = [];
        this.travelers = [];
        this.analytics = {};
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.initializeDashboard();
    }

    // تحميل بيانات المستخدم
    loadUserData() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    // تهيئة لوحة التحكم
    initializeDashboard() {
        this.updateUserProfile();
        this.loadShipments();
        this.loadTravelers();
        this.loadAnalytics();
        this.setupTabNavigation();
    }

    // تحديث ملف المستخدم الشخصي
    updateUserProfile() {
        const userNameElement = document.getElementById('user-name');
        const userTypeElement = document.getElementById('user-type');
        const userAvatarElement = document.getElementById('user-avatar');

        if (userNameElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.displayName || 'مستخدم';
        }

        if (userTypeElement && this.currentUser) {
            const userTypeNames = {
                'user': 'عميل',
                'traveler': 'مسافر',
                'car_owner': 'صاحب سيارة',
                'truck_owner': 'صاحب شاحنة',
                'fleet_company': 'شركة شحن'
            };
            userTypeElement.textContent = userTypeNames[this.currentUser.accountType] || 'مستخدم';
        }

        if (userAvatarElement && this.currentUser?.photoURL) {
            userAvatarElement.src = this.currentUser.photoURL;
        }
    }

    // تحميل الشحنات
    loadShipments() {
        // محاكاة بيانات الشحنات
        this.shipments = [
            {
                id: 's1',
                type: 'small',
                description: 'مستندات مهمة',
                weight: 2,
                volume: 0.01,
                pickupLocation: 'الرياض',
                deliveryLocation: 'جدة',
                status: 'pending',
                createdAt: '2024-01-15T10:00:00',
                estimatedPrice: 15.50,
                traveler: null
            },
            {
                id: 's2',
                type: 'medium',
                description: 'أجهزة إلكترونية',
                weight: 25,
                volume: 0.2,
                pickupLocation: 'جدة',
                deliveryLocation: 'الدمام',
                status: 'in_transit',
                createdAt: '2024-01-14T14:30:00',
                estimatedPrice: 45.00,
                traveler: {
                    id: 't1',
                    name: 'خالد السيد',
                    phone: '+966501234567'
                }
            },
            {
                id: 's3',
                type: 'large',
                description: 'أثاث منزلي',
                weight: 150,
                volume: 1.5,
                pickupLocation: 'الدمام',
                deliveryLocation: 'الرياض',
                status: 'delivered',
                createdAt: '2024-01-10T09:15:00',
                estimatedPrice: 180.00,
                traveler: {
                    id: 't2',
                    name: 'محمد أحمد',
                    phone: '+966502345678'
                }
            }
        ];

        this.displayShipments();
    }

    // تحميل المسافرين
    loadTravelers() {
        // محاكاة بيانات المسافرين
        this.travelers = [
            {
                id: 't1',
                name: 'خالد السيد',
                type: 'regular_traveler',
                rating: 4.8,
                totalTrips: 156,
                vehicle: 'تويوتا كامري 2020',
                route: 'الرياض → جدة',
                pricePerKg: 0.8,
                availability: true
            },
            {
                id: 't2',
                name: 'محمد أحمد',
                type: 'car_owner',
                rating: 4.6,
                totalTrips: 89,
                vehicle: 'فورد ترانزيت 2019',
                route: 'جدة → الدمام',
                pricePerKg: 1.2,
                availability: true
            }
        ];

        this.displayTravelers();
    }

    // تحميل التحليلات
    loadAnalytics() {
        this.analytics = {
            totalShipments: this.shipments.length,
            completedShipments: this.shipments.filter(s => s.status === 'delivered').length,
            pendingShipments: this.shipments.filter(s => s.status === 'pending').length,
            inTransitShipments: this.shipments.filter(s => s.status === 'in_transit').length,
            totalEarnings: this.calculateTotalEarnings(),
            averageRating: this.calculateAverageRating(),
            monthlyStats: this.getMonthlyStats()
        };

        this.displayAnalytics();
    }

    // حساب إجمالي الأرباح
    calculateTotalEarnings() {
        return this.shipments
            .filter(s => s.status === 'delivered')
            .reduce((total, s) => total + (s.estimatedPrice * 0.1), 0); // 10% عمولة
    }

    // حساب متوسط التقييم
    calculateAverageRating() {
        if (this.travelers.length === 0) return 0;
        const totalRating = this.travelers.reduce((sum, t) => sum + t.rating, 0);
        return totalRating / this.travelers.length;
    }

    // الحصول على الإحصائيات الشهرية
    getMonthlyStats() {
        return {
            shipments: 12,
            earnings: 1250.50,
            rating: 4.7
        };
    }

    // إعداد تنقل التبويبات
    setupTabNavigation() {
        const tabs = document.querySelectorAll('.dashboard-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                this.switchTab(tabId);
            });
        });
    }

    // تبديل التبويب
    switchTab(tabId) {
        // إزالة التحديد من جميع التبويبات
        document.querySelectorAll('.dashboard-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // إخفاء جميع المحتويات
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // تحديد التبويب المختار
        const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(`tab-${tabId}`);

        if (selectedTab && selectedContent) {
            selectedTab.classList.add('active');
            selectedContent.classList.remove('hidden');
            this.currentTab = tabId;

            // تحديث المحتوى حسب التبويب
            this.updateTabContent(tabId);
        }
    }

    // تحديث محتوى التبويب
    updateTabContent(tabId) {
        switch (tabId) {
            case 'shipments':
                this.displayShipments();
                break;
            case 'travelers':
                this.displayTravelers();
                break;
            case 'analytics':
                this.displayAnalytics();
                break;
            case 'messages':
                this.displayMessages();
                break;
            case 'profile':
                this.displayProfile();
                break;
        }
    }

    // عرض الشحنات
    displayShipments() {
        const container = document.getElementById('shipments-list');
        if (!container) return;

        if (this.shipments.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">📦</div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">لا توجد شحنات</h3>
                    <p class="text-gray-600 mb-6">ابدأ بإنشاء شحنة جديدة</p>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                        إنشاء شحنة جديدة
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="space-y-4">
                ${this.shipments.map(shipment => this.createShipmentCard(shipment)).join('')}
            </div>
        `;
    }

    // إنشاء بطاقة الشحنة
    createShipmentCard(shipment) {
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'in_transit': 'bg-blue-100 text-blue-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };

        const statusNames = {
            'pending': 'في الانتظار',
            'in_transit': 'قيد النقل',
            'delivered': 'تم التسليم',
            'cancelled': 'ملغاة'
        };

        return `
            <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <div class="text-2xl ml-3">${this.getShipmentIcon(shipment.type)}</div>
                        <div>
                            <h3 class="text-lg font-bold text-gray-800">${shipment.description}</h3>
                            <p class="text-sm text-gray-600">#${shipment.id}</p>
                        </div>
                    </div>
                    <span class="status-badge ${statusColors[shipment.status]}">
                        ${statusNames[shipment.status]}
                    </span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <span class="text-sm text-gray-600">الوزن:</span>
                        <span class="font-semibold">${shipment.weight} كجم</span>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">من:</span>
                        <span class="font-semibold">${shipment.pickupLocation}</span>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">إلى:</span>
                        <span class="font-semibold">${shipment.deliveryLocation}</span>
                    </div>
                </div>
                
                ${shipment.traveler ? `
                    <div class="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 class="font-semibold text-gray-800 mb-2">المسافر المختار</h4>
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                                <span class="text-blue-600 font-bold">${shipment.traveler.name.charAt(0)}</span>
                            </div>
                            <div>
                                <div class="font-semibold">${shipment.traveler.name}</div>
                                <div class="text-sm text-gray-600">${shipment.traveler.phone}</div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div class="flex items-center justify-between">
                    <div class="text-lg font-bold text-green-600">
                        ${shipment.estimatedPrice.toFixed(2)} ريال
                    </div>
                    <div class="flex gap-2">
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                            تتبع
                        </button>
                        ${shipment.status === 'pending' ? `
                            <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                إلغاء
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // الحصول على أيقونة الشحنة
    getShipmentIcon(type) {
        const icons = {
            'small': '🎒',
            'medium': '📦',
            'large': '🚚',
            'massive': '🏢'
        };
        return icons[type] || '📦';
    }

    // عرض المسافرين
    displayTravelers() {
        const container = document.getElementById('travelers-list');
        if (!container) return;

        if (this.travelers.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">🚗</div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">لا توجد مسافرين</h3>
                    <p class="text-gray-600">ابدأ بالبحث عن المسافرين المناسبين</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${this.travelers.map(traveler => this.createTravelerCard(traveler)).join('')}
            </div>
        `;
    }

    // إنشاء بطاقة المسافر
    createTravelerCard(traveler) {
        const ratingStars = '★'.repeat(Math.floor(traveler.rating)) + '☆'.repeat(5 - Math.floor(traveler.rating));
        
        return `
            <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                        <span class="text-blue-600 font-bold">${traveler.name.charAt(0)}</span>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-lg font-bold text-gray-800">${traveler.name}</h3>
                        <div class="flex items-center">
                            <span class="text-yellow-500 ml-1">${ratingStars}</span>
                            <span class="text-sm text-gray-600">${traveler.rating}</span>
                            <span class="text-sm text-gray-500 mx-2">•</span>
                            <span class="text-sm text-gray-500">${traveler.totalTrips} رحلة</span>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-2 mb-4">
                    <div class="flex items-center">
                        <span class="text-gray-600 text-sm ml-2">🚗</span>
                        <span class="text-sm">${traveler.vehicle}</span>
                    </div>
                    <div class="flex items-center">
                        <span class="text-gray-600 text-sm ml-2">📍</span>
                        <span class="text-sm">${traveler.route}</span>
                    </div>
                    <div class="flex items-center">
                        <span class="text-gray-600 text-sm ml-2">💰</span>
                        <span class="text-sm font-bold text-green-600">${traveler.pricePerKg} ريال/كجم</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <span class="inline-block ${traveler.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs px-2 py-1 rounded-full">
                        ${traveler.availability ? 'متاح' : 'غير متاح'}
                    </span>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        تفاصيل
                    </button>
                </div>
            </div>
        `;
    }

    // عرض التحليلات
    displayAnalytics() {
        const container = document.getElementById('analytics-content');
        if (!container) return;

        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div class="flex items-center">
                        <div class="text-3xl text-blue-600 ml-3">📦</div>
                        <div>
                            <div class="text-2xl font-bold text-gray-800">${this.analytics.totalShipments}</div>
                            <div class="text-sm text-gray-600">إجمالي الشحنات</div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div class="flex items-center">
                        <div class="text-3xl text-green-600 ml-3">✅</div>
                        <div>
                            <div class="text-2xl font-bold text-gray-800">${this.analytics.completedShipments}</div>
                            <div class="text-sm text-gray-600">شحنات مكتملة</div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div class="flex items-center">
                        <div class="text-3xl text-yellow-600 ml-3">⏳</div>
                        <div>
                            <div class="text-2xl font-bold text-gray-800">${this.analytics.pendingShipments}</div>
                            <div class="text-sm text-gray-600">شحنات معلقة</div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div class="flex items-center">
                        <div class="text-3xl text-purple-600 ml-3">💰</div>
                        <div>
                            <div class="text-2xl font-bold text-gray-800">${this.analytics.totalEarnings.toFixed(2)}</div>
                            <div class="text-sm text-gray-600">إجمالي الأرباح (ريال)</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">إحصائيات الشحنات</h3>
                    <div id="shipments-chart" class="h-64"></div>
                </div>
                
                <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">الأرباح الشهرية</h3>
                    <div id="earnings-chart" class="h-64"></div>
                </div>
            </div>
        `;

        // تهيئة الرسوم البيانية
        this.initializeCharts();
    }

    // تهيئة الرسوم البيانية
    initializeCharts() {
        // يمكن إضافة مكتبة الرسوم البيانية هنا مثل Chart.js أو ECharts
        console.log('تهيئة الرسوم البيانية...');
    }

    // عرض الرسائل
    displayMessages() {
        const container = document.getElementById('messages-content');
        if (!container) return;

        container.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">💬</div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">لا توجد رسائل</h3>
                <p class="text-gray-600">ستظهر رسائلك هنا عند توفرها</p>
            </div>
        `;
    }

    // عرض الملف الشخصي
    displayProfile() {
        const container = document.getElementById('profile-content');
        if (!container) return;

        container.innerHTML = `
            <div class="max-w-2xl">
                <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h3 class="text-lg font-bold text-gray-800 mb-6">الملف الشخصي</h3>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">الاسم الكامل</label>
                            <input type="text" value="${this.currentUser?.displayName || ''}" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
                            <input type="email" value="${this.currentUser?.email || ''}" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">رقم الهاتف</label>
                            <input type="tel" placeholder="أدخل رقم الهاتف" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">نوع الحساب</label>
                            <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="user" ${this.currentUser?.accountType === 'user' ? 'selected' : ''}>عميل</option>
                                <option value="traveler" ${this.currentUser?.accountType === 'traveler' ? 'selected' : ''}>مسافر</option>
                                <option value="car_owner" ${this.currentUser?.accountType === 'car_owner' ? 'selected' : ''}>صاحب سيارة</option>
                                <option value="truck_owner" ${this.currentUser?.accountType === 'truck_owner' ? 'selected' : ''}>صاحب شاحنة</option>
                                <option value="fleet_company" ${this.currentUser?.accountType === 'fleet_company' ? 'selected' : ''}>شركة شحن</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="mt-8 flex justify-end">
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                            حفظ التغييرات
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // يمكن إضافة مستمعي الأحداث الإضافية هنا
    }
}

// إنشاء مثيل عام للمدير
window.dashboardManager = new DashboardManager();

// تصدير الكلاس للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardManager;
}