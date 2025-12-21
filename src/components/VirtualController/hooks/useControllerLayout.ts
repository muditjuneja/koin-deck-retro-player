import { useState, useCallback } from 'react';
import { useButtonPositions } from '../useButtonPositions';

interface UseControllerLayoutProps {
    onPause: () => void;
    onResume: () => void;
}

export const useControllerLayout = ({
    onPause,
    onResume,
}: UseControllerLayoutProps) => {
    const [isLocked, setIsLocked] = useState(true); // Default locked
    const { getPosition, savePosition } = useButtonPositions();

    // Toggle lock and persist - pause game on exit (entering layout mode), resume on lock
    const toggleLock = useCallback(() => {
        setIsLocked(prev => {
            const newValue = !prev;

            if (newValue) {
                // Locking layout - resume game
                onResume();
            } else {
                // Unlocking layout (entering layout mode) - pause game
                onPause();
            }

            return newValue;
        });
    }, [onPause, onResume]);

    return {
        isLocked,
        toggleLock,
        getPosition,
        savePosition,
    };
};
