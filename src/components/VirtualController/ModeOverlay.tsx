'use client';

import { Hand, Zap, X } from 'lucide-react';

type Mode = 'hold' | 'turbo' | null;

interface ModeOverlayProps {
    mode: Mode;
    heldButtons: Set<string>;
    turboButtons: Set<string>;
    systemColor?: string;
    /** Callback to exit the mode */
    onExit: () => void;
}

const MODE_CONFIG = {
    hold: {
        Icon: Hand,
        title: 'Hold Mode',
        instruction: 'Tap a button to hold it',
        buttonIcon: Hand,
        buttonColor: '#22c55e', // green
    },
    turbo: {
        Icon: Zap,
        title: 'Turbo Mode',
        instruction: 'Tap a button for rapid fire',
        buttonIcon: Zap,
        buttonColor: '#fbbf24', // yellow
    },
} as const;

/**
 * Unified overlay for Hold Mode and Turbo Mode
 * Shows instructions and list of configured buttons
 */
export default function ModeOverlay({
    mode,
    heldButtons,
    turboButtons,
    systemColor = '#00FF41',
    onExit,
}: ModeOverlayProps) {
    if (!mode) return null;

    const config = MODE_CONFIG[mode];
    const buttons = mode === 'hold' ? heldButtons : turboButtons;
    const buttonArray = Array.from(buttons);
    const { Icon, buttonIcon: ButtonIcon } = config;

    return (
        <div className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 pointer-events-none">
            {/* Floating instruction card at top */}
            <div
                className="relative px-5 py-3 rounded-2xl backdrop-blur-md border pointer-events-auto"
                style={{
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    borderColor: `${systemColor}60`,
                    boxShadow: `0 4px 20px ${systemColor}30`,
                }}
            >
                {/* Exit button */}
                <button
                    onClick={onExit}
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90"
                    style={{
                        backgroundColor: '#ef4444',
                        border: '2px solid rgba(255,255,255,0.3)',
                    }}
                    aria-label="Exit mode"
                >
                    <X size={14} color="white" strokeWidth={3} />
                </button>

                <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${systemColor}30` }}
                    >
                        <Icon size={20} style={{ color: systemColor }} />
                    </div>

                    <div className="text-left">
                        {/* Title */}
                        <h3 className="text-white font-bold text-sm">
                            {config.title}
                        </h3>

                        {/* Instructions */}
                        <p className="text-white/60 text-xs">
                            {config.instruction}
                        </p>
                    </div>
                </div>

                {/* Configured buttons list */}
                {buttonArray.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 justify-center mt-2 pt-2 border-t border-white/10">
                        {buttonArray.map(button => (
                            <span
                                key={button}
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"
                                style={{
                                    backgroundColor: `${config.buttonColor}25`,
                                    color: config.buttonColor,
                                }}
                            >
                                <ButtonIcon size={10} />
                                {button}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

