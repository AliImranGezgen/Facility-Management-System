from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from typing import Optional

class SecurityEventType(str, Enum):
    DOOR_FORCED = "DoorForced"
    CAMERA_OFFLINE = "CameraOffline"
    FIRE_PANEL = "FirePanel"
    CROWD_RISK = "CrowdRisk"
    UNAUTHORIZED_ACCESS = "UnauthorizedAccess"

class SecurityStatus(str, Enum):
    OPEN = "Open"
    ACKNOWLEDGED = "Acknowledged"
    RESOLVED = "Resolved"

class SecurityEvent(BaseModel):
    """
    Güvenlik olaylarını ve alarmları temsil eder.
    """
    id: str
    ts: datetime
    zone: str
    type: SecurityEventType
    severity: int = Field(..., ge=1, le=5, description="1 (Düşük) - 5 (Kritik)")
    status: SecurityStatus
    description: Optional[str] = None

class SecurityKPI(BaseModel):
    active_alarm_count: int
    critical_alarms_last_hour: int
    riskiest_zone: str