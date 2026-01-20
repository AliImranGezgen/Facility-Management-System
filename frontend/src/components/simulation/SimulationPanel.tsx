import { useSimulation } from '../../context/SimulationContext';
import { SimulationControls } from './SimulationControls';
import { X } from 'lucide-react';

export const SimulationPanel = () => {
    const { isSimulating, toggleSimulation } = useSimulation();

    return (
        <div 
            className={`fixed right-0 top-16 bottom-0 w-80 bg-dark-card border-l border-dark-border shadow-2xl transform transition-transform duration-300 ease-in-out z-30 ${
                isSimulating ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <div className="p-6 h-full overflow-y-auto">
                {/* Kapat Butonu */}
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-white">Simülasyon Ayarları</h3>
                    <button onClick={toggleSimulation} className="text-gray-500 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Kontroller */}
                <SimulationControls />

                {/* Bilgi Notu */}
                <div className="mt-8 pt-6 border-t border-dark-border">
                    <h5 className="text-sm font-semibold text-gray-300 mb-2">Nasıl Çalışır?</h5>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Değerleri değiştirdiğinizde, Python Backend'deki "Digital Twin" motoru yeni senaryoyu hesaplar ve grafikleri (Enerji, CO2, Sıcaklık) anlık olarak günceller.
                    </p>
                </div>
            </div>
        </div>
    );
};