import { useState } from 'react';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import type { DashboardData } from '../../types';
import { formatTime, formatZoneName } from '../../utils/formatters';
import { Activity, ShieldAlert, Wrench,  } from 'lucide-react';

interface OperationsTabsProps {
    data: DashboardData;
}

type TabType = 'alarms' | 'work_orders' | 'assets' | 'cleaning';

const typeTranslations: Record<string, string> = {
    'DoorForced': 'Kapı Zorlama',
    'CameraOffline': 'Kamera Çevrimdışı',
    'FirePanel': 'Yangın Paneli',
    'CrowdRisk': 'Kalabalık Riski',
    'UnauthorizedAccess': 'Yetkisiz Giriş',
    'Escalator': 'Yürüyen Merdiven',
    'Chiller': 'Soğutma Grubu',
    'AHU': 'Klima Santrali',
    'Elevator': 'Asansör',
    'Camera': 'Kamera Sistemi',
    'Generator': 'Jeneratör'
};

export const OperationsTabs = ({ data }: OperationsTabsProps) => {
    // Varsayılan olarak 'assets' (Varlıklar) sekmesini açalım ki yeni özelliği hemen gör
    const [activeTab, setActiveTab] = useState<TabType>('assets');
    const t = (key: string) => typeTranslations[key] || key;

    // Sağlık Puanına Göre Renk Belirleme
    const getHealthColor = (score: number) => {
        if (score >= 90) return 'bg-green-500';
        if (score >= 70) return 'bg-blue-500';
        if (score >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <Card className="min-h-[400px]">
            {/* --- SEKME BAŞLIKLARI --- */}
            <div className="flex space-x-2 md:space-x-6 border-b border-dark-border mb-4 pb-2 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('assets')}
                    className={`flex items-center pb-2 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'assets' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    <Activity size={16} className="mr-2" />
                    Varlık Sağlığı ({data.assets?.length || 0})
                </button>
                <button 
                    onClick={() => setActiveTab('alarms')}
                    className={`flex items-center pb-2 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'alarms' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    <ShieldAlert size={16} className="mr-2" />
                    Güvenlik ({data.security?.length || 0})
                </button>
                <button 
                    onClick={() => setActiveTab('work_orders')}
                    className={`flex items-center pb-2 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'work_orders' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    <Wrench size={16} className="mr-2" />
                    Bakım İşleri ({data.maintenance?.length || 0})
                </button>
            </div>

            {/* --- TABLO İÇERİĞİ --- */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-dark-bg text-gray-200 uppercase text-xs">
                        <tr>
                            {activeTab === 'assets' ? (
                                <>
                                    <th className="px-4 py-3 rounded-l-lg">Cihaz Adı</th>
                                    <th className="px-4 py-3">Tip & Bölge</th>
                                    <th className="px-4 py-3">Sağlık Durumu</th>
                                    <th className="px-4 py-3">Bakım</th>
                                    <th className="px-4 py-3 rounded-r-lg text-right">Durum</th>
                                </>
                            ) : (
                                <>
                                    <th className="px-4 py-3 rounded-l-lg">Zaman</th>
                                    <th className="px-4 py-3">Bölge</th>
                                    <th className="px-4 py-3">Detay / Sorun</th>
                                    <th className="px-4 py-3 rounded-r-lg text-right">Durum</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border">
                        
                        {/* 1. VARLIK SAĞLIĞI TABLOSU (YENİ) */}
                        {activeTab === 'assets' && data.assets?.map((item) => (
                            <tr key={item.id} className="hover:bg-dark-bg/50 transition-colors">
                                <td className="px-4 py-3">
                                    <span className="text-white font-medium block">{item.name}</span>
                                    <span className="text-xs text-gray-500">ID: {item.id}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="block text-gray-300">{t(item.type)}</span>
                                    <span className="text-xs text-gray-500">{formatZoneName(item.zone)}</span>
                                </td>
                                <td className="px-4 py-3 min-w-[140px]">
                                    <div className="flex items-center">
                                        <div className="flex-1 bg-gray-700 rounded-full h-2 mr-3">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-500 ${getHealthColor(item.health_score)}`} 
                                                style={{ width: `${item.health_score}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-xs font-bold ${item.health_score < 50 ? 'text-red-500' : 'text-gray-300'}`}>
                                            %{item.health_score}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-xs">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400">Son: {item.last_maintenance}</span>
                                        <span className="text-brand-blue">Planlı: {item.next_maintenance}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <StatusBadge status={item.status} />
                                </td>
                            </tr>
                        ))}

                        {/* 2. GÜVENLİK TABLOSU */}
                        {activeTab === 'alarms' && data.security?.map((item) => (
                            <tr key={item.id} className="hover:bg-dark-bg/50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap">{formatTime(item.ts)}</td>
                                <td className="px-4 py-3 text-white font-medium">{formatZoneName(item.zone)}</td>
                                <td className="px-4 py-3">
                                    <span className="text-gray-300 font-medium">{t(item.type)}</span>
                                    <span className="block text-xs text-gray-500">{item.description}</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <StatusBadge status={item.status} />
                                </td>
                            </tr>
                        ))}

                        {/* 3. BAKIM TABLOSU */}
                        {activeTab === 'work_orders' && data.maintenance?.map((item) => (
                            <tr key={item.id} className="hover:bg-dark-bg/50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap">{formatTime(item.ts_opened)}</td>
                                <td className="px-4 py-3 text-white font-medium">{formatZoneName(item.zone)}</td>
                                <td className="px-4 py-3">
                                    <span className="text-gray-300">{item.issue}</span>
                                    <span className="block text-xs text-gray-500">
                                        Öncelik: <span className="text-gray-300">{t(item.priority)}</span> • Tahmini: {item.eta_min} dk
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <StatusBadge status={item.status} />
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>

                {/* BOŞ DURUM MESAJI */}
                {((activeTab === 'assets' && (!data.assets || data.assets.length === 0)) ||
                  (activeTab === 'alarms' && (!data.security || data.security.length === 0)) ||
                  (activeTab === 'work_orders' && (!data.maintenance || data.maintenance.length === 0))) && (
                    <div className="p-8 text-center text-gray-500">
                        Bu kategoride gösterilecek kayıt bulunamadı.
                    </div>
                )}
            </div>
        </Card>
    );
};