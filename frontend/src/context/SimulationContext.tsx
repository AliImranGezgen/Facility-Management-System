import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Simülasyon Parametreleri
interface SimulationParams {
    tempOffset: number;       // Sıcaklık değişimi (Örn: +1.5 derece)
    occupancyMultiplier: number; // Kalabalık çarpanı (Örn: 1.2 = %20 daha kalabalık)
    utilityCostMultiplier: number; // Enerji birim fiyat değişimi
}

interface SimulationContextType {
    isSimulating: boolean;    // Mod açık mı?
    toggleSimulation: () => void;
    params: SimulationParams;
    updateParams: (newParams: Partial<SimulationParams>) => void;
    resetParams: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
    const [isSimulating, setIsSimulating] = useState(false);
    
    // Varsayılan değerler (Etkisiz elemanlar)
    const defaultParams: SimulationParams = {
        tempOffset: 0,
        occupancyMultiplier: 1.0,
        utilityCostMultiplier: 1.0
    };

    const [params, setParams] = useState<SimulationParams>(defaultParams);

    const toggleSimulation = () => setIsSimulating(prev => !prev);

    const updateParams = (newParams: Partial<SimulationParams>) => {
        setParams(prev => ({ ...prev, ...newParams }));
    };

    const resetParams = () => setParams(defaultParams);

    return (
        <SimulationContext.Provider value={{ 
            isSimulating, 
            toggleSimulation, 
            params, 
            updateParams, 
            resetParams 
        }}>
            {children}
        </SimulationContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSimulation = () => {
    const context = useContext(SimulationContext);
    if (!context) {
        throw new Error('useSimulation must be used within a SimulationProvider');
    }
    return context;
};