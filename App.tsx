/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Sliders, ClipboardCheck, BarChart4, 
  BookOpen, Apple, Banana, HelpCircle, FileSpreadsheet,
  Layers, CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import FruitAnalyzer from './components/FruitAnalyzer';
import EvaluasiDashboard from './components/EvaluasiDashboard';
import HistoryList from './components/HistoryList';
import { HistoryItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'evaluation' | 'history' | 'guide'>('analyzer');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedOldItem, setSelectedOldItem] = useState<HistoryItem | null>(null);

  // Muat riwayat dari localStorage saat aplikasi pertama kali dimuat
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fruit_ripeness_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Gagal membaca localStorage:', err);
    }
  }, []);

  // Simpan item riwayat baru ke state & localStorage
  const handleAnalysisSuccess = (newItem: HistoryItem) => {
    setHistory((prev) => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem('fruit_ripeness_history', JSON.stringify(updated));
      } catch (err) {
        console.error('Gagal menyimpan ke localStorage:', err);
      }
      return updated;
    });
  };

  // Menghapus satu item dari riwayat
  const handleDeleteItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('fruit_ripeness_history', JSON.stringify(updated));
      } catch (err) {
        console.error('Gagal memperbarui localStorage:', err);
      }
      return updated;
    });
  };

  // Mengosongkan seluruh riwayat
  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('fruit_ripeness_history');
    } catch (err) {
      console.error('Gagal menghapus localStorage:', err);
    }
  };

  // Memuat item riwayat lama ke analyzer
  const handleSelectOldItem = (item: HistoryItem) => {
    setSelectedOldItem(item);
    setActiveTab('analyzer');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col text-slate-800 selection:bg-emerald-500 selection:text-white">
      {/* Top Header Banner */}
      <header id="app-header" className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-600/10 shrink-0">
              <Apple className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-sans tracking-tight text-gray-900 flex items-center justify-center sm:justify-start gap-1.5">
                RipenScan
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-100 font-mono">
                  DIP + AI
                </span>
              </h1>
              <p className="text-xs text-gray-400">
                Sistem Identifikasi Kematangan Buah Berbasis Pengolahan Citra Digital &amp; Google Gemini Vision
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
            {(
              [
                { id: 'analyzer', label: 'Analisis Buah', icon: Sliders },
                { id: 'evaluation', label: 'Evaluasi & Akurasi', icon: BarChart4 },
                { id: 'history', label: `Riwayat (${history.length})`, icon: ClipboardCheck },
                { id: 'guide', label: 'Panduan Agronomi', icon: BookOpen }
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-emerald-700 shadow-2xs border border-gray-100'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main id="app-main" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full"
          >
            {activeTab === 'analyzer' && (
              <FruitAnalyzer 
                onAnalysisSuccess={handleAnalysisSuccess}
                loadedHistoryItem={selectedOldItem}
                onResetLoadedItem={() => setSelectedOldItem(null)}
              />
            )}

            {activeTab === 'evaluation' && (
              <EvaluasiDashboard />
            )}

            {activeTab === 'history' && (
              <HistoryList 
                items={history}
                onDeleteItem={handleDeleteItem}
                onClearHistory={handleClearHistory}
                onSelectOldItem={handleSelectOldItem}
              />
            )}

            {activeTab === 'guide' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Panduan Kiri */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
                    <h2 className="text-lg font-semibold text-gray-900 font-sans tracking-tight mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                      Panduan Kematangan Buah Hortikultura
                    </h2>
                    <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                      Kematangan buah (ripening) adalah proses fisiologis kompleks yang melibatkan perubahan warna pigmentasi kulit, degradasi pati menjadi karbohidrat rantai pendek (gula sederhana), degradasi zat pektin dinding sel pengikat air, serta pelepasan senyawa aromatis atsiri etilen. Berikut adalah ringkasan klasifikasi visual ilmiah:
                    </p>

                    <div className="space-y-6">
                      {/* Pisang */}
                      <div className="flex flex-col sm:flex-row gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                        <div className="w-full sm:w-32 h-24 bg-amber-50 rounded-xl shrink-0 flex items-center justify-center border border-amber-100/50">
                          <Banana className="w-12 h-12 text-amber-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-gray-800">1. Pisang (Musa acuminata)</h4>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            Proses de-greening pisang sangat dipengaruhi oleh pelepasan gas etilen alami. Pisang mentah dipenuhi klorofil hijau pekat dengan rasa kesat (pati tinggi). Pisang matang memiliki warna kuning mulus dengan kemunculan bintik cokelat tipis (Sugar Spots) yang menandakan karbohidrat pati telah hancur sepenuhnya menjadi fruktosa dan glukosa manis. Ketika terlalu matang, warna kuning berganti cokelat gelap lembek, disertai aroma alkohol samar akibat fermentasi alami.
                          </p>
                        </div>
                      </div>

                      {/* Alpukat */}
                      <div className="flex flex-col sm:flex-row gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                        <div className="w-full sm:w-32 h-24 bg-emerald-50 rounded-xl shrink-0 flex items-center justify-center border border-emerald-100/50">
                          <Apple className="w-12 h-12 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-gray-800">2. Alpukat (Persea americana)</h4>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            Alpukat tidak matang di pohon, melainkan baru melunak setelah dipetik. Alpukat mentah berkulit hijau rumput kencang dan licin. Kematangan ditandai dengan kulit luar yang menggelap menjadi hijau zaitun tua kehitaman, tekstur berkerikil kusam, dan empuk jika ditekan lembut karena lipid lemak nabati tinggi telah berkembang sempurna. Pada tahap lewat matang, alpukat menjadi hitam legam berongga, daging buah berserat cokelat pekat dan terasa tengik (oksidasi lemak).
                          </p>
                        </div>
                      </div>

                      {/* Tomat */}
                      <div className="flex flex-col sm:flex-row gap-4 pb-5 last:border-0 last:pb-0">
                        <div className="w-full sm:w-32 h-24 bg-rose-50 rounded-xl shrink-0 flex items-center justify-center border border-rose-100/50">
                          <Apple className="w-12 h-12 text-rose-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-gray-800">3. Tomat (Solanum lycopersicum)</h4>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            Kematangan tomat dicirikan oleh pergeseran dominasi zat warna dari klorofil hijau menjadi likopen merah menyala (antioksidan tinggi). Tomat mentah mengandung solanin pelindung yang berasa pahit masam. Tomat matang berwarna merah merata berair kencang. Tomat terlalu matang tampak layu berkerut, dinding turgor sel merosot membuat bentuk penyok, dan berair asam akibat penguapan kelembaban.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Samping */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 border border-slate-800 shadow-md">
                    <h3 className="text-sm font-semibold font-sans tracking-tight text-white mb-3 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-emerald-400" />
                      Parameter Vektor Fisik
                    </h3>
                    <div className="space-y-4 text-xs">
                      <div className="border-b border-slate-800 pb-3">
                        <strong className="text-emerald-400 block mb-1">Color Hue (H)</strong>
                        <p className="text-slate-400 text-[11px]">
                          Vektor warna melingkar 0-360 derajat. Nilai 120° melambangkan hijau, 60° kuning, dan 0°/360° merah cerah. Perubahan derajat Hue adalah indikator kimiawi kematangan buah.
                        </p>
                      </div>

                      <div className="border-b border-slate-800 pb-3">
                        <strong className="text-emerald-400 block mb-1">Color Saturation (S)</strong>
                        <p className="text-slate-400 text-[11px]">
                          Menunjukkan kemurnian warna (0-100%). Buah matang biasanya memiliki kejenuhan warna (saturasi) yang tinggi dibanding warna mentah kusam pucat.
                        </p>
                      </div>

                      <div>
                        <strong className="text-emerald-400 block mb-1">Tekstur &amp; Guratan</strong>
                        <p className="text-slate-400 text-[11px]">
                          Menghitung densitas pori kulit luar. Kulit mulus (Halus) bertransisi menjadi berbintik (Matang) lalu layu berlipat (Keriput) karena pelepasan molekul H2O.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* App Footer */}
      <footer id="app-footer" className="bg-white border-t border-gray-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="text-center md:text-left">
            <span className="font-semibold text-gray-600 block sm:inline mr-1">
              Sistem Identifikasi Kematangan Buah
            </span>
            &copy; 2026 RipenScan. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4 text-gray-400 text-[11px]">
            <span>Metrik HSV &amp; Gradien Sobel dihitung lokal</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
            <span>AI dianalisis dengan Gemini 3.5 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
