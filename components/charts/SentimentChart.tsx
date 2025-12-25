'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Smile, Meh, Frown } from 'lucide-react'

const COLORS = {
    positive: '#10b981', // Emerald 500
    neutral: '#f59e0b',  // Amber 500
    negative: '#ef4444'  // Red 500
}

export default function SentimentChart({
    sentimentDist
}: {
    sentimentDist: { positive: number; neutral: number; negative: number }
}) {
    const data = [
        { name: 'Positive', value: sentimentDist.positive },
        { name: 'Neutral', value: sentimentDist.neutral },
        { name: 'Negative', value: sentimentDist.negative },
    ]

    const total = data.reduce((acc, curr) => acc + curr.value, 0)

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm h-full flex flex-col">
            {/* Header */}
            <div className="mb-2">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">User Sentiment</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                    Feedback Distribution
                </p>
            </div>

            <div className="flex-grow relative min-h-[300px]">
                {/* Center Label Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total</span>
                    <span className="text-3xl font-black text-slate-900">{total}</span>
                    <span className="text-slate-400 text-[10px] font-bold">Reviews</span>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={8}
                            cornerRadius={40}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} 
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ 
                                borderRadius: '16px', 
                                border: 'none', 
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                            }} 
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Custom Legend Section */}
            <div className="grid grid-cols-3 gap-2 mt-4">
                {data.map((item) => (
                    <div key={item.name} className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-1.5 mb-1">
                            <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: COLORS[item.name.toLowerCase() as keyof typeof COLORS] }}
                            />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                {item.name}
                            </span>
                        </div>
                        <span className="text-sm font-black text-slate-900">
                            {((item.value / total) * 100).toFixed(0)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}