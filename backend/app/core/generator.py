import random
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any

from app.models import (
    EnergyPoint,
    HvacPoint,
    SecurityEvent,
    SecurityEventType,
    SecurityStatus,
    Asset,
    WorkOrder,
    AssetType,
    Priority,
    WorkOrderStatus,
    CleaningNeed,
    ShiftPlan,
)


class SimulationState:
    """
    Simülasyonun önceki anını hafızada tutar.
    Böylece veriler anlık sıçramalar yapmaz, bir önceki duruma göre değişir.
    """

    def __init__(self):
        self.zones = ["FoodCourt", "MainEntrance", "Cinema", "RetailCorridor"]

        # Her zone için başlangıç değerleri
        self.zone_states = {
            zone: {
                "co2": 400.0,  # Başlangıç PPM
                "temp": 22.0,  # Başlangıç Derece
                "cleanliness": 100.0,  # Pırıl pırıl
                "people": 0,  # İçerideki insan sayısı (kümülatif etki için)
            }
            for zone in self.zones
        }

        # Sabit Varlıklar (Assets) - Bir kere oluşturulur
        self.assets = self._generate_initial_assets()

    def _generate_initial_assets(self) -> List[Asset]:
        asset_list = []
        types = [
            (AssetType.CHILLER, "Main Chiller A", "RetailCorridor"),
            (AssetType.ESCALATOR, "Escalator North", "MainEntrance"),
            (AssetType.ESCALATOR, "Escalator South", "FoodCourt"),
            (AssetType.AHU, "AHU Unit 1", "Cinema"),
            (AssetType.CAMERA, "Cam 55 Lobby", "MainEntrance"),
        ]
        for idx, (atype, name, zone) in enumerate(types):
            asset_list.append(
                Asset(id=f"ast_{idx}", name=name, type=atype, zone=zone, is_active=True)
            )
        return asset_list


