// FastShip Demo Data - بيانات تجريبية شاملة لمنصة FastShip
// تعرض جميع أنواع الموصلين الأربعة والشحنات المختلفة

class FastShipDemoData {
    constructor() {
        this.demoUsers = [];
        this.demoCarriers = [];
        this.demoShipments = [];
        this.saudiCities = this.getSaudiCities();
        
        this.generateDemoData();
    }

    // إنشاء البيانات التجريبية الشاملة
    generateDemoData() {
        this.createDemoUsers();
        this.createDemoCarriers();
        this.createDemoShipments();
        this.createDemoMatches();
    }

    // إنشاء مستخدمين تجريبيين
    createDemoUsers() {
        const users = [
            // 🚶‍♂️ النوع 1: المسافرون العاديون
            {
                firstName: 'أحمد', lastName: 'محمد', email: 'ahmed.traveler@example.com',
                phone: '+966501234567', accountType: 'both', city: 'الرياض', region: 'منطقة الرياض',
                userType: 'individual_traveler'
            },
            {
                firstName: 'فاطمة', lastName: 'علي', email: 'fatima.student@example.com',
                phone: '+966507654321', accountType: 'both', city: 'جدة', region: 'منطقة مكة المكرمة',
                userType: 'student_traveler'
            },
            {
                firstName: 'خالد', lastName: 'السعد', email: 'khalid.business@example.com',
                phone: '+966551234567', accountType: 'both', city: 'الدمام', region: 'المنطقة الشرقية',
                userType: 'business_traveler'
            },

            // 🚗 النوع 2: أصحاب السيارات الخاصة
            {
                firstName: 'سارة', lastName: 'الأحمد', email: 'sara.driver@example.com',
                phone: '+966502345678', accountType: 'both', city: 'الرياض', region: 'منطقة الرياض',
                userType: 'private_car_owner'
            },
            {
                firstName: 'محمد', lastName: 'العتيبي', email: 'mohammed.pickup@example.com',
                phone: '+966558765432', accountType: 'both', city: 'جدة', region: 'منطقة مكة المكرمة',
                userType: 'pickup_owner'
            },
            {
                firstName: 'نورا', lastName: 'القحطاني', email: 'nora.suv@example.com',
                phone: '+966503456789', accountType: 'both', city: 'الطائف', region: 'منطقة مكة المكرمة',
                userType: 'suv_owner'
            },

            // 🚚 النوع 3: أصحاب الشاحنات
            {
                firstName: 'عبدالله', lastName: 'الشمري', email: 'abdullah.truck@example.com',
                phone: '+966504567890', accountType: 'carrier', city: 'الرياض', region: 'منطقة الرياض',
                userType: 'truck_driver'
            },
            {
                firstName: 'يوسف', lastName: 'المطيري', email: 'youssef.van@example.com',
                phone: '+966559876543', accountType: 'carrier', city: 'الدمام', region: 'المنطقة الشرقية',
                userType: 'van_driver'
            },
            {
                firstName: 'عمر', lastName: 'الغامدي', email: 'omar.trailer@example.com',
                phone: '+966505678901', accountType: 'carrier', city: 'جدة', region: 'منطقة مكة المكرمة',
                userType: 'trailer_driver'
            },

            // 🏢 النوع 4: الشركات والأساطيل
            {
                firstName: 'إدارة', lastName: 'شركة النقل السريع', email: 'admin@fastlogistics.sa',
                phone: '+966112345678', accountType: 'carrier', city: 'الرياض', region: 'منطقة الرياض',
                userType: 'logistics_company'
            },
            {
                firstName: 'مدير', lastName: 'الخطوط الجوية السعودية', email: 'cargo@saudiairlines.sa',
                phone: '+966118765432', accountType: 'carrier', city: 'جدة', region: 'منطقة مكة المكرمة',
                userType: 'airline_company'
            },
            {
                firstName: 'قسم', lastName: 'الشحن البحري المتحد', email: 'shipping@unitedmarine.sa',
                phone: '+966133456789', accountType: 'carrier', city: 'الدمام', region: 'المنطقة الشرقية',
                userType: 'shipping_company'
            },

            // مرسلون عاديون
            {
                firstName: 'ليلى', lastName: 'الزهراني', email: 'layla.sender@example.com',
                phone: '+966506789012', accountType: 'shipper', city: 'أبها', region: 'منطقة عسير',
                userType: 'regular_shipper'
            },
            {
                firstName: 'حسام', lastName: 'الدوسري', email: 'hussam.business@example.com',
                phone: '+966557890123', accountType: 'shipper', city: 'بريدة', region: 'منطقة القصيم',
                userType: 'business_shipper'
            }
        ];

        users.forEach((userData, index) => {
            const user = window.FastShip.createUser({
                ...userData,
                profileImage: `https://i.pravatar.cc/150?img=${index + 1}`,
                isVerified: Math.random() > 0.3, // 70% verified
                rating: 4.0 + Math.random() * 1.0, // Between 4.0 and 5.0
                reviewCount: Math.floor(Math.random() * 50) + 5
            });
            
            this.demoUsers.push(user);
        });
    }

