// =====================================
// FastShip - Utility Functions
// الملف: js/utils.js
// دوال مساعدة عامة
// =====================================

// =====================================
// دوال الإشعارات (Notifications)
// =====================================

function showNotification(message, type = 'success') {
  // إزالة الإشعارات السابقة
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notif => notif.remove());

  // إنشاء الإشعار
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // الأنماط
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 99999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease;
    max-width: 400px;
    word-wrap: break-word;
  `;

  // الألوان حسب النوع
  if (type === 'success') {
    notification.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
  } else if (type === 'error') {
    notification.style.background = 'linear-gradient(135deg, #f44336 0%, #da190b 100%)';
  } else if (type === 'warning') {
    notification.style.background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
  } else if (type === 'info') {
    notification.style.background = 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)';
  }

  // إضافة للصفحة
  document.body.appendChild(notification);

  // إزالة تلقائية بعد 4 ثواني
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// =====================================
// دوال التاريخ والوقت
// =====================================

function formatDate(dateString) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  // استخدام اللغة الحالية من نظام اللغات
  const currentLang = window.i18n ? window.i18n.currentLang : 'ar';
  const locale = currentLang === 'ar' ? 'ar-SA' : 
                 currentLang === 'en' ? 'en-US' :
                 currentLang === 'zh' ? 'zh-CN' :
                 currentLang === 'es' ? 'es-ES' :
                 currentLang === 'ru' ? 'ru-RU' :
                 currentLang === 'ur' ? 'ur-PK' : 'ar-SA';
  
  return date.toLocaleDateString(locale, options);
}

function formatTime(dateString) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  const options = { 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  
  const currentLang = window.i18n ? window.i18n.currentLang : 'ar';
  const locale = currentLang === 'ar' ? 'ar-SA' : 
                 currentLang === 'en' ? 'en-US' :
                 currentLang === 'zh' ? 'zh-CN' :
                 currentLang === 'es' ? 'es-ES' :
                 currentLang === 'ru' ? 'ru-RU' :
                 currentLang === 'ur' ? 'ur-PK' : 'ar-SA';
  
  return date.toLocaleTimeString(locale, options);
}

function formatDateTime(dateString) {
  if (!dateString) return '-';
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
}

function getRelativeTime(dateString) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  const currentLang = window.i18n ? window.i18n.currentLang : 'ar';
  
  const translations = {
    ar: {
      justNow: 'الآن',
      minutesAgo: 'منذ {n} دقيقة',
      hoursAgo: 'منذ {n} ساعة',
      daysAgo: 'منذ {n} يوم'
    },
    en: {
      justNow: 'Just now',
      minutesAgo: '{n} minutes ago',
      hoursAgo: '{n} hours ago',
      daysAgo: '{n} days ago'
    }
  };

  const t = translations[currentLang] || translations.ar;

  if (diffMins < 1) return t.justNow;
  if (diffMins < 60) return t.minutesAgo.replace('{n}', diffMins);
  if (diffHours < 24) return t.hoursAgo.replace('{n}', diffHours);
  return t.daysAgo.replace('{n}', diffDays);
}

// =====================================
// دوال التحقق (Validation)
// =====================================

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
  // التحقق من أرقام الجوال السعودية والدولية
  const re = /^(\+?\d{1,4})?[\s-]?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}$/;
  return re.test(phone);
}

function validatePassword(password) {
  // على الأقل 6 أحرف
  return password && password.length >= 6;
}

function validateRequired(value) {
  return value && value.trim().length > 0;
}

// =====================================
// دوال localStorage
// =====================================

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    return false;
  }
}

function getFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
}

function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from storage:', error);
    return false;
  }
}

function clearStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}

// =====================================
// دوال التوجيه (Navigation)
// =====================================

function redirect(path) {
  window.location.href = path;
}

function redirectWithDelay(path, delay = 1500) {
  setTimeout(() => {
    window.location.href = path;
  }, delay);
}

function goBack() {
  window.history.back();
}

function reload() {
  window.location.reload();
}

// =====================================
// دوال DOM
// =====================================

function showElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'block';
  }
}

function hideElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'none';
  }
}

function toggleElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = element.style.display === 'none' ? 'block' : 'none';
  }
}

function addClass(elementId, className) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add(className);
  }
}

function removeClass(elementId, className) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.remove(className);
  }
}

function toggleClass(elementId, className) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.toggle(className);
  }
}

// =====================================
// دوال التنسيق (Formatting)
// =====================================

function formatCurrency(amount, currency = 'SAR') {
  const symbols = {
    SAR: 'ر.س',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'د.إ',
    KWD: 'د.ك',
    BHD: 'د.ب',
    OMR: 'ر.ع',
    QAR: 'ر.ق'
  };

  const symbol = symbols[currency] || currency;
  const formatted = Number(amount).toLocaleString('ar-SA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  return `${formatted} ${symbol}`;
}

function formatWeight(weight) {
  if (weight < 1000) {
    return `${weight} كيلو`;
  } else {
    const tons = (weight / 1000).toFixed(2);
    return `${tons} طن`;
  }
}

function formatDistance(distance) {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} متر`;
  } else {
    return `${distance.toFixed(1)} كم`;
  }
}

