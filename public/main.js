[file name]: main.js
[file content begin]
// main.js - الملف الرئيسي لوظائف الموقع (محدث)

// تهيئة الموقع عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نظام المصادقة
    if (window.authManager) {
        window.authManager.updateUI();
    }
    
    // تهيئة القوائم المنسدلة
    initializeDropdowns();
    
    // تهيئة شرائح الصور
    initializeSliders();
    
    // تهيئة نماذج الاتصال
    initializeForms();
    
    // تهيئة التصميم المتجاوب
    initializeResponsive();
    
    // تهيئة نظام الإشعارات
    initializeNotifications();
});

// تهيئة القوائم المنسدلة
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', function(e) {
                e.stopPropagation();
                menu.classList.toggle('hidden');
            });
        }
    });
    
    // إغلاق القوائم المنسدلة عند النقر خارجها
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu && !menu.classList.contains('hidden')) {
                menu.classList.add('hidden');
            }
        });
    });
}

// تهيئة شرائح الصور
function initializeSliders() {
    const sliders = document.querySelectorAll('.slider');
    
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');
        const dots = slider.querySelectorAll('.slider-dot');
        
        let currentSlide = 0;
        
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('hidden', i !== index);
            });
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentSlide = index;
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                let newIndex = currentSlide - 1;
                if (newIndex < 0) newIndex = slides.length - 1;
                showSlide(newIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                let newIndex = currentSlide + 1;
                if (newIndex >= slides.length) newIndex = 0;
                showSlide(newIndex);
            });
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showSlide(index);
            });
        });
        
        // التمرير التلقائي
        setInterval(() => {
            let newIndex = currentSlide + 1;
            if (newIndex >= slides.length) newIndex = 0;
            showSlide(newIndex);
        }, 5000);
    });
}

// تهيئة النماذج
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn?.textContent;
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'جاري الإرسال...';
            }
            
            // محاكاة إرسال النموذج
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
                
                showNotification('تم إرسال النموذج بنجاح!', 'success');
            }, 2000);
        });
    });
}

// تهيئة التصميم المتجاوب
function initializeResponsive() {
    // إضافة حدث تغيير حجم الشاشة
    window.addEventListener('resize', function() {
        // تحديث أي عناصر تحتاج إلى تعديل حسب حجم الشاشة
        updateResponsiveElements();
    });
}

// تحديث العناصر المتجاوبة
function updateResponsiveElements() {
    const screenWidth = window.innerWidth;
    const elements = document.querySelectorAll('[data-responsive]');
    
    elements.forEach(element => {
        const config = JSON.parse(element.dataset.responsive);
        
        for (const breakpoint in config) {
            if (screenWidth >= parseInt(breakpoint)) {
                Object.assign(element.style, config[breakpoint]);
            }
        }
    });
}

// تهيئة نظام الإشعارات
function initializeNotifications() {
    // يمكن إضافة المزيد من وظائف الإشعارات هنا
}

// وظيفة لعرض الإشعارات
function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white transform transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        type === 'warning' ? 'bg-yellow-500' : 
        'bg-blue-500'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="mr-2 text-white hover:text-gray-200">
                ✕
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// وظيفة للتحقق من صحة البريد الإلكتروني
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// وظيفة لتنسيق الأرقام
function formatNumber(number) {
    return new Intl.NumberFormat('ar-SA').format(number);
}

// وظيفة لتنسيق التاريخ
function formatDate(date) {
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// وظيفة لإضافة تأثير التحميل
function showLoading(element) {
    const originalContent = element.innerHTML;
    element.innerHTML = `
        <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span class="mr-2">جاري التحميل...</span>
        </div>
    `;
    element.disabled = true;
    
    return function() {
        element.innerHTML = originalContent;
        element.disabled = false;
    };
}

// وظيفة للانتقال السلس إلى الأقسام
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// إضافة تأثيرات عند التمرير
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.fade-in-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('opacity-100', 'translate-y-0');
            element.classList.remove('opacity-0', 'translate-y-4');
        }
    });
});

// تهيئة خرائط Google (إذا كانت مستخدمة)
function initMap() {
    // يمكن إضافة تهيئة الخرائط هنا
}

