// نظام إدارة الشحنات
class ShipmentManager {
    constructor() {
        this.shipments = [];
        this.init();
    }

    async init() {
        await this.loadShipments();
    }

    async loadShipments() {
        try {
            if (window.authManager && window.authManager.isLoggedIn()) {
                this.shipments = await window.authManager.getUserShipments();
            } else {
                // تحميل من localStorage إذا لم يكن مستخدم مسجل
                const stored = localStorage.getItem('fastship_shipments');
                this.shipments = stored ? JSON.parse(stored) : [];
            }
        } catch (error) {
            console.error('Error loading shipments:', error);
            this.shipments = [];
        }
    }

    async saveShipments() {
        try {
            if (window.authManager && window.authManager.isLoggedIn()) {
                // يتم الحفظ في Firestore تلقائياً عبر authManager
                return;
            }
            localStorage.setItem('fastship_shipments', JSON.stringify(this.shipments));
        } catch (error) {
            console.error('Error saving shipments:', error);
        }
    }

    async createShipment(shipmentData) {
        try {
            let shipment;

            if (window.authManager && window.authManager.isLoggedIn()) {
                // استخدام نظام authManager للحفظ في Firestore
                shipment = await window.authManager.createShipment(shipmentData);
            } else {
                // حفظ محلي
                shipment = {
                    id: 'SH-' + Date.now(),
                    userId: 'guest',
                    ...shipmentData,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    trackingNumber: 'TRK-' + Math.random().toString(36).substr(2, 8).toUpperCase()
                };
                this.shipments.push(shipment);
                await this.saveShipments();
            }

            return shipment;
        } catch (error) {
            console.error('Error creating shipment:', error);
            throw error;
        }
    }

    async updateShipmentStatus(shipmentId, status) {
        try {
            const shipment = this.shipments.find(s => s.id === shipmentId);
            if (shipment) {
                shipment.status = status;
                
                if (status === 'delivered') {
                    shipment.deliveredAt = new Date().toISOString();
                }

                await this.saveShipments();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating shipment status:', error);
            return false;
        }
    }

    async cancelShipment(shipmentId) {
        return await this.updateShipmentStatus(shipmentId, 'cancelled');
    }

    async assignTraveler(shipmentId, travelerId) {
        try {
            const shipment = this.shipments.find(s => s.id === shipmentId);
            if (shipment) {
                shipment.assignedTraveler = travelerId;
                shipment.assignedAt = new Date().toISOString();
                shipment.status = 'in-transit';
                await this.saveShipments();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error assigning traveler:', error);
            return false;
        }
    }

    getShipmentById(shipmentId) {
        return this.shipments.find(s => s.id === shipmentId);
    }

    getUserShipments(userId) {
        if (userId === 'guest') {
            return this.shipments.filter(s => s.userId === 'guest');
        }
        return this.shipments.filter(s => s.userId === userId);
    }

    getShipmentsByStatus(status) {
        return this.shipments.filter(s => s.status === status);
    }

    calculatePrice(weight, fromCity, toCity, type = 'standard') {
        let basePrice = 50;
        let weightPrice = weight * 5;
        let distanceMultiplier = 1;
        let typeMultiplier = 1;

        // مضاعف المسافة
        if (fromCity === 'الرياض' && toCity === 'جدة') distanceMultiplier = 1.5;
        else if (fromCity === 'الرياض' && toCity === 'الدمام') distanceMultiplier = 1.2;
        else if (fromCity === 'جدة' && toCity === 'الدمام') distanceMultiplier = 1.3;

        // مضاعف نوع الشحنة
        const typeMultipliers = {
            'documents': 1.0,
            'electronics': 1.2,
            'clothes': 1.0,
            'food': 1.3,
            'other': 1.1
        };
        typeMultiplier = typeMultipliers[type] || 1.0;

        return Math.round((basePrice + weightPrice) * distanceMultiplier * typeMultiplier);
    }

    getShipmentStatistics() {
        const total = this.shipments.length;
        const completed = this.shipments.filter(s => s.status === 'delivered').length;
        const pending = this.shipments.filter(s => s.status === 'pending').length;
        const inTransit = this.shipments.filter(s => s.status === 'in-transit').length;
        const cancelled = this.shipments.filter(s => s.status === 'cancelled').length;

        return {
            total,
            completed,
            pending,
            inTransit,
            cancelled,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    // توليد رقم تتبع
    generateTrackingNumber() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'TRK-';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // الحصول على حالة الشحنة كنص
    getStatusText(status) {
        const statusMap = {
            'pending': 'قيد الانتظار',
            'in-transit': 'في الطريق',
            'delivered': 'تم التوصيل',
            'cancelled': 'ملغية'
        };
        return statusMap[status] || 'قيد الانتظار';
    }

    // الحصول على لون حالة الشحنة
    getStatusColor(status) {
        const colorMap = {
            'pending': 'orange',
            'in-transit': 'blue',
            'delivered': 'green',
            'cancelled': 'red'
        };
        return colorMap[status] || 'gray';
    }

    // الحصول على أيقونة نوع الشحنة
    getTypeIcon(type) {
        const iconMap = {
            'documents': '📄',
            'electronics': '📱',
            'clothes': '👕',
            'food': '🍕',
            'other': '📦'
        };
        return iconMap[type] || '📦';
    }

    // الحصول على نص نوع الشحنة
    getTypeText(type) {
        const textMap = {
            'documents': 'مستندات',
            'electronics': 'إلكترونيات',
            'clothes': 'ملابس',
            'food': 'أطعمة',
            'other': 'أخرى'
        };
        return textMap[type] || 'أخرى';
    }

    // تصفية الشحنات
    filterShipments(filters = {}) {
        let filtered = [...this.shipments];

        if (filters.status) {
            filtered = filtered.filter(s => s.status === filters.status);
        }

        if (filters.type) {
            filtered = filtered.filter(s => s.type === filters.type);
        }

        if (filters.fromCity) {
            filtered = filtered.filter(s => s.fromCity === filters.fromCity);
        }

        if (filters.toCity) {
            filtered = filtered.filter(s => s.toCity === filters.toCity);
        }

        if (filters.dateFrom) {
            filtered = filtered.filter(s => new Date(s.createdAt) >= new Date(filters.dateFrom));
        }

        if (filters.dateTo) {
            filtered = filtered.filter(s => new Date(s.createdAt) <= new Date(filters.dateTo));
        }

        return filtered;
    }

    // ترتيب الشحنات
    sortShipments(shipments, sortBy = 'createdAt', order = 'desc') {
        return shipments.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'createdAt') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (order === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }
}

// تهيئة نظام الشحنات
window.shipmentManager = new ShipmentManager();

// وظائف مساعدة للشحنات
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR'
    }).format(amount);
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return 'الآن';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `منذ ${minutes} دقيقة`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `منذ ${hours} ساعة`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `منذ ${days} يوم`;
    } else {
        return formatDate(dateString);
    }
}

// تصدير الدوال للاستخدام العالمي
window.shipmentUtils = {
    formatDate,
    formatCurrency,
    getTimeAgo
};