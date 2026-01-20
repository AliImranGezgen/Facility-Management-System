// --- Enerji ---
export interface EnergyPoint {
    ts: string;
    zone: string;
    kwh: number;
    tariff: number;
    cost: number;
}

// --- HVAC ---
export interface HvacPoint {
    ts: string;
    zone: string;
    temp_c: number;
    humidity: number;
    co2_ppm: number;
}

// --- Güvenlik ---
export type SecurityEventType = "DoorForced" | "CameraOffline" | "FirePanel" | "CrowdRisk" | "UnauthorizedAccess";
export type SecuritySeverity = 1 | 2 | 3 | 4 | 5;

export interface SecurityEvent {
    id: string;
    ts: string;
    zone: string;
    type: SecurityEventType;
    severity: SecuritySeverity;
    status: "Open" | "Acknowledged" | "Resolved";
    description: string;
}

// --- Bakım ve Varlıklar (GÜNCELLENDİ) ---
export interface Asset {
    id: string;
    name: string;
    type: "Escalator" | "Chiller" | "AHU" | "Elevator" | "Camera" | "Generator";
    zone: string;
    status: "Operational" | "Maintenance" | "Failed"; // Cihaz durumu
    health_score: number; // %0 - %100 arası sağlık
    last_maintenance: string;
    next_maintenance: string;
    maintenance_type: "Preventive" | "Reactive"; // Bakım tipi
}

export interface WorkOrder {
    id: string;
    asset_id: string;
    zone: string;
    ts_opened: string;
    issue: string;
    priority: "Low" | "Med" | "High" | "Critical";
    status: "Open" | "InProgress" | "Done";
    eta_min: number;
    type: "Reactive" | "Preventive"; // İş emri tipi
}

// --- TİCARİ VE OPERASYONEL (YENİ) ---
export interface CommercialStats {
    occupancy_rate: number; // % Doluluk
    total_leasable_area: number; // m2
    rent_collection_rate: number; // % Tahsilat
    total_stores: number;
    open_stores: number;
}

export interface VisitorStats {
    daily_total: number;
    current_inside: number;
    peak_hour_value: number;
}

// --- Personel / Temizlik ---
export interface CleaningNeed {
    ts: string;
    zone: string;
    footfall: number;
    cleanliness_score: number;
}

// --- API Yanıt Yapısı ---
export interface DashboardData {
    energy: EnergyPoint[];
    hvac: HvacPoint[];
    cleaning: CleaningNeed[];
    security: SecurityEvent[];
    maintenance: WorkOrder[];
    assets: Asset[]; // Artık asset listesini de taşıyoruz
    commercial: CommercialStats; // Yeni ticari veriler
    visitors: VisitorStats; // Yeni ziyaretçi verileri
}