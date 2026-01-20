from pydantic import BaseModel, Field
from datetime import datetime

class HvacPoint(BaseModel):
    """
    Bölge bazlı sıcaklık, nem ve hava kalitesi verisi.
    """
    ts: datetime
    zone: str
    temp_c: float = Field(..., description="Sıcaklık (°C)")
    humidity: float = Field(..., ge=0, le=100, description="Nem Oranı (%)")
    co2_ppm: int = Field(..., ge=0, description="Karbondioksit seviyesi (PPM)")

class HvacKPI(BaseModel):
    """
    HVAC sisteminin genel sağlık durumu.
    """
    worst_co2_zone: str
    uncomfortable_zone_count: int
    health_score: float = Field(..., ge=0, le=100, description="Genel sistem sağlık puanı")