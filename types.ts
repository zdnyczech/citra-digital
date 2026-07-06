/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RipenessLevel = 'MENTAH' | 'MATANG' | 'TERLALU_MATANG';

export type TextureType = 'Halus' | 'Berbintik' | 'Keriput';

export type ShapeType = 'Normal' | 'Penyok' | 'Tidak Simetris';

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorHSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export interface Annotation {
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  width: number; // percentage width (0-100)
  height: number; // percentage height (0-100)
  label: string;
  reason: string;
}

export interface AnalysisResult {
  fruitName: string;
  ripeness: RipenessLevel;
  confidence: number; // 0 - 100
  dominantColorHex: string;
  dominantColorName: string;
  rgb: ColorRGB;
  hsv: ColorHSV;
  brightness: number; // 0 - 100
  saturation: number; // 0 - 100
  texture: TextureType;
  textureDetail: string;
  shape: ShapeType;
  shapeDetail: string;
  visualExplanation: string;
  recommendations: {
    storage: string;
    consumption: string;
    processing: string;
  };
  annotations: Annotation[];
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  imageUrl: string; // Base64 string or sample reference
  result: AnalysisResult;
}

export interface FruitSample {
  id: string;
  name: string;
  ripeness: RipenessLevel;
  imageUrl: string;
  description: string;
  expectedResult: {
    fruitName: string;
    ripeness: RipenessLevel;
    dominantColorName: string;
    dominantColorHex: string;
    texture: TextureType;
    shape: ShapeType;
    brightness: number;
    saturation: number;
    hsv: ColorHSV;
    rgb: ColorRGB;
    visualExplanation: string;
    recommendations: {
      storage: string;
      consumption: string;
      processing: string;
    };
    annotations: Annotation[];
  };
}
