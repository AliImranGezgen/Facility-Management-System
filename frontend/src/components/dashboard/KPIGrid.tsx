import { Zap, Thermometer, Users, Store } from 'lucide-react';
import { Card } from '../common/Card';
import type { DashboardData } from '../../types';

interface KPIGridProps {
    data: DashboardData;
}

export const KPIGrid = ({ data }: KPIGridProps) => {
    
    // Güvenlik: Tüketim Hesapla
    const totalConsumption = data.energy.reduce((acc, curr) => acc + curr.kwh, 0);
    const cost = totalConsumption * 3.5; 

    // Konfor: Ortalama Sıcaklık
    const avgTemp = data.hvac.length > 0 
        ? data.hvac.reduce((acc, curr) => acc + curr.temp_c, 0) / data.hvac.length 
        : 0;

    // Ziyaretçi (Yeni Veri)
    const visitorCount = data.visitors?.current_inside || 1240; // Fallback
    const visitorDaily = data.visitors?.daily_total || 45000;

    // Doluluk (Yeni Veri)
    const occupancy = data.commercial?.occupancy_rate || 94;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Enerji Kartı */}
            <Card className="relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={60} className="text-brand-blue" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Toplam Tüketim</p>
                    <h3 className="text-2xl font-bold text-white mb-1">
                        {totalConsumption.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} kWh
                    </h3>
                    <p className="text-xs text-gray-500">Maliyet: ₺{cost.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</p>
                </div>
            </Card>

            {/* 2. Ziyaretçi Kartı (YENİ) */}
            <Card className="relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Users size={60} className="text-purple-500" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Anlık Ziyaretçi</p>
                    <h3 className="text-2xl font-bold text-white mb-1">
                        {visitorCount.toLocaleString('tr-TR')} Kişi
                    </h3>
                    <p className="text-xs text-green-500">Bugün Toplam: {visitorDaily.toLocaleString('tr-TR')}</p>
                </div>
            </Card>

            {/* 3. Doluluk/Kira Kartı (YENİ) */}
            <Card className="relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Store size={60} className="text-green-500" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Mağaza Doluluk</p>
                    <h3 className="text-2xl font-bold text-white mb-1">
                        %{occupancy}
                    </h3>
                    <p className="text-xs text-gray-500">Aktif Kiracı: 142/150</p>
                </div>
            </Card>

            {/* 4. Sıcaklık Kartı */}
            <Card className="relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Thermometer size={60} className="text-orange-500" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Ortalama Sıcaklık</p>
                    <h3 className="text-2xl font-bold text-white mb-1">
                        {avgTemp.toFixed(1)}°C
                    </h3>
                    <p className="text-xs text-gray-500">Tüm zonların ortalaması</p>
                </div>
            </Card>
        </div>
    );
};