    // إنشاء موصلين تجريبيين لجميع الأنواع الأربعة
    createDemoCarriers() {
        const carriersData = [
            // 🚶‍♂️ النوع 1: المسافرون العاديون (10-20 كيلو)
            {
                userId: this.demoUsers[0].id, // أحمد المسافر
                vehicleType: 'taxi',
                capacity: { weight: 15, volume: 0.5 },
                serviceAreas: [
                    { city: 'الرياض', region: 'منطقة الرياض' },
                    { city: 'الخرج', region: 'منطقة الرياض' }
                ],
                pricing: { baseRate: 3, weightRate: 2, minimumCharge: 15 },
                vehicle: {
                    make: 'تويوتا', model: 'كامري', year: 2020, color: 'أبيض',
                    plateNumber: 'أ ب ج 1234', features: ['ac', 'gps']
                },
                description: 'مسافر منتظم بين الرياض والخرج، يحمل حقيبة صغيرة'
            },
            {
                userId: this.demoUsers[1].id, // فاطمة الطالبة
                vehicleType: 'bus',
                capacity: { weight: 20, volume: 0.8 },
                serviceAreas: [
                    { city: 'جدة', region: 'منطقة مكة المكرمة' },
                    { city: 'مكة المكرمة', region: 'منطقة مكة المكرمة' }
                ],
                pricing: { baseRate: 2, weightRate: 1.5, minimumCharge: 10 },
                vehicle: {
                    make: 'مرسيدس', model: 'حافلة', year: 2019, color: 'أزرق',
                    features: ['ac']
                },
                description: 'طالبة تسافر بالحافلة، تحمل حقيبة دراسية'
            },
            {
                userId: this.demoUsers[2].id, // خالد رجل الأعمال
                vehicleType: 'plane',
                capacity: { weight: 18, volume: 0.6 },
                serviceAreas: [
                    { city: 'الدمام', region: 'المنطقة الشرقية' },
                    { city: 'الرياض', region: 'منطقة الرياض' },
                    { city: 'جدة', region: 'منطقة مكة المكرمة' }
                ],
                pricing: { baseRate: 5, weightRate: 3, minimumCharge: 50 },
                vehicle: {
                    make: 'الخطوط السعودية', model: 'رحلة تجارية', year: 2021,
                    features: ['fast_delivery', 'secure']
                },
                description: 'رجل أعمال يسافر بالطائرة، يحمل حقيبة أعمال'
            },

            // 🚗 النوع 2: أصحاب السيارات الخاصة (300-1500 كيلو)
            {
                userId: this.demoUsers[3].id, // سارة صاحبة السيارة
                vehicleType: 'car',
                capacity: { weight: 400, volume: 1.5 },
                serviceAreas: [
                    { city: 'الرياض', region: 'منطقة الرياض' },
                    { city: 'الدمام', region: 'المنطقة الشرقية' },
                    { city: 'الأحساء', region: 'المنطقة الشرقية' }
                ],
                pricing: { baseRate: 1.5, weightRate: 0.3, minimumCharge: 50 },
                vehicle: {
                    make: 'هيونداي', model: 'إلنترا', year: 2021, color: 'فضي',
                    plateNumber: 'د هـ و 5678', features: ['ac', 'gps', 'insurance']
                },
                description: 'موظفة تسافر بين المدن بسيارتها الخاصة'
            },
            {
                userId: this.demoUsers[4].id, // محمد صاحب البيك أب
                vehicleType: 'pickup',
                capacity: { weight: 1200, volume: 3 },
                serviceAreas: [
                    { city: 'جدة', region: 'منطقة مكة المكرمة' },
                    { city: 'المدينة المنورة', region: 'منطقة المدينة المنورة' }
                ],
                pricing: { baseRate: 2, weightRate: 0.4, minimumCharge: 80 },
                vehicle: {
                    make: 'فورد', model: 'F-150', year: 2020, color: 'أسود',
                    plateNumber: 'ز ح ط 9012', features: ['ac', 'gps', 'cargo_cover']
                },
                description: 'يملك بيك أب ويسافر بانتظام بين جدة والمدينة'
            },
            {
                userId: this.demoUsers[5].id, // نورا صاحبة الـ SUV
                vehicleType: 'suv',
                capacity: { weight: 800, volume: 2.5 },
                serviceAreas: [
                    { city: 'الطائف', region: 'منطقة مكة المكرمة' },
                    { city: 'الباحة', region: 'منطقة الباحة' },
                    { city: 'أبها', region: 'منطقة عسير' }
                ],
                pricing: { baseRate: 1.8, weightRate: 0.35, minimumCharge: 60 },
                vehicle: {
                    make: 'تويوتا', model: 'برادو', year: 2022, color: 'أبيض',
                    plateNumber: 'ي ك ل 3456', features: ['ac', 'gps', '4wd']
                },
                description: 'تسافر بين المدن الجبلية بسيارة دفع رباعي'
            },

            // 🚚 النوع 3: أصحاب الشاحنات (4-50 طن)
            {
                userId: this.demoUsers[6].id, // عبدالله سائق الشاحنة
                vehicleType: 'truck',
                capacity: { weight: 8000, volume: 25 },
                serviceAreas: [
                    { city: 'الرياض', region: 'منطقة الرياض' },
                    { city: 'جدة', region: 'منطقة مكة المكرمة' },
                    { city: 'الدمام', region: 'المنطقة الشرقية' }
                ],
                pricing: { baseRate: 3, weightRate: 0.8, minimumCharge: 200 },
                vehicle: {
                    make: 'مرسيدس', model: 'أكتروس', year: 2019, color: 'أزرق',
                    plateNumber: 'م ن س 7890', features: ['gps', 'hydraulic_lift', 'insurance']
                },
                description: 'سائق شاحنة محترف مع خبرة 10 سنوات'
            },
            {
                userId: this.demoUsers[7].id, // يوسف سائق الفان
                vehicleType: 'van',
                capacity: { weight: 2500, volume: 12 },
                serviceAreas: [
                    { city: 'الدمام', region: 'المنطقة الشرقية' },
                    { city: 'الخبر', region: 'المنطقة الشرقية' },
                    { city: 'الظهران', region: 'المنطقة الشرقية' }
                ],
                pricing: { baseRate: 2.5, weightRate: 0.6, minimumCharge: 120 },
                vehicle: {
                    make: 'إيفيكو', model: 'ديلي', year: 2020, color: 'أبيض',
                    plateNumber: 'ع ف ص 2468', features: ['ac', 'gps', 'refrigerated']
                },
                description: 'متخصص في نقل البضائع المبردة'
            },
            {
                userId: this.demoUsers[8].id, // عمر سائق التريلا
                vehicleType: 'trailer',
                capacity: { weight: 35000, volume: 80 },
                serviceAreas: [
                    { city: 'جدة', region: 'منطقة مكة المكرمة' },
                    { city: 'الرياض', region: 'منطقة الرياض' },
                    { city: 'الدمام', region: 'المنطقة الشرقية' }
                ],
                pricing: { baseRate: 4, weightRate: 1.2, minimumCharge: 500 },
                vehicle: {
                    make: 'فولفو', model: 'FH16', year: 2021, color: 'أحمر',
                    plateNumber: 'ق ر ش 1357', features: ['gps', 'hydraulic_lift', 'insurance', 'sleeper_cab']
                },
                description: 'سائق تريلا للشحنات الثقيلة والمسافات الطويلة'
            },

            // 🏢 النوع 4: الشركات والأساطيل (50-1000+ طن)
            {
                userId: this.demoUsers[9].id, // شركة النقل السريع
                vehicleType: 'fleet',
                capacity: { weight: 100000, volume: 500 },
                serviceAreas: this.saudiCities.map(city => ({ city: city.name, region: city.region })),
                pricing: { baseRate: 2, weightRate: 0.5, minimumCharge: 1000 },
                vehicle: {
                    make: 'أسطول متنوع', model: 'شاحنات وتريلات', year: 2020,
                    features: ['gps', 'insurance', 'tracking', '24_7_support']
                },
                description: 'شركة نقل متكاملة مع أسطول من 50 مركبة'
            },
            {
                userId: this.demoUsers[10].id, // الخطوط الجوية السعودية
                vehicleType: 'airline',
                capacity: { weight: 50000, volume: 200 },
                serviceAreas: [
                    { city: 'الرياض', region: 'منطقة الرياض' },
                    { city: 'جدة', region: 'منطقة مكة المكرمة' },
                    { city: 'الدمام', region: 'المنطقة الشرقية' },
                    { city: 'أبها', region: 'منطقة عسير' },
                    { city: 'تبوك', region: 'منطقة تبوك' }
                ],
                pricing: { baseRate: 8, weightRate: 2, minimumCharge: 2000 },
                vehicle: {
                    make: 'إيرباص', model: 'A320 Cargo', year: 2019,
                    features: ['fast_delivery', 'international', 'insurance', 'tracking']
                },
                description: 'شحن جوي سريع وآمن لجميع أنحاء المملكة'
            },
            {
                userId: this.demoUsers[11].id, // الشحن البحري المتحد
                vehicleType: 'shipping',
                capacity: { weight: 500000, volume: 2000 },
                serviceAreas: [
                    { city: 'جدة', region: 'منطقة مكة المكرمة' },
                    { city: 'الدمام', region: 'المنطقة الشرقية' },
                    { city: 'ينبع', region: 'منطقة المدينة المنورة' },
                    { city: 'الجبيل', region: 'المنطقة الشرقية' }
                ],
                pricing: { baseRate: 1, weightRate: 0.2, minimumCharge: 5000 },
                vehicle: {
                    make: 'سفن الحاويات', model: 'Container Ship', year: 2018,
                    features: ['container_shipping', 'international', 'insurance', 'bulk_cargo']
                },
                description: 'شحن بحري للحاويات والبضائع الثقيلة'
            }
        ];

        carriersData.forEach((carrierData, index) => {
            const carrier = window.FastShip.createCarrier(carrierData);
            
            // إضافة إحصائيات واقعية
            carrier.stats = {
                totalTrips: Math.floor(Math.random() * 200) + 50,
                totalDistance: Math.floor(Math.random() * 50000) + 10000,
                totalEarnings: Math.floor(Math.random() * 100000) + 20000,
                completionRate: 85 + Math.random() * 15, // 85-100%
                onTimeRate: 80 + Math.random() * 20, // 80-100%
                rating: 4.0 + Math.random() * 1.0, // 4.0-5.0
                reviewCount: Math.floor(Math.random() * 100) + 10
            };

            // تحديد التوفر بشكل عشوائي
            carrier.availability.status = Math.random() > 0.3 ? 'available' : 'busy';
            
            this.demoCarriers.push(carrier);
        });
    }

