'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ratings Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="day"
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        domain={[0, 4]}
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="rating"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ fill: '#22c55e', r: 5 }}
                        activeDot={{ r: 7 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