class DataGenerator:
    def __init__(self):
        self.state = SimulationState()

    def _get_tariff(self, hour: int) -> float:
        """Zamana dayalı elektrik tarifesi (TL/kWh)"""
        if 17 <= hour <= 22:
            return 4.50  # Akşam Puant (En pahalı)
        if 0 <= hour <= 6:
            return 1.10  # Gece (En ucuz)
        return 2.80  # Gündüz (Normal)

    def _calculate_footfall(self, zone: str, hour: int) -> int:
        """
        Saate ve bölgeye göre insan yoğunluğu üretir.
        """
        base = 0
        if 8 <= hour < 10:
            base = 50  # Sabah açılış
        elif 10 <= hour < 14:
            base = 300  # Öğle yoğunluğu
        elif 14 <= hour < 17:
            base = 150  # Öğleden sonra sakinliği
        elif 17 <= hour < 21:
            base = 400  # Akşam yoğunluğu (İş çıkışı)
        else:
            base = 10  # Gece

        # Bölge çarpanları
        multiplier = 1.0
        if zone == "FoodCourt":
            if 11 <= hour <= 14 or 18 <= hour <= 20:
                multiplier = 1.5  # Yemek saatleri
        elif zone == "Cinema":
            if hour >= 20:
                multiplier = 1.8  # Akşam sinema

        # Rastgelelik ekle (+-%20)
        val = int(base * multiplier * random.uniform(0.8, 1.2))
        return val

    def generate_snapshot(self, current_time: datetime) -> Dict[str, Any]:
        """
        Verilen zaman dilimi için TÜM sistemlerin verisini üretir.
        Birbiriyle ilişkili veriler (Zincirleme Reaksiyon) burada işlenir.
        """
        hour = current_time.hour

        energy_data = []
        hvac_data = []
        cleaning_data = []
        security_events = []
        work_orders = []

        # 1. Döngü: Her Zone için Çevresel Verileri Hesapla
        for zone in self.state.zones:
            prev_state = self.state.zone_states[zone]

            # --- ADIM 1: Footfall (Sürücü) ---
            footfall = self._calculate_footfall(zone, hour)
            self.state.zone_states[zone]["people"] = footfall

            # --- ADIM 2: HVAC (Sıcaklık ve CO2) ---
            # CO2 mantığı: İnsanlar artırır, HVAC düşürür (gecikmeli)
            # CO2 Artış hızı: Kişi başı 0.5 ppm katkı
            # CO2 Azalış hızı: HVAC sürekli %5 temizler
            co2_increase = footfall * 0.5
            co2_decay = prev_state["co2"] * 0.05
            new_co2 = prev_state["co2"] + co2_increase - co2_decay

            # Sınırlar (400ppm dış hava - 2000ppm max)
            new_co2 = max(400.0, min(2000.0, new_co2))

            # Sıcaklık mantığı: İnsan vücut ısısı ortamı ısıtır, Klima soğutur
            # Hedef sıcaklık 22C. Kalabalık varsa ısınır.
            target_temp = 22.0
            heat_load = footfall * 0.002  # İnsan etkisi
            temp_drift = random.uniform(-0.1, 0.2)  # Doğal dalgalanma

            new_temp = prev_state["temp"] + heat_load + temp_drift
            # Klima etkisi (Isındıysa soğutmaya çalışır)
            if new_temp > target_temp:
                new_temp -= 0.15

            hvac_point = HvacPoint(
                ts=current_time,
                zone=zone,
                temp_c=round(new_temp, 2),
                humidity=round(random.uniform(40, 60), 1),
                co2_ppm=int(new_co2),
            )
            hvac_data.append(hvac_point)

            # State güncelle
            self.state.zone_states[zone]["co2"] = new_co2
            self.state.zone_states[zone]["temp"] = new_temp

            # --- ADIM 3: Enerji ---
            # HVAC yükü ne kadar fazlaysa (CO2 ve Sıcaklık yüksekse) enerji o kadar artar
            # Base Load (Aydınlatma vb.): 10 kWh
            # HVAC Load: (CO2 - 400) * 0.01 + (Temp - 20) * 2
            hvac_power_effort = (new_co2 - 400) * 0.02 + abs(new_temp - 22) * 5
            total_kwh = 10 + hvac_power_effort
            tariff = self._get_tariff(hour)

            energy_point = EnergyPoint(
                ts=current_time,
                zone=zone,
                kwh=round(total_kwh, 2),
                tariff=tariff,
                cost=round(total_kwh * tariff, 2),
            )
            energy_data.append(energy_point)

            # --- ADIM 4: Temizlik ---
            # Footfall kirliliği artırır (Skoru düşürür)
            # Her insan skoru 0.05 düşürsün
            dirt_factor = footfall * 0.05
            new_cleanliness = prev_state["cleanliness"] - dirt_factor

            # Otomatik temizlik simülasyonu (Eğer çok kirlendiyse temizleniyor gibi yapalım - Reset)
            # Gerçek senaryoda bu bir "Action" olurdu, şimdilik döngüsel olsun.
            if new_cleanliness < 40:
                new_cleanliness = 100.0  # Temizlik yapıldı

            cleaning_point = CleaningNeed(
                ts=current_time,
                zone=zone,
                footfall=footfall,
                cleanliness_score=round(max(0.0, new_cleanliness), 1),
            )
            cleaning_data.append(cleaning_point)
            self.state.zone_states[zone]["cleanliness"] = new_cleanliness

        # --- ADIM 5: Olay Bazlı (Güvenlik & Arıza) ---

        # Güvenlik Olayı (Düşük ihtimal)
        if random.random() < 0.05:  # %5 ihtimalle her döngüde bir olay
            event_type = random.choice(list(SecurityEventType))
            severity = 1
            if event_type == SecurityEventType.FIRE_PANEL:
                severity = 5
            elif event_type == SecurityEventType.CROWD_RISK:
                severity = 3

            sec_event = SecurityEvent(
                id=str(uuid.uuid4())[:8],
                ts=current_time,
                zone=random.choice(self.state.zones),
                type=event_type,
                severity=severity,
                status=SecurityStatus.OPEN,
                description=f"Otomatik algılanan olay: {event_type.value}",
            )
            security_events.append(sec_event)

        # Arıza Olayı (Çok düşük ihtimal)
        if random.random() < 0.02:  # %2 ihtimal
            faulty_asset = random.choice(self.state.assets)
            if faulty_asset.is_active:  # Zaten bozuk değilse boz
                wo = WorkOrder(
                    id=f"WO-{str(uuid.uuid4())[:6]}",
                    asset_id=faulty_asset.id,
                    ts_opened=current_time,
                    issue=f"{faulty_asset.name} performans düşüklüğü / arıza",
                    priority=(
                        Priority.HIGH
                        if faulty_asset.type in [AssetType.CHILLER, AssetType.ELEVATOR]
                        else Priority.MED
                    ),
                    status=WorkOrderStatus.OPEN,
                    eta_min=random.randint(60, 240),
                )
                work_orders.append(wo)
                faulty_asset.is_active = False  # State güncellemesi (Basit tutuldu)

        return {
            "energy": energy_data,
            "hvac": hvac_data,
            "cleaning": cleaning_data,
            "security": security_events,
            "maintenance": work_orders,
            "assets": self.state.assets,  # Varlık listesini de döndürelim
        }
