from fastapi import FastAPI
from app.routes.auth import router as auth_router
from app.db.database import engine, Base
from app.models.user import User

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PaperPilot API",
    description="AI Document Intelligence Platform",
    version="1.0.0"
)

app.include_router(auth_router)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "PaperPilot backend is running"}
