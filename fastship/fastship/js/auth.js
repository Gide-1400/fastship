// =====================================
// FastShip - Authentication Manager
// الملف: js/auth.js
// =====================================

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// الحصول على auth من window
const getAuth = () => window.auth;

// =====================================
// مدير المصادقة (Authentication Manager)
// =====================================

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.userType = null;
    this.init();
  }

  // تهيئة النظام
  init() {
    const stored = this.getStoredUser();
    if (stored) {
      this.currentUser = stored.userId;
      this.userType = stored.userType;
    }
    
    // الاستماع لتغييرات حالة المصادقة
    this.setupAuthListener();
  }

  // الاستماع لتغييرات المصادقة
  setupAuthListener() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ User is signed in:", user.uid);
        this.currentUser = user.uid;
      } else {
        console.log("❌ User is signed out");
        this.currentUser = null;
        this.userType = null;
      }
    });
  }

  // =====================================
  // تسجيل مستخدم جديد
  // =====================================
  async register(email, password, userData, userType) {
    try {
      const auth = getAuth();
      
      // إنشاء المستخدم في Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;

      // تحديث الملف الشخصي
      await updateProfile(user, {
        displayName: userData.name
      });

      // حفظ بيانات المستخدم في Database
      // نحتاج استيراد addUser من database.js
      const { addUser } = await import('./database.js');
      await addUser(userId, {
        email,
        ...userData,
        phoneVerified: false
      }, userType);

      // حفظ في localStorage
      this.currentUser = userId;
      this.userType = userType;
      this.saveUser(userId, userType, email);

      console.log("✅ Registration successful");
      return { success: true, userId, userType };
      
    } catch (error) {
      console.error("❌ Registration error:", error);
      
      // ترجمة أخطاء Firebase للعربية
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'البريد الإلكتروني غير صحيح';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'كلمة المرور ضعيفة جداً (يجب أن تكون 6 أحرف على الأقل)';
      }
      
      return { success: false, error: errorMessage };
    }
  }

  // =====================================
  // تسجيل الدخول
  // =====================================
  async login(email, password) {
    try {
      const auth = getAuth();
      
      // تسجيل الدخول في Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;

      // الحصول على نوع المستخدم من Database
      const { getUser } = await import('./database.js');
      
      // البحث في shippers أولاً
      let userData = await getUser(userId, 'shipper');
      let userType = 'shipper';
      
      // إذا لم يوجد، ابحث في carriers
      if (!userData) {
        userData = await getUser(userId, 'carrier');
        userType = 'carrier';
      }

      if (!userData) {
        throw new Error('User data not found in database');
      }

      // حفظ في localStorage
      this.currentUser = userId;
      this.userType = userType;
      this.saveUser(userId, userType, email);

      console.log("✅ Login successful");
      return { success: true, userId, userType };
      
    } catch (error) {
      console.error("❌ Login error:", error);
      
      // ترجمة أخطاء Firebase للعربية
      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'المستخدم غير موجود';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'كلمة المرور غير صحيحة';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'البريد الإلكتروني غير صحيح';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'تم تجاوز عدد المحاولات، حاول لاحقاً';
      }
      
      return { success: false, error: errorMessage };
    }
  }

  // =====================================
  // تسجيل الخروج
  // =====================================
  async logout() {
    try {
      const auth = getAuth();
      await signOut(auth);
      
      // حذف من localStorage
      this.currentUser = null;
      this.userType = null;
      this.clearStoredUser();
      
      console.log("✅ Logout successful");
      return { success: true };
      
    } catch (error) {
      console.error("❌ Logout error:", error);
      return { success: false, error: error.message };
    }
  }

  // =====================================
  // دوال localStorage
  // =====================================
  
  saveUser(userId, userType, email) {
    const userData = {
      userId,
      userType,
      email,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('fastship_user', JSON.stringify(userData));
  }

  getStoredUser() {
    const stored = localStorage.getItem('fastship_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        return null;
      }
    }
    return null;
  }

  clearStoredUser() {
    localStorage.removeItem('fastship_user');
  }

  // =====================================
  // دوال مساعدة
  // =====================================

  // الحصول على المستخدم الحالي
  getCurrentUser() {
    const auth = getAuth();
    return auth.currentUser;
  }

  // الحصول على معلومات المستخدم المحفوظة
  getStoredUserInfo() {
    return this.getStoredUser();
  }

  // التحقق من تسجيل الدخول
  isAuthenticated() {
    const auth = getAuth();
    return auth.currentUser !== null;
  }

  // الحصول على نوع المستخدم
  getUserType() {
    const stored = this.getStoredUser();
    return stored ? stored.userType : null;
  }

  // إعادة توجيه حسب نوع المستخدم
  redirectToDashboard() {
    const userType = this.getUserType();
    if (userType === 'shipper') {
      window.location.href = 'shippers/dashboard.html';
    } else if (userType === 'carrier') {
      window.location.href = 'carriers/dashboard.html';
    } else {
      window.location.href = 'shared-auth.html';
    }
  }

  // التحقق من الصلاحيات
  requireAuth(requiredType = null) {
    if (!this.isAuthenticated()) {
      window.location.href = '../shared-auth.html';
      return false;
    }

    if (requiredType) {
      const userType = this.getUserType();
      if (userType !== requiredType) {
        console.error("Access denied: wrong user type");
        this.redirectToDashboard();
        return false;
      }
    }

    return true;
  }
}

// =====================================
// إنشاء مثيل عام
// =====================================

const authManager = new AuthManager();

// تصدير للاستخدام العام
window.authManager = authManager;

// تصدير للـ modules
export default authManager;
export { AuthManager };

console.log("✅ Auth Manager loaded successfully");