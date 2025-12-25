import Link from 'next/link'
import { ArrowLeft, Home, Compass } from 'lucide-react'

export default function NotFound() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <div className="relative isolate overflow-hidden py-20 sm:py-28">
                <div className="absolute inset-0 opacity-80" aria-hidden="true">
                    <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-200/60 to-cyan-200/60 blur-3xl" />
                    <div className="absolute right-[-80px] top-24 h-80 w-80 rounded-full bg-gradient-to-br from-amber-200/70 via-rose-200/60 to-purple-200/60 blur-3xl" />
                </div>

                <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-10 px-6 sm:px-10">
                    <div className="flex flex-wrap items-center gap-3 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 shadow-lg shadow-emerald-200/60">
                        <Compass className="h-4 w-4" />
                        Page not found
                    </div>

                    <div className="space-y-6">
                        <p className="text-6xl font-black leading-none text-slate-900 sm:text-7xl">404</p>
                        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">This plate is empty.</h1>
                        <p className="max-w-2xl text-lg text-slate-600">
                            We couldn&apos;t find the page you were looking for. Let&apos;s get you back to the menu—either the
                            home page or your dashboard.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm font-semibold">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-white shadow-lg shadow-emerald-300/70 transition hover:translate-y-0.5 hover:bg-emerald-400"
                        >
                            <Home className="h-4 w-4" />
                            Back to Home
                        </Link>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Open Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
