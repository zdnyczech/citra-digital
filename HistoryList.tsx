/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, Calendar, ClipboardCheck, Sparkles, 
  ChevronRight, RefreshCw, BarChart3, AlertCircle 
} from 'lucide-react';
import { HistoryItem, RipenessLevel } from '../types';

interface HistoryListProps {
  items: HistoryItem[];
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
  onSelectOldItem: (item: HistoryItem) => void;
}

export default function HistoryList({ 
  items, 
  onDeleteItem, 
  onClearHistory, 
  onSelectOldItem 
}: HistoryListProps) {

  // Helper badge kematangan
  const getRipenessBadge = (level: RipenessLevel) => {
    switch (level) {
      case 'MENTAH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            MENTAH
          </span>
        );
      case 'MATANG':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            MATANG
          </span>
        );
      case 'TERLALU_MATANG':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-100">
            OVERRIPE
          </span>
        );
    }
  };

  return (
    <div id="history-list-root" className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold font-sans tracking-tight text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-emerald-600" />
            Riwayat Klasifikasi Kematangan Buah
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Menampilkan riwayat buah yang Anda unggah secara lokal pada peramban ini.
          </p>
        </div>
        
        {items.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat analisis lokal Anda?')) {
                onClearHistory();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus Semua
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-100 rounded-xl bg-gray-50/50"
          >
            <AlertCircle className="w-10 h-10 text-gray-300 mb-2" />
            <span className="text-sm font-semibold text-gray-700 mb-1">Riwayat Kosong</span>
            <p className="text-xs text-gray-400 max-w-xs leading-normal">
              Anda belum melakukan klasifikasi gambar kustom. Buka tab "Analisis Buah" untuk mengunggah gambar pertama Anda.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1"
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="group border border-gray-100 rounded-xl overflow-hidden bg-white hover:border-emerald-200 transition-all flex h-28 hover:shadow-xs shadow-2xs"
              >
                {/* Image thumb */}
                <div className="w-28 h-full bg-gray-50 shrink-0 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.result.fruitName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    {getRipenessBadge(item.result.ripeness)}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {item.result.fruitName}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5 font-mono">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{item.timestamp}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      className="p-1 rounded hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors"
                      title="Hapus Log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Metadata and load old result button */}
                  <div className="flex items-center justify-between border-t border-gray-50 pt-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-300" 
                        style={{ backgroundColor: item.result.dominantColorHex }}
                        title={item.result.dominantColorName}
                      />
                      <span className="text-[10px] font-mono text-gray-500 font-bold">
                        AI Acc: {item.result.confidence}%
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectOldItem(item)}
                      className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group-hover:translate-x-0.5 duration-200"
                    >
                      Muat Hasil
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
