loadShipments() {
    const stored = localStorage.getItem('fastshipment_shipments');
    return stored ? JSON.parse(stored) : [];
}

saveShipments() {
    localStorage.setItem('fastshipment_shipments', JSON.stringify(this.shipments));
}

createShipment(data) {
    const shipment = {
        id: Date.now(),
        userId: window.authManager?.getCurrentUser()?.id || null,
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        trackingNumber: this.generateTrackingNumber()
    };

    this.shipments.push(shipment);
    this.saveShipments();
    return shipment;
}

generateTrackingNumber() {
    return 'SH-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

getUserShipments(userId) {
    return this.shipments.filter(s => s.userId === userId);
}

updateShipmentStatus(shipmentId, status) {
    const shipment = this.shipments.find(s => s.id === shipmentId);
    if (shipment) {
        shipment.status = status;
        this.saveShipments();
        return true;
    }
    return false;
}