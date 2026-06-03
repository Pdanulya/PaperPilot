from fastapi import FastAPI

app = FastAPI(
    title="PaperPilot API",
    description="AI Document Intelligence Platform",
    version="1.0.0"
)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "PaperPilot backend is running"}