from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router
from app.core.config import settings

# Uygulamayı başlat
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="AVM Dijital İkiz ve Tesis Yönetim Simülasyonu Backend API",
)

# --- CORS Ayarları ---
# React (genelde localhost:3000 veya 5173) backend'e erişebilsin diye izin veriyoruz.
origins = ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # Geliştirme aşamasında herkese izin ver (Production'da kısıtlanmalı)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route'ları dahil et
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    """Sunucu sağlık kontrolü"""
    return {"status": "active", "message": "AVM Digital Twin Backend is Running..."}


# Doğrudan python main.py ile çalıştırılırsa diye:
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
