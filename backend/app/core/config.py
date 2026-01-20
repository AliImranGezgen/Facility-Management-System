from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AVM Digital Twin API"
    VERSION: str = "1.0.0"

    # Simülasyon Sabitleri
    DEFAULT_ZONE_TEMP: float = 22.0
    MAX_SAFE_CO2: int = 1000
    MAX_SAFE_HUMIDITY: float = 65.0
    MIN_SAFE_HUMIDITY: float = 30.0

    # Maliyet Sabitleri (TL)
    COST_PER_CLEANING_SHIFT: float = 1500.0

    # Alarm Eşikleri
    CROWD_THRESHOLD: int = 500
    CRITICAL_ASSET_TYPES: list = ["Chiller", "Elevator"]

    class Config:
        env_file = ".env"


settings = Settings()
