from __future__ import annotations
from datetime import datetime
from typing import List, Optional
from enum import Enum

from sqlalchemy import String, Text, Integer, Float, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ShipmentStatus(str, Enum):
    CREATED = "created"
    MATCHED = "matched"
    BOOKED = "booked"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class Shipment(Base):
    __tablename__ = "shipments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[Optional[str]] = mapped_column(Text(), nullable=True)

    weight_kg: Mapped[float] = mapped_column(Float)
    volume_m3: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    pickup_address: Mapped[str] = mapped_column(String(255))
    pickup_lat: Mapped[float] = mapped_column(Float)
    pickup_lng: Mapped[float] = mapped_column(Float)

    dropoff_address: Mapped[str] = mapped_column(String(255))
    dropoff_lat: Mapped[float] = mapped_column(Float)
    dropoff_lng: Mapped[float] = mapped_column(Float)

    earliest_pickup: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    latest_delivery: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    status: Mapped[ShipmentStatus] = mapped_column(SAEnum(ShipmentStatus), default=ShipmentStatus.CREATED, index=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    offers: Mapped[List["Offer"]] = relationship("Offer", back_populates="shipment", cascade="all, delete-orphan")
