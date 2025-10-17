// نظام المصادقة والإدارة للمنصة (محدث ومصحح)
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.setupAuthStateListener();
    }

    setupAuthStateListener() {
        // الاستماع لتغيرات حالة المصادقة
        if (window.firebaseAuth) {
            window.firebaseOnAuthStateChanged(window.firebaseAuth, (user) => {
                if (user) {
                    this.handleUserLogin(user);
                } else {
                    this.handleUserLogout();
                }
            });
        }
    }

    async handleUserLogin(user) {
        try {
            // جلب البيانات الكاملة من Firestore
            const userDoc = await window.firebaseGetDoc(window.firebaseDoc(window.firebaseDB, "users", user.uid));
            const userProfile = userDoc.data();
            
            const userData = {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                displayName: user.displayName || `${userProfile?.firstName} ${userProfile?.lastName}`,
                photoURL: user.photoURL,
                accountType: userProfile?.accountType || 'user',
                firstName: userProfile?.firstName,
                lastName: userProfile?.lastName
            };
            
            this.saveCurrentUser(userData);
            this.updateUI();
            
        } catch (error) {
            console.error('خطأ في تحميل بيانات المستخدم:', error);
        }
    }

    handleUserLogout() {
        this.clearCurrentUser();
        this.updateUI();
    }

    loadCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    saveCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        // تحديث جميع الصفحات فوراً
        this.updateUI();
    }

    clearCurrentUser() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        // تحديث جميع الصفحات فوراً
        this.updateUI();
    }

    async login(email, password) {
        try {
            const userCredential = await window.firebaseSignIn(window.firebaseAuth, email, password);
            await this.handleUserLogin(userCredential.user);
            
            // ✅ الإصلاح: لا يتم التوجيه تلقائياً، يبقى في نفس الصفحة
            showNotification('تم تسجيل الدخول بنجاح!', 'success');
            return true;
            
        } catch (error) {
            console.error('خطأ في تسجيل الدخول:', error);
            showNotification('فشل تسجيل الدخول. تأكد من البيانات المدخلة.', 'error');
            return false;
        }
    }

    async logout() {
        try {
            if (window.firebaseAuth) {
                await window.firebaseSignOut(window.firebaseAuth);
            }
            this.handleUserLogout();
            showNotification('تم تسجيل الخروج بنجاح', 'info');
            
            // ✅ الإصلاح: التوجيه إلى الرئيسية بعد التسجيل
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
        }
    }

    updateUI() {
        updateAuthUI(this.currentUser);
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// ✅ وظيفة تحديث واجهة المستخدم المحسنة
function updateAuthUI(user) {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    const userType = document.getElementById('user-type');
    const userAvatar = document.getElementById('user-avatar');

    if (user && user.uid) {
        // إخفاء أزرار التسجيل والدخول
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        
        // إظهار قائمة المستخدم
        if (userMenu) {
            userMenu.classList.remove('hidden');
            userMenu.style.display = 'flex';
        }
        
        // تحديث بيانات المستخدم
        if (userName) {
            userName.textContent = user.displayName || user.email || 'مستخدم';
        }
        
        if (userType) {
            const accountType = user.accountType;
            if (accountType === 'traveler') {
                userType.textContent = 'موصل';
                userType.className = 'bg-green-100 text-green-800 px-2 py-1 rounded text-xs';
            } else if (accountType === 'client') {
                userType.textContent = 'عميل';
                userType.className = 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs';
            } else {
                userType.textContent = 'مستخدم';
                userType.className = 'bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs';
            }
        }
        
        if (userAvatar) {
            userAvatar.src = user.photoURL || user.profileImage || 'https://kimi-web-img.moonshot.cn/img/www.dropoff.com/55cca0b187c44c02ad7d55fdd54a23b1061a7806.jpeg';
            userAvatar.alt = user.displayName || 'صورة المستخدم';
        }
    } else {
        // إظهار أزرار التسجيل والدخول
        if (loginBtn) {
            loginBtn.style.display = 'block';
            loginBtn.classList.remove('hidden');
        }
        if (registerBtn) {
            registerBtn.style.display = 'block';
            registerBtn.classList.remove('hidden');
        }
        
        // إخفاء قائمة المستخدم
        if (userMenu) {
            userMenu.classList.add('hidden');
            userMenu.style.display = 'none';
        }
    }
}

// ✅ تهيئة نظام المصادقة
window.authManager = new AuthManager();

// ✅ تحديث الواجهة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.authManager.updateUI();
});