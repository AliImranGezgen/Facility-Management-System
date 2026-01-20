import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../common/Card';
import type { EnergyPoint } from '../../types';
import { formatTime } from '../../utils/formatters';

interface EnergyChartProps {
    data: EnergyPoint[];
}

export const EnergyChart = ({ data }: EnergyChartProps) => {
    return (
        <Card title="Enerji Tüketim Trendi (Saatlik)">
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis 
                            dataKey="ts" 
                            tickFormatter={formatTime} 
                            stroke="#94a3b8" 
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                            stroke="#94a3b8" 
                            tick={{ fontSize: 12 }}
                            unit=" kWh" // Eksen birimi
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                            itemStyle={{ color: '#3b82f6' }}
                            labelFormatter={(label) => `Saat: ${formatTime(label)}`}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="kwh" 
                            name="Tüketim" // Tooltip'te görünecek isim
                            unit=" kWh"   // Tooltip'te görünecek birim
                            stroke="#3b82f6" 
                            fillOpacity={1} 
                            fill="url(#colorKwh)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};