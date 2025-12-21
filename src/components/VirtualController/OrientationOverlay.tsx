'use client';

import { motion } from 'framer-motion';
import { Smartphone, RotateCw } from 'lucide-react';

interface OrientationOverlayProps {
    systemColor?: string;
    onDismiss: () => void;
}

/**
 * Premium orientation reminder for mobile users
 * Shows a rotation animation when in portrait mode
 */
export default function OrientationOverlay({ systemColor = '#00FF41', onDismiss }: OrientationOverlayProps) {
    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-md p-8 text-center pointer-events-auto">
            {/* Ambient Background Glow */}
            <div
                className="absolute inset-0 pointer-none opacity-20"
                style={{
                    background: `radial-gradient(circle at center, ${systemColor} 0%, transparent 70%)`
                }}
            />

            {/* Animation Container */}
            <div className="relative mb-8">
                {/* Rotating Phone Shadow/Glow */}
                <motion.div
                    animate={{
                        rotate: [0, 90, 90, 0, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.4, 0.6, 0.9, 1]
                    }}
                    className="absolute inset-0 rounded-3xl blur-2xl opacity-40 translate-y-2"
                    style={{ backgroundColor: systemColor }}
                />

                {/* The Phone Icon */}
                <motion.div
                    animate={{
                        rotate: [0, 90, 90, 0, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.4, 0.6, 0.9, 1]
                    }}
                    className="relative bg-zinc-900 border-2 rounded-3xl p-8 shadow-2xl"
                    style={{ borderColor: `${systemColor}40` }}
                >
                    <Smartphone size={80} style={{ color: systemColor }} strokeWidth={1} />
                </motion.div>

                {/* Rotation Arrow Overlay */}
                <motion.div
                    animate={{
                        opacity: [0, 1, 1, 0],
                        scale: [0.8, 1.2, 1.2, 0.8],
                        rotate: [0, 45, 45, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeOut",
                        times: [0, 0.2, 0.7, 1]
                    }}
                    className="absolute -top-4 -right-4 bg-zinc-900 border border-white/10 p-3 rounded-full shadow-lg"
                >
                    <RotateCw size={24} style={{ color: systemColor }} />
                </motion.div>
            </div>

            {/* Lingo */}
            <div className="relative z-10 space-y-6 max-w-xs">
                <div className="space-y-2">
                    <h2 className="text-white text-2xl font-black uppercase tracking-tighter">
                        Landscape Mode <span style={{ color: systemColor }}>Required</span>
                    </h2>
                    <div className="h-0.5 w-12 mx-auto rounded-full" style={{ backgroundColor: systemColor }} />
                </div>

                <p className="text-white/60 text-sm font-medium leading-relaxed tracking-wide">
                    Virtual controls are minimized in portrait mode. Rotate your device to play, or hide this overlay to spectate.
                </p>

                <button
                    onClick={onDismiss}
                    className="mt-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors"
                >
                    Hide Overlay
                </button>
            </div>

            {/* Scanning Line Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
                <motion.div
                    animate={{ y: ['-100%', '100%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-full h-1/2 bg-gradient-to-b from-transparent via-white to-transparent"
                />
            </div>
        </div>
    );
}
