from typing import List, Dict

# StaffKPI kaldırıldı çünkü tanımlı değil ve kullanılmıyor
from app.models import EnergyPoint, HvacPoint
from app.core.config import settings


class AIEngine:
    """
    Sistemin 'Akıllı' katmanı.
    Anomali tespiti ve Optimizasyon önerileri sunar.
    """

    @staticmethod
    def detect_anomalies(
        energy_data: List[EnergyPoint], hvac_data: List[HvacPoint]
    ) -> List[str]:
        """
        Gelen son verileri tarar ve anormallikleri raporlar.
        """
        anomalies = []

        # 1. Enerji Anomalisi
        for point in energy_data:
            if point.kwh > 50.0:
                anomalies.append(
                    f"Enerji Sıçraması: {point.zone} bölgesinde aşırı tüketim ({point.kwh} kWh)."
                )

        # 2. HVAC Anomalisi
        for point in hvac_data:
            if point.co2_ppm > settings.MAX_SAFE_CO2:
                anomalies.append(
                    f"Hava Kalitesi Uyarısı: {point.zone} bölgesinde CO2 seviyesi kritik ({point.co2_ppm} PPM)."
                )

            if not (18.0 <= point.temp_c <= 26.0):
                anomalies.append(
                    f"Sıcaklık Sapması: {point.zone} bölgesinde sıcaklık ({point.temp_c}°C) ideal aralık dışında."
                )

        return anomalies

    @staticmethod
    def optimize_hvac_strategy(
        current_occupancy: int, current_temp: float
    ) -> Dict[str, str]:
        """
        Mevcut duruma göre en verimli HVAC stratejisini önerir.
        """
        recommendation = {}

        if current_occupancy < 50:
            recommendation = {
                "mode": "ECONOMY",
                "action": "Fan hızını %20'ye düşür, taze hava girişini minimuma indir.",
                "reason": "Alan boş, enerji tasarrufu yapılabilir.",
            }
        elif current_occupancy > settings.CROWD_THRESHOLD:
            recommendation = {
                "mode": "TURBO_FRESH",
                "action": "Taze hava damperlerini %100 aç, soğutmayı artır.",
                "reason": "Kalabalık artışı CO2 riskini doğuruyor, önleyici soğutma gerekli.",
            }
        else:
            recommendation = {
                "mode": "COMFORT",
                "action": "Set değerini 22°C'de sabit tut.",
                "reason": "Koşullar stabil.",
            }

        return recommendation
