import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

// Para Birimi Formatı (₺)
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2
    }).format(value);
};

// Sayı Formatı (Binlik ayraçlı)
export const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('tr-TR').format(value);
};

// Saat Formatı (Sadece Saat ve Dakika: 14:30)
export const formatTime = (isoString: string): string => {
    try {
        return format(parseISO(isoString), 'HH:mm');
    } catch {
        return '--:--';
    }
};

// Tarih Formatı (Uzun: 9 Ocak Cuma)
export const formatDateFull = (isoString: string): string => {
    try {
        return format(parseISO(isoString), 'd MMMM EEEE', { locale: tr });
    } catch {
        return 'Tarih Yok';
    }
};

// Zone (Bölge) İsimlerini Türkçeleştirme
export const formatZoneName = (zoneKey: string): string => {
    const zoneMap: Record<string, string> = {
        "All": "Tüm AVM",
        "FoodCourt": "Yemek Katı",
        "MainEntrance": "Ana Giriş",
        "Cinema": "Sinema",
        "RetailCorridor": "Mağaza Koridoru",
        "Parking": "Otopark",
        "Terrace": "Teras",
        // Simülasyon verisi için
        "Tüm Bina (Simülasyon)": "Tüm Bina (Simülasyon)",
        "Ortalama": "Ortalama Değer"
    };

    return zoneMap[zoneKey] || zoneKey; // Listede yoksa orijinalini göster
};