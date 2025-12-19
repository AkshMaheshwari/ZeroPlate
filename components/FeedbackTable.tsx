const EMOJI_MAP: { [key: number]: string } = {
    4: '😄',
    3: '🙂',
    2: '😐',
    1: '😞'
}

const SENTIMENT_COLORS: { [key: string]: string } = {
    positive: 'bg-green-100 text-green-800',
    neutral: 'bg-yellow-100 text-yellow-800',
    negative: 'bg-red-100 text-red-800'
}

export default function FeedbackTable({
    feedbackData,
    loading
}: {
    feedbackData: any[]
    loading: boolean
}) {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8">
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // If no data from Firebase, show mock data
    const displayData = feedbackData.length > 0 ? feedbackData : MOCK_FEEDBACK

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Recent Feedback</h3>
                <p className="text-sm text-gray-600 mt-1">Latest student submissions</p>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dish</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voice</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {displayData.map((feedback, index) => (
                            <tr key={feedback.id || index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {feedback.timestamp ? formatTime(feedback.timestamp) : feedback.time}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {feedback.mealType}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {feedback.dishName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-2xl">
                                    {EMOJI_MAP[feedback.rating]}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${SENTIMENT_COLORS[feedback.sentiment]}`}>
                                        {feedback.sentiment}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {feedback.hasVoiceNote ? '🎤' : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
                {displayData.map((feedback, index) => (
                    <div key={feedback.id || index} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">{feedback.mealType}</span>
                            <span className="text-2xl">{EMOJI_MAP[feedback.rating]}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{feedback.dishName}</p>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">
                                {feedback.timestamp ? formatTime(feedback.timestamp) : feedback.time}
                            </span>
                            <span className={`px-2 py-1 rounded-full ${SENTIMENT_COLORS[feedback.sentiment]}`}>
                                {feedback.sentiment}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {displayData.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    <p>No feedback submitted yet. Students can share their opinions on the Feedback page!</p>
                </div>
            )}
        </div>
    )
}

function formatTime(timestamp: any): string {
    if (!timestamp) return '-'

    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    } catch {
        return '-'
    }
}

// Mock data for when Firebase is not connected
const MOCK_FEEDBACK = [
    { id: '1', time: '12:30 PM', mealType: 'Lunch', dishName: 'Paneer Butter Masala', rating: 4, sentiment: 'positive', hasVoiceNote: false },
    { id: '2', time: '12:25 PM', mealType: 'Lunch', dishName: 'Dal Tadka', rating: 3, sentiment: 'positive', hasVoiceNote: true },
    { id: '3', time: '12:20 PM', mealType: 'Lunch', dishName: 'Jeera Rice', rating: 2, sentiment: 'neutral', hasVoiceNote: false },
    { id: '4', time: '09:15 AM', mealType: 'Breakfast', dishName: 'Aloo Paratha', rating: 4, sentiment: 'positive', hasVoiceNote: false },
    { id: '5', time: '09:10 AM', mealType: 'Breakfast', dishName: 'Poha', rating: 1, sentiment: 'negative', hasVoiceNote: true },
    { id: '6', time: '09:05 AM', mealType: 'Breakfast', dishName: 'Upma', rating: 2, sentiment: 'neutral', hasVoiceNote: false },
    { id: '7', time: '08:50 AM', mealType: 'Breakfast', dishName: 'Idli Sambhar', rating: 3, sentiment: 'positive', hasVoiceNote: false },
]
