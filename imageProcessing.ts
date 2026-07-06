/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ColorHSV, ColorRGB } from '../types';

/**
 * Konversi warna dari RGB ke HSV
 */
export function rgbToHsv(r: number, g: number, b: number): ColorHSV {
  const rf = r / 255;
  const gf = g / 255;
  const bf = b / 255;

  const max = Math.max(rf, gf, bf);
  const min = Math.min(rf, gf, bf);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rf) {
      h = ((gf - bf) / delta) % 6;
    } else if (max === gf) {
      h = (bf - rf) / delta + 2;
    } else {
      h = (rf - gf) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : Math.round((delta / max) * 100);
  const v = Math.round(max * 100);

  return { h, s, v };
}

/**
 * Konversi warna dari HSV ke RGB
 */
export function hsvToRgb(h: number, s: number, v: number): ColorRGB {
  const sf = s / 100;
  const vf = v / 100;

  const c = vf * sf;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vf - c;

  let rf = 0, gf = 0, bf = 0;

  if (h >= 0 && h < 60) {
    rf = c; gf = x; bf = 0;
  } else if (h >= 60 && h < 120) {
    rf = x; gf = c; bf = 0;
  } else if (h >= 120 && h < 180) {
    rf = 0; gf = c; bf = x;
  } else if (h >= 180 && h < 240) {
    rf = 0; gf = x; bf = c;
  } else if (h >= 240 && h < 300) {
    rf = x; gf = 0; bf = c;
  } else if (h >= 300 && h <= 360) {
    rf = c; gf = 0; bf = x;
  }

  return {
    r: Math.round((rf + m) * 255),
    g: Math.round((gf + m) * 255),
    b: Math.round((bf + m) * 255)
  };
}

/**
 * Konversi RGB ke HEX
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, c)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Menamai warna berdasarkan HSV untuk keperluan klasifikasi lokal
 */
export function getClosestColorName(h: number, s: number, v: number): string {
  if (v < 15) return 'Hitam';
  if (s < 15 && v > 75) return 'Putih';
  if (s < 15) return 'Abu-abu';

  if (h >= 345 || h < 15) {
    return v < 50 ? 'Coklat Kemerahan' : 'Merah';
  }
  if (h >= 15 && h < 45) {
    return v < 50 ? 'Coklat Tua' : 'Oranye / Jingga';
  }
  if (h >= 45 && h < 70) {
    return 'Kuning';
  }
  if (h >= 70 && h < 165) {
    return v < 35 ? 'Hijau Gelap' : 'Hijau';
  }
  if (h >= 165 && h < 255) {
    return 'Biru';
  }
  if (h >= 255 && h < 315) {
    return 'Ungu';
  }
  return 'Pink / Merah Muda';
}

/**
 * Mengaplikasikan Box Blur 3x3 (Noise Reduction) pada ImageData
 */
export function applyBoxBlur(imageData: ImageData): ImageData {
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  
  // Create a copy of the original pixel data
  const dst = new Uint8ClampedArray(src.length);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      
      // Look at 3x3 surrounding pixels
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const px = x + kx;
          const py = y + ky;
          
          if (px >= 0 && px < width && py >= 0 && py < height) {
            const idx = (py * width + px) * 4;
            rSum += src[idx];
            gSum += src[idx + 1];
            bSum += src[idx + 2];
            count++;
          }
        }
      }
      
      const idx = (y * width + x) * 4;
      dst[idx] = rSum / count;     // R
      dst[idx + 1] = gSum / count; // G
      dst[idx + 2] = bSum / count; // B
      dst[idx + 3] = src[idx + 3]; // Alpha tetap sama
    }
  }
  
  return new ImageData(dst, width, height);
}

/**
 * Mengaplikasikan Sobel Edge Detection (Segmentasi Tepi)
 */
export function applySobelEdgeDetection(imageData: ImageData, threshold: number = 30): ImageData {
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  const dst = new Uint8ClampedArray(src.length);

  // Sobel Kernels
  const Gx = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ];
  const Gy = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
  ];

  // Grayscale helper
  const getGray = (x: number, y: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return 0;
    const idx = (y * width + x) * 4;
    // Standar Luminansi
    return 0.299 * src[idx] + 0.587 * src[idx + 1] + 0.114 * src[idx + 2];
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let valX = 0;
      let valY = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const gray = getGray(x + kx, y + ky);
          valX += gray * Gx[ky + 1][kx + 1];
          valY += gray * Gy[ky + 1][kx + 1];
        }
      }

      // Hitung Magnitude gradien
      const magnitude = Math.sqrt(valX * valX + valY * valY);
      const edgeColor = magnitude > threshold ? 255 : 0;

      const idx = (y * width + x) * 4;
      dst[idx] = edgeColor;       // R
      dst[idx + 1] = edgeColor;   // G
      dst[idx + 2] = edgeColor;   // B
      dst[idx + 3] = 255;         // Opasitas penuh
    }
  }

  return new ImageData(dst, width, height);
}

/**
 * Mengaplikasikan Segmentasi Thresholding Warna (Binerisasi)
 */
export function applyThreshold(imageData: ImageData, thresholdValue: number = 127): ImageData {
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  const dst = new Uint8ClampedArray(src.length);

  for (let i = 0; i < src.length; i += 4) {
    const r = src[i];
    const g = src[i + 1];
    const b = src[i + 2];
    
    // Hitung intensitas kecerahan
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const binaryValue = gray > thresholdValue ? 255 : 0;

    dst[i] = binaryValue;     // R
    dst[i + 1] = binaryValue; // G
    dst[i + 2] = binaryValue; // B
    dst[i + 3] = src[i + 3];  // Alpha
  }

  return new ImageData(dst, width, height);
}

