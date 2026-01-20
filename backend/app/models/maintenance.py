from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from typing import Optional

class AssetType(str, Enum):
    ESCALATOR = "Escalator"
    CHILLER = "Chiller"
    AHU = "AHU" # Klima Santrali
    ELEVATOR = "Elevator"
    CAMERA = "Camera"

class Priority(str, Enum):
    LOW = "Low"
    MED = "Med"
    HIGH = "High"
    CRITICAL = "Critical"

class WorkOrderStatus(str, Enum):
    OPEN = "Open"
    IN_PROGRESS = "InProgress"
    DONE = "Done"

class Asset(BaseModel):
    id: str
    name: str
    type: AssetType
    zone: str
    is_active: bool = True

class WorkOrder(BaseModel):
    id: str
    asset_id: str
    ts_opened: datetime
    issue: str
    priority: Priority
    status: WorkOrderStatus
    eta_min: int = Field(..., description="Tahmini onarım süresi (dakika)")

class UptimeSnapshot(BaseModel):
    ts: datetime
    asset_id: str
    uptime_pct_7d: float = Field(..., ge=0, le=100)
    mtbf_hours: float
    mttr_min: float