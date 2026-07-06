/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Image as ImageIcon, Sliders, Play, CheckCircle2, 
  AlertCircle, ShieldAlert, FileText, Sparkles, RefreshCw, Eye
} from 'lucide-react';
import { AnalysisResult, HistoryItem, RipenessLevel } from '../types';
import { 
  applyBoxBlur, applySobelEdgeDetection, applyThreshold, 
  extractColorSegmentation, extractVisualMetrics, rgbToHex 
} from '../utils/imageProcessing';

interface FruitAnalyzerProps {
  onAnalysisSuccess: (item: HistoryItem) => void;
  loadedHistoryItem?: HistoryItem | null;
  onResetLoadedItem?: () => void;
}

type DIPViewMode = 'original' | 'blur' | 'sobel' | 'threshold' | 'segmentation';

export default function FruitAnalyzer({ 
  onAnalysisSuccess, 
  loadedHistoryItem, 
  onResetLoadedItem 
}: FruitAnalyzerProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [dipMode, setDipMode] = useState<DIPViewMode>('original');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [hoveredAnnotation, setHoveredAnnotation] = useState<number | null>(null);
  
  // Ref untuk canvas gambar asli dan canvas interaktif DIP
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Metrik lokal yang diekstrak secara real-time dari canvas
  const [localMetrics, setLocalMetrics] = useState<{
    rgb: { r: number; g: number; b: number };
    hsv: { h: number; s: number; v: number };
    brightness: number;
    saturation: number;
    dominantColorHex: string;
    dominantColorName: string;
  } | null>(null);

  // Menangani drag and drop gambar
  const [isDragging, setIsDragging] = useState(false);

  // Load item riwayat jika dipilih oleh pengguna dari tab lain
  useEffect(() => {
    if (loadedHistoryItem) {
      setImageSrc(loadedHistoryItem.imageUrl);
      setAnalysisResult(loadedHistoryItem.result);
      setError(null);
      setDipMode('original');
      onResetLoadedItem?.();
    }
  }, [loadedHistoryItem, onResetLoadedItem]);

  // Gambar ulang canvas jika mode DIP diubah atau gambar dimuat
  useEffect(() => {
    if (!imageSrc || !originalImageRef.current || !canvasRef.current) return;

    const img = originalImageRef.current;
    
    // Tunggu sampai gambar termuat sepenuhnya
    const renderCanvas = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Atur ukuran standar agar tidak terlalu berat memproses pixel (maksimal lebar/tinggi 400px)
      const maxDim = 400;
      let w = img.naturalWidth || img.width || 300;
      let h = img.naturalHeight || img.height || 300;
      
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      // Ekstrak ImageData asli
      let imgData = ctx.getImageData(0, 0, w, h);

      // Ekstrak metrik awal jika belum ada
      const metrics = extractVisualMetrics(canvas);
      setLocalMetrics(metrics);

      // Aplikasikan pengolahan citra digital berdasarkan mode
      if (dipMode === 'blur') {
        imgData = applyBoxBlur(imgData);
      } else if (dipMode === 'sobel') {
        imgData = applySobelEdgeDetection(imgData, 25);
      } else if (dipMode === 'threshold') {
        imgData = applyThreshold(imgData, 120);
      } else if (dipMode === 'segmentation') {
        imgData = extractColorSegmentation(imgData);
      }

      // Gambar kembali data piksel yang terproses
      ctx.putImageData(imgData, 0, 0);
    };

    if (img.complete) {
      renderCanvas();
    } else {
      img.onload = renderCanvas;
    }
  }, [imageSrc, dipMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readImageFile(file);
    }
  };

  const readImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Format file salah. Silakan unggah gambar buah (JPG, JPEG, PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
        setAnalysisResult(null);
        setError(null);
        setDipMode('original');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      readImageFile(file);
    }
  };

  const runAnalysis = async () => {
    if (!imageSrc) return;
    setIsProcessing(true);
    setError(null);

    try {
      // Kirim metrik pengolahan citra lokal sebagai pembantu ke Gemini AI
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageSrc,
          clientMetrics: localMetrics
        }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Terjadi kesalahan sistem saat menghubungi model AI.');
      }

      const result: AnalysisResult = data.result;
      setAnalysisResult(result);

      // Simpan hasil ke riwayat
      const newHistoryItem: HistoryItem = {
        id: `hist-${Date.now()}`,
        timestamp: new Date().toLocaleString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        imageUrl: imageSrc,
        result
      };

      onAnalysisSuccess(newHistoryItem);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal menganalisis gambar. Mohon periksa kembali API Key Anda.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper untuk badge kematangan
  const getRipenessBadge = (level: RipenessLevel) => {
    switch (level) {
      case 'MENTAH':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            MENTAH / UNRIPE
          </span>
        );
      case 'MATANG':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            MATANG / RIPE
          </span>
        );
      case 'TERLALU_MATANG':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            TERLALU MATANG / OVERRIPE
          </span>
        );
    }
  };

  return (
    <div id="fruit-analyzer-root" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Kiri: Input Gambar & Pengolahan Citra Digital */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
          <h2 className="text-lg font-semibold font-sans tracking-tight text-gray-900 mb-4 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            Input & Pengolahan Citra Digital
          </h2>

          {/* Upload Area */}
          {!imageSrc ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                isDragging 
                  ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xs">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-semibold text-gray-800 text-sm mb-1">
                Unggah atau Seret Gambar Buah
              </p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Mendukung file format JPG, JPEG, atau PNG. Sistem akan melakukan segmentasi pixel secara otomatis.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Gambar Tersembunyi untuk referensi Image Element */}
              <img
                ref={originalImageRef}
                src={imageSrc}
                alt="Original"
                className="hidden"
              />

              {/* Tampilan Visual Citra Terproses */}
              <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-slate-900 flex items-center justify-center aspect-video shadow-inner group">
                <canvas
                  ref={canvasRef}
                  className="max-h-full max-w-full object-contain"
                />

                {/* Overlays untuk anotasi AI jika ada */}
                {analysisResult && dipMode === 'original' && (
                  <div className="absolute inset-0 pointer-events-none">
                    {analysisResult.annotations.map((ann, idx) => (
                      <div
                        key={idx}
                        className={`absolute border-2 transition-all duration-200 cursor-pointer pointer-events-auto ${
                          hoveredAnnotation === idx 
                            ? 'border-emerald-400 bg-emerald-400/20 shadow-lg' 
                            : 'border-amber-400 bg-amber-400/5'
                        }`}
                        style={{
                          left: `${ann.x}%`,
                          top: `${ann.y}%`,
                          width: `${ann.width}%`,
                          height: `${ann.height}%`
                        }}
                        onMouseEnter={() => setHoveredAnnotation(idx)}
                        onMouseLeave={() => setHoveredAnnotation(null)}
                        title={`${ann.label}: ${ann.reason}`}
                      />
                    ))}
                  </div>
                )}

                {/* Indikator Mode Pengolahan Citra */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/75 backdrop-blur-xs text-[10px] font-mono font-medium text-white tracking-widest uppercase shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  MODE: {dipMode}
                </div>

                {/* Hover tip */}
                <div className="absolute bottom-3 left-3 right-3 p-2 rounded bg-black/70 backdrop-blur-xs text-[10px] text-gray-300 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  Teknik binerisasi & gradien tepi Sobel dihitung langsung di peramban Anda.
                </div>
              </div>

              {/* Kontrol Toggle Pengolahan Citra (DIP) */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Hasil Pengolahan Citra Digital (DIP)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                  {(
                    [
                      { id: 'original', label: 'Asli (RGB)', icon: ImageIcon },
                      { id: 'blur', label: 'Noise Reduction', icon: Sparkles },
                      { id: 'sobel', label: 'Tepi Sobel', icon: Eye },
                      { id: 'threshold', label: 'Threshold', icon: Sliders },
                      { id: 'segmentation', label: 'Segmentasi', icon: RefreshCw }
                    ] as const
                  ).map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setDipMode(mode.id)}
                        className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 px-2.5 py-2 sm:py-1.5 rounded-md text-[11px] font-medium transition-all ${
                          dipMode === mode.id
                            ? 'bg-white text-emerald-700 shadow-xs border border-gray-100'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="truncate">{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Metrik Ekstraksi Fitur Fisik Lokal */}
              {localMetrics && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2 bg-gray-50/50 border border-gray-100 rounded-xl p-3.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Warna Dominan</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300 shadow-3xs" 
                        style={{ backgroundColor: localMetrics.dominantColorHex }}
                      />
                      <span className="text-xs font-medium text-gray-800 truncate">{localMetrics.dominantColorName}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Rata-rata RGB</span>
                    <span className="text-xs font-mono font-medium text-gray-700">
                      R:{localMetrics.rgb.r} G:{localMetrics.rgb.g} B:{localMetrics.rgb.b}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Kecerahan (HSV.V)</span>
                    <span className="text-xs font-mono font-medium text-gray-700">
                      {localMetrics.brightness}%
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Saturasi (HSV.S)</span>
                    <span className="text-xs font-mono font-medium text-gray-700">
                      {localMetrics.saturation}%
                    </span>
                  </div>
                </div>
              )}

              {/* Tombol Aksi */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => {
                    setImageSrc(null);
                    setLocalMetrics(null);
                    setAnalysisResult(null);
                    setError(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Unggah Baru
                </button>
                <button
                  onClick={runAnalysis}
                  disabled={isProcessing}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Memproses Citra & AI...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      Analisis Kematangan Buah
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Petunjuk Workflow Pengolahan Citra */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 text-slate-300">
          <h3 className="text-sm font-semibold font-sans tracking-tight text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Alur Preprocessing Citra Digital Anda
          </h3>
          <ol className="list-decimal pl-5 text-xs space-y-2 text-slate-400">
            <li><strong className="text-slate-200">Pre-processing:</strong> Gambar diproyeksikan ke canvas berukuran terstandarisasi. Menggunakan 3x3 filter untuk reduksi noise klorofilik.</li>
            <li><strong className="text-slate-200">Segmentasi Edge Sobel:</strong> Menghitung matriks konvolusi piksel horizontal (Gx) & vertikal (Gy) untuk memetakan tepi bentuk fisik luar buah.</li>
            <li><strong className="text-slate-200">Konversi Kolorimetri:</strong> Merotasi koordinat warna RGB kartesian ke polar HSV (Hue, Saturation, Value) guna menangkap intensitas klorofil (hijau) versus likopen/karotenoid (merah/oranye).</li>
            <li><strong className="text-slate-200">Klasifikasi AI Vision:</strong> Model Gemini Vision menyatukan visual mentah dan metrik pixel numerik lokal untuk mengunci klasifikasi akhir.</li>
          </ol>
        </div>
      </div>

      {/* Kolom Kanan: Hasil Klasifikasi AI Vision */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        <AnimatePresence mode="wait">
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-2xl border border-gray-100 p-8 shadow-xs text-center flex flex-col items-center justify-center min-h-[400px]"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
                <Sparkles className="w-6 h-6 text-emerald-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mengolah Citra Buah</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Sistem sedang memisahkan buah dari background, menguji histogram warna, dan mengirim citra tersegmentasi ke Google Gemini Vision untuk evaluasi final...
              </p>
              <div className="w-48 bg-gray-100 rounded-full h-1.5 mt-6 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full animate-[loading_1.5s_infinite_ease-in-out]" style={{ width: '40%' }}></div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4"
            >
              <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 text-sm mb-1">Kegagalan Analisis Sistem</h3>
                <p className="text-xs text-red-700 leading-relaxed mb-4">{error}</p>
                <div className="text-[11px] text-red-600 font-medium">
                  Saran: Pastikan Anda telah memasukkan kunci rahasia <code className="font-mono bg-red-100/50 px-1 py-0.5 rounded">GEMINI_API_KEY</code> di menu <strong className="font-semibold">Settings &gt; Secrets</strong> pada editor sebelah kanan atas AI Studio.
                </div>
              </div>
            </motion.div>
          )}

          {!isProcessing && !error && !analysisResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]"
            >
              <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Hasil Klasifikasi Buah</h3>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                Silakan unggah foto buah Anda di kolom sebelah kiri, lalu tekan tombol "Analisis Kematangan Buah" untuk menjalankan segmentasi visual AI.
              </p>
            </motion.div>
          )}

          {!isProcessing && !error && analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              {/* Hasil Ringkasan */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono">
                      Nama Buah Terdeteksi
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1 font-sans">
                      {analysisResult.fruitName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono block">
                      Tingkat Kematangan
                    </span>
                    <div className="mt-1">{getRipenessBadge(analysisResult.ripeness)}</div>
                  </div>
                </div>

                {/* Score & Confidence */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">Confidence Score</span>
                      <span className="text-sm font-bold text-emerald-600">{analysisResult.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${analysisResult.confidence}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full border border-gray-200 shadow-2xs"
                      style={{ backgroundColor: analysisResult.dominantColorHex }}
                    />
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Warna Dominan AI</span>
                      <span className="text-xs font-semibold text-gray-800">{analysisResult.dominantColorName}</span>
                      <span className="text-[10px] font-mono text-gray-500 block">{analysisResult.dominantColorHex}</span>
                    </div>
                  </div>
                </div>

                {/* Penjelasan Ciri Visual */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 font-mono">
                    Penjelasan Karakteristik Visual
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed bg-emerald-50/30 border border-emerald-100/50 rounded-xl p-4">
                    {analysisResult.visualExplanation}
                  </p>
                </div>

                {/* Hasil Analisis Fisik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Metrik Tekstur Kulit</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs font-semibold text-gray-800 bg-gray-100 px-2.5 py-1 rounded">
                        {analysisResult.texture}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 leading-snug">{analysisResult.textureDetail}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Metrik Keutuhan Bentuk</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs font-semibold text-gray-800 bg-gray-100 px-2.5 py-1 rounded">
                        {analysisResult.shape}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 leading-snug">{analysisResult.shapeDetail}</p>
                  </div>
                </div>

                {/* Highlight Anotasi (Tergantung Hover) */}
                {analysisResult.annotations.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block font-mono">
                      Anotasi Area Penentu (Arahkan Kursor)
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {analysisResult.annotations.map((ann, idx) => (
                        <div
                          key={idx}
                          onMouseEnter={() => setHoveredAnnotation(idx)}
                          onMouseLeave={() => setHoveredAnnotation(null)}
                          className={`p-2.5 rounded-lg border text-xs transition-all ${
                            hoveredAnnotation === idx
                              ? 'bg-emerald-50 border-emerald-200 shadow-3xs translate-x-1'
                              : 'bg-gray-50 border-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <strong className="font-semibold text-gray-800 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {ann.label}
                            </strong>
                            <span className="text-[10px] font-mono text-gray-400">Area {idx+1}</span>
                          </div>
                          <p className="text-gray-600 text-[11px] leading-relaxed">{ann.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Rekomendasi Pemanfaatan */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
                <h4 className="text-sm font-semibold font-sans tracking-tight text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Rekomendasi Agronomi &amp; Pemanfaatan
                </h4>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <strong className="text-xs text-gray-800 block mb-0.5">Penyimpanan &amp; Daya Tahan</strong>
                      <p className="text-xs text-gray-600 leading-relaxed">{analysisResult.recommendations.storage}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <strong className="text-xs text-gray-800 block mb-0.5">Konsumsi Langsung</strong>
                      <p className="text-xs text-gray-600 leading-relaxed">{analysisResult.recommendations.consumption}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <strong className="text-xs text-gray-800 block mb-0.5">Pengolahan Kuliner Lanjutan</strong>
                      <p className="text-xs text-gray-600 leading-relaxed">{analysisResult.recommendations.processing}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 text-[10px] text-gray-400 bg-gray-50 rounded-lg p-3 border border-gray-100">
                <AlertCircle className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Disclaimer:</strong> Analisis ini dihasilkan melalui teknik kecerdasan buatan visi komputer (Computer Vision AI) berbasis sensor piksel gambar. Kondisi kesegaran internal nyata dapat bervariasi bergantung kondisi lingkungan dan metode penyimpanan buah yang tidak terdeteksi oleh kamera.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
