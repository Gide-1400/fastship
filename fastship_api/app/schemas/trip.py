from __future__ import annotations
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TripCreate(BaseModel):
    mode: str
    vehicle_type: Optional[str] = None

    origin_address: str
    origin_lat: float
    origin_lng: float

    destination_address: str
    destination_lat: float
    destination_lng: float

    capacity_kg: float
    capacity_m3: Optional[float] = None

    departure_time: Optional[datetime] = None
    arrival_time: Optional[datetime] = None


class TripOut(BaseModel):
    id: int
    mode: str
    vehicle_type: Optional[str]

    origin_address: str
    origin_lat: float
    origin_lng: float

    destination_address: str
    destination_lat: float
    destination_lng: float

    capacity_kg: float
    capacity_m3: Optional[float]

    departure_time: Optional[datetime]
    arrival_time: Optional[datetime]

    status: str

    class Config:
        from_attributes = True
