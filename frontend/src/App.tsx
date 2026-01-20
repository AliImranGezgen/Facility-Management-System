import { useEffect, useState, useCallback } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { KPIGrid } from './components/dashboard/KPIGrid';
import { EnergyChart } from './components/dashboard/EnergyChart';
import { HvacSection } from './components/dashboard/HvacSection';
import { OperationsTabs } from './components/dashboard/OperationsTabs';
import { SimulationPanel } from './components/simulation/SimulationPanel';

import { getDashboardData, runSimulation } from './api/client';
import type { DashboardData, SecurityEvent, WorkOrder, Asset, CommercialStats, VisitorStats, HvacPoint } from './types';
import { useZone } from './context/ZoneContext';
import { useSimulation } from './context/SimulationContext';

// --- DEMO AJANI: SABİT VERİ ÜRETİCİSİ ---
const injectDemoAlerts = (realData: DashboardData, tempOffset: number): DashboardData => {
  
  // 1. HVAC VERİSİNİ SIFIRDAN OLUŞTUR
  const fixedZones = ['FoodCourt', 'MainEntrance', 'Cinema', 'RetailCorridor'];
  
  const generatedHvac: HvacPoint[] = fixedZones.map(zone => {
    const isFireZone = zone === 'FoodCourt'; 
    
    // A) SICAKLIK: Sabit 24 + Simülasyon Ayarı + (Yangınsa +6 derece)
    let finalTemp = 24 + tempOffset;
    if (isFireZone) finalTemp += 6; 

    // B) HAVA KALİTESİ: Yangınsa 2200, değilse 400
    const finalCo2 = isFireZone ? 2200 : 400; 

    return {
        ts: new Date().toISOString(),
        zone: zone,
        temp_c: finalTemp,
        co2_ppm: finalCo2,
        humidity: isFireZone ? 30 : 45
    };
  });

  // 2. DİĞER DEMO VERİLERİ
  const demoAssets: Asset[] = [
    { id: 'AHU-01', name: 'Ana Klima Santrali', type: 'AHU', zone: 'FoodCourt', status: 'Operational', health_score: 92, last_maintenance: '2025-11-15', next_maintenance: '2026-05-15', maintenance_type: 'Preventive' },
    { id: 'ESC-04', name: 'Yürüyen Merdiven #4', type: 'Escalator', zone: 'MainEntrance', status: 'Failed', health_score: 12, last_maintenance: '2025-12-20', next_maintenance: '2026-01-10', maintenance_type: 'Reactive' },
    { id: 'ELV-02', name: 'Müşteri Asansörü B', type: 'Elevator', zone: 'Cinema', status: 'Maintenance', health_score: 58, last_maintenance: '2025-10-05', next_maintenance: '2026-01-12', maintenance_type: 'Reactive' },
    { id: 'GEN-02', name: 'Jeneratör B Blok', type: 'Generator', zone: 'Parking', status: 'Operational', health_score: 98, last_maintenance: '2026-01-05', next_maintenance: '2026-07-05', maintenance_type: 'Preventive' },
    { id: 'CHL-01', name: 'Ana Chiller Grubu', type: 'Chiller', zone: 'Terrace', status: 'Operational', health_score: 78, last_maintenance: '2025-08-20', next_maintenance: '2026-02-20', maintenance_type: 'Preventive' },
    { id: 'CAM-12', name: 'Koridor Kamerası', type: 'Camera', zone: 'RetailCorridor', status: 'Maintenance', health_score: 45, last_maintenance: '2025-09-10', next_maintenance: '2026-02-10', maintenance_type: 'Preventive' },
  ];

  const demoSecurity: SecurityEvent[] = [
    { id: `sec-01-${Date.now()}`, ts: new Date().toISOString(), zone: 'FoodCourt', type: 'FirePanel', severity: 5, status: 'Open', description: 'Duman sensörü tetiklendi (Yüksek Isı & CO2 Artışı)' },
    { id: `sec-02-${Date.now()}`, ts: new Date(Date.now() - 1000 * 60 * 5).toISOString(), zone: 'Parking', type: 'UnauthorizedAccess', severity: 4, status: 'Open', description: 'B-Blok Personel Kapısı zorlandı' },
    { id: `sec-03-${Date.now()}`, ts: new Date(Date.now() - 1000 * 60 * 25).toISOString(), zone: 'MainEntrance', type: 'CrowdRisk', severity: 3, status: 'Acknowledged', description: 'Giriş yoğunluğu kapasite limitinde (%95)' }
  ];

  const demoMaintenance: WorkOrder[] = [
    { id: `wo-01-${Date.now()}`, asset_id: 'ESC-04', zone: 'MainEntrance', ts_opened: new Date(Date.now() - 1000 * 60 * 15).toISOString(), issue: 'Yürüyen Merdiven Acil Stop (Motor Arızası)', priority: 'Critical', status: 'InProgress', eta_min: 10, type: 'Reactive' },
    { id: `wo-02-${Date.now()}`, asset_id: 'ELV-02', zone: 'Cinema', ts_opened: new Date(Date.now() - 1000 * 60 * 120).toISOString(), issue: 'Kapı kapanma sensörü arızası', priority: 'High', status: 'Open', eta_min: 45, type: 'Reactive' },
    { id: `wo-03-${Date.now()}`, asset_id: 'AHU-01', zone: 'FoodCourt', ts_opened: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), issue: 'Periyodik filtre değişimi', priority: 'Low', status: 'Open', eta_min: 0, type: 'Preventive' }
  ];

  const demoCommercial: CommercialStats = {
    occupancy_rate: 94.5,
    total_leasable_area: 45000,
    rent_collection_rate: 88.2,
    total_stores: 150,
    open_stores: 142
  };

  const hour = new Date().getHours();
  const baseVisitor = (hour > 11 && hour < 20) ? 2500 : 800;
  const demoVisitors: VisitorStats = {
    current_inside: baseVisitor + Math.floor(Math.random() * 200),
    daily_total: 12500 + (hour * 1500),
    peak_hour_value: 4800
  };

  return {
    ...realData,
    hvac: generatedHvac, 
    security: [...demoSecurity, ...(realData.security || [])],
    maintenance: [...demoMaintenance, ...(realData.maintenance || [])],
    assets: demoAssets,
    commercial: demoCommercial,
    visitors: demoVisitors
  };
};

