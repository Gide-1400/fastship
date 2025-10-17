from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db, engine
from app.db.base import Base
from app.models.booking import Booking
from app.models.offer import Offer, OfferStatus
from app.schemas.booking import BookingCreate, BookingOut

router = APIRouter(prefix="/bookings", tags=["bookings"]) 

Base.metadata.create_all(bind=engine)


@router.post("/", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    offer = db.get(Offer, payload.offer_id)
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    # When using SQLAlchemy Enum, offer.status may be of Enum type
    if (getattr(offer.status, 'value', str(offer.status)) != OfferStatus.ACCEPTED.value):
        raise HTTPException(status_code=400, detail="Offer is not accepted")

    booking = Booking(**payload.model_dump())
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking
