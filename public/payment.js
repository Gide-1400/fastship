// نظام الدفع والتحصيل للمنصة
class PaymentManager {
    constructor() {
        this.paymentMethods = ['credit_card', 'debit_card', 'bank_transfer', 'wallet'];
        this.commissionRate = 0.10; // 10% عمولة
        this.init();
    }

    init() {
        this.loadPaymentHistory();
    }

    // حساب السعر النهائي مع العمولة
    calculatePrice(basePrice, shipmentType = 'standard') {
        const commission = basePrice * this.commissionRate;
        const totalPrice = basePrice + commission;
        
        return {
            basePrice: basePrice,
            commission: commission,
            totalPrice: totalPrice,
            travelerEarnings: basePrice - commission
        };
    }

    // إنشاء فاتورة جديدة
    createInvoice(shipmentData, travelerData, pricing) {
        const invoice = {
            id: 'INV-' + Date.now(),
            shipmentId: shipmentData.id,
            travelerId: travelerData.id,
            clientId: shipmentData.clientId,
            amount: pricing.totalPrice,
            commission: pricing.commission,
            travelerEarnings: pricing.travelerEarnings,
            status: 'pending',
            createdAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 ساعة
            paymentMethod: null,
            paidAt: null
        };

        this.saveInvoice(invoice);
        return invoice;
    }

