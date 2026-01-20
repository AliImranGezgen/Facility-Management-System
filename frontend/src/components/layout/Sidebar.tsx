import { LayoutDashboard, Activity, Settings, Zap, Thermometer, Users, ShieldAlert, Building2, Store, PieChart } from 'lucide-react';

export const Sidebar = () => {
    
    const menuItems = [
        { icon: LayoutDashboard, label: "Genel Bakış", active: true },
        { icon: Store, label: "Kira & Mağaza Y.", active: false }, // YENİ
        { icon: PieChart, label: "Alan Yönetimi", active: false }, // YENİ
        { icon: Zap, label: "Enerji Yönetimi", active: false },
        { icon: Thermometer, label: "HVAC & Konfor", active: false },
        { icon: Users, label: "Ziyaretçi & Temizlik", active: false }, // İsim güncellendi
        { icon: ShieldAlert, label: "Güvenlik", active: false },
        { icon: Activity, label: "Varlık Sağlığı", active: false },
        { icon: Settings, label: "Ayarlar", active: false },
    ];

    return (
        <aside className="w-64 bg-dark-card border-r border-dark-border h-screen flex flex-col fixed left-0 top-0 z-20 transition-all duration-300">
            {/* --- LOGO ALANI --- */}
            <div className="h-20 flex items-center px-6 border-b border-dark-border bg-dark-bg/50 backdrop-blur-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-blue-700 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-brand-blue/20">
                    <Building2 className="text-white" size={22} />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-white font-bold text-sm tracking-wide leading-tight">
                        TESİS YÖNETİM
                    </h1>
                    <span className="text-brand-blue text-[10px] font-bold tracking-wider uppercase">
                        SİSTEMİ v2.0
                    </span>
                </div>
            </div>

            {/* --- MENÜ --- */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {menuItems.map((item, index) => (
                    <button 
                        key={index}
                        className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                            item.active 
                            ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/10' 
                            : 'text-gray-400 hover:bg-dark-bg hover:text-gray-200 hover:pl-4'
                        }`}
                    >
                        <item.icon 
                            size={20} 
                            className={`mr-3 transition-colors ${item.active ? 'text-brand-blue' : 'text-gray-500 group-hover:text-gray-300'}`} 
                        />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* --- ALT BİLGİ --- */}
            <div className="p-4 border-t border-dark-border bg-dark-bg/30">
                <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-xs text-white font-bold border border-gray-600 shadow-sm">
                        ADM
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">Admin User</p>
                        <p className="text-xs text-gray-500">AVM Müdürü</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};