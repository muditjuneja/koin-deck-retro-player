import { useState, useCallback } from 'react';

interface UseControllerModesProps {
    isRunning: boolean;
    hapticsEnabled: boolean;
    onPause: () => void;
    onResume: () => void;
    onButtonUp: (button: string) => void;
    onButtonDown: (button: string) => void;
}

export const useControllerModes = ({
    isRunning,
    hapticsEnabled,
    onPause,
    onResume,
    onButtonUp,
    onButtonDown,
}: UseControllerModesProps) => {
    // Hold Mode State
    const [isHoldMode, setIsHoldMode] = useState(false);
    const [heldButtons, setHeldButtons] = useState<Set<string>>(new Set());

    // Turbo Mode State
    const [isTurboMode, setIsTurboMode] = useState(false);
    const [turboButtons, setTurboButtons] = useState<Set<string>>(new Set());

    // Toggle Hold Mode
    const toggleHoldMode = useCallback(() => {
        setIsHoldMode(prev => {
            if (prev) {
                // Exiting hold mode
                onResume();
            } else {
                // Entering hold mode
                onPause();
            }
            return !prev;
        });
    }, [onPause, onResume]);

    // Toggle Turbo Mode
    const toggleTurboMode = useCallback(() => {
        setIsTurboMode(prev => {
            if (prev) {
                // Exiting turbo mode
                onResume();
            } else {
                // Entering turbo mode
                onPause();
            }
            return !prev;
        });
    }, [onPause, onResume]);

    // Handle button press in specialized modes
    // Returns true if the event was handled by a mode and should stop propagation
    const handleModePress = useCallback((buttonType: string): boolean => {
        if (!isRunning) return false;

        // HOLD MODE LOGIC
        if (isHoldMode) {
            const isHeld = heldButtons.has(buttonType);
            if (isHeld) {
                // Un-hold
                setHeldButtons(prev => {
                    const next = new Set(prev);
                    next.delete(buttonType);
                    return next;
                });
                onButtonUp(buttonType);
                // Haptic feedback for unhold
                if (hapticsEnabled && navigator.vibrate) navigator.vibrate(10);
            } else {
                // Hold
                setHeldButtons(prev => {
                    // Mutual exclusion: Remove from Turbo if present
                    setTurboButtons(turboPrev => {
                        if (turboPrev.has(buttonType)) {
                            const nextTurbo = new Set(turboPrev);
                            nextTurbo.delete(buttonType);
                            return nextTurbo;
                        }
                        return turboPrev;
                    });
                    return new Set(prev).add(buttonType);
                });
                onButtonDown(buttonType);
                // Haptic feedback for hold
                if (hapticsEnabled && navigator.vibrate) navigator.vibrate([10, 30, 10]);
            }
            return true; // Handled
        }

        // TURBO MODE LOGIC - toggle turbo status
        if (isTurboMode) {
            const isTurbo = turboButtons.has(buttonType);
            if (isTurbo) {
                // Disable Turbo
                setTurboButtons(prev => {
                    const next = new Set(prev);
                    next.delete(buttonType);
                    return next;
                });
                if (hapticsEnabled && navigator.vibrate) navigator.vibrate(10);
            } else {
                // Enable Turbo
                setTurboButtons(prev => {
                    // Mutual exclusion: Remove from Hold if present
                    setHeldButtons(holdPrev => {
                        if (holdPrev.has(buttonType)) {
                            const nextHold = new Set(holdPrev);
                            nextHold.delete(buttonType);
                            // Also physical release
                            onButtonUp(buttonType);
                            return nextHold;
                        }
                        return holdPrev;
                    });
                    return new Set(prev).add(buttonType);
                });
                if (hapticsEnabled && navigator.vibrate) navigator.vibrate([5, 10, 5]);
            }
            return true; // Handled
        }

        return false; // Not handled by modes
    }, [isHoldMode, isTurboMode, heldButtons, turboButtons, hapticsEnabled, onButtonUp, onButtonDown, isRunning]);

    // Handle button release in specialized modes
    // Returns true if the event should be blocked (e.g. in config mode)
    const shouldBlockRelease = useCallback((buttonType: string): boolean => {
        // HOLD MODE LOGIC: Do nothing on release if in Hold Mode
        if (isHoldMode) return true;

        // If button is physically held (via Hold Mode)
        if (heldButtons.has(buttonType)) {
            // If we are NOT in config mode, this release event (from a tap) should un-hold it
            if (!isHoldMode) {
                setHeldButtons(prev => {
                    const next = new Set(prev);
                    next.delete(buttonType);
                    return next;
                });
                onButtonUp(buttonType);
                if (hapticsEnabled && navigator.vibrate) navigator.vibrate(10);
            }
            return true;
        }

        // TURBO MODE LOGIC: Do nothing on release if in Config Mode
        if (isTurboMode) return true;

        return false;
    }, [isHoldMode, isTurboMode, heldButtons, hapticsEnabled, onButtonUp]);

    return {
        isHoldMode,
        heldButtons,
        toggleHoldMode,
        isTurboMode,
        turboButtons,
        toggleTurboMode,
        handleModePress,
        shouldBlockRelease,
    };
};
