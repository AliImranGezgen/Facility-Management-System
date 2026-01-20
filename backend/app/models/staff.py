from pydantic import BaseModel, Field
from datetime import date, datetime

class CleaningNeed(BaseModel):
    """
    Bir bölgenin anlık kirlilik/temizlik durumu.
    """
    ts: datetime
    zone: str
    footfall: int = Field(..., ge=0, description="Bölgeden geçen kişi sayısı")
    cleanliness_score: float = Field(..., ge=0, le=100, description="0 (Kirli) - 100 (Temiz)")

class ShiftPlan(BaseModel):
    """
    Personel vardiya planlaması.
    """
    shift_date: date
    zone: str
    required_staff: int
    assigned_staff: int
    gap: int # required - assigned (Negatifse fazlalık var demektir)