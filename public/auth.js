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
            
            const userData = {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                displayName: user.displayName,
                photoURL: user.photoURL
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
                photoURL: user.photoURL
            };
            
            this.saveCurrentUser(currentUserData);
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
	            window.location.href = 'index.html?loggedOut=true';
	        } catch (error) {
	            console.error('خطأ في تسجيل الخروج:', error);
	        }
	    }
	
	    /**
	     * تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول.
	     * يتم استدعاؤها في كل صفحة لتحقيق التناسق.
	     */
	    updateUI() {
	        const authToggleBtn = document.getElementById('auth-toggle-btn');
	        const authText = document.getElementById('auth-text');
	        const authIcon = document.getElementById('auth-icon');
	        const userMenu = document.getElementById('user-menu');
	        const userName = document.getElementById('user-name');
	        const userEmail = document.getElementById('user-email');
	        const welcomeMessage = document.getElementById('welcome-message'); // لصفحة لوحة التحكم
	
	        if (this.currentUser) {
	            const displayName = this.currentUser.displayName || this.currentUser.email.split('@')[0];
	            
	            // تحديث زر المصادقة ليصبح قائمة المستخدم
	            if (authToggleBtn) {
	                authToggleBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'px-4', 'py-2');
	                authToggleBtn.classList.add('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800', 'p-2');
	                authToggleBtn.title = displayName;
	                authToggleBtn.onclick = null; // إزالة أي وظيفة سابقة
	            }
	            if (authText) authText.textContent = displayName.split(' ')[0]; // عرض الاسم الأول فقط
	            if (authIcon) authIcon.classList.add('hidden'); // إخفاء أيقونة تسجيل الدخول
	
	            // إظهار قائمة المستخدم
	            if (userMenu) userMenu.style.display = 'block';
	            if (userName) userName.textContent = displayName;
	            if (userEmail) userEmail.textContent = this.currentUser.email;
	            
	            // تحديث رسالة الترحيب في لوحة التحكم
	            if (welcomeMessage) {
	                welcomeMessage.textContent = `مرحباً، ${displayName.split(' ')[0]}!`;
	            }
	
	            // عرض رسالة ترحيب (إذا لم تكن في صفحة الدخول/التسجيل)
	            if (document.title.includes('تسجيل الدخول') || document.title.includes('إنشاء حساب')) {
	                window.location.href = 'dashboard.html'; // إعادة التوجيه
	            } else if (document.referrer.includes('login.html') || document.referrer.includes('register.html')) {
	                showNotification(`أهلاً بك، ${displayName}!`, 'success');
	            }
	
	        } else {
	            // تحديث زر المصادقة ليصبح زر تسجيل الدخول/التسجيل
	            if (authToggleBtn) {
	                authToggleBtn.classList.remove('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800', 'p-2');
	                authToggleBtn.classList.add('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'px-4', 'py-2');
	                authToggleBtn.title = 'تسجيل الدخول / إنشاء حساب';
	                authToggleBtn.onclick = () => window.location.href = 'login.html';
	            }
	            if (authText) authText.textContent = 'تسجيل الدخول';
	            if (authIcon) authIcon.classList.remove('hidden');
	
	            // إخفاء قائمة المستخدم
	            if (userMenu) userMenu.style.display = 'none';
	            
	            // إذا كان المستخدم في صفحة تتطلب تسجيل الدخول
	            if (isDashboardPage()) {
	                // في لوحة التحكم، يتم التعامل مع حالة عدم تسجيل الدخول في ملف dashboard.html
	            }
	        }
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
	            const user = window.firebaseAuth.currentUser;
	            const newDisplayName = `${profileData.firstName} ${profileData.lastName}`;
	            
	            if (user) {
	                // 1. تحديث اسم العرض في Firebase Auth
	                await window.firebaseUpdateProfile(user, {
	                    displayName: newDisplayName
	                });
	            }
	
	            // 2. تحديث البيانات في Firestore
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
	
	            // 3. تحديث البيانات المحلية
	            this.currentUser.displayName = newDisplayName;
	            this.saveCurrentUser(this.currentUser);
	            
	            return true;
	        } catch (error) {
	            console.error('خطأ في تحديث الملف الشخصي:', error);
	            return false;
	        }
	    }
	
	    async changePassword(currentPassword, newPassword) {
	        if (!this.currentUser) return false;
	        
	        try {
	            const user = window.firebaseAuth.currentUser;
	            const credential = window.firebaseEmailAuthProvider.credential(user.email, currentPassword);
	            
	            // 1. إعادة مصادقة المستخدم
	            await window.firebaseReauthenticateWithCredential(user, credential);
	            
	            // 2. تغيير كلمة المرور
	            await window.firebaseUpdatePassword(user, newPassword);
	            
	            return true;
	        } catch (error) {
	            console.error('خطأ في تغيير كلمة المرور:', error);
	            // يمكن عرض رسالة خطأ محددة للمستخدم
	            if (error.code === 'auth/wrong-password') {
	                showNotification('كلمة المرور الحالية غير صحيحة.', 'error');
	            } else if (error.code === 'auth/requires-recent-login') {
	                showNotification('يجب عليك تسجيل الدخول مرة أخرى قبل تغيير كلمة المرور.', 'error');
	            } else {
	                showNotification('فشل تغيير كلمة المرور. يرجى المحاولة مرة أخرى.', 'error');
	            }
	            return false;
	        }
	    }
	    
	    async deleteAccount(password) {
	        if (!this.currentUser) return false;
	        
	        try {
	            const user = window.firebaseAuth.currentUser;
	            const credential = window.firebaseEmailAuthProvider.credential(user.email, password);
	            
	            // 1. إعادة مصادقة المستخدم
	            await window.firebaseReauthenticateWithCredential(user, credential);
	            
	            // 2. حذف بيانات المستخدم من Firestore (اختياري، يفضل استخدام Cloud Functions)
	            // For now, we'll skip this part as it requires server-side logic for a full cleanup.
	            
	            // 3. حذف الحساب
	            await window.firebaseDeleteUser(user);
	            
	            this.clearCurrentUser();
	            this.updateUI();
	            window.location.href = 'index.html?accountDeleted=true';
	            
	            return true;
	        } catch (error) {
	            console.error('خطأ في حذف الحساب:', error);
	            showNotification('فشل حذف الحساب. يرجى التأكد من كلمة المرور.', 'error');
	            return false;
	        }
	    }
	
	    // الحصول على المسافرين المتاحين
	    async getAvailableTravelers() {
	        try {
	            // هذا يتطلب استعلام Firestore
	            console.log('جاري جلب بيانات المسافرين من Firestore');
	            // يجب استبدال هذا بالاستعلام الحقيقي
	            return [
	                // بيانات وهمية مؤقتة
	                { id: 1, name: 'سالم الأحمد', route: 'الرياض - الدمام', vehicle: 'سيارة خاصة', rating: 4.9, availableSpace: 'صندوق صغير' },
	                { id: 2, name: 'نورة السعد', route: 'جدة - مكة', vehicle: 'حافلة', rating: 4.5, availableSpace: 'حقيبة متوسطة' },
	                { id: 3, name: 'فهد العتيبي', route: 'الرياض - جدة', vehicle: 'شاحنة', rating: 5.0, availableSpace: 'مساحة كبيرة' },
	            ];
	        } catch (error) {
	            console.error('خطأ في جلب المسافرين:', error);
	            return [];
	        }
	    }
	
	    // الحصول على إحصائيات المستخدم
	    async getUserStats() {
	        if (!this.currentUser) return null;
	
	        try {
	            // جلب الإحصائيات من Firestore
	            // هذا مثال بسيط - في التطبيق الحقيقي تحتاج لجلب البيانات من Firestore
	            return {
	                completedTrips: 12,
	                rating: 5.0,
	                earnings: 2450
	            };
	        } catch (error) {
	            console.error('خطأ في جلب الإحصائيات:', error);
	            return null;
	        }
	    }
	    
	    async getUserProfile(uid) {
	        try {
	            // جلب بيانات الملف الشخصي من Firestore
	            const docRef = window.firebaseDoc(window.firebaseDB, "users", uid);
	            const docSnap = await window.firebaseGetDoc(docRef);
	            
	            if (docSnap.exists()) {
	                return docSnap.data();
	            } else {
	                console.log("لا يوجد ملف شخصي لهذا المستخدم!");
	                return null;
	            }
	        } catch (error) {
	            console.error('خطأ في جلب الملف الشخصي:', error);
	            return null;
	        }
	    }
	}
	
	// تهيئة نظام المصادقة
	window.authManager = new AuthManager();
	
	// وظيفة مساعدة لتحديد ما إذا كانت الصفحة هي لوحة التحكم
	function isDashboardPage() {
	    return document.title.includes('لوحة التحكم');
	}
	
	// تحديث الواجهة عند تحميل الصفحة
	document.addEventListener('DOMContentLoaded', function() {
	    window.authManager.updateUI();
	    
	    // عرض رسالة النجاح إذا كان المستخدم قد سجل للتو
	    const urlParams = new URLSearchParams(window.location.search);
	    if (urlParams.get('registered') === 'true') {
	        showNotification('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.', 'success');
	    }
	    
	    // عرض رسالة تسجيل الخروج
	    if (urlParams.get('loggedOut') === 'true') {
	        showNotification('تم تسجيل الخروج بنجاح.', 'info');
	    }
	    
	    // عرض رسالة حذف الحساب
	    if (urlParams.get('accountDeleted') === 'true') {
	        showNotification('تم حذف حسابك بنجاح.', 'info');
	    }
	});
	
	// وظيفة لعرض الإشعارات
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