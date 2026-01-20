import { Card } from './Card';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral'; 
    alert?: boolean;
}

export const StatCard = ({ title, value, subValue, icon: Icon, alert = false }: StatCardProps) => {
    return (
        <Card className={`relative overflow-hidden transition-all ${alert ? 'border-red-500/50 bg-red-500/5' : ''}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <h4 className="text-2xl font-bold text-white mt-2">{value}</h4>
                    {subValue && (
                        <p className="text-xs text-gray-500 mt-1">{subValue}</p>
                    )}
                </div>
                
                <div className={`p-3 rounded-lg ${alert ? 'bg-red-500/20 text-red-400' : 'bg-dark-bg text-brand-blue'}`}>
                    <Icon size={24} />
                </div>
            </div>
        </Card>
    );
};