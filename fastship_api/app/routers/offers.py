from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db, engine
from app.db.base import Base
from app.models.offer import Offer
from app.models.shipment import Shipment
from app.models.trip import Trip
from app.schemas.offer import OfferCreate, OfferOut

router = APIRouter(prefix="/offers", tags=["offers"]) 

Base.metadata.create_all(bind=engine)


@router.post("/", response_model=OfferOut, status_code=status.HTTP_201_CREATED)
def create_offer(payload: OfferCreate, db: Session = Depends(get_db)):
    if not db.get(Shipment, payload.shipment_id):
        raise HTTPException(status_code=404, detail="Shipment not found")
    if not db.get(Trip, payload.trip_id):
        raise HTTPException(status_code=404, detail="Trip not found")

    offer = Offer(**payload.model_dump())
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer


@router.get("/{offer_id}", response_model=OfferOut)
def get_offer(offer_id: int, db: Session = Depends(get_db)):
    offer = db.get(Offer, offer_id)
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    return offer
