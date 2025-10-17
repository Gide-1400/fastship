from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.trip import Trip
from app.models.shipment import Shipment
from app.schemas.trip import TripOut
from app.core.geo import haversine_km

router = APIRouter(prefix="/matches", tags=["matches"]) 


@router.get("/by-shipment/{shipment_id}", response_model=List[TripOut])
def match_trips_for_shipment(shipment_id: int, db: Session = Depends(get_db)):
    shipment = db.get(Shipment, shipment_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")

    # naive scoring: distance from shipment pickup to trip origin + capacity check
    trips = db.query(Trip).all()
    scored = []
    for t in trips:
        if t.capacity_kg is not None and t.capacity_kg < shipment.weight_kg:
            continue
        d_km = haversine_km(shipment.pickup_lat, shipment.pickup_lng, t.origin_lat, t.origin_lng)
        scored.append((d_km, t))

    scored.sort(key=lambda x: x[0])
    return [t for _, t in scored[:20]]
