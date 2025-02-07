import { BUTTON_CATEGORIES } from '../enums/enums';
import { KeyButton } from '../interfaces/key-button';

const NUMERIC_BUTTONS: KeyButton[] = [
  { key: 1, output: '1' },
  { key: 2, output: '4' },
  { key: 3, output: '5' },
  { key: 4, output: '6' },
  { key: 5, output: '7' },
  { key: 16, output: '8' },
  { key: 17, output: '9' },
  { key: 18, output: '10' },
  { key: 19, output: '11' },
  { key: 20, output: '12' },
  { key: 21, output: '13' },
  { key: 22, output: '14' },
  { key: 23, output: '15' },
  { key: 24, output: '16' },
  { key: 25, output: '17' },
];


const SYMBOLIC_BUTTONS: KeyButton[] = [
  { key: 6, output: '16' },
  { key: 7, output: '4.' },
  { key: 8, output: '5(' },
  { key: 9, output: '6°' },
  { key: 10, output: '7+' },
  { key: 26, output: '8.' },
  { key: 27, output: '9.' },
  { key: 28, output: '10.' },
  { key: 29, output: '11.' },
  { key: 30, output: '12.' },
  { key: 31, output: '13.' },
  { key: 32, output: '14.' },
  { key: 33, output: '15.' },
  { key: 34, output: '16.' },
  { key: 35, output: '17.' },
];


const CHARACTER_BUTTONS: KeyButton[] = [
  { key: 11, output: 'H' },
  { key: 12, output: 'D' },
  { key: 13, output: 'K' },
  { key: 14, output: 'T' },
  { key: 15, output: 'P' },
  { key: 36, output: 'A' },
  { key: 37, output: 'B' },
  { key: 38, output: 'C' },
  { key: 39, output: 'E' },
  { key: 40, output: 'F' },
  { key: 41, output: 'G' },
  { key: 42, output: 'I' },
  { key: 43, output: 'J' },
  { key: 44, output: 'L' },
  { key: 45, output: 'M' },
];

/**
 * Maps button categories from the `BUTTON_CATEGORIES` enum to their respective button configurations.
 * Each entry associates a category with a specific set of `KeyButton` mappings.
 */
export const BUTTON_CATEGORIES_MAP = new Map<BUTTON_CATEGORIES, KeyButton[]>([
  [BUTTON_CATEGORIES.NUMBER, NUMERIC_BUTTONS], // Buttons for numeric values
  [BUTTON_CATEGORIES.SYMBOL, SYMBOLIC_BUTTONS], // Buttons for symbols and floating-point values
  [BUTTON_CATEGORIES.CHARACTER, CHARACTER_BUTTONS], // Buttons for alphabetic or special character values
]);