    // إنشاء شحنات تجريبية متنوعة
    createDemoShipments() {
        const shipmentsData = [
            // شحنات صغيرة (10-20 كيلو) - مناسبة للمسافرين العاديين
            {
                senderId: this.demoUsers[12].id, // ليلى المرسلة
                type: 'documents', weight: 2,
                dimensions: { length: 30, width: 20, height: 5 },
                pickup: { city: 'أبها', region: 'منطقة عسير', address: 'شارع الملك فهد', contactName: 'ليلى الزهراني', contactPhone: '+966506789012' },
                delivery: { city: 'الرياض', region: 'منطقة الرياض', address: 'حي العليا', contactName: 'أحمد محمد', contactPhone: '+966501111111' },
                priority: 'urgent', fragile: false, value: 500
            },
            {
                senderId: this.demoUsers[13].id, // حسام رجل الأعمال
                type: 'electronics', weight: 8,
                dimensions: { length: 40, width: 30, height: 15 },
                pickup: { city: 'بريدة', region: 'منطقة القصيم', address: 'المركز التجاري', contactName: 'حسام الدوسري', contactPhone: '+966557890123' },
                delivery: { city: 'جدة', region: 'منطقة مكة المكرمة', address: 'حي الروضة', contactName: 'سارة أحمد', contactPhone: '+966502222222' },
                priority: 'high', fragile: true, value: 2000
            },
            {
                senderId: this.demoUsers[0].id, // أحمد
                type: 'clothes', weight: 15,
                dimensions: { length: 50, width: 40, height: 20 },
                pickup: { city: 'الرياض', region: 'منطقة الرياض', address: 'حي النخيل', contactName: 'أحمد محمد', contactPhone: '+966501234567' },
                delivery: { city: 'الدمام', region: 'المنطقة الشرقية', address: 'الكورنيش', contactName: 'فاطمة علي', contactPhone: '+966503333333' },
                priority: 'normal', fragile: false, value: 800
            },

            // شحنات متوسطة (300-1500 كيلو) - مناسبة لأصحاب السيارات
            {
                senderId: this.demoUsers[1].id, // فاطمة
                type: 'furniture', weight: 450,
                dimensions: { length: 120, width: 80, height: 60 },
                pickup: { city: 'جدة', region: 'منطقة مكة المكرمة', address: 'حي الزهراء', contactName: 'فاطمة علي', contactPhone: '+966507654321' },
                delivery: { city: 'مكة المكرمة', region: 'منطقة مكة المكرمة', address: 'العزيزية', contactName: 'محمد سالم', contactPhone: '+966504444444' },
                priority: 'normal', fragile: true, value: 3000
            },
            {
                senderId: this.demoUsers[2].id, // خالد
                type: 'electronics', weight: 800,
                dimensions: { length: 100, width: 70, height: 50 },
                pickup: { city: 'الدمام', region: 'المنطقة الشرقية', address: 'حي الفيصلية', contactName: 'خالد السعد', contactPhone: '+966551234567' },
                delivery: { city: 'الرياض', region: 'منطقة الرياض', address: 'حي الملز', contactName: 'نورا أحمد', contactPhone: '+966505555555' },
                priority: 'high', fragile: true, value: 15000
            },
            {
                senderId: this.demoUsers[12].id, // ليلى
                type: 'food', weight: 1200,
                dimensions: { length: 150, width: 100, height: 80 },
                pickup: { city: 'أبها', region: 'منطقة عسير', address: 'السوق المركزي', contactName: 'ليلى الزهراني', contactPhone: '+966506789012' },
                delivery: { city: 'الطائف', region: 'منطقة مكة المكرمة', address: 'حي الشفا', contactName: 'عبدالله محمد', contactPhone: '+966506666666' },
                priority: 'urgent', fragile: false, perishable: true, value: 5000
            },

            // شحنات كبيرة (4-50 طن) - مناسبة لأصحاب الشاحنات
            {
                senderId: this.demoUsers[13].id, // حسام
                type: 'furniture', weight: 8000,
                dimensions: { length: 400, width: 200, height: 150 },
                pickup: { city: 'بريدة', region: 'منطقة القصيم', address: 'المنطقة الصناعية', contactName: 'حسام الدوسري', contactPhone: '+966557890123' },
                delivery: { city: 'الرياض', region: 'منطقة الرياض', address: 'حي الياسمين', contactName: 'سعد العتيبي', contactPhone: '+966507777777' },
                priority: 'normal', fragile: true, value: 50000
            },
            {
                senderId: this.demoUsers[3].id, // سارة
                type: 'other', weight: 15000,
                dimensions: { length: 500, width: 250, height: 200 },
                pickup: { city: 'الرياض', region: 'منطقة الرياض', address: 'المنطقة الصناعية الثانية', contactName: 'سارة الأحمد', contactPhone: '+966502345678' },
                delivery: { city: 'الدمام', region: 'المنطقة الشرقية', address: 'الميناء', contactName: 'يوسف الخالد', contactPhone: '+966508888888' },
                priority: 'high', fragile: false, value: 80000
            },
            {
                senderId: this.demoUsers[4].id, // محمد
                type: 'other', weight: 25000,
                dimensions: { length: 600, width: 300, height: 250 },
                pickup: { city: 'جدة', region: 'منطقة مكة المكرمة', address: 'الميناء الإسلامي', contactName: 'محمد العتيبي', contactPhone: '+966558765432' },
                delivery: { city: 'المدينة المنورة', region: 'منطقة المدينة المنورة', address: 'المنطقة الصناعية', contactName: 'أحمد الشريف', contactPhone: '+966509999999' },
                priority: 'normal', fragile: false, value: 120000
            },

            // شحنات عملاقة (50-1000+ طن) - مناسبة للشركات والأساطيل
            {
                senderId: this.demoUsers[5].id, // نورا
                type: 'other', weight: 75000,
                dimensions: { length: 1200, width: 600, height: 400 },
                pickup: { city: 'الطائف', region: 'منطقة مكة المكرمة', address: 'المنطقة الصناعية', contactName: 'نورا القحطاني', contactPhone: '+966503456789' },
                delivery: { city: 'الرياض', region: 'منطقة الرياض', address: 'مدينة الملك عبدالله الاقتصادية', contactName: 'شركة البناء المتطور', contactPhone: '+966501010101' },
                priority: 'normal', fragile: false, value: 500000
            },
            {
                senderId: this.demoUsers[6].id, // عبدالله
                type: 'other', weight: 150000,
                dimensions: { length: 2000, width: 800, height: 600 },
                pickup: { city: 'الرياض', region: 'منطقة الرياض', address: 'المدينة الصناعية', contactName: 'عبدالله الشمري', contactPhone: '+966504567890' },
                delivery: { city: 'جدة', region: 'منطقة مكة المكرمة', address: 'ميناء الملك عبدالعزيز', contactName: 'شركة التصدير الدولية', contactPhone: '+966501111101' },
                priority: 'high', fragile: false, value: 1000000
            },
            {
                senderId: this.demoUsers[7].id, // يوسف
                type: 'other', weight: 300000,
                dimensions: { length: 3000, width: 1000, height: 800 },
                pickup: { city: 'الدمام', region: 'المنطقة الشرقية', address: 'ميناء الملك عبدالعزيز', contactName: 'يوسف المطيري', contactPhone: '+966559876543' },
                delivery: { city: 'الجبيل', region: 'المنطقة الشرقية', address: 'المدينة الصناعية', contactName: 'سابك للبتروكيماويات', contactPhone: '+966501212121' },
                priority: 'urgent', fragile: false, value: 2000000
            }
        ];

        shipmentsData.forEach((shipmentData, index) => {
            // إضافة إحداثيات وهمية
            shipmentData.pickup.coordinates = this.getRandomCoordinates();
            shipmentData.delivery.coordinates = this.getRandomCoordinates();
            
            // إضافة تفاصيل إضافية
            shipmentData.specialInstructions = this.getRandomInstructions();
            shipmentData.images = [`https://picsum.photos/400/300?random=${index}`];
            
            const shipment = window.FastShip.createShipment(shipmentData);
            this.demoShipments.push(shipment);
        });
    }

