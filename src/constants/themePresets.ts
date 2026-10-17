import { SkinTone } from '../types/database';

export interface PredefinedColor {
  id: string;
  name: string;
  hex: string;
}

export const PREDEFINED_ACCENTS: PredefinedColor[] = [
  { id: 'electric-blue', name: 'Electric Blue', hex: '#3b82f6' },
  { id: 'chrome-silver', name: 'Chrome Silver', hex: '#94a3b8' },
  { id: 'hyper-violet', name: 'Hyper Violet', hex: '#8b5cf6' },
  { id: 'crimson-steel', name: 'Crimson Steel', hex: '#f43f5e' },
  { id: 'emerald-titanium', name: 'Emerald Titanium', hex: '#10b981' },
  { id: 'amber-gold', name: 'Amber Gold', hex: '#f59e0b' },
];

export const PREDEFINED_GLOW_COLORS: PredefinedColor[] = [
  { id: 'cyber-cyan', name: 'Cyber Cyan', hex: '#00f0ff' },
  { id: 'electric-amber', name: 'Amber Heat', hex: '#f59e0b' },
  { id: 'crimson-pulse', name: 'Crimson Pulse', hex: '#f43f5e' },
  { id: 'acid-lime', name: 'Acid Lime', hex: '#84cc16' },
  { id: 'hyper-violet', name: 'Bio-Violet', hex: '#a855f7' },
  { id: 'emerald-hyper', name: 'Hyper Emerald', hex: '#10b981' },
];

export interface SkinToneOption {
  id: SkinTone;
  name: string;
  hex: string;
  description: string;
}

export const SKIN_TONE_OPTIONS: SkinToneOption[] = [
  { id: 'fair', name: 'Fair', hex: '#f7d0b5', description: 'Porcelain Peach' },
  { id: 'medium', name: 'Medium', hex: '#d9a07a', description: 'Warm Olive' },
  { id: 'tan', name: 'Tan', hex: '#b3764d', description: 'Golden Bronze' },
  { id: 'dark', name: 'Deep', hex: '#633c24', description: 'Rich Espresso' },
];