// إدارة حالة التطبيق
const appState = {
    currentPage: window.location.pathname,
    user: null,
    settings: {
        theme: 'light',
        language: 'ar'
    },
    
    setUser(user) {
        this.user = user;
        this.updateUI();
    },
    
    updateUI() {
        // تحديث الواجهة بناءً على حالة المستخدم
        const authElements = document.querySelectorAll('[data-auth]');
        
        authElements.forEach(element => {
            const authType = element.dataset.auth;
            
            if (authType === 'required' && !this.user) {
                element.style.display = 'none';
            } else if (authType === 'optional' && this.user) {
                element.style.display = 'none';
            } else {
                element.style.display = 'block';
            }
        });
    },
    
    toggleTheme() {
        this.settings.theme = this.settings.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        localStorage.setItem('theme', this.settings.theme);
    },
    
    setLanguage(lang) {
        this.settings.language = lang;
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        localStorage.setItem('language', lang);
    }
};

// تحميل الإعدادات المحفوظة
const savedTheme = localStorage.getItem('theme');
const savedLanguage = localStorage.getItem('language');

if (savedTheme) {
    appState.settings.theme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
}

if (savedLanguage) {
    appState.settings.language = savedLanguage;
    document.documentElement.setAttribute('lang', savedLanguage);
    document.documentElement.setAttribute('dir', savedLanguage === 'ar' ? 'rtl' : 'ltr');
}

// ✅ دوال التوجيه المحسنة من الصفحة الرئيسية
function handleSendShipment() {
    const user = window.authManager?.getCurrentUser();
    
    if (!user) {
        // إذا لم يكن مسجلاً، يذهب لتسجيل الدخول مع توجيه للعودة
        window.location.href = 'login.html?redirect=create-shipment';
        return;
    }
    
    // إذا كان مسجلاً، يذهب مباشرة لإنشاء شحنة
    if (user.accountType === 'traveler') {
        window.location.href = 'dashboard.html?action=available-shipments';
    } else {
        window.location.href = 'dashboard.html?action=create-shipment';
    }
}

function handleDeliverShipments() {
    const user = window.authManager?.getCurrentUser();
    
    if (!user) {
        // إذا لم يكن مسجلاً، يذهب لتسجيل الدخول مع توجيه للعودة
        window.location.href = 'login.html?redirect=deliver-shipments';
        return;
    }
    
    // إذا كان مسجلاً، يذهب مباشرة للشحنات المتاحة
    if (user.accountType === 'traveler') {
        window.location.href = 'dashboard.html?action=traveler-shipments';
    } else {
        window.location.href = 'travelers.html';
    }
}

// نظام المطابقة الذكي - FastShip Matching System
class FastShipMatchingSystem {
    constructor() {
        this.shipmentTypes = {
            small: {
                name: 'شحنات صغيرة',
                weightRange: { min: 0.1, max: 20 },
                examples: ['مستندات', 'كتب', 'هدايا صغيرة', 'أدوية', 'إلكترونيات صغيرة'],
                compatibleCarriers: ['regular_traveler'],
                icon: '🎒',
                color: 'green'
            },
            medium: {
                name: 'شحنات متوسطة',
                weightRange: { min: 20, max: 1500 },
                examples: ['أجهزة إلكترونية', 'ملابس', 'مشتريات online', 'أطعمة', 'أدوات منزلية'],
                compatibleCarriers: ['regular_traveler', 'car_owner'],
                icon: '📦',
                color: 'blue'
            },
            large: {
                name: 'شحنات كبيرة',
                weightRange: { min: 1500, max: 50000 },
                examples: ['أثاث', 'أجهزة منزلية', 'بضائع تجارية', 'معدات', 'قطع غيار'],
                compatibleCarriers: ['car_owner', 'truck_owner'],
                icon: '🚚',
                color: 'orange'
            },
            giant: {
                name: 'شحنات عملاقة',
                weightRange: { min: 50000, max: 1000000 },
                examples: ['مواد بناء', 'حاويات', 'معدات ثقيلة', 'سيارات', 'بضائع تجارية ضخمة'],
                compatibleCarriers: ['truck_owner', 'fleet_company'],
                icon: '🏢',
                color: 'purple'
            }
        };

        this.carrierTypes = {
            regular_traveler: {
                name: 'المسافر العادي',
                capacity: { min: 0.1, max: 20 },
                vehicles: ['تاكسي', 'حافلة', 'طائرة', 'قطار'],
                example: 'طالب مسافر يحمل حقيبة صغيرة',
                icon: '🚶‍♂️',
                color: 'green',
                compatibleShipments: ['small', 'medium']
            },
            car_owner: {
                name: 'صاحب السيارة الخاصة',
                capacity: { min: 20, max: 1500 },
                vehicles: ['كورولا', 'بيك أب', 'سيارات خاصة'],
                example: 'موظف مسافر بين المدن بسيارته',
                icon: '🚗',
                color: 'blue',
                compatibleShipments: ['medium', 'large']
            },
            truck_owner: {
                name: 'صاحب الشاحنة',
                capacity: { min: 1500, max: 50000 },
                vehicles: ['دينات', 'شاحنات متوسطة', 'تريلات'],
                example: 'سائق شاحنة برحلات منتظمة',
                icon: '🚚',
                color: 'orange',
                compatibleShipments: ['large', 'giant']
            },
            fleet_company: {
                name: 'الشركات والأساطيل',
                capacity: { min: 50000, max: 1000000 },
                vehicles: ['تريلات', 'قطارات', 'طائرات', 'سفن'],
                example: 'شركات شحن لديها مساحات غير مستغلة',
                icon: '🏢',
                color: 'purple',
                compatibleShipments: ['giant']
            }
        };

        this.routes = {
            'الرياض-جدة': { distance: 870, duration: 8, cost: { small: 50, medium: 200, large: 800, giant: 3000 } },
            'الرياض-الدمام': { distance: 395, duration: 4, cost: { small: 30, medium: 120, large: 500, giant: 2000 } },
            'جدة-الدمام': { distance: 1275, duration: 12, cost: { small: 80, medium: 300, large: 1200, giant: 5000 } },
            'الرياض-أبها': { distance: 650, duration: 6, cost: { small: 40, medium: 150, large: 600, giant: 2500 } },
            'جدة-المدينة المنورة': { distance: 360, duration: 4, cost: { small: 25, medium: 100, large: 400, giant: 1500 } }
        };
    }

