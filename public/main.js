// main.js - الملف الرئيسي لوظائف الموقع (محدث ومكتمل)

// تهيئة الموقع عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // تهيئة نظام المصادقة
        if (window.authManager) {
            window.authManager.updateUI();
        }

        // تهيئة نظام الشحنات
        if (window.shipmentManager) {
            await window.shipmentManager.init();
        }

        // تهيئة المكونات الأخرى
        initializeComponents();
        setupEventListeners();
        setupServiceWorker();

        console.log('تم تهيئة التطبيق بنجاح');
    } catch (error) {
        console.error('خطأ في تهيئة التطبيق:', error);
    }
}

// تهيئة المكونات
function initializeComponents() {
    initializeNavigation();
    initializeForms();
    initializeModals();
    initializeNotifications();
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    setupGlobalEventListeners();
    setupAuthEventListeners();
    setupShipmentEventListeners();
}

// تهيئة التنقل
function initializeNavigation() {
    // تحديث التنقل الديناميكي
    updateNavigation();

    // إعداد القوائم المنسدلة
    setupDropdowns();

    // إعداد القوائم الجانبية
    setupSidebars();
}

// تحديث التنقل بناءً على حالة المستخدم
function updateNavigation() {
    const user = window.authManager?.getCurrentUser();
    const authElements = document.querySelectorAll('[data-auth]');

    authElements.forEach(element => {
        const authType = element.dataset.auth;

        if (authType === 'required' && !user) {
            element.style.display = 'none';
        } else if (authType === 'optional' && user) {
            element.style.display = 'none';
        } else {
            element.style.display = 'block';
        }
    });
}

// إعداد القوائم المنسدلة
function setupDropdowns() {
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

// إعداد القوائم الجانبية
function setupSidebars() {
    const sidebarToggles = document.querySelectorAll('.sidebar-toggle');
    const sidebarOverlays = document.querySelectorAll('.sidebar-overlay');

    sidebarToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const sidebarId = this.dataset.sidebar;
            const sidebar = document.getElementById(sidebarId);
            if (sidebar) {
                sidebar.classList.toggle('hidden');
            }
        });
    });

    sidebarOverlays.forEach(overlay => {
        overlay.addEventListener('click', function() {
            const sidebar = this.closest('.sidebar');
            if (sidebar) {
                sidebar.classList.add('hidden');
            }
        });
    });
}

// تهيئة النماذج
function initializeForms() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });

        // التحقق أثناء الكتابة
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    });
}

// التحقق من صحة النموذج
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

// التحقق من صحة الحقل
function validateField(field) {
    const value = field.value.trim();
    const errorElement = field.parentElement.querySelector('.error-message') || 
                        field.parentElement.querySelector('[id$="-error"]');

    // مسح الأخطاء السابقة
    if (errorElement) {
        errorElement.classList.add('hidden');
    }

    // التحقق من الحقول المطلوبة
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'هذا الحقل مطلوب');
        return false;
    }

    // التحقق من صحة البريد الإلكتروني
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'البريد الإلكتروني غير صحيح');
            return false;
        }
    }

    // التحقق من رقم الجوال السعودي
    if (field.type === 'tel' && value) {
        const phoneRegex = /^05\d{8}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'رقم الجوال غير صحيح');
            return false;
        }
    }

    // التحقق من كلمة المرور
    if (field.type === 'password' && value) {
        if (value.length < 8) {
            showFieldError(field, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل');
            return false;
        }
    }

    return true;
}

// عرض خطأ الحقل
function showFieldError(field, message) {
    let errorElement = field.parentElement.querySelector('.error-message');

    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message text-red-500 text-sm mt-1';
        field.parentElement.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    
    field.classList.add('border-red-500');
    field.classList.remove('border-gray-300');
}

// تهيئة النوافذ المنبثقة
function initializeModals() {
    const modalToggles = document.querySelectorAll('.modal-toggle');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    modalToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const modalId = this.dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('hidden');
            }
        });
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // أزرار إغلاق النوافذ
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

// تهيئة نظام الإشعارات
function initializeNotifications() {
    // يمكن إضافة المزيد من وظائف الإشعارات هنا
}

// إعداد مستمعي الأحداث العامة
function setupGlobalEventListeners() {
    // النقر خارج العناصر
    document.addEventListener('click', function(e) {
        handleOutsideClick(e);
    });

    // مفاتيح الاختصار
    document.addEventListener('keydown', function(e) {
        handleKeyboardShortcuts(e);
    });

    // التمرير
    window.addEventListener('scroll', function() {
        handleScrollEvents();
    });

    // تغيير حجم النافذة
    window.addEventListener('resize', function() {
        handleResizeEvents();
    });
}

// التعامل مع النقر خارج العناصر
function handleOutsideClick(e) {
    // إغلاق القوائم المنسدلة والنوافذ
    const dropdowns = document.querySelectorAll('.dropdown-menu:not(.hidden)');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target) && !dropdown.previousElementSibling.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

// مفاتيح الاختصار
function handleKeyboardShortcuts(e) {
    // Esc لإغلاق النوافذ
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal:not(.hidden)');
        openModals.forEach(modal => {
            modal.classList.add('hidden');
        });
    }
}

// أحداث التمرير
function handleScrollEvents() {
    // إضافة تأثيرات عند التمرير
    const elements = document.querySelectorAll('.fade-in-on-scroll');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            element.classList.add('opacity-100', 'translate-y-0');
            element.classList.remove('opacity-0', 'translate-y-4');
        }
    });

    // شريط التقدم
    updateProgressBar();
}

// تحديث شريط التقدم
function updateProgressBar() {
    const progressBar = document.querySelector('.reading-progress');
    if (progressBar) {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset;
        const progress = (scrollTop / documentHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

// أحداث تغيير الحجم
function handleResizeEvents() {
    updateResponsiveElements();
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

// إعداد مستمعي أحداث المصادقة
function setupAuthEventListeners() {
    // تحديث الواجهة عند تغيير حالة المصادقة
    if (window.authManager) {
        // يمكن إضافة مستمعي أحداث إضافية هنا
    }
}

// إعداد مستمعي أحداث الشحنات
function setupShipmentEventListeners() {
    // يمكن إضافة مستمعي أحداث للشحنات هنا
}

// إعداد Service Worker (للتطبيق التقدمي PWA)
function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker مسجل بنجاح:', registration);
            })
            .catch(error => {
                console.log('فشل تسجيل Service Worker:', error);
            });
    }
}

// وظائف مساعدة عامة
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// الانتقال السلس إلى الأقسام
function smoothScrollTo(target, offset = 0) {
    const element = document.querySelector(target);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// إظهار تأثير التحميل
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

// نسخ إلى الحافظة
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('تم النسخ إلى الحافظة', 'success');
    }).catch(() => {
        showNotification('فشل النسخ إلى الحافظة', 'error');
    });
}

// تحميل لاحق للصور
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// جعل الدوال متاحة عالمياً
window.appUtils = {
    debounce,
    throttle,
    smoothScrollTo,
    showLoading,
    copyToClipboard,
    setupLazyLoading
};

// تصدير للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        validateForm,
        showNotification
    };
}