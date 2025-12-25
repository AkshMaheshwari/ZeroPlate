'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { TrendingUp } from 'lucide-react'

// Mock data for last 7 days
const data = [
    { day: 'Mon', rating: 3.1 },
    { day: 'Tue', rating: 3.3 },
    { day: 'Wed', rating: 2.9 },
    { day: 'Thu', rating: 3.5 },
    { day: 'Fri', rating: 3.2 },
    { day: 'Sat', rating: 3.4 },
    { day: 'Sun', rating: 3.2 },
]

export default function RatingsChart() {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        Rating Trends
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                        7-Day Performance Metrics
                    </p>
                </div>
                <div className="px-3 py-1 bg-emerald-50 rounded-lg">
                    <span className="text-xs font-bold text-emerald-700">+12% Growth</span>
                </div>
            </div>

            {/* Chart Container */}
            <div className="h-[300px] w-full -ml-4"> {/* Pull left slightly to align YAxis labels */}
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        
                        <CartesianGrid vertical={false} stroke="#f1f5f9" />
                        
                        <XAxis 
                            dataKey="day" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            dy={10}
                        />
                        
                        <YAxis 
                            domain={[0, 4]} 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                        />
                        
                        <Tooltip 
                            cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                borderRadius: '16px',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                padding: '12px'
                            }}
                            itemStyle={{
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: '#0f172a'
                            }}
                        />
                        
                        <Area 
                            type="monotone" 
                            dataKey="rating" 
                            stroke="#10b981" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorRating)"
                            dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}