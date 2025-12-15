'use client';

import { useState, useEffect } from 'react';
import { Move } from 'lucide-react';

const STORAGE_KEY = 'koin-controls-hint-shown';

interface ControlsHintProps {
    isVisible: boolean;
}

/**
 * First-time hint overlay that teaches users about control repositioning
 * Only shows once, stores flag in sessionStorage
 */
export default function ControlsHint({ isVisible }: ControlsHintProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!isVisible) return;

        // Check if hint was already shown
        try {
            const wasShown = sessionStorage.getItem(STORAGE_KEY);
            if (!wasShown) {
                // Delay showing to let user see the controls first
                const timer = setTimeout(() => setShow(true), 1500);
                return () => clearTimeout(timer);
            }
        } catch {
            // sessionStorage not available
        }
    }, [isVisible]);

    const handleDismiss = () => {
        setShow(false);
        try {
            sessionStorage.setItem(STORAGE_KEY, 'true');
        } catch {
            // sessionStorage not available
        }
    };

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleDismiss}
            onTouchEnd={handleDismiss}
        >
            <div
                className="bg-black/90 border border-white/30 rounded-2xl p-6 mx-4 max-w-sm text-center shadow-2xl pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
            >
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center">
                        <Move size={32} className="text-green-400" />
                    </div>
                </div>

                <h3 className="text-white text-lg font-bold mb-2">
                    Customize Your Controls
                </h3>

                <p className="text-white/70 text-sm mb-4">
                    <strong className="text-white">Long-press</strong> any button or the <strong className="text-white">D-pad center</strong> to drag and reposition it.
                </p>

                <p className="text-white/50 text-xs mb-4">
                    Your layout is saved separately for portrait and landscape modes.
                </p>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss();
                    }}
                    onTouchEnd={(e) => {
                        e.stopPropagation();
                        handleDismiss();
                    }}
                    className="w-full py-3 px-4 bg-green-500 hover:bg-green-400 active:bg-green-600 text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
                >
                    Got it!
                </button>
            </div>
        </div>
    );
}
