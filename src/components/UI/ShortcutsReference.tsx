'use client';

import { memo, useState } from 'react';
import { Keyboard, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Shortcuts Reference
 * -------------------
 * Collapsible panel showing player F-key shortcuts.
 * Game controls have their own config in the Keys modal.
 */

interface ShortcutsReferenceProps {
    systemColor?: string;
    isExpanded?: boolean;
}

// F-key shortcuts only - these don't conflict with games
const SHORTCUTS = [
    { key: 'F1', description: 'Help' },
    { key: 'F3', description: 'FPS Overlay' },
    { key: 'F4', description: 'Input Display' },
    { key: 'F5', description: 'Record' },
    { key: 'F9', description: 'Mute' },
];

const ShortcutsReference = memo(function ShortcutsReference({
    systemColor = '#00FF41',
    isExpanded: initialExpanded = false,
}: ShortcutsReferenceProps) {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);

    return (
        <div
            className="rounded overflow-hidden"
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                border: `1px solid ${systemColor}40`,
            }}
        >
            {/* Header - always visible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Keyboard size={14} style={{ color: systemColor }} />
                    <span className="text-xs font-bold text-white/80">Shortcuts</span>
                </div>
                {isExpanded ? (
                    <ChevronUp size={14} className="text-white/50" />
                ) : (
                    <ChevronDown size={14} className="text-white/50" />
                )}
            </button>

            {/* Shortcuts list - collapsible */}
            {isExpanded && (
                <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-white/10">
                    {SHORTCUTS.map(({ key, description }) => (
                        <div key={key} className="flex items-center justify-between text-xs">
                            <span className="text-white/60">{description}</span>
                            <kbd
                                className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold"
                                style={{
                                    backgroundColor: `${systemColor}20`,
                                    color: systemColor,
                                    border: `1px solid ${systemColor}40`,
                                }}
                            >
                                {key}
                            </kbd>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

export default ShortcutsReference;
