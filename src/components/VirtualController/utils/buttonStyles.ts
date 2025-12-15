/**
 * Button styling utilities for virtual controller buttons
 * 
 * Provides console-specific color schemes and pressed state styling.
 */

import { ButtonType } from '../layouts';

export interface ButtonStyle {
  bg: string;
  text: string;
  border: string;
  shadow: string;
  transform: string;
}

// --- DEFAULT STYLES ---

const DEFAULT_FACE: ButtonStyle = {
  bg: 'bg-white/10 backdrop-blur-md',
  text: 'text-white',
  border: 'border-white/30',
  shadow: 'shadow-lg',
  transform: '',
};

const DEFAULT_SHOULDER: ButtonStyle = {
  bg: 'bg-white/20 backdrop-blur-md',
  text: 'text-white',
  border: 'border-white/30',
  shadow: 'shadow-sm',
  transform: '',
};

const DEFAULT_SYSTEM: ButtonStyle = {
  bg: 'bg-black/60 backdrop-blur-md',
  text: 'text-white/80',
  border: 'border-white/20',
  shadow: 'shadow-sm',
  transform: '',
};

const PRESSED_STYLE: ButtonStyle = {
  bg: 'bg-white/90',
  text: 'text-black',
  border: 'border-white',
  shadow: 'shadow-none',
  transform: 'scale(0.95)',
};

// --- HELPER FUNCTIONS ---

function coloredButton(bgColor: string, textColor: string = 'text-white'): ButtonStyle {
  return {
    bg: bgColor,
    text: textColor,
    border: 'border-white/20',
    shadow: 'shadow-lg',
    transform: '',
  };
}

function psButton(symbolColor: string): ButtonStyle {
  return {
    bg: 'bg-black/80 backdrop-blur-md',
    text: symbolColor,
    border: 'border-white/30',
    shadow: 'shadow-lg',
    transform: '',
  };
}

// --- MAIN FUNCTION ---

/**
 * Get button styles based on type, pressed state, and console
 */
export function getButtonStyles(
  buttonType: ButtonType,
  isPressed: boolean,
  consoleName: string = ''
): ButtonStyle {
  if (isPressed) {
    return PRESSED_STYLE;
  }

  const c = consoleName.toUpperCase();

  // Neo Geo: A(red)/B(yellow)/C(green)/D(blue) → mapped to b/a/y/x
  if (c === 'NEOGEO') {
    switch (buttonType) {
      case 'b': return coloredButton('bg-[#E60012]');           // A = Red
      case 'a': return coloredButton('bg-[#FFD600]', 'text-black'); // B = Yellow
      case 'y': return coloredButton('bg-[#009944]');           // C = Green
      case 'x': return coloredButton('bg-[#0068B7]');           // D = Blue
    }
  }

  // PlayStation: Symbol colors
  if (c === 'PSX' || c === 'PS1' || c === 'PSP') {
    switch (buttonType) {
      case 'y': return psButton('text-[#25D998]'); // △ = Green
      case 'b': return psButton('text-[#FF5555]'); // ○ = Red
      case 'a': return psButton('text-[#5599FF]'); // ✕ = Blue
      case 'x': return psButton('text-[#E889DD]'); // □ = Pink
    }
  }

  // SNES: Colored face buttons
  if (c === 'SNES' || c === 'NDS') {
    switch (buttonType) {
      case 'a': return coloredButton('bg-[#CC0000]');           // A = Red
      case 'b': return coloredButton('bg-[#CCCC00]', 'text-black'); // B = Yellow
      case 'x': return coloredButton('bg-[#0033CC]');           // X = Blue
      case 'y': return coloredButton('bg-[#006600]');           // Y = Green
    }
  }

  // Default by button type
  switch (buttonType) {
    case 'a':
    case 'b':
    case 'x':
    case 'y':
      return DEFAULT_FACE;

    case 'l':
    case 'r':
    case 'l2':
    case 'r2':
      return DEFAULT_SHOULDER;

    case 'start':
    case 'select':
    case 'menu':
      return DEFAULT_SYSTEM;

    default:
      return DEFAULT_FACE;
  }
}
