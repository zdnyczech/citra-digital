/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Meningkatkan batas ukuran request karena menangani data URI gambar base64
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Inisialisasi Google GenAI dengan API Key
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Endpoint untuk Analisis Gambar Buah menggunakan Gemini 3.5 Flash
app.post('/api/analyze', async (req, res) => {
  try {
    const { image, clientMetrics } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Data gambar tidak ditemukan.' });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'GEMINI_API_KEY tidak dikonfigurasi di server. Mohon periksa tab Settings > Secrets di AI Studio.' 
      });
    }

    // Ekstrak data base64 murni dan tipe mime dari Data URI
    let base64Data = '';
    let mimeType = 'image/jpeg';
    
    if (image.includes(';base64,')) {
      const parts = image.split(';base64,');
      mimeType = parts[0].replace('data:', '');
      base64Data = parts[1];
    } else {
      base64Data = image;
    }

    // Buat prompt detail untuk memandu analisis vision
    const prompt = `Analisis gambar buah ini untuk menentukan tingkat kematangannya (MENTAH, MATANG, atau TERLALU_MATANG).
Sistem pengolahan citra lokal kami mendeteksi karakteristik berikut:
- Nama warna dominan teoritis: ${clientMetrics?.dominantColorName || 'Tidak terdeteksi'}
- Kecerahan citra (0-100): ${clientMetrics?.brightness || 'N/A'}
- Saturasi citra (0-100): ${clientMetrics?.saturation || 'N/A'}
- Nilai RGB teoritis: R=${clientMetrics?.rgb?.r || 'N/A'}, G=${clientMetrics?.rgb?.g || 'N/A'}, B=${clientMetrics?.rgb?.b || 'N/A'}

Harap lakukan analisis vision yang jauh lebih presisi:
1. Identifikasi nama spesifik buah (misal: Pisang, Mangga, Tomat, Apel, Alpukat, Jeruk, dll.).
2. Klasifikasikan kematangannya menjadi tepat salah satu dari: "MENTAH", "MATANG", atau "TERLALU_MATANG".
3. Tentukan skor keyakinan (confidence score, 0-100%).
4. Jelaskan warna dominan visual, tekstur kulit (Halus, Berbintik, Keriput), dan bentuk objek (Normal, Penyok, Tidak Simetris) beserta penjelasan mendalamnya dalam bahasa Indonesia.
5. Berikan rekomendasi spesifik penyimpanan, konsumsi, dan pengolahan lanjutan dalam bahasa Indonesia.
6. Buat 1 sampai 3 anotasi bounding box visual (koordinat persentase x, y dari 0-100, lebar, tinggi) pada area yang menjadi dasar penentuan (misalnya bercak hitam pembusukan, warna kuning kematangan, atau warna hijau kemurahan).`;

    // Kirim permintaan ke Gemini 3.5 Flash dengan JSON Schema yang ketat
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        },
        { text: prompt }
      ],
      config: {
        systemInstruction: 'Anda adalah pakar agronomi, kecerdasan buatan, dan pengolahan citra digital yang berspesialisasi dalam menganalisis kualitas, kesegaran, dan klasifikasi kematangan buah hortikultura berdasarkan visual kulit dan bentuk.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: [
            'fruitName',
            'ripeness',
            'confidence',
            'dominantColorHex',
            'dominantColorName',
            'rgb',
            'hsv',
            'brightness',
            'saturation',
            'texture',
            'textureDetail',
            'shape',
            'shapeDetail',
            'visualExplanation',
            'recommendations',
            'annotations'
          ],
          properties: {
            fruitName: {
              type: Type.STRING,
              description: 'Nama buah yang berhasil diidentifikasi dalam Bahasa Indonesia (misal: Pisang, Mangga, Tomat, dll.)'
            },
            ripeness: {
              type: Type.STRING,
              description: 'Tingkat kematangan buah',
              enum: ['MENTAH', 'MATANG', 'TERLALU_MATANG']
            },
            confidence: {
              type: Type.INTEGER,
              description: 'Confidence score (persentase keyakinan) dari analisis, rentang nilai 0 hingga 100.'
            },
            dominantColorHex: {
              type: Type.STRING,
              description: 'Representasi kode hex warna dominan visual utama (misal: #FFEB3B)'
            },
            dominantColorName: {
              type: Type.STRING,
              description: 'Nama warna dominan dalam Bahasa Indonesia (misal: Kuning Cerah, Hijau Gelap, Merah Oranye)'
            },
            rgb: {
              type: Type.OBJECT,
              description: 'Refined RGB average value',
              required: ['r', 'g', 'b'],
              properties: {
                r: { type: Type.INTEGER },
                g: { type: Type.INTEGER },
                b: { type: Type.INTEGER }
              }
            },
            hsv: {
              type: Type.OBJECT,
              description: 'Refined HSV values',
              required: ['h', 's', 'v'],
              properties: {
                h: { type: Type.INTEGER, description: 'Hue (0-360)' },
                s: { type: Type.INTEGER, description: 'Saturation (0-100)' },
                v: { type: Type.INTEGER, description: 'Value/Brightness (0-100)' }
              }
            },
            brightness: {
              type: Type.INTEGER,
              description: 'Intensitas kecerahan buah visual keseluruhan (0-100)'
            },
            saturation: {
              type: Type.INTEGER,
              description: 'Saturasi warna buah (0-100)'
            },
            texture: {
              type: Type.STRING,
              description: 'Kategori tekstur kulit luar buah',
              enum: ['Halus', 'Berbintik', 'Keriput']
            },
            textureDetail: {
              type: Type.STRING,
              description: 'Penjelasan tekstur kulit terperinci dalam Bahasa Indonesia (misal: Kulit licin kencang, Berbintik hitam kecil merata, Berkerut dan layu)'
            },
            shape: {
              type: Type.STRING,
              description: 'Kondisi keutuhan bentuk fisik buah',
              enum: ['Normal', 'Penyok', 'Tidak Simetris']
            },
            shapeDetail: {
              type: Type.STRING,
              description: 'Penjelasan bentuk fisik terperinci dalam Bahasa Indonesia (misal: Oval simetris utuh, Sedikit penyok di bawah karena lembek)'
            },
            visualExplanation: {
              type: Type.STRING,
              description: 'Penjelasan utuh mengenai ciri visual dominan yang mendasari penentuan klasifikasi ini dalam Bahasa Indonesia.'
            },
            recommendations: {
              type: Type.OBJECT,
              required: ['storage', 'consumption', 'processing'],
              properties: {
                storage: {
                  type: Type.STRING,
                  description: 'Saran penyimpanan buah agar tahan lama atau matang sempurna dalam Bahasa Indonesia'
                },
                consumption: {
                  type: Type.STRING,
                  description: 'Saran cara konsumsi terbaik atau kesiapan makan dalam Bahasa Indonesia'
                },
                processing: {
                  type: Type.STRING,
                  description: 'Rekomendasi pengolahan makanan/minuman yang sesuai dalam Bahasa Indonesia'
                }
              }
            },
            annotations: {
              type: Type.ARRAY,
              description: 'Anotasi visual bounding box pada area penentu (1-3 kotak)',
              items: {
                type: Type.OBJECT,
                required: ['x', 'y', 'width', 'height', 'label', 'reason'],
                properties: {
                  x: { type: Type.INTEGER, description: 'Posisi koordinat X kiri atas dalam persen (0-100)' },
                  y: { type: Type.INTEGER, description: 'Posisi koordinat Y kiri atas dalam persen (0-100)' },
                  width: { type: Type.INTEGER, description: 'Lebar kotak dalam persen (0-100)' },
                  height: { type: Type.INTEGER, description: 'Tinggi kotak dalam persen (0-100)' },
                  label: { type: Type.STRING, description: 'Nama label singkat dalam Bahasa Indonesia (misal: Bercak Pembusukan, Area Hijau, Pangkal Kuning)' },
                  reason: { type: Type.STRING, description: 'Alasan penandaan area ini dalam Bahasa Indonesia' }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text || '';
    const cleanJson = text.trim();
    const result = JSON.parse(cleanJson);

    return res.json({ success: true, result });
  } catch (error: any) {
    console.error('Error analyzing image via Gemini:', error);
    return res.status(500).json({ 
      error: 'Gagal menganalisis gambar buah. ' + (error.message || error) 
    });
  }
});

// Middleware setup untuk Vite (Poin Kunci Full-Stack)
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Sistem Identifikasi Kematangan Buah berjalan pada http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Gagal menjalankan server:', err);
});
