// =====================================
// FastShip - Database Functions
// الملف: js/database.js
// =====================================

import { ref, set, get, update, push, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// الحصول على db من window (تم تعيينه في firebase-config.js)
const getDB = () => window.db;

// =====================================
// دوال المستخدمين (Users)
// =====================================

// إضافة مستخدم جديد
export async function addUser(userId, userData, userType) {
  try {
    const db = getDB();
    const userRef = ref(db, `users/${userType}/${userId}`);
    await set(userRef, {
      ...userData,
      createdAt: new Date().toISOString(),
      rating: 0,
      totalRatings: 0,
      completedTrips: 0,
      reviews: []
    });
    console.log("✅ User added successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Error adding user:", error);
    return { success: false, error: error.message };
  }
}

// الحصول على بيانات المستخدم
export async function getUser(userId, userType) {
  try {
    const db = getDB();
    const userRef = ref(db, `users/${userType}/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("❌ Error getting user:", error);
    return null;
  }
}

// تحديث بيانات المستخدم
export async function updateUser(userId, userType, updates) {
  try {
    const db = getDB();
    const userRef = ref(db, `users/${userType}/${userId}`);
    await update(userRef, updates);
    console.log("✅ User updated successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return { success: false, error: error.message };
  }
}

// =====================================
// دوال الشحنات (Shipments)
// =====================================

// إنشاء شحنة جديدة
export async function createShipment(shipperId, shipmentData) {
  try {
    const db = getDB();
    const shipmentsRef = ref(db, 'shipments');
    const newShipmentRef = push(shipmentsRef);
    const shipmentId = newShipmentRef.key;
    
    await set(newShipmentRef, {
      shipmentId,
      shipperId,
      ...shipmentData,
      carrierId: null,
      tripId: null,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log("✅ Shipment created:", shipmentId);
    return { success: true, shipmentId };
  } catch (error) {
    console.error("❌ Error creating shipment:", error);
    return { success: false, error: error.message };
  }
}

// الحصول على شحنة معينة
export async function getShipment(shipmentId) {
  try {
    const db = getDB();
    const shipmentRef = ref(db, `shipments/${shipmentId}`);
    const snapshot = await get(shipmentRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("❌ Error getting shipment:", error);
    return null;
  }
}

// الحصول على الشحنات المعلقة (pending)
export async function getPendingShipments() {
  try {
    const db = getDB();
    const shipmentsRef = ref(db, 'shipments');
    const snapshot = await get(shipmentsRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const shipments = [];
    snapshot.forEach((childSnapshot) => {
      const shipment = childSnapshot.val();
      if (shipment.status === 'pending') {
        shipments.push(shipment);
      }
    });
    
    return shipments;
  } catch (error) {
    console.error("❌ Error getting pending shipments:", error);
    return [];
  }
}

// الحصول على شحنات المستخدم
export async function getUserShipments(shipperId) {
  try {
    const db = getDB();
    const shipmentsRef = ref(db, 'shipments');
    const userQuery = query(shipmentsRef, orderByChild('shipperId'), equalTo(shipperId));
    const snapshot = await get(userQuery);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const shipments = [];
    snapshot.forEach((childSnapshot) => {
      shipments.push(childSnapshot.val());
    });
    
    return shipments;
  } catch (error) {
    console.error("❌ Error getting user shipments:", error);
    return [];
  }
}

// تحديث حالة الشحنة
export async function updateShipmentStatus(shipmentId, newStatus) {
  try {
    const db = getDB();
    const shipmentRef = ref(db, `shipments/${shipmentId}`);
    await update(shipmentRef, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
    console.log("✅ Shipment status updated");
    return { success: true };
  } catch (error) {
    console.error("❌ Error updating shipment status:", error);
    return { success: false, error: error.message };
  }
}

// =====================================
// دوال الرحلات (Trips)
// =====================================

// إنشاء رحلة جديدة
export async function createTrip(carrierId, tripData) {
  try {
    const db = getDB();
    const tripsRef = ref(db, 'trips');
    const newTripRef = push(tripsRef);
    const tripId = newTripRef.key;
    
    await set(newTripRef, {
      tripId,
      carrierId,
      ...tripData,
      acceptedShipments: [],
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log("✅ Trip created:", tripId);
    return { success: true, tripId };
  } catch (error) {
    console.error("❌ Error creating trip:", error);
    return { success: false, error: error.message };
  }
}

// الحصول على رحلة معينة
export async function getTrip(tripId) {
  try {
    const db = getDB();
    const tripRef = ref(db, `trips/${tripId}`);
    const snapshot = await get(tripRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("❌ Error getting trip:", error);
    return null;
  }
}

// الحصول على رحلات الموصل
export async function getCarrierTrips(carrierId) {
  try {
    const db = getDB();
    const tripsRef = ref(db, 'trips');
    const carrierQuery = query(tripsRef, orderByChild('carrierId'), equalTo(carrierId));
    const snapshot = await get(carrierQuery);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const trips = [];
    snapshot.forEach((childSnapshot) => {
      const trip = childSnapshot.val();
      if (trip.status === 'active') {
        trips.push(trip);
      }
    });
    
    return trips;
  } catch (error) {
    console.error("❌ Error getting carrier trips:", error);
    return [];
  }
}

// الحصول على جميع الرحلات النشطة
export async function getActiveTrips() {
  try {
    const db = getDB();
    const tripsRef = ref(db, 'trips');
    const snapshot = await get(tripsRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const trips = [];
    snapshot.forEach((childSnapshot) => {
      const trip = childSnapshot.val();
      if (trip.status === 'active') {
        trips.push(trip);
      }
    });
    
    return trips;
  } catch (error) {
    console.error("❌ Error getting active trips:", error);
    return [];
  }
}

// =====================================
// دوال العقود والمطابقة
// =====================================

// قبول شحنة من قبل موصل
export async function acceptShipment(shipmentId, carrierId, tripId) {
  try {
    const db = getDB();
    const updates = {};
    
    // تحديث الشحنة
    updates[`shipments/${shipmentId}/carrierId`] = carrierId;
    updates[`shipments/${shipmentId}/tripId`] = tripId;
    updates[`shipments/${shipmentId}/status`] = "accepted";
    updates[`shipments/${shipmentId}/acceptedAt`] = new Date().toISOString();
    
    await update(ref(db), updates);
    
    console.log("✅ Shipment accepted");
    return { success: true };
  } catch (error) {
    console.error("❌ Error accepting shipment:", error);
    return { success: false, error: error.message };
  }
}

// =====================================
// دوال الرسائل (Messages)
// =====================================

// إرسال رسالة
export async function sendMessage(contractId, senderId, senderType, message) {
  try {
    const db = getDB();
    const messagesRef = ref(db, `contracts/${contractId}/messages`);
    const newMessageRef = push(messagesRef);
    
    await set(newMessageRef, {
      senderId,
      senderType,
      message,
      timestamp: new Date().toISOString(),
      seen: false
    });
    
    console.log("✅ Message sent");
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending message:", error);
    return { success: false, error: error.message };
  }
}

// الحصول على الرسائل
export async function getMessages(contractId) {
  try {
    const db = getDB();
    const messagesRef = ref(db, `contracts/${contractId}/messages`);
    const snapshot = await get(messagesRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const messages = [];
    snapshot.forEach((childSnapshot) => {
      messages.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    return messages;
  } catch (error) {
    console.error("❌ Error getting messages:", error);
    return [];
  }
}

// =====================================
// دوال التقييمات (Ratings)
// =====================================

// إضافة تقييم
export async function addRating(ratingData) {
  try {
    const db = getDB();
    const ratingsRef = ref(db, 'ratings');
    const newRatingRef = push(ratingsRef);
    
    await set(newRatingRef, {
      ...ratingData,
      createdAt: new Date().toISOString()
    });
    
    console.log("✅ Rating added");
    return { success: true };
  } catch (error) {
    console.error("❌ Error adding rating:", error);
    return { success: false, error: error.message };
  }
}

// الحصول على تقييمات المستخدم
export async function getUserRatings(userId) {
  try {
    const db = getDB();
    const ratingsRef = ref(db, 'ratings');
    const userQuery = query(ratingsRef, orderByChild('toUserId'), equalTo(userId));
    const snapshot = await get(userQuery);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const ratings = [];
    snapshot.forEach((childSnapshot) => {
      ratings.push(childSnapshot.val());
    });
    
    return ratings;
  } catch (error) {
    console.error("❌ Error getting user ratings:", error);
    return [];
  }
}

console.log("✅ Database functions loaded successfully");