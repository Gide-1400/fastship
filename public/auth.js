[file name]: auth.js
[file content begin]
// نظام المصادقة والإدارة للمنصة
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.init();
    }

    init() {
        // تحميل بيانات المستخدمين من localStorage
        this.loadCurrentUser();
        
        // تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
        this.updateUI();
    }

    loadUsers() {
        const users = localStorage.getItem('fastshipment_users');
        if (users) {
            return JSON.parse(users);
        }
        
        // بيانات تجريبية افتراضية
        const defaultUsers = [
            {
                id: 1,
                firstName: 'أحمد',
                lastName: 'محمد',
                email: 'client@example.com',
                phone: '0551234567',
                city: 'الرياض',
                accountType: 'client',
                password: 'password123',
                createdAt: new Date().toISOString(),
                isActive: true,
                profileImage: 'https://kimi-web-img.moonshot.cn/img/www.dropoff.com/55cca0b187c44c02ad7d55fdd54a23b1061a7806.jpeg'
            },
            {
                id: 2,
                firstName: 'خالد',
                lastName: 'السيد',
                email: 'traveler@example.com',
                phone: '0557654321',
                city: 'جدة',
                accountType: 'traveler',
                password: 'password123',
                vehicleType: 'سيارة',
                vehicleModel: 'تويوتا كامري 2022',
                licenseNumber: 'SA123456789',
                createdAt: new Date().toISOString(),
                isActive: true,
                profileImage: 'https://kimi-web-img.moonshot.cn/img/www.dropoff.com/55cca0b187c44c02ad7d55fdd54a23b1061a7806.jpeg'
            }
        ];
        
        this.saveUsers(defaultUsers);
        return defaultUsers;
    }

    saveUsers(users) {
        localStorage.setItem('fastshipment_users', JSON.stringify(users));
    }

    loadCurrentUser() {
        const userData = localStorage.getItem('fastshipment_current_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    saveCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('fastshipment_current_user', JSON.stringify(user));
    }

    clearCurrentUser() {
        this.currentUser = null;
        localStorage.removeItem('fastshipment_current_user');
    }

    login(email, password, remember = false) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user && user.isActive) {
            this.saveCurrentUser(user);
            this.updateUI();
            return true;
        }
        
        return false;
    }

    register(userData) {
        // التحقق من عدم وجود مستخدم بنفس البريد الإلكتروني
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
            return false;
        }

        // إنشاء مستخدم جديد
        const newUser = {
            id: Date.now(),
            ...userData,
            createdAt: new Date().toISOString(),
            isActive: true,
            profileImage: 'https://kimi-web-img.moonshot.cn/img/www.dropoff.com/55cca0b187c44c02ad7d55fdd54a23b1061a7806.jpeg',
            rating: userData.accountType === 'traveler' ? 5.0 : null,
            completedTrips: userData.accountType === 'traveler' ? 0 : null
        };

        this.users.push(newUser);
        this.saveUsers(this.users);
        return true;
    }

    logout() {
        this.clearCurrentUser();
        this.updateUI();
        window.location.href = 'index.html';
    }

    updateUI() {
        // تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const userMenu = document.getElementById('user-menu');
        const userName = document.getElementById('user-name');
        const userType = document.getElementById('user-type');

        if (this.currentUser) {
            // إخفاء أزرار تسجيل الدخول والتسجيل
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            
            // إظهار قائمة المستخدم
            if (userMenu) userMenu.style.display = 'block';
            if (userName) userName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            if (userType) {
                userType.textContent = this.currentUser.accountType === 'client' ? 'عميل' : 'مسافر';
                userType.className = this.currentUser.accountType === 'client' ? 
                    'bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs' : 
                    'bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs';
            }
        } else {
            // إظهار أزرار تسجيل الدخول والتسجيل
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            
            // إخفاء قائمة المستخدم
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    updateProfile(profileData) {
        if (!this.currentUser) return false;

        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...profileData };
            this.currentUser = this.users[userIndex];
            this.saveUsers(this.users);
            this.saveCurrentUser(this.currentUser);
            return true;
        }
        return false;
    }

    changePassword(currentPassword, newPassword) {
        if (!this.currentUser) return false;

        if (this.currentUser.password !== currentPassword) {
            return false;
        }

        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex].password = newPassword;
            this.currentUser.password = newPassword;
            this.saveUsers(this.users);
            this.saveCurrentUser(this.currentUser);
            return true;
        }
        return false;
    }

    // الحصول على المسافرين المتاحين
    getAvailableTravelers() {
        return this.users.filter(user => 
            user.accountType === 'traveler' && 
            user.isActive
        );
    }

    // الحصول على إحصائيات المستخدم
    getUserStats() {
        if (!this.currentUser) return null;

        if (this.currentUser.accountType === 'traveler') {
            return {
                completedTrips: this.currentUser.completedTrips || 0,
                rating: this.currentUser.rating || 5.0,
                earnings: (this.currentUser.completedTrips || 0) * 50 // مثال
            };
        } else {
            return {
                sentPackages: 0, // يمكن إضافة منطق لحساب الشحنات المرسلة
                activeRequests: 0
            };
        }
    }
}

// تهيئة نظام المصادقة
window.authManager = new AuthManager();

// تحديث الواجهة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.authManager.updateUI();
    
    // عرض رسالة النجاح إذا كان المستخدم قد سجل للتو
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        showNotification('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.', 'success');
    }
});

// وظيفة لعرض الإشعارات
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
        notification.remove();
    }, 5000);
}

// وظيفة للتحقق من صحة البريد الإلكتروني
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// وظيفة للتحقق من صحة رقم الجوال السعودي
function isValidSaudiPhone(phone) {
    const phoneRegex = /^05\d{8}$/;
    return phoneRegex.test(phone);
}
[file content end]