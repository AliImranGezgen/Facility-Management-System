import { useSimulation } from '../../context/SimulationContext';
import { RefreshCw, Play } from 'lucide-react';

export const SimulationControls = () => {
    const { params, updateParams, resetParams, isSimulating } = useSimulation();

    if (!isSimulating) return null;

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="bg-brand-blue/10 p-4 rounded-lg border border-brand-blue/20">
                <h4 className="text-brand-blue font-semibold flex items-center">
                    <Play size={18} className="mr-2" />
                    Senaryo Modu Aktif
                </h4>
                <p className="text-xs text-brand-blue/80 mt-1">
                    Gerçek zamanlı veriler kesildi. Şu an yapay zeka tarafından üretilen sanal bir senaryoyu izliyorsun.
                </p>
            </div>

            {/* Kontrol 1: Sıcaklık */}
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-400">Termostat Sapması</label>
                    <span className="text-sm font-bold text-white">
                        {params.tempOffset > 0 ? '+' : ''}{params.tempOffset}°C
                    </span>
                </div>
                <input 
                    type="range" 
                    min="-5" max="5" step="0.5"
                    value={params.tempOffset}
                    onChange={(e) => updateParams({ tempOffset: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Soğuk (-5)</span>
                    <span>Sıcak (+5)</span>
                </div>
            </div>

            {/* Kontrol 2: Kalabalık */}
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-400">Ziyaretçi Yoğunluğu</label>
                    <span className="text-sm font-bold text-white">
                        x{params.occupancyMultiplier.toFixed(1)}
                    </span>
                </div>
                <input 
                    type="range" 
                    min="0.5" max="3.0" step="0.1"
                    value={params.occupancyMultiplier}
                    onChange={(e) => updateParams({ occupancyMultiplier: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-green"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Tenha</span>
                    <span>Kaos</span>
                </div>
            </div>

            {/* Sıfırla Butonu */}
            <button 
                onClick={resetParams}
                className="w-full py-2 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-white bg-dark-card border border-dark-border hover:bg-dark-border rounded-lg transition-colors"
            >
                <RefreshCw size={16} className="mr-2" />
                Varsayılana Dön
            </button>
        </div>
    );
};