// معالج إنشاء الشحنات - FastShip Platform
// يدعم جميع أنواع الشحنات مع واجهة سهلة الاستخدام

class ShipmentWizard {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.shipmentData = {
            type: null,
            weight: null,
            volume: null,
            description: '',
            value: null,
            pickupLocation: null,
            deliveryLocation: null,
            pickupDate: null,
            deliveryDate: null,
            urgency: 'standard',
            specialInstructions: '',
            images: []
        };
        this.init();
    }

    init() {
        this.createWizardHTML();
        this.setupEventListeners();
        this.updateStepDisplay();
    }

    createWizardHTML() {
        const container = document.getElementById('shipment-wizard-container');
        if (!container) return;

        container.innerHTML = `
            <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                <!-- Header -->
                <div class="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6">
                    <h2 class="text-2xl font-bold text-center">إنشاء شحنة جديدة</h2>
                    <div class="mt-4">
                        <div class="flex justify-between text-sm">
                            <span>الخطوة 1: نوع الشحنة</span>
                            <span>الخطوة 2: المواصفات</span>
                            <span>الخطوة 3: المواقع</span>
                            <span>الخطوة 4: التوقيت</span>
                            <span>الخطوة 5: التأكيد</span>
                        </div>
                        <div class="mt-2 bg-white/20 rounded-full h-2">
                            <div id="progress-bar" class="bg-orange-500 h-2 rounded-full transition-all duration-300" style="width: 20%"></div>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div class="p-8">
                    <!-- Step 1: Shipment Type -->
                    <div id="step-1" class="step-content">
                        <h3 class="text-xl font-bold text-gray-800 mb-6">اختر نوع الشحنة</h3>
                        <div id="shipment-type-selector" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- سيتم تحميل أنواع الشحنات هنا -->
                        </div>
                        <div class="mt-6 flex justify-end">
                            <button id="next-step-1" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50" disabled>
                                التالي
                            </button>
                        </div>
                    </div>

                    <!-- Step 2: Specifications -->
                    <div id="step-2" class="step-content hidden">
                        <h3 class="text-xl font-bold text-gray-800 mb-6">مواصفات الشحنة</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">الوزن (كيلوغرام)</label>
                                <input type="number" id="shipment-weight" step="0.1" min="0.1" 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                       placeholder="أدخل الوزن">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">الحجم (متر مكعب)</label>
                                <input type="number" id="shipment-volume" step="0.001" min="0.001" 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                       placeholder="أدخل الحجم">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">القيمة المقدرة (ريال)</label>
                                <input type="number" id="shipment-value" min="0" 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                       placeholder="أدخل القيمة المقدرة">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">الأولوية</label>
                                <select id="shipment-urgency" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="standard">عادي</option>
                                    <option value="express">سريع</option>
                                    <option value="same_day">نفس اليوم</option>
                                </select>
                            </div>
                        </div>
                        <div class="mt-6">
                            <label class="block text-sm font-semibold text-gray-700 mb-2">وصف الشحنة</label>
                            <textarea id="shipment-description" rows="3" 
                                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                      placeholder="وصف مفصل للشحنة"></textarea>
                        </div>
                        <div class="mt-6">
                            <label class="block text-sm font-semibold text-gray-700 mb-2">تعليمات خاصة</label>
                            <textarea id="special-instructions" rows="2" 
                                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                      placeholder="أي تعليمات خاصة للموصل"></textarea>
                        </div>
                        <div class="mt-6 flex justify-between">
                            <button id="prev-step-2" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                السابق
                            </button>
                            <button id="next-step-2" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                التالي
                            </button>
                        </div>
                    </div>

                    <!-- Step 3: Locations -->
                    <div id="step-3" class="step-content hidden">
                        <h3 class="text-xl font-bold text-gray-800 mb-6">مواقع الإرسال والاستلام</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">موقع الإرسال</label>
                                <input type="text" id="pickup-location" 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                       placeholder="أدخل عنوان الإرسال">
                                <div class="mt-2">
                                    <label class="block text-sm text-gray-600 mb-1">المدينة</label>
                                    <select id="pickup-city" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">اختر المدينة</option>
                                        <option value="riyadh">الرياض</option>
                                        <option value="jeddah">جدة</option>
                                        <option value="dammam">الدمام</option>
                                        <option value="mecca">مكة المكرمة</option>
                                        <option value="medina">المدينة المنورة</option>
                                        <option value="taif">الطائف</option>
                                        <option value="buraidah">بريدة</option>
                                        <option value="tabuk">تبوك</option>
                                        <option value="hail">حائل</option>
                                        <option value="khamis_mushait">خميس مشيط</option>
                                        <option value="hafr_al_batin">حفر الباطن</option>
                                        <option value="jubail">الجبيل</option>
                                        <option value="yanbu">ينبع</option>
                                        <option value="al_kharj">الخرج</option>
                                        <option value="qatif">القطيف</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">موقع الاستلام</label>
                                <input type="text" id="delivery-location" 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                       placeholder="أدخل عنوان الاستلام">
                                <div class="mt-2">
                                    <label class="block text-sm text-gray-600 mb-1">المدينة</label>
                                    <select id="delivery-city" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">اختر المدينة</option>
                                        <option value="riyadh">الرياض</option>
                                        <option value="jeddah">جدة</option>
                                        <option value="dammam">الدمام</option>
                                        <option value="mecca">مكة المكرمة</option>
                                        <option value="medina">المدينة المنورة</option>
                                        <option value="taif">الطائف</option>
                                        <option value="buraidah">بريدة</option>
                                        <option value="tabuk">تبوك</option>
                                        <option value="hail">حائل</option>
                                        <option value="khamis_mushait">خميس مشيط</option>
                                        <option value="hafr_al_batin">حفر الباطن</option>
                                        <option value="jubail">الجبيل</option>
                                        <option value="yanbu">ينبع</option>
                                        <option value="al_kharj">الخرج</option>
                                        <option value="qatif">القطيف</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="mt-6">
                            <div id="distance-calculator" class="bg-gray-50 rounded-lg p-4 hidden">
                                <h4 class="font-semibold text-gray-800 mb-2">معلومات المسافة</h4>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span class="text-gray-600">المسافة:</span>
                                        <span id="calculated-distance" class="font-semibold text-blue-600">-</span>
                                    </div>
                                    <div>
                                        <span class="text-gray-600">الوقت المقدر:</span>
                                        <span id="estimated-time" class="font-semibold text-green-600">-</span>
                                    </div>
                                    <div>
                                        <span class="text-gray-600">نوع الرحلة:</span>
                                        <span id="trip-type" class="font-semibold text-orange-600">-</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-6 flex justify-between">
                            <button id="prev-step-3" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                السابق
                            </button>
                            <button id="next-step-3" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                التالي
                            </button>
                        </div>
                    </div>

                    <!-- Step 4: Timing -->
                    <div id="step-4" class="step-content hidden">
                        <h3 class="text-xl font-bold text-gray-800 mb-6">التوقيت المطلوب</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">تاريخ الإرسال</label>
                                <input type="date" id="pickup-date" 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">وقت الإرسال</label>
                                <input type="time" id="pickup-time" 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">تاريخ الاستلام المطلوب</label>
                                <input type="date" id="delivery-date" 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">وقت الاستلام المطلوب</label>
                                <input type="time" id="delivery-time" 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                        </div>
                        <div class="mt-6">
                            <label class="block text-sm font-semibold text-gray-700 mb-2">المرونة في التوقيت</label>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input type="radio" name="time-flexibility" value="strict" class="ml-2">
                                    <span>دقيق (في الوقت المحدد بالضبط)</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="time-flexibility" value="flexible" checked class="ml-2">
                                    <span>مرن (±2 ساعة)</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="time-flexibility" value="very_flexible" class="ml-2">
                                    <span>مرن جداً (±6 ساعات)</span>
                                </label>
                            </div>
                        </div>
                        <div class="mt-6 flex justify-between">
                            <button id="prev-step-4" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                السابق
                            </button>
                            <button id="next-step-4" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                التالي
                            </button>
                        </div>
                    </div>

                    <!-- Step 5: Confirmation -->
                    <div id="step-5" class="step-content hidden">
                        <h3 class="text-xl font-bold text-gray-800 mb-6">تأكيد بيانات الشحنة</h3>
                        <div id="shipment-summary" class="bg-gray-50 rounded-lg p-6">
                            <!-- سيتم ملء البيانات هنا -->
                        </div>
                        <div class="mt-6">
                            <label class="flex items-center">
                                <input type="checkbox" id="terms-agreement" class="ml-2">
                                <span class="text-sm text-gray-600">أوافق على <a href="terms.html" class="text-blue-600 hover:underline">الشروط والأحكام</a> و <a href="privacy.html" class="text-blue-600 hover:underline">سياسة الخصوصية</a></span>
                            </label>
                        </div>
                        <div class="mt-6 flex justify-between">
                            <button id="prev-step-5" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                السابق
                            </button>
                            <button id="submit-shipment" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50" disabled>
                                إنشاء الشحنة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Step navigation
        document.getElementById('next-step-1')?.addEventListener('click', () => this.nextStep());
        document.getElementById('next-step-2')?.addEventListener('click', () => this.nextStep());
        document.getElementById('next-step-3')?.addEventListener('click', () => this.nextStep());
        document.getElementById('next-step-4')?.addEventListener('click', () => this.nextStep());
        
        document.getElementById('prev-step-2')?.addEventListener('click', () => this.prevStep());
        document.getElementById('prev-step-3')?.addEventListener('click', () => this.prevStep());
        document.getElementById('prev-step-4')?.addEventListener('click', () => this.prevStep());
        document.getElementById('prev-step-5')?.addEventListener('click', () => this.prevStep());

        // Shipment type selection
        document.addEventListener('shipmentTypeSelected', (e) => {
            this.shipmentData.type = e.detail.type;
            document.getElementById('next-step-1').disabled = false;
        });

        // Form validation
        this.setupFormValidation();

        // Submit shipment
        document.getElementById('submit-shipment')?.addEventListener('click', () => this.submitShipment());

        // Terms agreement
        document.getElementById('terms-agreement')?.addEventListener('change', (e) => {
            document.getElementById('submit-shipment').disabled = !e.target.checked;
        });
    }

    setupFormValidation() {
        // Weight validation
        document.getElementById('shipment-weight')?.addEventListener('input', (e) => {
            const weight = parseFloat(e.target.value);
            if (weight > 0) {
                this.shipmentData.weight = weight;
                this.validateStep2();
            }
        });

        // Volume validation
        document.getElementById('shipment-volume')?.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            if (volume > 0) {
                this.shipmentData.volume = volume;
                this.validateStep2();
            }
        });

        // Description validation
        document.getElementById('shipment-description')?.addEventListener('input', (e) => {
            this.shipmentData.description = e.target.value;
            this.validateStep2();
        });

        // Location validation
        document.getElementById('pickup-location')?.addEventListener('input', (e) => {
            this.shipmentData.pickupLocation = e.target.value;
            this.validateStep3();
        });

        document.getElementById('delivery-location')?.addEventListener('input', (e) => {
            this.shipmentData.deliveryLocation = e.target.value;
            this.validateStep3();
        });

        // City selection
        document.getElementById('pickup-city')?.addEventListener('change', (e) => {
            this.shipmentData.pickupCity = e.target.value;
            this.validateStep3();
            this.calculateDistance();
        });

        document.getElementById('delivery-city')?.addEventListener('change', (e) => {
            this.shipmentData.deliveryCity = e.target.value;
            this.validateStep3();
            this.calculateDistance();
        });
    }

    validateStep2() {
        const isValid = this.shipmentData.weight && this.shipmentData.volume && this.shipmentData.description;
        document.getElementById('next-step-2').disabled = !isValid;
    }

    validateStep3() {
        const isValid = this.shipmentData.pickupLocation && this.shipmentData.deliveryLocation && 
                       this.shipmentData.pickupCity && this.shipmentData.deliveryCity;
        document.getElementById('next-step-3').disabled = !isValid;
    }

    calculateDistance() {
        if (this.shipmentData.pickupCity && this.shipmentData.deliveryCity) {
            // محاكاة حساب المسافة
            const distance = this.getDistanceBetweenCities(this.shipmentData.pickupCity, this.shipmentData.deliveryCity);
            const time = this.estimateTravelTime(distance);
            const tripType = this.getTripType(distance);
            
            document.getElementById('calculated-distance').textContent = `${distance} كم`;
            document.getElementById('estimated-time').textContent = time;
            document.getElementById('trip-type').textContent = tripType;
            document.getElementById('distance-calculator').classList.remove('hidden');
        }
    }

    getDistanceBetweenCities(city1, city2) {
        // محاكاة بيانات المسافات بين المدن السعودية
        const distances = {
            'riyadh-jeddah': 870,
            'riyadh-dammam': 395,
            'riyadh-mecca': 870,
            'riyadh-medina': 850,
            'jeddah-dammam': 1340,
            'jeddah-mecca': 80,
            'jeddah-medina': 420,
            'dammam-mecca': 1340,
            'dammam-medina': 1320
        };
        
        const key = `${city1}-${city2}`;
        const reverseKey = `${city2}-${city1}`;
        
        return distances[key] || distances[reverseKey] || Math.floor(Math.random() * 500) + 100;
    }

    estimateTravelTime(distance) {
        if (distance < 100) return '1-2 ساعة';
        if (distance < 300) return '3-4 ساعات';
        if (distance < 600) return '5-7 ساعات';
        if (distance < 1000) return '8-12 ساعة';
        return '12+ ساعة';
    }

    getTripType(distance) {
        if (distance < 100) return 'محلي';
        if (distance < 300) return 'إقليمي';
        if (distance < 600) return 'وطني';
        return 'دولي';
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            document.getElementById(`step-${this.currentStep}`).classList.add('hidden');
            this.currentStep++;
            document.getElementById(`step-${this.currentStep}`).classList.remove('hidden');
            this.updateStepDisplay();
            this.updateProgressBar();
            
            if (this.currentStep === 5) {
                this.updateShipmentSummary();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            document.getElementById(`step-${this.currentStep}`).classList.add('hidden');
            this.currentStep--;
            document.getElementById(`step-${this.currentStep}`).classList.remove('hidden');
            this.updateStepDisplay();
            this.updateProgressBar();
        }
    }

    updateStepDisplay() {
        // تحديث عرض الخطوات
        const steps = document.querySelectorAll('.step-content');
        steps.forEach((step, index) => {
            if (index + 1 === this.currentStep) {
                step.classList.remove('hidden');
            } else {
                step.classList.add('hidden');
            }
        });
    }

    updateProgressBar() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
    }

    updateShipmentSummary() {
        const summary = document.getElementById('shipment-summary');
        if (!summary) return;

        const shipmentType = window.shipmentTypeManager?.shipmentTypes[this.shipmentData.type];
        const carrierType = window.shipmentTypeManager?.getCompatibleCarriers(shipmentType)[0];
        const estimatedPrice = window.shipmentTypeManager?.calculatePrice(shipmentType, carrierType, 'regional');

        summary.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 class="font-bold text-gray-800 mb-3">تفاصيل الشحنة</h4>
                    <div class="space-y-2 text-sm">
                        <div><span class="text-gray-600">النوع:</span> <span class="font-semibold">${shipmentType?.name || 'غير محدد'}</span></div>
                        <div><span class="text-gray-600">الوزن:</span> <span class="font-semibold">${this.shipmentData.weight} كجم</span></div>
                        <div><span class="text-gray-600">الحجم:</span> <span class="font-semibold">${this.shipmentData.volume} م³</span></div>
                        <div><span class="text-gray-600">القيمة:</span> <span class="font-semibold">${this.shipmentData.value || 'غير محدد'} ريال</span></div>
                        <div><span class="text-gray-600">الأولوية:</span> <span class="font-semibold">${this.shipmentData.urgency}</span></div>
                    </div>
                </div>
                <div>
                    <h4 class="font-bold text-gray-800 mb-3">المواقع والتوقيت</h4>
                    <div class="space-y-2 text-sm">
                        <div><span class="text-gray-600">من:</span> <span class="font-semibold">${this.shipmentData.pickupLocation}</span></div>
                        <div><span class="text-gray-600">إلى:</span> <span class="font-semibold">${this.shipmentData.deliveryLocation}</span></div>
                        <div><span class="text-gray-600">تاريخ الإرسال:</span> <span class="font-semibold">${this.shipmentData.pickupDate || 'غير محدد'}</span></div>
                        <div><span class="text-gray-600">تاريخ الاستلام:</span> <span class="font-semibold">${this.shipmentData.deliveryDate || 'غير محدد'}</span></div>
                    </div>
                </div>
            </div>
            <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="flex justify-between items-center">
                    <span class="text-lg font-bold text-gray-800">السعر المقدر:</span>
                    <span class="text-2xl font-bold text-green-600">${estimatedPrice?.toFixed(2) || '0.00'} ريال</span>
                </div>
            </div>
        `;
    }

    async submitShipment() {
        try {
            // جمع البيانات من النموذج
            this.collectFormData();
            
            // التحقق من صحة البيانات
            if (!this.validateShipmentData()) {
                alert('يرجى ملء جميع الحقول المطلوبة');
                return;
            }

            // إظهار حالة التحميل
            const submitBtn = document.getElementById('submit-shipment');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'جاري إنشاء الشحنة...';
            submitBtn.disabled = true;

            // محاكاة إرسال البيانات
            await new Promise(resolve => setTimeout(resolve, 2000));

            // إظهار رسالة النجاح
            alert('تم إنشاء الشحنة بنجاح! سيتم إشعارك بالمسافرين المتاحين.');
            
            // إعادة تعيين النموذج
            this.resetForm();

        } catch (error) {
            console.error('خطأ في إنشاء الشحنة:', error);
            alert('حدث خطأ في إنشاء الشحنة. يرجى المحاولة مرة أخرى.');
        }
    }

    collectFormData() {
        this.shipmentData.weight = parseFloat(document.getElementById('shipment-weight')?.value);
        this.shipmentData.volume = parseFloat(document.getElementById('shipment-volume')?.value);
        this.shipmentData.value = parseFloat(document.getElementById('shipment-value')?.value);
        this.shipmentData.description = document.getElementById('shipment-description')?.value;
        this.shipmentData.specialInstructions = document.getElementById('special-instructions')?.value;
        this.shipmentData.urgency = document.getElementById('shipment-urgency')?.value;
        this.shipmentData.pickupLocation = document.getElementById('pickup-location')?.value;
        this.shipmentData.deliveryLocation = document.getElementById('delivery-location')?.value;
        this.shipmentData.pickupCity = document.getElementById('pickup-city')?.value;
        this.shipmentData.deliveryCity = document.getElementById('delivery-city')?.value;
        this.shipmentData.pickupDate = document.getElementById('pickup-date')?.value;
        this.shipmentData.deliveryDate = document.getElementById('delivery-date')?.value;
        this.shipmentData.pickupTime = document.getElementById('pickup-time')?.value;
        this.shipmentData.deliveryTime = document.getElementById('delivery-time')?.value;
    }

    validateShipmentData() {
        return this.shipmentData.type && 
               this.shipmentData.weight && 
               this.shipmentData.volume && 
               this.shipmentData.description &&
               this.shipmentData.pickupLocation &&
               this.shipmentData.deliveryLocation;
    }

    resetForm() {
        this.currentStep = 1;
        this.shipmentData = {
            type: null,
            weight: null,
            volume: null,
            description: '',
            value: null,
            pickupLocation: null,
            deliveryLocation: null,
            pickupDate: null,
            deliveryDate: null,
            urgency: 'standard',
            specialInstructions: '',
            images: []
        };
        
        // إعادة تعيين النموذج
        document.querySelectorAll('input, textarea, select').forEach(element => {
            if (element.type === 'checkbox' || element.type === 'radio') {
                element.checked = false;
            } else {
                element.value = '';
            }
        });
        
        this.updateStepDisplay();
        this.updateProgressBar();
    }
}

// إنشاء مثيل عام للمعالج
window.shipmentWizard = new ShipmentWizard();

// تصدير الكلاس للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShipmentWizard;
}