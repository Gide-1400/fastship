from __future__ import annotations
from typing import Optional
from pydantic import BaseModel


class OfferCreate(BaseModel):
    shipment_id: int
    trip_id: int
    price_amount: float
    currency: str = "SAR"
    note: Optional[str] = None


class OfferOut(BaseModel):
    id: int
    shipment_id: int
    trip_id: int
    price_amount: float
    currency: str
    status: str
    note: Optional[str]

    class Config:
        from_attributes = True
