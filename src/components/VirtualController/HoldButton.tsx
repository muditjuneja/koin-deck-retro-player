'use client';

import { Hand, StopCircle } from 'lucide-react';

interface HoldButtonProps {
    isActive: boolean;
    onToggle: () => void;
    systemColor?: string;
}

/**
 * Floating button to toggle "Hold Mode"
 * When active, tapping a button toggles its "held" state
 */
export default function HoldButton({
    isActive,
    onToggle,
    systemColor = '#00FF41',
}: HoldButtonProps) {
    const Icon = isActive ? StopCircle : Hand;

    return (
        <button
            onClick={onToggle}
            className="pointer-events-auto p-2 rounded-full backdrop-blur-sm transition-all active:scale-95"
            style={{
                backgroundColor: isActive ? 'rgba(0,0,0,0.6)' : `${systemColor}20`,
                border: `1px solid ${isActive ? 'rgba(255,255,255,0.4)' : systemColor}`,
            }}
            aria-label={isActive ? 'Disable Hold Mode' : 'Enable Button Hold Mode'}
        >
            <Icon
                size={18}
                style={{ color: isActive ? '#fff' : systemColor }}
            />
        </button>
    );
}
