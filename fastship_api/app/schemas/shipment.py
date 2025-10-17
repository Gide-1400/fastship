from __future__ import annotations
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ShipmentCreate(BaseModel):
    title: str
    description: Optional[str] = None

    weight_kg: float
    volume_m3: Optional[float] = None

    pickup_address: str
    pickup_lat: float
    pickup_lng: float

    dropoff_address: str
    dropoff_lat: float
    dropoff_lng: float

    earliest_pickup: Optional[datetime] = None
    latest_delivery: Optional[datetime] = None


class ShipmentOut(BaseModel):
    id: int
    title: str
    description: Optional[str]

    weight_kg: float
    volume_m3: Optional[float]

    pickup_address: str
    pickup_lat: float
    pickup_lng: float

    dropoff_address: str
    dropoff_lat: float
    dropoff_lng: float

    earliest_pickup: Optional[datetime]
    latest_delivery: Optional[datetime]

    status: str

    class Config:
        from_attributes = True
