import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-green-50">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
                <div className="text-center">
                    {/* Logo & Branding */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-white rounded-3xl p-8 shadow-2xl ring-1 ring-primary-100">
                            <span className="text-7xl">🍽️</span>
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
                        Zero<span className="text-primary-600">Plate</span>
                    </h1>

                    <p className="text-2xl md:text-3xl text-gray-600 mb-4 font-medium max-w-3xl mx-auto leading-relaxed">
                        Reducing food waste, one meal at a time
                    </p>

                    <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
                        AI-powered insights to help mess halls reduce waste by up to 40%
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
                        <Link
                            href="/feedback"
                            className="btn-primary text-lg px-10 py-5"
                        >
                            🎯 Give Feedback
                        </Link>
                        <Link
                            href="/dashboard"
                            className="btn-secondary text-lg px-10 py-5"
                        >
                            📊 Admin Dashboard
                        </Link>
                    </div>
                </div>

                {/* Problem & Solution Section */}
                <div className="mt-24 grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Problem */}
                    <div className="card p-10 border-2 border-gray-100">
                        <div className="text-5xl mb-6">⚠️</div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-5">The Problem</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Mess halls waste tons of food daily due to poor demand forecasting,
                            lack of student feedback, and no data-driven insights on meal preferences.
                            This leads to environmental harm and resource inefficiency.
                        </p>
                    </div>

                    {/* Solution */}
                    <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-shadow text-white border-2 border-primary-500">
                        <div className="text-5xl mb-6">✨</div>
                        <h2 className="text-3xl font-bold mb-5">Our Solution</h2>
                        <p className="leading-relaxed text-lg opacity-95">
                            ZeroPlate uses AI-powered analytics to collect real-time student feedback,
                            analyze meal preferences, and provide actionable insights to mess admins.
                            Reduce waste by up to 40% with data-driven decision making.
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-24">
                    <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Why ZeroPlate?</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon="📊"
                            title="Real-time Analytics"
                            description="Track ratings, sentiment, and waste patterns instantly"
                        />
                        <FeatureCard
                            icon="🤖"
                            title="AI Insights"
                            description="Get smart recommendations powered by Gemini AI"
                        />
                        <FeatureCard
                            icon="📱"
                            title="Easy Feedback"
                            description="Students submit feedback in seconds with emoji ratings"
                        />
                        <FeatureCard
                            icon="📉"
                            title="Waste Reduction"
                            description="Optimize portions based on actual consumption data"
                        />
                        <FeatureCard
                            icon="💰"
                            title="Cost Savings"
                            description="Reduce food costs by eliminating overproduction"
                        />
                        <FeatureCard
                            icon="🌱"
                            title="Sustainability"
                            description="Contribute to environmental conservation efforts"
                        />
                    </div>
                </div>

                {/* Team Section */}
                <div className="mt-24 text-center">
                    <div className="inline-block card px-12 py-8 border-2 border-primary-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Built by A² Labs</h3>
                        <p className="text-xl text-primary-600 font-semibold">Aksh & Aditi</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="card p-8 border border-gray-100 group hover:border-primary-200 transition-all">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    )
}
