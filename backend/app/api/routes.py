from fastapi import APIRouter, Query
from datetime import datetime
from typing import Dict, Any, List

# Core modüllerimiz
from app.core import DataGenerator, Simulator, AIEngine

router = APIRouter()

# --- Singleton Instances ---
# State'in korunması için global instance kullanıyoruz.
# Böylece her istekte veriler sıfırlanmaz, kaldığı yerden devam eder.
generator_instance = DataGenerator()
simulator_instance = Simulator()


@router.get("/live")
def get_live_dashboard_data():
    """
    Frontend'in her 3-5 saniyede bir çağıracağı ana endpoint.
    Anlık simülasyon verisini ve AI analizlerini döndürür.
    """
    now = datetime.now()

    # 1. Ham veriyi üret (Generator)
    snapshot = generator_instance.generate_snapshot(now)

    # 2. AI Katmanını Çalıştır (Anomali Tespiti)
    anomalies = AIEngine.detect_anomalies(
        energy_data=snapshot["energy"], hvac_data=snapshot["hvac"]
    )

    # 3. Yanıtı birleştir
    response = {
        "timestamp": now.isoformat(),
        "data": snapshot,
        "ai_insights": {"anomalies": anomalies, "anomaly_count": len(anomalies)},
    }
    return response


@router.post("/simulate")
def run_simulation(hours: int = 24):
    """
    'What-If' veya Gelecek Tahmini senaryosu.
    Mevcut durumdan itibaren X saat sonrasını simüle eder.
    """
    start_time = datetime.now()
    forecast_results = simulator_instance.run_forecast(start_time, hours=hours)

    return {"meta": {"hours_simulated": hours}, "forecast": forecast_results}


@router.post("/recommend")
def get_optimization_recommendation(zone: str = "FoodCourt"):
    """
    Seçilen bölge için AI tabanlı HVAC/Personel önerisi verir.
    """
    # Mevcut durumu generator'dan çekelim
    # (Basitlik adına son durumu alıyoruz)
    current_state = generator_instance.state.zone_states.get(zone)

    if not current_state:
        return {"error": "Zone not found"}

    recommendation = AIEngine.optimize_hvac_strategy(
        current_occupancy=current_state["people"], current_temp=current_state["temp"]
    )

    return {
        "zone": zone,
        "current_conditions": current_state,
        "ai_recommendation": recommendation,
    }