    determineShipmentType(weight) {
        for (const [type, config] of Object.entries(this.shipmentTypes)) {
            if (weight >= config.weightRange.min && weight <= config.weightRange.max) {
                return type;
            }
        }
        return 'giant';
    }

    findCompatibleCarriers(shipmentType, from, to, preferences = {}) {
        const shipment = this.shipmentTypes[shipmentType];
        const compatibleCarriers = [];

        for (const [carrierType, carrier] of Object.entries(this.carrierTypes)) {
            if (shipment.compatibleCarriers.includes(carrierType)) {
                const route = this.getRoute(from, to);
                const estimatedCost = this.calculateCost(shipmentType, carrierType, route);
                const rating = this.calculateRating(carrierType, shipmentType);
                const estimatedTime = this.calculateTime(carrierType, route);

                compatibleCarriers.push({
                    type: carrierType,
                    name: carrier.name,
                    capacity: carrier.capacity,
                    vehicles: carrier.vehicles,
                    example: carrier.example,
                    icon: carrier.icon,
                    color: carrier.color,
                    estimatedCost: estimatedCost,
                    rating: rating,
                    estimatedTime: estimatedTime,
                    compatibility: this.calculateCompatibility(shipmentType, carrierType)
                });
            }
        }

        return compatibleCarriers.sort((a, b) => {
            if (a.compatibility !== b.compatibility) {
                return b.compatibility - a.compatibility;
            }
            return a.estimatedCost - b.estimatedCost;
        });
    }

    calculateCost(shipmentType, carrierType, route) {
        if (!route) return 0;
        
        const baseCost = route.cost[shipmentType] || 0;
        const carrierMultiplier = {
            'regular_traveler': 0.8,
            'car_owner': 1.0,
            'truck_owner': 1.2,
            'fleet_company': 1.5
        };

        return Math.round(baseCost * (carrierMultiplier[carrierType] || 1.0));
    }

    calculateRating(carrierType, shipmentType) {
        const baseRatings = {
            'regular_traveler': 4.2,
            'car_owner': 4.5,
            'truck_owner': 4.7,
            'fleet_company': 4.8
        };

        const compatibilityBonus = this.calculateCompatibility(shipmentType, carrierType) * 0.1;
        return Math.min(5.0, (baseRatings[carrierType] || 4.0) + compatibilityBonus);
    }

    calculateTime(carrierType, route) {
        if (!route) return 0;
        
        const baseTime = route.duration;
        const timeMultiplier = {
            'regular_traveler': 1.0,
            'car_owner': 1.1,
            'truck_owner': 1.2,
            'fleet_company': 1.5
        };

        return Math.round(baseTime * (timeMultiplier[carrierType] || 1.0));
    }

    calculateCompatibility(shipmentType, carrierType) {
        const shipment = this.shipmentTypes[shipmentType];
        const carrier = this.carrierTypes[carrierType];
        
        if (!shipment.compatibleCarriers.includes(carrierType)) {
            return 0;
        }

        const shipmentMin = shipment.weightRange.min;
        const shipmentMax = shipment.weightRange.max;
        const carrierMin = carrier.capacity.min;
        const carrierMax = carrier.capacity.max;

        if (shipmentMin >= carrierMin && shipmentMax <= carrierMax) {
            return 100;
        }

        const overlap = Math.min(shipmentMax, carrierMax) - Math.max(shipmentMin, carrierMin);
        const totalRange = Math.max(shipmentMax, carrierMax) - Math.min(shipmentMin, carrierMin);
        
        return Math.max(0, Math.round((overlap / totalRange) * 100));
    }

