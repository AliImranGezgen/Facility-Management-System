import { Bell, Search } from 'lucide-react';
import { useZone } from '../../context/ZoneContext';
import { useSimulation } from '../../context/SimulationContext';
import { Toggle } from '../common/Toggle';
import { formatZoneName } from '../../utils/formatters'; // Yeni eklediğimiz fonksiyonu çağırdık

export const Header = () => {
    const { selectedZone, setSelectedZone, availableZones } = useZone();
    const { isSimulating, toggleSimulation } = useSimulation();

    return (
        <header className="h-16 bg-dark-card border-b border-dark-border flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
            
            {/* Sol: Arama ve Alan Seçimi */}
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Varlık veya Alan ara..." 
                        className="bg-dark-bg border border-dark-border text-gray-300 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-brand-blue w-64 placeholder-gray-500"
                    />
                </div>

                {/* Alan Seçici (Dropdown) */}
                <div className="relative">
                    <select 
                        value={selectedZone}
                        onChange={(e) => setSelectedZone(e.target.value)}
                        className="bg-dark-bg border border-dark-border text-gray-300 text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-brand-blue cursor-pointer appearance-none min-w-[140px]"
                    >
                        {availableZones.map(zone => (
                            <option key={zone} value={zone}>
                                {formatZoneName(zone)}
                            </option>
                        ))}
                    </select>
                    {/* Dropdown oku (İsteğe bağlı görsel iyileştirme) */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
                        ▼
                    </div>
                </div>
            </div>

            {/* Sağ: Simülasyon ve Bildirimler */}
            <div className="flex items-center space-x-6">
                
                {/* Simülasyon Toggle */}
                <div className={`px-4 py-1.5 rounded-lg border ${isSimulating ? 'border-brand-blue/30 bg-brand-blue/5' : 'border-transparent'}`}>
                    <Toggle 
                        label={isSimulating ? "Simülasyon Modu" : "Canlı İzleme"} 
                        checked={isSimulating} 
                        onChange={toggleSimulation} 
                    />
                </div>

                {/* Bildirim İkonu */}
                <button className="relative text-gray-400 hover:text-white transition-colors">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                </button>
            </div>
        </header>
    );
};