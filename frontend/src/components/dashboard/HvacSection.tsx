import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Card } from '../common/Card';
import type { HvacPoint } from '../../types';
import { formatZoneName } from '../../utils/formatters';

interface HvacSectionProps {
    data: HvacPoint[];
}

export const HvacSection = ({ data }: HvacSectionProps) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* 1. CO2 Seviyeleri (Bar Grafiği - Renkli) */}
            <Card title="Bölgesel Hava Kalitesi (CO₂ PPM)">
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis 
                                dataKey="zone" 
                                stroke="#94a3b8" 
                                tick={{ fontSize: 10 }}
                                tickFormatter={formatZoneName} 
                            />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                cursor={{ fill: '#334155', opacity: 0.4 }}
                                labelFormatter={(label) => formatZoneName(label)} 
                            />
                            <ReferenceLine y={1000} stroke="#ef4444" strokeDasharray="3 3" label="Sınır" />
                            <Bar 
                                dataKey="co2_ppm" 
                                name="CO₂ Değeri" 
                                radius={[4, 4, 0, 0]} 
                            >
                                {/* ÖZEL RENKLENDİRME: Değer 1000'i geçerse Kırmızı, değilse Yeşil */}
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.co2_ppm > 1000 ? '#ef4444' : '#10b981'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* 2. Sıcaklık Takibi (Çizgi Grafiği) */}
            <Card title="Sıcaklık İzleme (°C)">
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis 
                                dataKey="zone" 
                                stroke="#94a3b8" 
                                tick={{ fontSize: 10 }}
                                tickFormatter={formatZoneName} 
                            />
                            <YAxis domain={[15, 35]} stroke="#94a3b8" unit="°C" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} 
                                labelFormatter={(label) => formatZoneName(label)} 
                            />
                            <Line 
                                type="monotone" 
                                dataKey="temp_c" 
                                name="Sıcaklık"
                                unit="°C"
                                stroke="#f97316" 
                                strokeWidth={2} 
                                dot={{ r: 4 }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};