from __future__ import annotations
from datetime import datetime
from enum import Enum

from sqlalchemy import Integer, DateTime, ForeignKey, Enum as SAEnum, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class BookingStatus(str, Enum):
    RESERVED = "reserved"  # after offer accepted, before payment capture
    CONFIRMED = "confirmed"  # after payment capture
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    offer_id: Mapped[int] = mapped_column(ForeignKey("offers.id", ondelete="CASCADE"), unique=True)

    total_amount: Mapped[float] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(8), default="SAR")

    status: Mapped[BookingStatus] = mapped_column(SAEnum(BookingStatus), default=BookingStatus.RESERVED, index=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    offer = relationship("Offer")
