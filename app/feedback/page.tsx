'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { onAuthChange } from '@/lib/auth'

interface SpeechRecognitionEvent extends Event {
    results: {
        [key: number]: {
            [key: number]: {
                transcript: string;
            };
        };
    };
}

const EMOJI_RATINGS = [
    { emoji: '😄', label: 'Loved it!', value: 4, sentiment: 'POSITIVE', color: 'border-[#10b981] bg-[#ecfdf5] text-[#059669]' },
    { emoji: '🙂', label: 'Good', value: 3, sentiment: 'POSITIVE', color: 'border-[#10b981] bg-[#ecfdf5] text-[#059669]' },
    { emoji: '😐', label: 'Okay', value: 2, sentiment: 'NEUTRAL', color: 'border-[#94a3b8] bg-[#f8fafc] text-[#475569]' },
    { emoji: '😞', label: 'Poor', value: 1, sentiment: 'NEGATIVE', color: 'border-[#f43f5e] bg-[#fff1f2] text-[#e11d48]' },
]

export default function FeedbackPage() {
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const router = useRouter()

    const [mealType, setMealType] = useState('')
    const [dishName, setDishName] = useState('')
    const [rating, setRating] = useState<number | null>(null)
    const [transcript, setTranscript] = useState('')
    const [isListening, setIsListening] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthChange((user) => {
            if (!user) router.push('/login')
            else { setCurrentUser(user); setLoading(false); }
        })
        return () => unsubscribe()
    }, [router])

    const toggleListening = () => {
        if (typeof window === 'undefined') return;
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        if (!SpeechRecognition) return alert("Please use Chrome.")

        const recognition = new SpeechRecognition()
        recognition.onstart = () => setIsListening(true)
        recognition.onend = () => setIsListening(false)
        recognition.onresult = (event: SpeechRecognitionEvent) => setTranscript(event.results[0][0].transcript)
        
        isListening ? recognition.stop() : recognition.start()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!mealType || !dishName || rating === null) return
        setIsSubmitting(true)
        try {
            const selectedRating = EMOJI_RATINGS.find(r => r.value === rating);
            await addDoc(collection(db, 'feedback'), {
                uid: currentUser?.uid,
                email: currentUser?.email,
                mealType, dishName, rating, transcript,
                sentiment: selectedRating?.sentiment,
                timestamp: serverTimestamp(),
            })
            setMealType(''); setDishName(''); setRating(null); setTranscript('');
            alert("Sent!")
        } catch (error) { console.error(error) } 
        finally { setIsSubmitting(false) }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>

    return (
        <div className="relative py-12 px-4 bg-[#f1f5f9] min-h-screen flex items-center justify-center overflow-hidden">
            
            {/* --- INTENSIFIED DOODLE BACKGROUND --- */}
            <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none select-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="heavy-doodle" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
                        {/* Pizza Slice */}
                        <path d="M40 40 L70 40 L55 70 Z" stroke="#059669" strokeWidth="3" fill="none" strokeLinejoin="round"/>
                        <circle cx="50" cy="48" r="2" fill="#059669"/>
                        <circle cx="60" cy="48" r="2" fill="#059669"/>
                        
                        {/* Burger/Bun */}
                        <path d="M120 50 q15 -20 30 0 v10 h-30 Z" stroke="#0f172a" strokeWidth="3" fill="none"/>
                        <path d="M120 65 h30" stroke="#0f172a" strokeWidth="3" />

                        {/* Coffee Mug */}
                        <path d="M40 120 h25 v20 q0 8 -8 8 h-9 q-8 0 -8 -8 Z" stroke="#0f172a" strokeWidth="3" fill="none" />
                        <path d="M65 125 q5 0 5 5 t-5 5" stroke="#0f172a" strokeWidth="3" fill="none" />

                        {/* Cutlery Cross */}
                        <path d="M130 120 l20 20 M150 120 l-20 20" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
                        
                        {/* Decorative Dots */}
                        <circle cx="90" cy="90" r="3" fill="#059669"/>
                        <circle cx="10" cy="150" r="3" fill="#0f172a"/>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#heavy-doodle)" />
                </svg>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/60 backdrop-blur-sm">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">How was your meal?</h1>
                        <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">Logged in as {currentUser?.email?.split('@')[0]}</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session</label>
                                <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="w-full p-4 text-sm border-2 border-slate-50 rounded-2xl bg-slate-50 font-bold outline-none focus:border-emerald-500 transition-all appearance-none" required>
                                    <option value="">Select</option>
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dish</label>
                                <input type="text" value={dishName} onChange={(e) => setDishName(e.target.value)} className="w-full p-4 text-sm border-2 border-slate-50 rounded-2xl bg-slate-50 font-bold outline-none focus:border-emerald-500 transition-all" placeholder="Dish name" required />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rating</label>
                            <div className="grid grid-cols-4 gap-2">
                                {EMOJI_RATINGS.map((item) => (
                                    <button key={item.value} type="button" onClick={() => setRating(item.value)} className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${rating === item.value ? item.color : 'border-transparent bg-slate-50 text-slate-400'}`}>
                                        <span className="text-2xl">{item.emoji}</span>
                                        <span className="text-[8px] font-black uppercase mt-1.5 tracking-tighter">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Optimized Voice Bar */}
                        <div className={`flex items-center gap-4 p-3 pr-5 rounded-2xl border-2 transition-all ${isListening ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-50'}`}>
                            <button type="button" onClick={toggleListening} className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all shadow-sm ${isListening ? 'bg-white scale-105' : 'bg-white hover:shadow-md'}`}>
                                {isListening ? (
                                    <div className="flex gap-1 items-center h-5">
                                        <span className="w-1 bg-blue-500 rounded-full animate-google-bounce" style={{animationDelay: '0s'}}></span>
                                        <span className="w-1 bg-red-500 rounded-full animate-google-bounce" style={{animationDelay: '0.1s'}}></span>
                                        <span className="w-1 bg-yellow-500 rounded-full animate-google-bounce" style={{animationDelay: '0.2s'}}></span>
                                        <span className="w-1 bg-green-500 rounded-full animate-google-bounce" style={{animationDelay: '0.3s'}}></span>
                                    </div>
                                ) : (
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path fill="#34A853" d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                                    </svg>
                                )}
                            </button>
                            <div className="flex-1 min-w-0">
                                <p className={`text-[9px] font-black uppercase tracking-widest ${isListening ? 'text-emerald-600' : 'text-slate-400'}`}>Voice Note</p>
                                <p className="text-xs font-bold text-slate-700 truncate mt-0.5 italic">{transcript || 'Tap to record details...'}</p>
                            </div>
                            {transcript && !isListening && (
                                <button type="button" onClick={() => setTranscript('')} className="text-slate-300 hover:text-rose-500 font-bold text-xl">×</button>
                            )}
                        </div>

                        <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-[#059669] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-emerald-200/50 active:scale-[0.97] transition-all disabled:opacity-50">
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>
                </div>
            </div>

            <style jsx global>{`
                @keyframes google-bounce {
                    0%, 100% { height: 8px; }
                    50% { height: 22px; }
                }
                .animate-google-bounce { animation: google-bounce 0.6s ease-in-out infinite; }
            `}</style>
        </div>
    )
}