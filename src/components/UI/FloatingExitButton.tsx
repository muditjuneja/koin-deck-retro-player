'use client';

import { Minimize2, X } from 'lucide-react';

interface FloatingExitButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

/**
 * Floating exit button that appears in fullscreen mode
 * Styled to match FloatingFullscreenButton for consistency
 */
export default function FloatingExitButton({ onClick, disabled = false }: FloatingExitButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                fixed top-3 right-3 z-50
                px-3 py-2 rounded-xl
                bg-black/80 backdrop-blur-md
                border-2 border-red-400/60
                shadow-xl
                flex items-center gap-2
                transition-all duration-300
                hover:bg-red-600/30 hover:border-red-400 hover:scale-105
                active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed
                touch-manipulation
            `}
            style={{
                paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)'
            }}
            aria-label="Exit fullscreen"
        >
            <X size={16} className="text-red-400" />
            <span className="text-white text-xs font-bold uppercase tracking-wider">
                Exit
            </span>
            <Minimize2 size={14} className="text-white/60" />
        </button>
    );
}
