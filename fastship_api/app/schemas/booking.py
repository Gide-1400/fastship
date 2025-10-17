from __future__ import annotations
from pydantic import BaseModel


class BookingCreate(BaseModel):
    offer_id: int
    total_amount: float
    currency: str = "SAR"


class BookingOut(BaseModel):
    id: int
    offer_id: int
    total_amount: float
    currency: str
    status: str

    class Config:
        from_attributes = True
