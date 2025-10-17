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
        if (window.firebaseAuth && window.firebaseOnAuthStateChanged) {
            window.firebaseOnAuthStateChanged(window.firebaseAuth, (user) => {
                if (user) {
                    this.handleUserLogin(user);
                } else {
                    this.handleUserLogout();
                }
            });
        } else {
            console.warn('Firebase Auth غير متاح');
        }
    }

    async handleUserLogin(user) {
        try {
            // إنشاء بيانات المستخدم الأساسية
            const userData = {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                displayName: user.displayName || 'مستخدم',
                photoURL: user.photoURL,
                accountType: 'client', // افتراضي
                firstName: '',
                lastName: ''
            };
            
            // محاولة جلب البيانات من Firestore إذا كانت متاحة
            if (window.firebaseDB && window.firebaseGetDoc && window.firebaseDoc) {
                try {
                    const userDoc = await window.firebaseGetDoc(window.firebaseDoc(window.firebaseDB, "users", user.uid));
                    if (userDoc.exists()) {
                        const userProfile = userDoc.data();
                        userData.displayName = userProfile?.displayName || `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || user.displayName || 'مستخدم';
                        userData.accountType = userProfile?.accountType || 'client';
                        userData.firstName = userProfile?.firstName || '';
                        userData.lastName = userProfile?.lastName || '';
                    }
                } catch (firestoreError) {
                    console.warn('لا يمكن الوصول إلى Firestore:', firestoreError);
                }
            }
            
            this.saveCurrentUser(userData);
            this.updateUI();
            
        } catch (error) {
            console.error('خطأ في تحميل بيانات المستخدم:', error);
            // في حالة الخطأ، استخدم البيانات الأساسية
            const userData = {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                displayName: user.displayName || 'مستخدم',
                photoURL: user.photoURL,
                accountType: 'client'
            };
            this.saveCurrentUser(userData);
            this.updateUI();
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
            if (!window.firebaseSignIn || !window.firebaseAuth) {
                throw new Error('Firebase Auth غير متاح');
            }
            
            const userCredential = await window.firebaseSignIn(window.firebaseAuth, email, password);
            await this.handleUserLogin(userCredential.user);
            
            showNotification('تم تسجيل الدخول بنجاح!', 'success');
            return true;
            
        } catch (error) {
            console.error('خطأ في تسجيل الدخول:', error);
            let errorMessage = 'فشل تسجيل الدخول. تأكد من البيانات المدخلة.';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'البريد الإلكتروني غير مسجل';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'كلمة المرور غير صحيحة';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'البريد الإلكتروني غير صحيح';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'تم تجاوز عدد المحاولات المسموح. حاول لاحقاً';
            }
            
            showNotification(errorMessage, 'error');
            return false;
        }
    }

    async logout() {
        try {
            if (window.firebaseSignOut && window.firebaseAuth) {
                await window.firebaseSignOut(window.firebaseAuth);
            }
            this.handleUserLogout();
            showNotification('تم تسجيل الخروج بنجاح', 'info');
            
            // التوجيه إلى الرئيسية بعد التسجيل
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
            // حتى لو فشل تسجيل الخروج من Firebase، نظف البيانات المحلية
            this.handleUserLogout();
            window.location.href = 'index.html';
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

// ✅ دالة مساعدة لإنشاء مستخدم جديد مع Firestore
async function createUserWithProfile(userCredential, additionalData = {}) {
    try {
        const user = userCredential.user;
        
        // إنشاء ملف المستخدم في Firestore
        if (window.firebaseDB && window.firebaseSetDoc && window.firebaseDoc) {
            const userProfile = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                accountType: additionalData.accountType || 'client',
                firstName: additionalData.firstName || '',
                lastName: additionalData.lastName || '',
                phone: additionalData.phone || '',
                city: additionalData.city || '',
                createdAt: new Date().toISOString(),
                isVerified: false,
                ...additionalData
            };
            
            await window.firebaseSetDoc(
                window.firebaseDoc(window.firebaseDB, "users", user.uid), 
                userProfile
            );
        }
        
        return user;
    } catch (error) {
        console.error('خطأ في إنشاء ملف المستخدم:', error);
        throw error;
    }
}

// ✅ دالة مساعدة لجلب بيانات المستخدم من Firestore
async function getUserProfile(uid) {
    try {
        if (window.firebaseDB && window.firebaseGetDoc && window.firebaseDoc) {
            const userDoc = await window.firebaseGetDoc(window.firebaseDoc(window.firebaseDB, "users", uid));
            if (userDoc.exists()) {
                return userDoc.data();
            }
        }
        return null;
    } catch (error) {
        console.error('خطأ في جلب ملف المستخدم:', error);
        return null;
    }
}

// ✅ دالة مساعدة لتسجيل مستخدم جديد
async function registerUser(email, password, userData) {
    try {
        if (!window.firebaseCreateUser || !window.firebaseAuth) {
            throw new Error('Firebase Auth غير متاح');
        }
        
        // إنشاء المستخدم في Firebase Auth
        const userCredential = await window.firebaseCreateUser(window.firebaseAuth, email, password);
        const user = userCredential.user;
        
        // تحديث اسم المستخدم
        if (userData.firstName && userData.lastName) {
            await user.updateProfile({
                displayName: `${userData.firstName} ${userData.lastName}`
            });
        }
        
        // إنشاء ملف المستخدم في Firestore
        await createUserWithProfile(userCredential, userData);
        
        // تسجيل الدخول التلقائي
        await window.authManager.handleUserLogin(user);
        
        return true;
    } catch (error) {
        console.error('خطأ في التسجيل:', error);
        throw error;
    }
}

// ✅ دالة مساعدة لتحديث ملف المستخدم
async function updateUserProfile(uid, updates) {
    try {
        if (window.firebaseDB && window.firebaseSetDoc && window.firebaseDoc) {
            await window.firebaseSetDoc(
                window.firebaseDoc(window.firebaseDB, "users", uid), 
                updates, 
                { merge: true }
            );
            return true;
        }
        return false;
    } catch (error) {
        console.error('خطأ في تحديث ملف المستخدم:', error);
        return false;
    }
}

// ✅ تحديث الواجهة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.authManager.updateUI();
});