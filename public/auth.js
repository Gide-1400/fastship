// نظام المصادقة والإدارة للمنصة (محدث مع Firebase)
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // تحميل بيانات المستخدم من localStorage
        this.loadCurrentUser();
        
        // تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
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
    }

    clearCurrentUser() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    async login(email, password) {
        try {
            const userCredential = await window.firebaseSignIn(window.firebaseAuth, email, password);
            const user = userCredential.user;
            
            // جلب البيانات الكاملة من Firestore
            const userDoc = await window.firebaseGetDoc(window.firebaseDoc(window.firebaseDB, "users", user.uid));
            const userProfile = userDoc.data();
            
            const userData = {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                displayName: user.displayName,
                photoURL: user.photoURL,
                accountType: userProfile?.accountType || 'user',
                firstName: userProfile?.firstName,
                lastName: userProfile?.lastName
            };
            
            this.saveCurrentUser(userData);
            this.updateUI();
            return true;
            
        } catch (error) {
            console.error('خطأ في تسجيل الدخول:', error);
            return false;
        }
    }

    async register(userData) {
        try {
            // إنشاء المستخدم في Firebase Authentication
            const userCredential = await window.firebaseCreateUser(window.firebaseAuth, userData.email, userData.password);
            const user = userCredential.user;

            // تحديث ملف المستخدم
            await window.firebaseUpdateProfile(user, {
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
            await window.firebaseSetDoc(window.firebaseDoc(window.firebaseDB, "users", user.uid), userProfile);

            // حفظ بيانات المستخدم
            const currentUserData = {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                displayName: user.displayName,
                photoURL: user.photoURL,
                accountType: userData.accountType,
                firstName: userData.firstName,
                lastName: userData.lastName
            };
            
            this.saveCurrentUser(currentUserData);
            this.updateUI();
            return true;
            
        } catch (error) {
            console.error('خطأ في إنشاء الحساب:', error);
            return false;
        }
    }

    async logout() {
        try {
            await window.firebaseSignOut(window.firebaseAuth);
            this.clearCurrentUser();
            this.updateUI();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
        }
    }

    updateUI() {
        // استخدام الدالة المحسنة لتحديث الواجهة
        updateAuthUI(this.currentUser);
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    async updateProfile(profileData) {
        if (!this.currentUser) return false;

        try {
            // تحديث البيانات في Firebase
            const user = window.firebaseAuth.currentUser;
            if (user) {
                await window.firebaseUpdateProfile(user, {
                    displayName: `${profileData.firstName} ${profileData.lastName}`
                });
            }

            // تحديث البيانات في Firestore
            await window.firebaseSetDoc(
                window.firebaseDoc(window.firebaseDB, "users", this.currentUser.uid),
                {
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    phone: profileData.phone,
                    city: profileData.city
                },
                { merge: true }
            );

            // تحديث البيانات المحلية
            this.currentUser.displayName = `${profileData.firstName} ${profileData.lastName}`;
            this.currentUser.firstName = profileData.firstName;
            this.currentUser.lastName = profileData.lastName;
            this.saveCurrentUser(this.currentUser);
            this.updateUI();
            
            return true;
        } catch (error) {
            console.error('خطأ في تحديث الملف:', error);
            return false;
        }
    }

    async changePassword(currentPassword, newPassword) {
        if (!this.currentUser) return false;

        try {
            const user = window.firebaseAuth.currentUser;
            
            // إعادة المصادقة أولاً
            const credential = window.firebaseEmailAuthProvider.credential(
                this.currentUser.email, 
                currentPassword
            );
            await window.firebaseReauthenticateWithCredential(user, credential);
            
            // تغيير كلمة المرور
            await window.firebaseUpdatePassword(user, newPassword);
            
            showNotification('تم تغيير كلمة المرور بنجاح', 'success');
            return true;
        } catch (error) {
            console.error('خطأ في تغيير كلمة المرور:', error);
            showNotification('فشل في تغيير كلمة المرور. تأكد من كلمة المرور الحالية.', 'error');
            return false;
        }
    }

    // الحصول على المسافرين المتاحين
    async getAvailableTravelers() {
        try {
            const travelersQuery = window.firebaseQuery(
                window.firebaseCollection(window.firebaseDB, "users"),
                window.firebaseWhere("accountType", "==", "traveler"),
                window.firebaseWhere("isActive", "==", true)
            );
            
            const querySnapshot = await window.firebaseGetDocs(travelersQuery);
            const travelers = [];
            
            querySnapshot.forEach((doc) => {
                travelers.push({ id: doc.id, ...doc.data() });
            });
            
            return travelers;
        } catch (error) {
            console.error('خطأ في جلب المسافرين:', error);
            return [];
        }
    }

    // الحصول على إحصائيات المستخدم
    async getUserStats() {
        if (!this.currentUser) return null;

        try {
            const userDoc = await window.firebaseGetDoc(
                window.firebaseDoc(window.firebaseDB, "users", this.currentUser.uid)
            );
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return {
                    completedTrips: userData.completedTrips || 0,
                    rating: userData.rating || 0,
                    earnings: userData.earnings || 0,
                    joinedDate: userData.createdAt || new Date().toISOString()
                };
            }
            
            return null;
        } catch (error) {
            console.error('خطأ في جلب الإحصائيات:', error);
            return null;
        }
    }

    // تحديث صورة الملف الشخصي
    async updateProfileImage(imageUrl) {
        if (!this.currentUser) return false;

        try {
            const user = window.firebaseAuth.currentUser;
            if (user) {
                await window.firebaseUpdateProfile(user, {
                    photoURL: imageUrl
                });
            }

            // تحديث البيانات في Firestore
            await window.firebaseSetDoc(
                window.firebaseDoc(window.firebaseDB, "users", this.currentUser.uid),
                { profileImage: imageUrl },
                { merge: true }
            );

            // تحديث البيانات المحلية
            this.currentUser.photoURL = imageUrl;
            this.saveCurrentUser(this.currentUser);
            this.updateUI();
            
            return true;
        } catch (error) {
            console.error('خطأ في تحديث صورة الملف:', error);
            return false;
        }
    }
}

// تهيئة نظام المصادقة
window.authManager = new AuthManager();

// وظيفة تحديث واجهة المستخدم (النسخة المحسنة)
function updateAuthUI(user) {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    const userType = document.getElementById('user-type');
    const userAvatar = document.getElementById('user-avatar');

    if (user && user.uid) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (userMenu) userMenu.classList.remove('hidden');
        
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
        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';
        if (userMenu) userMenu.classList.add('hidden');
    }
}

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

// وظيفة للتحقق من صحة رقم الجوال السعودي
function isValidSaudiPhone(phone) {
    const phoneRegex = /^05\d{8}$/;
    return phoneRegex.test(phone);
}

// تحديث الواجهة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.authManager.updateUI();
    
    // عرض رسالة النجاح إذا كان المستخدم قد سجل للتو
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        showNotification('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.', 'success');
    }
    
    if (urlParams.get('login') === 'true') {
        showNotification('تم تسجيل الدخول بنجاح!', 'success');
    }
    
    if (urlParams.get('logout') === 'true') {
        showNotification('تم تسجيل الخروج بنجاح', 'info');
    }
});

// إضافة مستمعي الأحداث لأزرار التسجيل والدخول
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.authManager.logout();
        });
    }
    
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'profile.html';
        });
    }
});
