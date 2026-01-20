from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class EnergyPoint(BaseModel):
    """
    Anlık enerji tüketim verisi.
    """
    ts: datetime
    zone: str
    kwh: float = Field(..., ge=0, description="Tüketilen kilowatt-saat")
    tariff: float = Field(..., ge=0, description="O anki tarife (TL/kWh)")
    cost: float = Field(..., ge=0, description="Hesaplanmış maliyet (kwh * tariff)")

class EnergyKPI(BaseModel):
    """
    Dashboard'da gösterilecek Enerji Özet Verileri.
    """
    current_kw: float
    daily_kwh: float
    daily_cost: float
    peak_zone: str