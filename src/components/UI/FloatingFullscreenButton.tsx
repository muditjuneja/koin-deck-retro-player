'use client';

import { Maximize, Gamepad2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FloatingFullscreenButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

/**
 * Floating fullscreen prompt for mobile devices
 * Shows prominently with clear messaging that controls appear in fullscreen
 */
export default function FloatingFullscreenButton({ onClick, disabled = false }: FloatingFullscreenButtonProps) {
    const [pulse, setPulse] = useState(true);

    // Stop pulsing after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => setPulse(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                absolute top-3 left-3 z-50
                px-3 py-2 rounded-xl
                bg-black/80 backdrop-blur-md
                border-2 border-white/60
                shadow-xl
                flex items-center gap-2
                transition-all duration-300
                hover:bg-white/20 hover:border-white hover:scale-105
                active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed
                touch-manipulation
                ${pulse ? 'animate-pulse border-green-400/80' : ''}
            `}
            aria-label="Tap for fullscreen controls"
        >
            <Gamepad2 size={18} className="text-green-400" />
            <span className="text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                Tap for Controls
            </span>
            <Maximize size={14} className="text-white/60" />
        </button>
    );
}
