const AI_SUGGESTIONS = [
    {
        id: 1,
        priority: 'high',
        suggestion: 'Reduce rice quantity by 15% based on consistent leftover patterns',
        impact: 'Could save ~5kg daily'
    },
    {
        id: 2,
        priority: 'medium',
        suggestion: 'Replace dal tadka with dal makhani on Thursdays (higher ratings)',
        impact: 'Improve satisfaction by 20%'
    },
    {
        id: 3,
        priority: 'high',
        suggestion: 'Introduce portion size options for heavy eaters vs light eaters',
        impact: 'Reduce waste by 25%'
    },
    {
        id: 4,
        priority: 'low',
        suggestion: 'Add more variety in breakfast menu based on feedback',
        impact: 'Boost morning attendance'
    },
]

export default function AIInsights() {
    return (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
                <div className="bg-purple-600 rounded-lg p-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Insights</h3>
                    <p className="text-sm text-gray-600">Powered by Gemini AI</p>
                </div>
            </div>

            <div className="space-y-3">
                {AI_SUGGESTIONS.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-lg p-4 border-l-4 hover:shadow-md transition-shadow"
                        style={{
                            borderLeftColor:
                                item.priority === 'high' ? '#ef4444' :
                                    item.priority === 'medium' ? '#f59e0b' :
                                        '#3b82f6'
                        }}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-gray-900 font-medium mb-1">{item.suggestion}</p>
                                <p className="text-sm text-gray-500">💡 {item.impact}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-blue-100 text-blue-700'
                                }`}>
                                {item.priority.toUpperCase()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                <p className="text-sm text-purple-900">
                    <strong>Note:</strong> These insights are generated based on feedback patterns and can be enhanced with real-time Gemini AI API integration.
                </p>
            </div>
        </div>
    )
}
