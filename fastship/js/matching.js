// =====================================
// FastShip - Matching Algorithm
// الملف: js/matching.js
// خوارزمية المطابقة الذكية بين الشحنات والرحلات
// =====================================

class MatchingEngine {
  constructor() {
    this.trips = [];
    this.shipments = [];
    this.cities = this.initializeCities();
  }

  // =====================================
  // إحداثيات المدن الرئيسية
  // =====================================
  initializeCities() {
    return {
      // السعودية
      "الرياض": { lat: 24.7136, lng: 46.6753, country: "SA" },
      "جدة": { lat: 21.5433, lng: 39.1727, country: "SA" },
      "مكة": { lat: 21.3891, lng: 39.8579, country: "SA" },
      "المدينة": { lat: 24.4539, lng: 39.5949, country: "SA" },
      "الدمام": { lat: 26.4207, lng: 50.0888, country: "SA" },
      "الخبر": { lat: 26.2172, lng: 50.1971, country: "SA" },
      "الطائف": { lat: 21.2854, lng: 40.4158, country: "SA" },
      "أبها": { lat: 18.2164, lng: 42.5053, country: "SA" },
      "القصيم": { lat: 26.3331, lng: 43.9751, country: "SA" },
      "حائل": { lat: 27.5219, lng: 41.6901, country: "SA" },
      "الجوف": { lat: 29.8651, lng: 40.2091, country: "SA" },
      "تبوك": { lat: 28.3838, lng: 36.5550, country: "SA" },
      "الخرج": { lat: 24.1528, lng: 47.3047, country: "SA" },
      "القويعية": { lat: 24.0683, lng: 45.2609, country: "SA" },
      "ينبع": { lat: 24.0896, lng: 38.0618, country: "SA" },
      "جيزان": { lat: 16.8892, lng: 42.5511, country: "SA" },
      
      // الإمارات
      "دبي": { lat: 25.2048, lng: 55.2708, country: "AE" },
      "أبوظبي": { lat: 24.4539, lng: 54.3773, country: "AE" },
      "الشارقة": { lat: 25.3462, lng: 55.4210, country: "AE" },
      
      // الكويت
      "الكويت": { lat: 29.3759, lng: 47.9774, country: "KW" },
      
      // البحرين
      "المنامة": { lat: 26.2285, lng: 50.5860, country: "BH" },
      
      // قطر
      "الدوحة": { lat: 25.2854, lng: 51.5310, country: "QA" },
      
      // عمان
      "مسقط": { lat: 23.5880, lng: 58.3829, country: "OM" },
      
      // اليمن
      "صنعاء": { lat: 15.3694, lng: 44.1910, country: "YE" },
      "عدن": { lat: 12.7855, lng: 45.0187, country: "YE" },
      
      // مصر
      "القاهرة": { lat: 30.0444, lng: 31.2357, country: "EG" },
      "الإسكندرية": { lat: 31.2001, lng: 29.9187, country: "EG" },
      
      // دول أخرى (عينة)
      "طوكيو": { lat: 35.6762, lng: 139.6503, country: "JP" },
      "لندن": { lat: 51.5074, lng: -0.1278, country: "GB" },
      "نيويورك": { lat: 40.7128, lng: -74.0060, country: "US" },
      "باريس": { lat: 48.8566, lng: 2.3522, country: "FR" },
      "برلين": { lat: 52.5200, lng: 13.4050, country: "DE" },
      "موسكو": { lat: 55.7558, lng: 37.6173, country: "RU" },
      "بكين": { lat: 39.9042, lng: 116.4074, country: "CN" },
      "شنغهاي": { lat: 31.2304, lng: 121.4737, country: "CN" },
      "مومباي": { lat: 19.0760, lng: 72.8777, country: "IN" },
      "كراتشي": { lat: 24.8607, lng: 67.0011, country: "PK" },
      "إسطنبول": { lat: 41.0082, lng: 28.9784, country: "TR" }
    };
  }

  // =====================================
  // حساب المسافة بين نقطتين (Haversine)
  // =====================================
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  // =====================================
  // الحصول على إحداثيات مدينة
  // =====================================
  getCityCoordinates(cityName) {
    const city = this.cities[cityName];
    if (city) {
      return { lat: city.lat, lng: city.lng };
    }
    
    // إذا لم تُعثر على المدينة، ارجع إحداثيات افتراضية
    console.warn(`City not found: ${cityName}`);
    return { lat: 24.7136, lng: 46.6753 }; // الرياض كافتراضي
  }

