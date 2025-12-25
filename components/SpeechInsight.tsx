'use client'

import React, { useState, useEffect } from 'react';

// Declaration for TypeScript to recognize the Web Speech API
declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
}

export default function SpeechInsight({ onTranscript }: { onTranscript: (text: string) => void }) {
    const [isListening, setIsListening] = useState(false);

    const startListening = () => {
        const SpeechRecognition = window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Speech Recognition. Please use Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onTranscript(transcript);
        };

        recognition.start();
    };

    return (
        <button 
            onClick={startListening}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition-all ${
                isListening ? 'bg-red-100 border-red-300 text-red-600 animate-pulse' : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
            }`}
        >
            <span>{isListening ? '🛑' : '🎤'}</span>
            <span className="text-xs font-bold">{isListening ? 'Listening...' : 'Get Insight'}</span>
        </button>
    );
}