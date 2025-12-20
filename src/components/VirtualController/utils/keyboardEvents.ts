/**
 * Utilities for dispatching keyboard events to the emulator canvas
 */

import { ControlMapping, DEFAULT_CONTROLS } from '../../types';

/**
 * Get keyboard code for a button type from controls mapping
 */
export function getKeyboardCode(
  buttonType: string,
  controls?: ControlMapping
): string | null {
  const key = buttonType as keyof ControlMapping;

  if (controls && key in controls && controls[key]) {
    return controls[key]!;
  }

  return DEFAULT_CONTROLS[key] ?? null;
}

/**
 * Derive key name from keyboard code
 */
export function getKeyName(code: string): string {
  if (code.startsWith('Key')) return code.slice(3).toLowerCase();
  if (code.startsWith('Arrow')) return code.slice(5);
  if (code === 'Enter') return 'Enter';
  if (code === 'ShiftRight' || code === 'ShiftLeft') return 'Shift';
  return code;
}

/**
 * Find the emulator canvas element
 */
export function getCanvas(): HTMLCanvasElement | null {
  return document.querySelector('.game-canvas-container canvas') as HTMLCanvasElement ||
    document.querySelector('canvas') as HTMLCanvasElement;
}

/**
 * Dispatch a keyboard event to the emulator
 * 
 * Note: RetroArch WebAssembly listens for keyboard events on the document,
 * not the canvas element. We dispatch to both for maximum compatibility.
 */
export function dispatchKeyboardEvent(
  type: 'keydown' | 'keyup',
  code: string
): boolean {
  const event = new KeyboardEvent(type, {
    code,
    key: getKeyName(code),
    bubbles: true,
    cancelable: true,
    // These properties help ensure the event is recognized
    keyCode: getKeyCode(code),
    which: getKeyCode(code),
  } as KeyboardEventInit);

  // Dispatch to document (where RetroArch listens)
  document.dispatchEvent(event);

  // Also dispatch to canvas for compatibility
  const canvas = getCanvas();
  if (canvas) {
    canvas.dispatchEvent(event);
  }

  return true;
}

/**
 * Get legacy keyCode for a code string
 */
function getKeyCode(code: string): number {
  const keyCodeMap: Record<string, number> = {
    'KeyA': 65, 'KeyB': 66, 'KeyC': 67, 'KeyD': 68, 'KeyE': 69,
    'KeyF': 70, 'KeyG': 71, 'KeyH': 72, 'KeyI': 73, 'KeyJ': 74,
    'KeyK': 75, 'KeyL': 76, 'KeyM': 77, 'KeyN': 78, 'KeyO': 79,
    'KeyP': 80, 'KeyQ': 81, 'KeyR': 82, 'KeyS': 83, 'KeyT': 84,
    'KeyU': 85, 'KeyV': 86, 'KeyW': 87, 'KeyX': 88, 'KeyY': 89,
    'KeyZ': 90,
    'ArrowUp': 38, 'ArrowDown': 40, 'ArrowLeft': 37, 'ArrowRight': 39,
    'Enter': 13, 'Space': 32, 'ShiftLeft': 16, 'ShiftRight': 16,
    'ControlLeft': 17, 'ControlRight': 17,
  };
  return keyCodeMap[code] || 0;
}