  // =====================================
  // البحث عن رحلات مطابقة لشحنة معينة
  // =====================================
  findMatchingTrips(shipment, allTrips = null) {
    const trips = allTrips || this.trips;
    
    if (trips.length === 0) {
      return [];
    }

    const shipmentFrom = this.getCityCoordinates(shipment.from);
    const shipmentTo = this.getCityCoordinates(shipment.to);

    const matches = [];

    trips.forEach(trip => {
      const tripFrom = this.getCityCoordinates(trip.from);
      const tripTo = this.getCityCoordinates(trip.to);

      // 1. التحقق من المسافة بين نقطة البداية
      const startDistance = this.calculateDistance(
        shipmentFrom.lat, shipmentFrom.lng,
        tripFrom.lat, tripFrom.lng
      );

      // 2. التحقق من المسافة بين نقطة النهاية
      const endDistance = this.calculateDistance(
        shipmentTo.lat, shipmentTo.lng,
        tripTo.lat, tripTo.lng
      );

      // 3. التحقق من المساحة المتاحة
      const hasEnoughSpace = (trip.availableSpace || trip.capacity) >= shipment.weight;

      // 4. حساب نسبة المطابقة
      const maxAcceptableDistance = 50; // 50 كيلومتر
      const startMatch = Math.max(0, 1 - (startDistance / maxAcceptableDistance));
      const endMatch = Math.max(0, 1 - (endDistance / maxAcceptableDistance));

      // إذا كانت المسافة أقل من 50 كم في البداية والنهاية + المساحة كافية
      if (startDistance < maxAcceptableDistance && 
          endDistance < maxAcceptableDistance && 
          hasEnoughSpace) {
        
        // حساب درجة المطابقة الكلية
        const matchScore = (startMatch + endMatch) / 2;
        
        matches.push({
          trip,
          matchScore,
          startDistance,
          endDistance,
          isExactMatch: startDistance < 5 && endDistance < 5
        });
      }

      // 5. التحقق من النقاط الوسيطة (waypoints)
      if (trip.waypoints && trip.waypoints.length > 0) {
        trip.waypoints.forEach(waypoint => {
          const waypointCoords = this.getCityCoordinates(waypoint.name);
          const distanceToWaypoint = this.calculateDistance(
            shipmentTo.lat, shipmentTo.lng,
            waypointCoords.lat, waypointCoords.lng
          );

          if (distanceToWaypoint < maxAcceptableDistance && hasEnoughSpace) {
            const waypointMatch = Math.max(0, 1 - (distanceToWaypoint / maxAcceptableDistance));
            matches.push({
              trip,
              matchScore: waypointMatch * 0.8, // نقطة وسيطة = 80% من المطابقة الكاملة
              startDistance,
              endDistance: distanceToWaypoint,
              isWaypointMatch: true,
              waypoint: waypoint.name
            });
          }
        });
      }
    });

    // ترتيب النتائج حسب الأولوية
    return this.rankMatches(matches, shipment);
  }

  // =====================================
  // ترتيب المطابقات حسب الأولوية
  // =====================================
  rankMatches(matches, shipment) {
    return matches.sort((a, b) => {
      // 1. الأولوية للمطابقة التامة
      if (a.isExactMatch && !b.isExactMatch) return -1;
      if (!a.isExactMatch && b.isExactMatch) return 1;

      // 2. الأولوية لدرجة المطابقة
      const scoreDiff = b.matchScore - a.matchScore;
      if (Math.abs(scoreDiff) > 0.1) return scoreDiff;

      // 3. الأولوية للسعر الأرخص
      const priceA = a.trip.pricePerUnit || a.trip.price || 0;
      const priceB = b.trip.pricePerUnit || b.trip.price || 0;
      const priceDiff = priceA - priceB;
      if (Math.abs(priceDiff) > 10) return priceDiff;

      // 4. الأولوية للتقييم الأعلى
      const ratingDiff = (b.trip.rating || 0) - (a.trip.rating || 0);
      if (Math.abs(ratingDiff) > 0.5) return ratingDiff;

      // 5. الأولوية للأقرب وقتاً
      const dateA = new Date(a.trip.departureDate || 0);
      const dateB = new Date(b.trip.departureDate || 0);
      return dateA - dateB;
    });
  }

  // =====================================
  // البحث عن شحنات مطابقة لرحلة معينة
  // =====================================
  findMatchingShipments(trip, allShipments = null) {
    const shipments = allShipments || this.shipments;
    
    if (shipments.length === 0) {
      return [];
    }

    const matches = [];

    shipments.forEach(shipment => {
      if (shipment.status !== 'pending') {
        return; // تخطي الشحنات غير المعلقة
      }

      const result = this.findMatchingTrips(shipment, [trip]);
      if (result.length > 0) {
        matches.push({
          shipment,
          ...result[0]
        });
      }
    });

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  // =====================================
  // تحميل البيانات
  // =====================================
  async loadTrips() {
    try {
      const { getActiveTrips } = await import('./database.js');
      this.trips = await getActiveTrips();
      console.log(`✅ Loaded ${this.trips.length} active trips`);
      return this.trips;
    } catch (error) {
      console.error("❌ Error loading trips:", error);
      return [];
    }
  }

  async loadShipments() {
    try {
      const { getPendingShipments } = await import('./database.js');
      this.shipments = await getPendingShipments();
      console.log(`✅ Loaded ${this.shipments.length} pending shipments`);
      return this.shipments;
    } catch (error) {
      console.error("❌ Error loading shipments:", error);
      return [];
    }
  }

  // =====================================
  // حساب السعر المقترح
  // =====================================
  calculateSuggestedPrice(shipment, trip) {
    const distance = this.calculateDistance(
      this.getCityCoordinates(shipment.from).lat,
      this.getCityCoordinates(shipment.from).lng,
      this.getCityCoordinates(shipment.to).lat,
      this.getCityCoordinates(shipment.to).lng
    );

    const weight = shipment.weight;
    const pricePerKm = 0.5; // ريال لكل كيلومتر
    const pricePerKg = 2; // ريال لكل كيلو

    const basePrice = (distance * pricePerKm) + (weight * pricePerKg);
    const minPrice = 50; // الحد الأدنى

    return Math.max(basePrice, minPrice);
  }

  // =====================================
  // إحصائيات
  // =====================================
  getStats() {
    return {
      totalTrips: this.trips.length,
      totalShipments: this.shipments.length,
      activeCities: Object.keys(this.cities).length,
      lastUpdate: new Date().toISOString()
    };
  }
}

// =====================================
// إنشاء مثيل عام
// =====================================

const matchingEngine = new MatchingEngine();

// تصدير للاستخدام العام
window.matchingEngine = matchingEngine;

export default matchingEngine;
export { MatchingEngine };

console.log("✅ Matching Engine loaded successfully");