'use client';

import { memo, useState, useRef, useEffect } from 'react';
import { Palette, ChevronDown } from 'lucide-react';

/**
 * Available CRT Shader Presets
 * ----------------------------
 * These are loaded from libretro/glsl-shaders via Nostalgist.
 * Format: { id: shader_path, name: display_name, description: tooltip }
 */
export const SHADER_PRESETS = [
    { id: '', name: 'None', description: 'No shader - sharp pixels' },
    { id: 'crt/crt-lottes', name: 'CRT Lottes', description: 'High-quality arcade monitor look' },
    { id: 'crt/crt-easymode', name: 'CRT Easy', description: 'Popular, performant CRT effect' },
    { id: 'crt/crt-geom', name: 'CRT Geom', description: 'Classic CRT shader with curvature' },
    { id: 'crt/crt-hyllian', name: 'CRT Hyllian', description: 'Attractive with minimal tweaking' },
    { id: 'crt/crt-nes-mini', name: 'NES Mini', description: 'Simple scanlines like NES Classic' },
    { id: 'crt/zfast-crt', name: 'zFast CRT', description: 'Lightweight, great for mobile' },
    { id: 'crt/crt-potato-cool', name: 'CRT Potato', description: 'Fast and good for weak devices' },
    { id: 'handheld/lcd-grid-v2', name: 'LCD Grid', description: 'Game Boy style LCD effect' },
    { id: 'scanlines', name: 'Scanlines', description: 'Simple horizontal scanlines' },
] as const;

export type ShaderPresetId = typeof SHADER_PRESETS[number]['id'];

interface ShaderSelectorProps {
    currentShader: ShaderPresetId;
    onShaderChange: (shaderId: ShaderPresetId) => void;
    disabled?: boolean;
    systemColor?: string;
}

/**
 * Shader Selector Component
 * -------------------------
 * Dropdown to select CRT/LCD shader effects.
 */
const ShaderSelector = memo(function ShaderSelector({
    currentShader,
    onShaderChange,
    disabled = false,
    systemColor = '#00FF41',
}: ShaderSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentPreset = SHADER_PRESETS.find(p => p.id === currentShader) || SHADER_PRESETS[0];

    return (
        <div ref={dropdownRef} className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-all"
                style={{
                    backgroundColor: currentShader ? `${systemColor}20` : 'rgba(255,255,255,0.1)',
                    color: currentShader ? systemColor : 'rgba(255,255,255,0.7)',
                    border: `1px solid ${currentShader ? systemColor : 'rgba(255,255,255,0.2)'}`,
                }}
            >
                <Palette size={16} />
                <span className="hidden sm:inline">{currentPreset.name}</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute bottom-full left-0 mb-2 w-56 bg-black/95 border border-white/20 rounded-lg shadow-xl overflow-hidden z-50"
                    style={{ backdropFilter: 'blur(8px)' }}
                >
                    <div className="p-2 border-b border-white/10">
                        <div className="text-xs font-bold text-white/60 uppercase tracking-wide">
                            Video Shader
                        </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {SHADER_PRESETS.map(preset => (
                            <button
                                key={preset.id}
                                onClick={() => {
                                    onShaderChange(preset.id);
                                    setIsOpen(false);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-white/10 transition-colors flex flex-col gap-0.5"
                                style={{
                                    backgroundColor: currentShader === preset.id ? `${systemColor}20` : undefined,
                                }}
                            >
                                <span
                                    className="text-sm font-medium"
                                    style={{ color: currentShader === preset.id ? systemColor : 'white' }}
                                >
                                    {preset.name}
                                </span>
                                <span className="text-xs text-white/50">
                                    {preset.description}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

export default ShaderSelector;
