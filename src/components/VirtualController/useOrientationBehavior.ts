import { useState, useEffect, useRef } from 'react';

interface UseOrientationBehaviorProps {
    isPortrait: boolean;
    isRunning: boolean;
    onPause: () => void;
}

interface UseOrientationBehaviorReturn {
    isDismissed: boolean;
    dismissOverlay: () => void;
}

/**
 * Encapsulates behaviors related to device orientation for the Virtual Controller:
 * 1. Auto-pausing the game when transitioning to Portrait mode.
 * 2. Managing the "Dismiss" state of the orientation overlay.
 * 3. Resetting the "Dismiss" state when returning to Landscape (so it shows again next time).
 */
export function useOrientationBehavior({
    isPortrait,
    isRunning,
    onPause
}: UseOrientationBehaviorProps): UseOrientationBehaviorReturn {
    const [isDismissed, setIsDismissed] = useState(false);
    const wasPortraitRef = useRef(isPortrait);

    useEffect(() => {
        // Detect transition: Landscape -> Portrait
        if (isPortrait && !wasPortraitRef.current) {
            // 1. Auto-Pause if game is running
            if (isRunning) {
                onPause();
            }
        }

        // Detect transition: Portrait -> Landscape
        if (!isPortrait && wasPortraitRef.current) {
            // 2. Reset dismissal state so the warning shows again next time
            setIsDismissed(false);
        }

        wasPortraitRef.current = isPortrait;
    }, [isPortrait, isRunning, onPause]);

    const dismissOverlay = () => setIsDismissed(true);

    return {
        isDismissed,
        dismissOverlay
    };
}
