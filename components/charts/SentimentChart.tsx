'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = {
    positive: '#22c55e',
    neutral: '#eab308',
    negative: '#ef4444'
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

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