    // إنشاء مطابقات تجريبية
    createDemoMatches() {
        this.demoShipments.forEach(shipment => {
            const matchingCarriers = window.FastShip.findMatchingCarriers(shipment.id);
            shipment.matchingCarriers = matchingCarriers.slice(0, 3).map(c => c.id); // أفضل 3 موصلين
            
            // إنشاء مطابقة عشوائية لبعض الشحنات
            if (Math.random() > 0.6 && matchingCarriers.length > 0) {
                const selectedCarrier = matchingCarriers[0];
                shipment.selectedCarrier = selectedCarrier.id;
                shipment.status = 'matched';
                
                // تحديث حالة الموصل
                const carrier = this.demoCarriers.find(c => c.id === selectedCarrier.id);
                if (carrier) {
                    carrier.availability.status = 'busy';
                }
            }
        });
    }

    // تحميل البيانات التجريبية إلى النظام
    loadIntoSystem() {
        // تحميل المستخدمين
        this.demoUsers.forEach(user => {
            window.FastShip.users.push(user);
        });

        // تحميل الموصلين
        this.demoCarriers.forEach(carrier => {
            window.FastShip.carriers.push(carrier);
        });

        // تحميل الشحنات
        this.demoShipments.forEach(shipment => {
            window.FastShip.shipments.push(shipment);
        });

        // حفظ البيانات
        window.FastShip.saveData();

        console.log('✅ تم تحميل البيانات التجريبية بنجاح!');
        console.log(`📊 الإحصائيات:`);
        console.log(`👥 المستخدمون: ${this.demoUsers.length}`);
        console.log(`🚚 الموصلون: ${this.demoCarriers.length}`);
        console.log(`📦 الشحنات: ${this.demoShipments.length}`);
        
        // عرض إحصائيات مفصلة
        this.showDetailedStats();
    }

