from datetime import datetime, timedelta
from typing import List, Dict, Any
import copy

from app.core.generator import DataGenerator
from app.models import EnergyPoint, HvacPoint


class Simulator:
    """
    Geleceğe yönelik tahminleme (Forecast) ve
    'What-If' senaryolarını çalıştıran motor.
    """

    def __init__(self):
        # Generator'ın temiz bir kopyasını alıyoruz
        self.generator = DataGenerator()

    def run_forecast(
        self, start_time: datetime, hours: int = 12
    ) -> Dict[str, List[Any]]:
        """
        Mevcut durumdan başlayarak X saat sonrasını tahmin eder.
        State'i bozmamak için geçici bir generator instance'ı kullanır.
        """
        # Mevcut state'in derin kopyasını al (Deep Copy)
        # Böylece simülasyon yaparken gerçek dashboard verisini bozmayız.
        sim_generator = DataGenerator()
        sim_generator.state = copy.deepcopy(self.generator.state)

        forecast_results = {"energy_trend": [], "co2_trend": [], "timestamps": []}

        current_sim_time = start_time

        for _ in range(hours):
            # 1 saat ileri sar
            current_sim_time += timedelta(hours=1)

            # O anki veriyi üret
            snapshot = sim_generator.generate_snapshot(current_sim_time)

            # Sadece trend için gerekli özet veriyi alıyoruz
            total_kwh = sum(e.kwh for e in snapshot["energy"])
            avg_co2 = sum(h.co2_ppm for h in snapshot["hvac"]) / len(snapshot["hvac"])

            forecast_results["timestamps"].append(current_sim_time)
            forecast_results["energy_trend"].append(round(total_kwh, 2))
            forecast_results["co2_trend"].append(int(avg_co2))

        return forecast_results

    def run_what_if(self, parameter: str, value: float) -> str:
        """
        Örn: "Sıcaklığı 1 derece artırırsam ne olur?"
        """
        # MVP kapsamında basit bir kural seti döndürelim.
        # İleride buraya gerçek simülasyon döngüsü eklenebilir.

        if parameter == "setpoint_temp":
            if value > 23:
                return "Enerji tüketimi %8 düşer, ancak Konfor Skoru 'Düşük' seviyesine geriler."
            elif value < 21:
                return "Konfor artar, ancak Enerji maliyeti %12 yükselir."

        return "Simülasyon sonucu: Değişiklik marjinal etki yaratır."