    getRoute(from, to) {
        const routeKey = `${from}-${to}`;
        return this.routes[routeKey] || null;
    }

    generateSmartRecommendation(shipmentWeight, from, to, preferences = {}) {
        const shipmentType = this.determineShipmentType(shipmentWeight);
        const compatibleCarriers = this.findCompatibleCarriers(shipmentType, from, to, preferences);
        
        const shipment = this.shipmentTypes[shipmentType];
        
        return {
            shipmentType: shipmentType,
            shipmentInfo: shipment,
            recommendedCarriers: compatibleCarriers,
            bestMatch: compatibleCarriers[0],
            alternativeMatches: compatibleCarriers.slice(1, 3),
            totalOptions: compatibleCarriers.length
        };
    }

    displayMatchingResults(containerId, recommendation) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const { shipmentInfo, recommendedCarriers, bestMatch } = recommendation;

        let html = `
            <div class="matching-results">
                <div class="shipment-info bg-${shipmentInfo.color}-50 rounded-lg p-4 mb-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">
                        ${shipmentInfo.icon} ${shipmentInfo.name}
                    </h3>
                    <p class="text-gray-600">الوزن: ${shipmentInfo.weightRange.min}-${shipmentInfo.weightRange.max} كيلو</p>
                    <p class="text-sm text-gray-500">أمثلة: ${shipmentInfo.examples.join('، ')}</p>
                </div>

                <div class="carriers-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        `;

        recommendedCarriers.forEach((carrier, index) => {
            const isBest = index === 0;
            const cardClass = isBest ? 'border-2 border-green-400 bg-green-50' : 'border border-gray-200 bg-white';
            
            html += `
                <div class="carrier-card ${cardClass} rounded-lg p-4 ${isBest ? 'ring-2 ring-green-400' : ''}">
                    ${isBest ? '<div class="text-green-600 font-bold text-sm mb-2">⭐ الأفضل</div>' : ''}
                    <div class="flex items-center mb-3">
                        <span class="text-2xl ml-2">${carrier.icon}</span>
                        <h4 class="font-bold text-gray-800">${carrier.name}</h4>
                    </div>
                    <div class="space-y-2 text-sm">
                        <p><strong>السعة:</strong> ${carrier.capacity.min}-${carrier.capacity.max} كيلو</p>
                        <p><strong>المركبات:</strong> ${carrier.vehicles.join('، ')}</p>
                        <p><strong>التكلفة المتوقعة:</strong> ${carrier.estimatedCost} ريال</p>
                        <p><strong>التقييم:</strong> ${carrier.rating.toFixed(1)}/5</p>
                        <p><strong>الوقت المتوقع:</strong> ${carrier.estimatedTime} ساعة</p>
                        <p><strong>التوافق:</strong> ${carrier.compatibility}%</p>
                    </div>
                    <div class="mt-4">
                        <button class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors" onclick="selectCarrier('${carrier.type}')">
                            اختر هذا الموصّل
                        </button>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;
    }
}

// إنشاء مثيل من النظام
const fastShipMatching = new FastShipMatchingSystem();

// دوال للاستخدام في الصفحات
function findBestCarriers(weight, from, to, preferences = {}) {
    return fastShipMatching.generateSmartRecommendation(weight, from, to, preferences);
}

function displayCarrierResults(containerId, weight, from, to, preferences = {}) {
    const recommendation = findBestCarriers(weight, from, to, preferences);
    fastShipMatching.displayMatchingResults(containerId, recommendation);
}

function selectCarrier(carrierType) {
    showNotification(`تم اختيار ${fastShipMatching.carrierTypes[carrierType].name} بنجاح!`, 'success');
    // يمكن إضافة المزيد من المنطق هنا
}

// جعل الدوال متاحة عالمياً
window.showNotification = showNotification;
window.smoothScrollTo = smoothScrollTo;
window.showLoading = showLoading;
window.appState = appState;
window.handleSendShipment = handleSendShipment;
window.handleDeliverShipments = handleDeliverShipments;
window.fastShipMatching = fastShipMatching;
window.findBestCarriers = findBestCarriers;
window.displayCarrierResults = displayCarrierResults;
window.selectCarrier = selectCarrier;
[file content end]