// =====================================
// دوال النصوص (Text)
// =====================================

function truncate(text, length = 100) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// =====================================
// دوال التحميل (Loading)
// =====================================

function showLoading(message = 'جاري التحميل...') {
  // إزالة أي loader موجود
  hideLoading();

  const loader = document.createElement('div');
  loader.id = 'globalLoader';
  loader.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 99999;
  `;

  loader.innerHTML = `
    <div style="
      background: white;
      padding: 30px 40px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    ">
      <div style="
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
      "></div>
      <p style="margin: 0; color: #333; font-weight: 600;">${message}</p>
    </div>
  `;

  // إضافة animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(loader);
}

function hideLoading() {
  const loader = document.getElementById('globalLoader');
  if (loader) {
    loader.remove();
  }
}

// =====================================
// دوال التأكيد (Confirmation)
// =====================================

function confirmAction(message, callback) {
  if (confirm(message)) {
    if (typeof callback === 'function') {
      callback();
    }
    return true;
  }
  return false;
}

// =====================================
// دوال الأخطاء (Error Handling)
// =====================================

function handleError(error, showToUser = true) {
  console.error('Error:', error);
  
  if (showToUser) {
    const errorMessage = error.message || 'حدث خطأ غير متوقع';
    showNotification(errorMessage, 'error');
  }
}

// =====================================
// دوال الحالة (Status)
// =====================================

function getStatusBadge(status) {
  const statusMap = {
    pending: { text: 'معلق', class: 'badge-warning', color: '#ff9800' },
    accepted: { text: 'مقبول', class: 'badge-info', color: '#2196f3' },
    'in-transit': { text: 'قيد التوصيل', class: 'badge-primary', color: '#667eea' },
    delivered: { text: 'تم التوصيل', class: 'badge-success', color: '#4caf50' },
    cancelled: { text: 'ملغى', class: 'badge-danger', color: '#f44336' },
    active: { text: 'نشط', class: 'badge-success', color: '#4caf50' },
    completed: { text: 'مكتمل', class: 'badge-success', color: '#4caf50' }
  };

  const statusInfo = statusMap[status] || { text: status, class: 'badge-secondary', color: '#999' };
  
  return `<span class="badge ${statusInfo.class}" style="
    background: ${statusInfo.color};
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  ">${statusInfo.text}</span>`;
}

// =====================================
// دوال التقييم (Rating)
// =====================================

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let stars = '★'.repeat(fullStars);
  if (hasHalfStar) stars += '⯨';
  stars += '☆'.repeat(emptyStars);

  return `<span style="color: #ffc107; font-size: 18px;">${stars}</span>`;
}

// =====================================
// تصدير الدوال للاستخدام العام
// =====================================

window.utils = {
  showNotification,
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  validateEmail,
  validatePhone,
  validatePassword,
  validateRequired,
  saveToStorage,
  getFromStorage,
  removeFromStorage,
  clearStorage,
  redirect,
  redirectWithDelay,
  goBack,
  reload,
  showElement,
  hideElement,
  toggleElement,
  addClass,
  removeClass,
  toggleClass,
  formatCurrency,
  formatWeight,
  formatDistance,
  truncate,
  capitalize,
  slugify,
  showLoading,
  hideLoading,
  confirmAction,
  handleError,
  getStatusBadge,
  generateStars
};

console.log("✅ Utility functions loaded successfully");