import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Context'in taşıyacağı verilerin tipi
interface ZoneContextType {
    selectedZone: string; // "All", "FoodCourt" vb.
    setSelectedZone: (zone: string) => void;
    availableZones: string[]; // Listelenecek bölgeler
}

// Boş bir context oluşturuyoruz
const ZoneContext = createContext<ZoneContextType | undefined>(undefined);

// Provider Bileşeni (Tüm uygulamayı sarmalayacak)
export const ZoneProvider = ({ children }: { children: ReactNode }) => {
    // Varsayılan olarak "All" (Tüm AVM) seçili
    const [selectedZone, setSelectedZone] = useState<string>('All');
    
    // Sabit Zone Listemiz
    const availableZones = [
        "All",
        "FoodCourt",
        "MainEntrance",
        "Cinema",
        "RetailCorridor"
    ];

    return (
        <ZoneContext.Provider value={{ selectedZone, setSelectedZone, availableZones }}>
            {children}
        </ZoneContext.Provider>
    );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useZone = () => {
    const context = useContext(ZoneContext);
    if (!context) {
        throw new Error('useZone must be used within a ZoneProvider');
    }
    return context;
};