/**
 * Mengambil Segmentasi Warna (memilah area piksel non-background)
 * Mengasumsikan background putih/terang atau netral. Memisahkan buah.
 */
export function extractColorSegmentation(imageData: ImageData, targetColorHsvRange?: { hMin: number; hMax: number }): ImageData {
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  const dst = new Uint8ClampedArray(src.length);

  for (let i = 0; i < src.length; i += 4) {
    const r = src[i];
    const g = src[i + 1];
    const b = src[i + 2];
    const a = src[i + 3];

    // Konversi ke HSV
    const hsv = rgbToHsv(r, g, b);

    // Filter background (misal warna putih/abu terang: s rendah, v tinggi)
    const isBackground = hsv.s < 12 && hsv.v > 85;

    if (isBackground) {
      // Ubah background menjadi abu-abu transparan/hitam agar terlihat area tersegmentasi
      dst[i] = 18;
      dst[i + 1] = 18;
      dst[i + 2] = 24;
      dst[i + 3] = 120;
    } else {
      // Pertahankan warna buah asli
      dst[i] = r;
      dst[i + 1] = g;
      dst[i + 2] = b;
      dst[i + 3] = a;
    }
  }

  return new ImageData(dst, width, height);
}

/**
 * Mengekstrak metrik visual utama dari canvas (rata-rata warna, kecerahan, saturasi, warna dominan)
 */
export function extractVisualMetrics(canvas: HTMLCanvasElement): {
  rgb: ColorRGB;
  hsv: ColorHSV;
  brightness: number;
  saturation: number;
  dominantColorHex: string;
  dominantColorName: string;
} {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      rgb: { r: 128, g: 128, b: 128 },
      hsv: { h: 0, s: 0, v: 50 },
      brightness: 50,
      saturation: 0,
      dominantColorHex: '#808080',
      dominantColorName: 'Abu-abu'
    };
  }

  // Reduksi ukuran internal untuk performa perhitungan cepat
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 40;
  tempCanvas.height = 40;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) {
    return {
      rgb: { r: 128, g: 128, b: 128 },
      hsv: { h: 0, s: 0, v: 50 },
      brightness: 50,
      saturation: 0,
      dominantColorHex: '#808080',
      dominantColorName: 'Abu-abu'
    };
  }

  tempCtx.drawImage(canvas, 0, 0, 40, 40);
  const imgData = tempCtx.getImageData(0, 0, 40, 40);
  const pixels = imgData.data;

  let rSum = 0, gSum = 0, bSum = 0, count = 0;
  let brightnessSum = 0;
  let saturationSum = 0;

  // Frekuensi warna kelompok untuk dominansi
  const colorBuckets: Record<string, number> = {};

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    // Lewati piksel transparan atau piksel mendekati latar belakang netral terang/gelap
    if (a < 150) continue;
    
    const hsv = rgbToHsv(r, g, b);
    
    // Abaikan background studio putih bersih
    if (hsv.s < 10 && hsv.v > 90) continue;
    
    rSum += r;
    gSum += g;
    bSum += b;
    brightnessSum += hsv.v;
    saturationSum += hsv.s;
    count++;

    // Kelompokkan dalam radius hue terdekat
    const roundedHue = Math.round(hsv.h / 15) * 15;
    const key = `${roundedHue}-${Math.round(hsv.s / 20) * 20}-${Math.round(hsv.v / 20) * 20}`;
    colorBuckets[key] = (colorBuckets[key] || 0) + 1;
  }

  if (count === 0) {
    return {
      rgb: { r: 244, g: 67, b: 54 },
      hsv: { h: 4, s: 78, v: 96 },
      brightness: 96,
      saturation: 78,
      dominantColorHex: '#F44336',
      dominantColorName: 'Merah'
    };
  }

  const rAvg = Math.round(rSum / count);
  const gAvg = Math.round(gSum / count);
  const bAvg = Math.round(bSum / count);
  const avgHsv = rgbToHsv(rAvg, gAvg, bAvg);
  const brightnessAvg = Math.round(brightnessSum / count);
  const saturationAvg = Math.round(saturationSum / count);

  // Cari warna dominan berdasarkan ember terbesar
  let maxCount = 0;
  let dominantRgb = { r: rAvg, g: gAvg, b: bAvg };
  let dominantHsv = avgHsv;

  for (const [key, bCount] of Object.entries(colorBuckets)) {
    if (bCount > maxCount) {
      maxCount = bCount;
      const [hStr, sStr, vStr] = key.split('-');
      dominantHsv = { h: parseInt(hStr), s: parseInt(sStr), v: parseInt(vStr) };
      dominantRgb = hsvToRgb(dominantHsv.h, dominantHsv.s, dominantHsv.v);
    }
  }

  const dominantHex = rgbToHex(dominantRgb.r, dominantRgb.g, dominantRgb.b);
  const dominantName = getClosestColorName(dominantHsv.h, dominantHsv.s, dominantHsv.v);

  return {
    rgb: dominantRgb,
    hsv: dominantHsv,
    brightness: brightnessAvg,
    saturation: saturationAvg,
    dominantColorHex: dominantHex,
    dominantColorName: dominantName
  };
}
