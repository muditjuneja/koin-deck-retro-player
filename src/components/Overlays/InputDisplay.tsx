'use client';

import React, { memo, useState, useEffect } from 'react';

interface InputDisplayProps {
    isVisible: boolean;
    system: string;
    systemColor?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline';
}

// Button layout configurations for different systems
const BUTTON_LAYOUTS: Record<string, { dpad: boolean; buttons: string[] }> = {
    // Nintendo
    nes: { dpad: true, buttons: ['B', 'A', 'SELECT', 'START'] },
    snes: { dpad: true, buttons: ['Y', 'B', 'X', 'A', 'L', 'R', 'SELECT', 'START'] },
    n64: { dpad: true, buttons: ['A', 'B', 'Z', 'L', 'R', 'C↑', 'C↓', 'C←', 'C→', 'START'] },
    gb: { dpad: true, buttons: ['B', 'A', 'SELECT', 'START'] },
    gbc: { dpad: true, buttons: ['B', 'A', 'SELECT', 'START'] },
    gba: { dpad: true, buttons: ['B', 'A', 'L', 'R', 'SELECT', 'START'] },
    nds: { dpad: true, buttons: ['Y', 'B', 'X', 'A', 'L', 'R', 'SELECT', 'START'] },

    // Sega
    genesis: { dpad: true, buttons: ['A', 'B', 'C', 'X', 'Y', 'Z', 'MODE', 'START'] },
    mastersystem: { dpad: true, buttons: ['1', '2', 'PAUSE'] },
    gamegear: { dpad: true, buttons: ['1', '2', 'START'] },

    // Sony
    ps1: { dpad: true, buttons: ['□', '×', '○', '△', 'L1', 'R1', 'L2', 'R2', 'SELECT', 'START'] },
    psp: { dpad: true, buttons: ['□', '×', '○', '△', 'L', 'R', 'SELECT', 'START'] },

    // Arcade
    arcade: { dpad: true, buttons: ['1', '2', '3', '4', '5', '6', 'COIN', 'START'] },
    neogeo: { dpad: true, buttons: ['A', 'B', 'C', 'D', 'COIN', 'START'] },

    // Default
    default: { dpad: true, buttons: ['A', 'B', 'START'] },
};

// Keyboard to button mapping (simplified - real mapping comes from controls)
const KEY_TO_BUTTON: Record<string, string> = {
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    'KeyZ': 'A',
    'KeyX': 'B',
    'KeyA': 'X',
    'KeyS': 'Y',
    'KeyQ': 'L',
    'KeyW': 'R',
    'Enter': 'START',
    'ShiftRight': 'SELECT',
    'Space': 'COIN',
};

/**
 * Input Display Overlay
 * ---------------------
 * Shows real-time button presses for streaming and speedruns.
 * Displays a visual representation of the controller with
 * active buttons highlighted.
 */
const InputDisplay = memo(function InputDisplay({
    isVisible,
    system,
    systemColor = '#00FF41',
    position = 'bottom-right',
}: InputDisplayProps) {
    const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

    // Track keyboard state
    useEffect(() => {
        if (!isVisible) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const button = KEY_TO_BUTTON[e.code];
            if (button) {
                setActiveKeys(prev => new Set(prev).add(button));
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const button = KEY_TO_BUTTON[e.code];
            if (button) {
                setActiveKeys(prev => {
                    const next = new Set(prev);
                    next.delete(button);
                    return next;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    const layout = BUTTON_LAYOUTS[system.toLowerCase()] || BUTTON_LAYOUTS.default;

    // Position classes - 'inline' means no absolute positioning (used in HUD container)
    const positionClasses: Record<string, string> = {
        'top-left': 'absolute top-2 left-2',
        'top-right': 'absolute top-2 right-2',
        'bottom-left': 'absolute bottom-2 left-2',
        'bottom-right': 'absolute bottom-2 right-2',
        'inline': '', // No positioning - parent controls placement
    };

    const isActive = (btn: string) => activeKeys.has(btn);
    const isDpadActive = (dir: string) => activeKeys.has(dir);

    return (
        <div
            className={`z-40 pointer-events-none select-none ${positionClasses[position]}`}
            style={{ fontFamily: 'monospace' }}
        >
            <div
                className="flex items-center gap-4 px-3 py-2 rounded"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    border: `1px solid ${systemColor}40`,
                }}
            >
                {/* D-Pad */}
                {layout.dpad && (
                    <div className="grid grid-cols-3 gap-0.5" style={{ width: '48px', height: '48px' }}>
                        <div /> {/* Empty top-left */}
                        <DpadButton active={isDpadActive('↑')} color={systemColor}>↑</DpadButton>
                        <div /> {/* Empty top-right */}
                        <DpadButton active={isDpadActive('←')} color={systemColor}>←</DpadButton>
                        <div className="w-3 h-3 bg-gray-700 rounded-sm" /> {/* Center */}
                        <DpadButton active={isDpadActive('→')} color={systemColor}>→</DpadButton>
                        <div /> {/* Empty bottom-left */}
                        <DpadButton active={isDpadActive('↓')} color={systemColor}>↓</DpadButton>
                        <div /> {/* Empty bottom-right */}
                    </div>
                )}

                {/* Face Buttons */}
                <div className="flex flex-wrap gap-1 max-w-[120px]">
                    {layout.buttons.slice(0, 6).map(btn => (
                        <ActionButton key={btn} active={isActive(btn)} color={systemColor}>
                            {btn}
                        </ActionButton>
                    ))}
                </div>
            </div>
        </div>
    );
});

// D-Pad button component
const DpadButton = memo(function DpadButton({
    active,
    color,
    children
}: {
    active: boolean;
    color: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className="w-3 h-3 flex items-center justify-center text-[8px] font-bold rounded-sm transition-all duration-75"
            style={{
                backgroundColor: active ? color : 'rgba(255,255,255,0.1)',
                color: active ? '#000' : 'rgba(255,255,255,0.5)',
                boxShadow: active ? `0 0 8px ${color}` : 'none',
            }}
        >
            {children}
        </div>
    );
});

// Action button component
const ActionButton = memo(function ActionButton({
    active,
    color,
    children
}: {
    active: boolean;
    color: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className="min-w-[20px] h-5 px-1 flex items-center justify-center text-[9px] font-bold rounded transition-all duration-75"
            style={{
                backgroundColor: active ? color : 'rgba(255,255,255,0.1)',
                color: active ? '#000' : 'rgba(255,255,255,0.6)',
                boxShadow: active ? `0 0 8px ${color}` : 'none',
            }}
        >
            {children}
        </div>
    );
});

export default InputDisplay;
