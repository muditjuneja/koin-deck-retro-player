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
 * Dispatch a keyboard event to the emulator canvas
 */
export function dispatchKeyboardEvent(
  type: 'keydown' | 'keyup',
  code: string
): boolean {
  const canvas = getCanvas();
  if (!canvas) {
    return false;
  }

  const event = new KeyboardEvent(type, {
    code,
    key: getKeyName(code),
    bubbles: true,
    cancelable: true,
  });
  canvas.dispatchEvent(event);
  return true;
}