    // عرض إحصائيات مفصلة
    showDetailedStats() {
        const carriersByType = {
            'small': this.demoCarriers.filter(c => c.category === 'small').length,
            'medium': this.demoCarriers.filter(c => c.category === 'medium').length,
            'large': this.demoCarriers.filter(c => c.category === 'large').length,
            'x-large': this.demoCarriers.filter(c => c.category === 'x-large').length
        };

        const shipmentsByType = {
            'small': this.demoShipments.filter(s => s.category === 'small').length,
            'medium': this.demoShipments.filter(s => s.category === 'medium').length,
            'large': this.demoShipments.filter(s => s.category === 'large').length,
            'x-large': this.demoShipments.filter(s => s.category === 'x-large').length
        };

        console.log('\n🚚 الموصلون حسب النوع:');
        console.log(`🚶‍♂️ مسافرون عاديون (صغير): ${carriersByType.small}`);
        console.log(`🚗 أصحاب سيارات (متوسط): ${carriersByType.medium}`);
        console.log(`🚚 أصحاب شاحنات (كبير): ${carriersByType.large}`);
        console.log(`🏢 شركات وأساطيل (عملاق): ${carriersByType['x-large']}`);

        console.log('\n📦 الشحنات حسب الحجم:');
        console.log(`📄 شحنات صغيرة (10-20 كيلو): ${shipmentsByType.small}`);
        console.log(`📦 شحنات متوسطة (300-1500 كيلو): ${shipmentsByType.medium}`);
        console.log(`🚚 شحنات كبيرة (4-50 طن): ${shipmentsByType.large}`);
        console.log(`🏢 شحنات عملاقة (50-1000+ طن): ${shipmentsByType['x-large']}`);
    }

