export type V3 = [number, number, number];

export type ShadingPresetId = 'flat' | 'painted' | 'strongLine' | 'target';

export interface ShadingPreset {
  label: string;
  gradients: boolean;
  outlineScale: number;
}

export const SHADING_PRESETS: Record<ShadingPresetId, ShadingPreset> = {
  flat: { label: '1 · Flat Toon', gradients: false, outlineScale: 0.35 },
  painted: { label: '2 · Toon + Painted Gradients', gradients: true, outlineScale: 0.35 },
  strongLine: { label: '3 · Toon + Strong Outline', gradients: false, outlineScale: 1 },
  target: { label: '4 · Gradients + Strong Outline', gradients: true, outlineScale: 1 },
};

export interface LabSettings {
  shading: ShadingPresetId;
  outlineThickness: number;
  outlineOpacity: number;
  shadowThreshold: number;
  shadowSoftness: number;
  gradientStrength: number;
  hairGradient: number;
  faceGradient: number;
  suitGradient: number;
  eyeDepth: number;
  eyeScale: number;
  cameraAzimuth: number;
  lightAzimuth: number;
  lightElevation: number;
  animSpeed: number;
  danceFrequency: number;
}

export type NumericSettingKey = Exclude<keyof LabSettings, 'shading'>;

export const DEFAULT_SETTINGS: LabSettings = {
  shading: 'target',
  outlineThickness: 0.014,
  outlineOpacity: 1,
  shadowThreshold: 0.3,
  shadowSoftness: 0.05,
  gradientStrength: 1,
  hairGradient: 0.6,
  faceGradient: 0.5,
  suitGradient: 0.5,
  eyeDepth: 0,
  eyeScale: 1,
  cameraAzimuth: 16,
  lightAzimuth: -15,
  lightElevation: 30,
  animSpeed: 1,
  danceFrequency: 1,
};

/** Colors estimated by eye from the Banta artwork. Replace with eyedropped values. */
export const PALETTE = {
  skin: '#f8dcc9', skinShade: '#f0cfc3', skinTop: '#fce6d8', skinBottom: '#f3c5b3',
  hair: '#a66a45', hairShade: '#b98d86', hairTop: '#b97b51', hairBottom: '#8f5039',
  suit: '#262f73', suitShade: '#7f86b8', suitTop: '#262f73', suitBottom: '#34419a',
  scarf: '#e23b3b', scarfShade: '#b86478',
  pack: '#f2b53d', packShade: '#d6925f',
  paper: '#c3dcf0', paperShade: '#a8b4cc',
  shoe: '#e5373a', shoeShade: '#b85a70',
  sole: '#fbf6f0', soleShade: '#c9bcc4',
  eyeWhite: '#fffaf3', eyeWhiteShade: '#e6d6da',
  iris: '#4b2b26', irisShade: '#a08486', irisTop: '#2d1916', irisBottom: '#74443a',
  pupil: '#170d0b',
  line: '#2a1b1d',
  nose: '#d98f86',
  blush: '#f0a39f',
};
