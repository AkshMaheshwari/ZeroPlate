export default function OverviewCards({
    avgRating,
    sentimentDist,
    estimatedWaste
}: {
    avgRating: number
    sentimentDist: { positive: number; neutral: number; negative: number }
    estimatedWaste: number
}) {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Average Rating Card */}
            <div className="card p-8 border-2 border-gray-100">
                <div className="flex items-start justify-between mb-6">
                    <div className="bg-primary-100 rounded-2xl p-4">
                        <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Average Rating</p>
                    <p className="text-5xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                    <p className="text-base text-gray-600 mt-2">out of 4.0</p>
                </div>
            </div>

            {/* Sentiment Distribution Card */}
            <div className="card p-8 border-2 border-gray-100">
                <div className="flex items-start justify-between mb-6">
                    <div className="bg-blue-100 rounded-2xl p-4">
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Sentiment Distribution</p>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-base text-gray-700 font-medium">😄 Positive</span>
                            <span className="text-2xl font-bold text-green-600">{sentimentDist.positive}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-base text-gray-700 font-medium">😐 Neutral</span>
                            <span className="text-2xl font-bold text-yellow-600">{sentimentDist.neutral}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-base text-gray-700 font-medium">😞 Negative</span>
                            <span className="text-2xl font-bold text-red-600">{sentimentDist.negative}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estimated Food Waste Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow text-white border-2 border-red-400">
                <div className="flex items-start justify-between mb-6">
                    <div className="bg-white bg-opacity-25 rounded-2xl p-4">
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide mb-2 opacity-95">Estimated Food Waste</p>
                    <p className="text-5xl font-bold">{estimatedWaste}</p>
                    <p className="text-lg mt-2 opacity-95">kg today</p>
                </div>
            </div>
        </div>
    )
}
