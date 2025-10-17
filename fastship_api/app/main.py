from fastapi import FastAPI

from app.routers.health import router as health_router
from app.routers.shipments import router as shipments_router
from app.routers.trips import router as trips_router
from app.routers.offers import router as offers_router
from app.routers.bookings import router as bookings_router
from app.routers.matches import router as matches_router

app = FastAPI(title="FastShip API", version="0.1.0")

app.include_router(health_router)
app.include_router(shipments_router)
app.include_router(trips_router)
app.include_router(offers_router)
app.include_router(bookings_router)
app.include_router(matches_router)


@app.get("/")
def root():
    return {"name": "FastShip API", "status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