    // وظائف مساعدة
    getSaudiCities() {
        return [
            { name: 'الرياض', region: 'منطقة الرياض' },
            { name: 'جدة', region: 'منطقة مكة المكرمة' },
            { name: 'مكة المكرمة', region: 'منطقة مكة المكرمة' },
            { name: 'المدينة المنورة', region: 'منطقة المدينة المنورة' },
            { name: 'الدمام', region: 'المنطقة الشرقية' },
            { name: 'الخبر', region: 'المنطقة الشرقية' },
            { name: 'الطائف', region: 'منطقة مكة المكرمة' },
            { name: 'بريدة', region: 'منطقة القصيم' },
            { name: 'تبوك', region: 'منطقة تبوك' },
            { name: 'أبها', region: 'منطقة عسير' },
            { name: 'حائل', region: 'منطقة حائل' },
            { name: 'الجبيل', region: 'المنطقة الشرقية' },
            { name: 'ينبع', region: 'منطقة المدينة المنورة' },
            { name: 'الخرج', region: 'منطقة الرياض' },
            { name: 'الأحساء', region: 'المنطقة الشرقية' }
        ];
    }

    getRandomCoordinates() {
        // إحداثيات عشوائية داخل المملكة العربية السعودية
        return {
            lat: 20 + Math.random() * 12, // بين 20 و 32 شمالاً
            lng: 34 + Math.random() * 16  // بين 34 و 50 شرقاً
        };
    }

    getRandomInstructions() {
        const instructions = [
            'يرجى التعامل بحذر - قابل للكسر',
            'التسليم خلال ساعات العمل فقط',
            'يرجى الاتصال قبل التسليم',
            'شحنة عاجلة - أولوية عالية',
            'يحتاج تبريد - درجة حرارة منخفضة',
            'شحنة ثقيلة - يحتاج معدات رفع',
            'وثائق مهمة - تسليم باليد فقط',
            'هدية - يرجى عدم فتح الصندوق',
            'مواد غذائية - صالحة لمدة محدودة',
            'أجهزة إلكترونية - تجنب الرطوبة'
        ];
        
        return instructions[Math.floor(Math.random() * instructions.length)];
    }
}

// إنشاء وتحميل البيانات التجريبية عند تحميل الملف
document.addEventListener('DOMContentLoaded', function() {
    // التأكد من تحميل النظام الأساسي أولاً
    setTimeout(() => {
        if (window.FastShip) {
            const demoData = new FastShipDemoData();
            demoData.loadIntoSystem();
            
            // جعل البيانات التجريبية متاحة عالمياً
            window.FastShipDemoData = demoData;
        }
    }, 1000);
});

// تصدير الفئة
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FastShipDemoData;
}