# Import order matters for relationship resolution
from app.models.shipment import Shipment, ShipmentStatus
from app.models.trip import Trip, TripStatus, TransportMode
from app.models.offer import Offer, OfferStatus
from app.models.booking import Booking, BookingStatus
