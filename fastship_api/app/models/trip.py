from __future__ import annotations
from datetime import datetime
from typing import List, Optional
from enum import Enum

from sqlalchemy import String, Integer, Float, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class TransportMode(str, Enum):
    TAXI = "taxi"
    BUS = "bus"
    CAR = "car"
    PICKUP = "pickup"
    TRUCK = "truck"
    VAN = "van"
    TRAIN = "train"
    PLANE = "plane"
    SHIP = "ship"


class TripStatus(str, Enum):
    OPEN = "open"
    CLOSED = "closed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    mode: Mapped[TransportMode] = mapped_column(SAEnum(TransportMode), index=True)
    vehicle_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    origin_address: Mapped[str] = mapped_column(String(255))
    origin_lat: Mapped[float] = mapped_column(Float)
    origin_lng: Mapped[float] = mapped_column(Float)

    destination_address: Mapped[str] = mapped_column(String(255))
    destination_lat: Mapped[float] = mapped_column(Float)
    destination_lng: Mapped[float] = mapped_column(Float)

    capacity_kg: Mapped[float] = mapped_column(Float)
    capacity_m3: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    departure_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    arrival_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    status: Mapped[TripStatus] = mapped_column(SAEnum(TripStatus), default=TripStatus.OPEN, index=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    offers: Mapped[List["Offer"]] = relationship("Offer", back_populates="trip", cascade="all, delete-orphan")
