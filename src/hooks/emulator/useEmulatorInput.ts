import { useCallback, MutableRefObject } from 'react';
import { Nostalgist } from 'nostalgist';

interface UseEmulatorInputProps {
    nostalgistRef: MutableRefObject<Nostalgist | null>;
}

interface UseEmulatorInputReturn {
    pressKey: (key: string) => void;
    pressDown: (button: string) => void;
    pressUp: (button: string) => void;
}

export function useEmulatorInput({ nostalgistRef }: UseEmulatorInputProps): UseEmulatorInputReturn {
    // Press key programmatically (press and release)
    const pressKey = useCallback((key: string) => {
        if (!nostalgistRef.current) return;

        try {
            nostalgistRef.current.press(key);
        } catch (err) {
            console.error('[Nostalgist] Press key error:', err);
        }
    }, [nostalgistRef]);

    // Press and hold a button
    const pressDown = useCallback((button: string) => {
        if (!nostalgistRef.current) return;

        try {
            (nostalgistRef.current as any).pressDown(button);
        } catch (err) {
            console.error('[Nostalgist] Press down error:', err);
        }
    }, [nostalgistRef]);

    // Release a button
    const pressUp = useCallback((button: string) => {
        if (!nostalgistRef.current) return;

        try {
            (nostalgistRef.current as any).pressUp(button);
        } catch (err) {
            console.error('[Nostalgist] Press up error:', err);
        }
    }, [nostalgistRef]);

    return {
        pressKey,
        pressDown,
        pressUp,
    };
}