    // معالجة الدفع
    async processPayment(invoiceId, paymentMethod, paymentData) {
        try {
            const invoice = this.getInvoice(invoiceId);
            if (!invoice) {
                throw new Error('الفاتورة غير موجودة');
            }

            if (invoice.status !== 'pending') {
                throw new Error('الفاتورة مدفوعة بالفعل');
            }

            // محاكاة معالجة الدفع
            const paymentResult = await this.simulatePayment(paymentMethod, paymentData, invoice.amount);
            
            if (paymentResult.success) {
                // تحديث حالة الفاتورة
                invoice.status = 'paid';
                invoice.paymentMethod = paymentMethod;
                invoice.paidAt = new Date().toISOString();
                invoice.transactionId = paymentResult.transactionId;

                this.updateInvoice(invoice);
                
                // إشعار الموصل بالدفع
                this.notifyTravelerPayment(invoice);
                
                return {
                    success: true,
                    transactionId: paymentResult.transactionId,
                    message: 'تم الدفع بنجاح'
                };
            } else {
                throw new Error(paymentResult.error || 'فشل في معالجة الدفع');
            }

        } catch (error) {
            console.error('خطأ في معالجة الدفع:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // محاكاة معالجة الدفع
    async simulatePayment(paymentMethod, paymentData, amount) {
        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 2000));

        // محاكاة نجاح أو فشل الدفع
        const success = Math.random() > 0.1; // 90% نجاح

        if (success) {
            return {
                success: true,
                transactionId: 'TXN-' + Date.now(),
                amount: amount,
                method: paymentMethod
            };
        } else {
            return {
                success: false,
                error: 'فشل في معالجة الدفع. حاول مرة أخرى.'
            };
        }
    }

    // إشعار الموصل بالدفع
    notifyTravelerPayment(invoice) {
        // في التطبيق الحقيقي، هنا سنرسل إشعار للموصل
        console.log(`تم دفع ${invoice.travelerEarnings} ريال للموصل ${invoice.travelerId}`);
        
        // إضافة للإشعارات المحلية
        this.addNotification({
            type: 'payment_received',
            title: 'تم استلام الدفع',
            message: `تم دفع ${invoice.travelerEarnings} ريال لشحنتك`,
            timestamp: new Date().toISOString()
        });
    }

    // إضافة إشعار
    addNotification(notification) {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.unshift(notification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    // حفظ الفاتورة
    saveInvoice(invoice) {
        const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
        invoices.push(invoice);
        localStorage.setItem('invoices', JSON.stringify(invoices));
    }

    // تحديث الفاتورة
    updateInvoice(updatedInvoice) {
        const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
        const index = invoices.findIndex(inv => inv.id === updatedInvoice.id);
        if (index !== -1) {
            invoices[index] = updatedInvoice;
            localStorage.setItem('invoices', JSON.stringify(invoices));
        }
    }

    // جلب الفاتورة
    getInvoice(invoiceId) {
        const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
        return invoices.find(inv => inv.id === invoiceId);
    }

    // جلب فواتير المستخدم
    getUserInvoices(userId, userType = 'client') {
        const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
        return invoices.filter(inv => {
            if (userType === 'client') {
                return inv.clientId === userId;
            } else if (userType === 'traveler') {
                return inv.travelerId === userId;
            }
            return false;
        });
    }

    // جلب تاريخ الدفع
    loadPaymentHistory() {
        const history = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
        return history;
    }

    // حفظ تاريخ الدفع
    savePaymentHistory(payment) {
        const history = this.loadPaymentHistory();
        history.unshift(payment);
        localStorage.setItem('paymentHistory', JSON.stringify(history));
    }

    // إحصائيات الدفع
    getPaymentStats(userId, userType = 'client') {
        const invoices = this.getUserInvoices(userId, userType);
        
        const stats = {
            totalInvoices: invoices.length,
            paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
            pendingInvoices: invoices.filter(inv => inv.status === 'pending').length,
            totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
            totalEarnings: userType === 'traveler' ? 
                invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.travelerEarnings, 0) : 0,
            totalCommission: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.commission, 0)
        };

        return stats;
    }

    // إلغاء الدفع
    cancelPayment(invoiceId) {
        const invoice = this.getInvoice(invoiceId);
        if (invoice && invoice.status === 'pending') {
            invoice.status = 'cancelled';
            this.updateInvoice(invoice);
            return true;
        }
        return false;
    }

    // استرداد المبلغ
    refundPayment(invoiceId, reason) {
        const invoice = this.getInvoice(invoiceId);
        if (invoice && invoice.status === 'paid') {
            invoice.status = 'refunded';
            invoice.refundReason = reason;
            invoice.refundedAt = new Date().toISOString();
            this.updateInvoice(invoice);
            
            // إضافة للإشعارات
            this.addNotification({
                type: 'refund_processed',
                title: 'تم استرداد المبلغ',
                message: `تم استرداد ${invoice.amount} ريال`,
                timestamp: new Date().toISOString()
            });
            
            return true;
        }
        return false;
    }
}

// تهيئة نظام الدفع
window.paymentManager = new PaymentManager();

// دوال مساعدة للواجهة
function showPaymentModal(invoiceId) {
    const invoice = window.paymentManager.getInvoice(invoiceId);
    if (!invoice) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 class="text-2xl font-bold text-gray-800 mb-6">إتمام الدفع</h3>
            
            <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-gray-600">المبلغ الأساسي:</span>
                    <span class="font-semibold">${invoice.amount - invoice.commission} ريال</span>
                </div>
                <div class="flex justify-between items-center mb-2">
                    <span class="text-gray-600">العمولة (10%):</span>
                    <span class="font-semibold">${invoice.commission} ريال</span>
                </div>
                <div class="flex justify-between items-center text-lg font-bold text-blue-600 border-t pt-2">
                    <span>المجموع:</span>
                    <span>${invoice.amount} ريال</span>
                </div>
            </div>

            <form id="paymentForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">طريقة الدفع</label>
                    <select id="paymentMethod" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">اختر طريقة الدفع</option>
                        <option value="credit_card">بطاقة ائتمان</option>
                        <option value="debit_card">بطاقة خصم</option>
                        <option value="bank_transfer">تحويل بنكي</option>
                        <option value="wallet">محفظة إلكترونية</option>
                    </select>
                </div>

                <div id="cardDetails" class="hidden space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">رقم البطاقة</label>
                        <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">تاريخ الانتهاء</label>
                            <input type="text" id="expiryDate" placeholder="MM/YY" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                            <input type="text" id="cvv" placeholder="123" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button type="button" onclick="closePaymentModal()" 
                            class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors">
                        إلغاء
                    </button>
                    <button type="submit" 
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors">
                        دفع الآن
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // إظهار تفاصيل البطاقة عند اختيار بطاقة ائتمان
    document.getElementById('paymentMethod').addEventListener('change', function() {
        const cardDetails = document.getElementById('cardDetails');
        if (this.value === 'credit_card' || this.value === 'debit_card') {
            cardDetails.classList.remove('hidden');
        } else {
            cardDetails.classList.add('hidden');
        }
    });

    // معالجة النموذج
    document.getElementById('paymentForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const paymentMethod = document.getElementById('paymentMethod').value;
        const paymentData = {
            cardNumber: document.getElementById('cardNumber').value,
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value
        };

        const result = await window.paymentManager.processPayment(invoiceId, paymentMethod, paymentData);
        
        if (result.success) {
            showNotification('تم الدفع بنجاح!', 'success');
            closePaymentModal();
            // تحديث الصفحة
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showNotification(result.error || 'فشل في الدفع', 'error');
        }
    });
}

function closePaymentModal() {
    const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    if (modal) {
        modal.remove();
    }
}

// دالة عرض الإشعارات
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