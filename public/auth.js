// نظام المصادقة والإدارة للمنصة (محدث ومكتمل)
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.initFirebaseAuth();
        this.updateUI();
    }

    initFirebaseAuth() {
        if (typeof firebase !== 'undefined') {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.handleUserSignedIn(user);
                } else {
                    this.handleUserSignedOut();
                }
            });
        }
    }

    handleUserSignedIn(user) {
        this.currentUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
        };
        this.saveCurrentUser(this.currentUser);
        this.updateUI();
        
        // جلب بيانات المستخدم الإضافية من Firestore
        this.loadUserProfile(user.uid);
    }

    handleUserSignedOut() {
        this.currentUser = null;
        this.clearCurrentUser();
        this.updateUI();
    }

    async loadUserProfile(uid) {
        try {
            if (typeof firebase === 'undefined') return;
            
            const doc = await firebase.firestore().collection("users").doc(uid).get();
            if (doc.exists) {
                const userData = doc.data();
                this.currentUser = { ...this.currentUser, ...userData };
                this.saveCurrentUser(this.currentUser);
                this.updateUI();
            }
        } catch (error) {
            console.error('خطأ في جلب بيانات المستخدم:', error);
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
                photoURL: userData.profileImage || 'https://kimi-web-img.moonshot.cn/img/www.dropoff.com/55cca0b187c44c02ad7d55fdd54a23b1061a7806.jpeg'
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
                vehicleType: userData.vehicleType || '',
                vehicleModel: userData.vehicleModel || '',
                licenseNumber: userData.licenseNumber || '',
                createdAt: new Date().toISOString(),
                profileImage: userData.profileImage || 'https://kimi-web-img.moonshot.cn/img/www.dropoff.com/55cca0b187c44c02ad7d55fdd54a23b1061a7806.jpeg',
                isActive: true,
                rating: userData.accountType === 'traveler' ? 5.0 : null,
                completedTrips: userData.accountType === 'traveler' ? 0 : null,
                totalEarnings: userData.accountType === 'traveler' ? 0 : null
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
        const userType = document.getElementById('user-type');
        const welcomeMessage = document.getElementById('welcome-message');
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');

        if (this.currentUser) {
            const displayName = this.currentUser.displayName || this.currentUser.email.split('@')[0];
            
            // إخفاء أزرار التسجيل والدخول
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            
            // إظهار قائمة المستخدم
            if (userMenu) userMenu.style.display = 'flex';
            if (userName) userName.textContent = displayName;
            if (userEmail) userEmail.textContent = this.currentUser.email;
            if (userType) userType.textContent = this.currentUser.accountType === 'traveler' ? 'مسافر' : 'عميل';
            
            if (welcomeMessage) {
                welcomeMessage.textContent = `مرحباً، ${displayName.split(' ')[0]}!`;
            }

            if (authToggleBtn) {
                authToggleBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'px-4', 'py-2');
                authToggleBtn.classList.add('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800', 'p-2');
                authToggleBtn.title = displayName;
            }
            if (authText) authText.textContent = displayName.split(' ')[0];
            if (authIcon) authIcon.classList.add('hidden');

        } else {
            // إظهار أزرار التسجيل والدخول
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            
            // إخفاء قائمة المستخدم
            if (userMenu) userMenu.style.display = 'none';

            if (authToggleBtn) {
                authToggleBtn.classList.remove('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800', 'p-2');
                authToggleBtn.classList.add('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'px-4', 'py-2');
                authToggleBtn.title = 'تسجيل الدخول / إنشاء حساب';
                authToggleBtn.onclick = () => window.location.href = 'login.html';
            }
            if (authText) authText.textContent = 'تسجيل الدخول';
            if (authIcon) authIcon.classList.remove('hidden');
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

    // نظام الشحنات
    async createShipment(shipmentData) {
        if (!this.currentUser) {
            throw new Error('يجب تسجيل الدخول أولاً');
        }

        try {
            const shipment = {
                id: 'SH-' + Date.now(),
                userId: this.currentUser.uid,
                userEmail: this.currentUser.email,
                userName: this.currentUser.displayName,
                ...shipmentData,
                status: 'pending',
                createdAt: new Date().toISOString(),
                trackingNumber: 'TRK-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
                assignedTraveler: null,
                assignedAt: null,
                deliveredAt: null
            };

            // حفظ في Firestore
            await firebase.firestore().collection("shipments").doc(shipment.id).set(shipment);

            return shipment;
        } catch (error) {
            console.error('خطأ في إنشاء الشحنة:', error);
            throw new Error('فشل إنشاء الشحنة');
        }
    }

    async getAvailableTravelers(filters = {}) {
        try {
            if (typeof firebase === 'undefined') return [];

            let query = firebase.firestore().collection("users").where("accountType", "==", "traveler");
            
            if (filters.city) {
                query = query.where("city", "==", filters.city);
            }

            const snapshot = await query.get();
            const travelers = [];

            snapshot.forEach(doc => {
                travelers.push({ id: doc.id, ...doc.data() });
            });

            return travelers;
        } catch (error) {
            console.error('خطأ في جلب المسافرين:', error);
            return [];
        }
    }

    async getUserShipments() {
        if (!this.currentUser) return [];

        try {
            const snapshot = await firebase.firestore()
                .collection("shipments")
                .where("userId", "==", this.currentUser.uid)
                .orderBy("createdAt", "desc")
                .get();

            const shipments = [];
            snapshot.forEach(doc => {
                shipments.push(doc.data());
            });

            return shipments;
        } catch (error) {
            console.error('خطأ في جلب الشحنات:', error);
            return [];
        }
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
    if (window.authManager) {
        window.authManager.updateUI();
    }
});