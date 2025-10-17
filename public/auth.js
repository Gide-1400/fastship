// نظام المصادقة والإدارة للمنصة (محدث ومصحح)
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.updateUI();
        
        // مراقبة حالة المصادقة
        if (typeof firebase !== 'undefined') {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.currentUser = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    };
                    this.saveCurrentUser(this.currentUser);
                } else {
                    this.clearCurrentUser();
                }
                this.updateUI();
            });
        }
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
    }

    clearCurrentUser() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    async login(email, password) {
        try {
            if (typeof firebase === 'undefined') {
                throw new Error('نظام المصادقة غير متاح');
            }

            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            const userData = {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                displayName: user.displayName,
                photoURL: user.photoURL
            };
            
            this.saveCurrentUser(userData);
            this.updateUI();
            return { success: true, user: userData };
            
        } catch (error) {
            console.error('خطأ في تسجيل الدخول:', error);
            return { 
                success: false, 
                error: this.getAuthErrorMessage(error) 
            };
        }
    }

    async register(userData) {
        try {
            if (typeof firebase === 'undefined') {
                throw new Error('نظام المصادقة غير متاح');
            }

            // إنشاء المستخدم في Firebase Authentication
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(
                userData.email, 
                userData.password
            );
            const user = userCredential.user;

            // تحديث ملف المستخدم
            await user.updateProfile({
                displayName: `${userData.firstName} ${userData.lastName}`,
                photoURL: userData.profileImage
            });

            // حفظ البيانات الإضافية في Firestore
            const userProfile = {
                uid: user.uid,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone,
                city: userData.city,
                accountType: userData.accountType,
                vehicleType: userData.vehicleType,
                vehicleModel: userData.vehicleModel,
                licenseNumber: userData.licenseNumber,
                createdAt: new Date().toISOString(),
                profileImage: userData.profileImage,
                isActive: true,
                rating: userData.accountType === 'traveler' ? 5.0 : null,
                completedTrips: userData.accountType === 'traveler' ? 0 : null
            };

            // حفظ البيانات في Firestore
            await firebase.firestore().collection("users").doc(user.uid).set(userProfile);

            // حفظ بيانات المستخدم محلياً
            const currentUserData = {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                displayName: user.displayName,
                photoURL: user.photoURL
            };
            
            this.saveCurrentUser(currentUserData);
            return { success: true, user: currentUserData };
            
        } catch (error) {
            console.error('خطأ في إنشاء الحساب:', error);
            return { 
                success: false, 
                error: this.getAuthErrorMessage(error) 
            };
        }
    }

    async logout() {
        try {
            if (typeof firebase !== 'undefined') {
                await firebase.auth().signOut();
            }
            this.clearCurrentUser();
            this.updateUI();
            window.location.href = 'index.html?loggedOut=true';
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
        }
    }

    getAuthErrorMessage(error) {
        const errorMessages = {
            'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
            'auth/user-not-found': 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني',
            'auth/wrong-password': 'كلمة المرور غير صحيحة',
            'auth/email-already-in-use': 'البريد الإلكتروني مسجل مسبقاً',
            'auth/weak-password': 'كلمة المرور ضعيفة، يجب أن تكون 8 أحرف على الأقل',
            'auth/too-many-requests': 'تم محاولة الدخول عدة مرات، يرجى المحاولة لاحقاً',
            'auth/network-request-failed': 'خطأ في الاتصال بالإنترنت'
        };
        
        return errorMessages[error.code] || 'حدث خطأ غير متوقع';
    }

    updateUI() {
        const authToggleBtn = document.getElementById('auth-toggle-btn');
        const authText = document.getElementById('auth-text');
        const authIcon = document.getElementById('auth-icon');
        const userMenu = document.getElementById('user-menu');
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        const welcomeMessage = document.getElementById('welcome-message');

        if (this.currentUser) {
            const displayName = this.currentUser.displayName || this.currentUser.email.split('@')[0];
            
            if (authToggleBtn) {
                authToggleBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'px-4', 'py-2');
                authToggleBtn.classList.add('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800', 'p-2');
                authToggleBtn.title = displayName;
            }
            if (authText) authText.textContent = displayName.split(' ')[0];
            if (authIcon) authIcon.classList.add('hidden');

            if (userMenu) userMenu.style.display = 'block';
            if (userName) userName.textContent = displayName;
            if (userEmail) userEmail.textContent = this.currentUser.email;
            
            if (welcomeMessage) {
                welcomeMessage.textContent = `مرحباً، ${displayName.split(' ')[0]}!`;
            }

        } else {
            if (authToggleBtn) {
                authToggleBtn.classList.remove('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800', 'p-2');
                authToggleBtn.classList.add('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'px-4', 'py-2');
                authToggleBtn.title = 'تسجيل الدخول / إنشاء حساب';
                authToggleBtn.onclick = () => window.location.href = 'login.html';
            }
            if (authText) authText.textContent = 'تسجيل الدخول';
            if (authIcon) authIcon.classList.remove('hidden');

            if (userMenu) userMenu.style.display = 'none';
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    async getUserProfile(uid) {
        try {
            if (typeof firebase === 'undefined') return null;
            
            const doc = await firebase.firestore().collection("users").doc(uid).get();
            if (doc.exists) {
                return doc.data();
            }
            return null;
        } catch (error) {
            console.error('خطأ في جلب الملف الشخصي:', error);
            return null;
        }
    }

    // نظام الشحنات المؤقت (بدون دفع)
    async createShipment(shipmentData) {
        if (!this.currentUser) return null;

        const shipment = {
            id: 'SH-' + Date.now(),
            userId: this.currentUser.uid,
            ...shipmentData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            trackingNumber: 'TRK-' + Math.random().toString(36).substr(2, 8).toUpperCase()
        };

        // حفظ في localStorage مؤقتاً
        const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
        shipments.push(shipment);
        localStorage.setItem('shipments', JSON.stringify(shipments));

        return shipment;
    }

    async getAvailableTravelers(filters = {}) {
        // بيانات وهمية للمسافرين (سيتم استبدالها بقاعدة بيانات حقيقية)
        return [
            {
                id: 1,
                name: 'سالم الأحمد',
                route: 'الرياض - الدمام',
                vehicle: 'سيارة خاصة',
                rating: 4.9,
                availableSpace: 'صندوق صغير',
                phone: '0551234567',
                photo: 'https://kimi-web-img.moonshot.cn/img/www.dropoff.com/55cca0b187c44c02ad7d55fdd54a23b1061a7806.jpeg'
            },
            {
                id: 2,
                name: 'نورة السعد',
                route: 'جدة - مكة',
                vehicle: 'حافلة',
                rating: 4.5,
                availableSpace: 'حقيبة متوسطة',
                phone: '0557654321',
                photo: 'https://kimi-web-img.moonshot.cn/img/citydelivery.com.vn/91e8f1c59ea323b3451428d49d42e5175d177b1b.jpg'
            }
        ];
    }
}

// تهيئة نظام المصادقة
window.authManager = new AuthManager();

// وظائف مساعدة
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        type === 'warning' ? 'bg-orange-500' :
        'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// تحديث الواجهة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.authManager.updateUI();
});