from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db, engine
from app.db.base import Base
from app.models.shipment import Shipment
from app.schemas.shipment import ShipmentCreate, ShipmentOut

router = APIRouter(prefix="/shipments", tags=["shipments"]) 

# Ensure tables exist (simple bootstrap for SQLite demo)
Base.metadata.create_all(bind=engine)


@router.post("/", response_model=ShipmentOut, status_code=status.HTTP_201_CREATED)
def create_shipment(payload: ShipmentCreate, db: Session = Depends(get_db)):
    shipment = Shipment(**payload.model_dump())
    db.add(shipment)
    db.commit()
    db.refresh(shipment)
    return shipment


@router.get("/{shipment_id}", response_model=ShipmentOut)
def get_shipment(shipment_id: int, db: Session = Depends(get_db)):
    shipment = db.get(Shipment, shipment_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment
