interface BadgeProps {
    status: string; // Backend'den gelen İngilizce durum
}

export const StatusBadge = ({ status }: BadgeProps) => {
    
    // --- Çeviri Sözlüğü ---
    const translations: Record<string, string> = {
        // Güvenlik
        'Critical': 'Kritik',
        'High': 'Yüksek',
        'Warning': 'Uyarı',
        'Normal': 'Normal',
        'Risk': 'Riskli',
        // İş Emirleri & Alarmlar
        'Open': 'Açık',
        'Resolved': 'Çözüldü',
        'InProgress': 'İşlemde',
        'Done': 'Tamamlandı',
        'Low': 'Düşük',
        'Med': 'Orta',
        // Temizlik
        'NeedsCleaning': 'Temizlik Şart',
        'Clean': 'Temiz'
    };

    // Gelen metni sözlükte ara, bulamazsan olduğu gibi göster
    const label = translations[status] || translations[Object.keys(translations).find(key => status.includes(key)) || ''] || status;

    // --- Renk Belirleme ---
    const getColor = (s: string) => {
        const lower = s.toLowerCase();
        if (lower.includes('critical') || lower.includes('5')) return 'bg-red-500/10 text-red-500 border-red-500/20';
        if (lower.includes('high') || lower.includes('4') || lower.includes('needscleaning')) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        if (lower.includes('warning') || lower.includes('risk') || lower.includes('inprogress')) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        if (lower.includes('done') || lower.includes('resolved') || lower.includes('clean') || lower.includes('normal')) return 'bg-green-500/10 text-green-500 border-green-500/20';
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'; // Varsayılan (Open, Low vb.)
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColor(status)}`}>
            {label}
        </span>
    );
};