// --- ÇEVİRMEN FONKSİYON ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformSimulationData = (raw: any): DashboardData => {
  if (raw.energy && Array.isArray(raw.energy)) return raw as DashboardData;

  const forecast = raw.forecast || raw; 
  
  if (!forecast.timestamps || !forecast.energy_trend) {
    return { energy: [], hvac: [], security: [], maintenance: [], cleaning: [], assets: [], commercial: {} as CommercialStats, visitors: {} as VisitorStats };
  }

  const timestamps = forecast.timestamps;
  const energyData = forecast.energy_trend;
  
  const energy = timestamps.map((ts: string, i: number) => ({
    ts: ts,
    zone: 'Tüm Bina (Simülasyon)',
    kwh: energyData[i] || 0,
    tariff: 0, 
    cost: (energyData[i] || 0) * 3.5
  }));

  return {
    energy,
    hvac: [], 
    security: [],   
    maintenance: [], 
    cleaning: [],
    assets: [],
    commercial: {} as CommercialStats,
    visitors: {} as VisitorStats
  };
};

function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { selectedZone } = useZone();
  const { isSimulating, params } = useSimulation();

  const fetchData = useCallback(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let rawResponse: any;

      if (isSimulating) {
        rawResponse = await runSimulation(24);
      } else {
        const res = await getDashboardData();
        rawResponse = res.data;
      }

      let processedData = transformSimulationData(rawResponse);
      
      // HATA DÜZELTİLDİ: temp_offset -> tempOffset olarak güncellendi.
      processedData = injectDemoAlerts(processedData, params.tempOffset);

      if (!isSimulating && selectedZone !== 'All') {
        const filteredEnergy = processedData.energy.filter(item => item.zone === selectedZone);
        
        setData({
          ...processedData,
          energy: filteredEnergy,
        });
      } else {
        setData(processedData);
      }
      
    } catch (error) {
      console.error("Veri İşleme Hatası:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedZone, isSimulating, params]); 

  useEffect(() => {
    setLoading(true);
    fetchData(); 

    const interval = setInterval(() => {
      if (!isSimulating) {
        fetchData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchData, isSimulating]); 

  return (
    <MainLayout>
      <SimulationPanel />

      {loading && !data ? (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-brand-blue animate-pulse">
              {isSimulating ? 'Yapay Zeka Senaryosu Hazırlanıyor...' : 'Sistem Verileri Yükleniyor...'}
          </div>
        </div>
      ) : data ? (
        <div className="animate-fade-in space-y-6">
          <KPIGrid data={data} />
          
          <div className="w-full h-[320px] bg-dark-card rounded-xl border border-dark-border p-4">
             <EnergyChart data={data.energy} />
          </div>
          
          <div className="w-full">
            <HvacSection data={data.hvac} />
          </div>

          <OperationsTabs data={data} />
        </div>
      ) : (
        <div className="text-center text-red-500 mt-10">
            Veri yüklenemedi.
        </div>
      )}
    </MainLayout>
  );
}

export default App;