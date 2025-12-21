'use client';

import { Hand, Zap, X, Move } from 'lucide-react';
import { memo } from 'react';

type Mode = 'hold' | 'turbo' | 'layout' | null;

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
        lines: [
            'Tap buttons to keep them active',
            'Tap the X when you are finished'
        ],
        buttonIcon: Hand,
        buttonColor: '#22c55e', // green
    },
    turbo: {
        Icon: Zap,
        title: 'Turbo Mode',
        lines: [
            'Tap for automatic rapid-fire input',
            'Tap the X when you are finished'
        ],
        buttonIcon: Zap,
        buttonColor: '#fbbf24', // yellow
    },
    layout: {
        Icon: Move,
        title: 'Layout Mode',
        lines: [
            'Drag and place buttons anywhere',
            'Tap the X to save and lock layout'
        ],
        buttonIcon: Move,
        buttonColor: '#38bdf8', // Default backup, but we'll prioritize systemColor
    },
} as const;

/**
 * Unified overlay for Hold Mode and Turbo Mode
 * Shows instructions and list of configured buttons
 */
const ModeOverlay = memo(function ModeOverlay({
    mode,
    heldButtons,
    turboButtons,
    systemColor = '#00FF41',
    onExit,
}: ModeOverlayProps) {
    if (!mode) return null;

    const config = MODE_CONFIG[mode];
    const buttons = mode === 'hold' ? heldButtons : mode === 'turbo' ? turboButtons : new Set<string>();
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
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-lg"
                    style={{
                        backgroundColor: '#ef4444',
                        border: '2px solid rgba(255,255,255,0.4)',
                    }}
                    aria-label="Exit mode"
                >
                    <X size={14} color="white" strokeWidth={3} />
                </button>

                <div className="flex items-center gap-3 relative z-10">
                    {/* Icon */}
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative"
                        style={{ backgroundColor: `${systemColor}20` }}
                    >
                        <div
                            className="absolute inset-x-0 bottom-0 top-0 rounded-full blur-md opacity-50"
                            style={{ backgroundColor: systemColor }}
                        />
                        <Icon size={20} className="relative z-10" style={{ color: systemColor }} />
                    </div>

                    <div className="text-left">
                        {/* Title */}
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.15em]">
                                {config.title}
                            </h4>
                            <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: systemColor }} />
                        </div>

                        {/* Instructions */}
                        <div className="space-y-0.5">
                            {config.lines.map((line, i) => (
                                <p key={i} className={`text-xs leading-none tracking-tight ${i === 0 ? 'text-white font-extrabold' : 'text-white/40 font-medium'}`}>
                                    {line}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* HUD Scanline Texture Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                        backgroundSize: '100% 2px, 3px 100%'
                    }}
                />

                {/* Configured buttons list */}
                {buttonArray.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 justify-center mt-2 pt-2 border-t border-white/10">
                        {buttonArray.map(button => (
                            <span
                                key={button}
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"
                                style={{
                                    backgroundColor: `${mode === 'layout' ? systemColor : config.buttonColor}25`,
                                    color: mode === 'layout' ? systemColor : config.buttonColor,
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
});

export default ModeOverlay;
