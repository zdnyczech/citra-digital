/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FruitSample } from '../types';

export const FRUIT_SAMPLES: FruitSample[] = [
  // --- PISANG (BANANA) ---
  {
    id: 'pisang-mentah',
    name: 'Pisang Mentah (Unripe)',
    ripeness: 'MENTAH',
    imageUrl: 'https://images.unsplash.com/photo-1566393028639-d108a42c46a7?auto=format&fit=crop&q=80&w=600',
    description: 'Pisang berwarna hijau terang, tekstur keras, pati tinggi, dan belum beraroma.',
    expectedResult: {
      fruitName: 'Pisang',
      ripeness: 'MENTAH',
      dominantColorName: 'Hijau Muda',
      dominantColorHex: '#4CAF50',
      texture: 'Halus',
      shape: 'Normal',
      brightness: 45,
      saturation: 60,
      rgb: { r: 76, g: 175, b: 80 },
      hsv: { h: 122, s: 57, v: 69 },
      visualExplanation: 'Kulit buah didominasi oleh klorofil (warna hijau > 80%). Tidak terdapat bercak coklat. Bentuk silindris melengkung sempurna, tekstur kulit kencang dan halus tanpa kerutan.',
      recommendations: {
        storage: 'Simpan di suhu ruang (20-25°C) dalam wadah terbuka. Jangan disimpan di dalam kulkas karena dapat menghambat proses pematangan alami (chilling injury).',
        consumption: 'Kurang cocok dikonsumsi langsung karena rasa sepat dan kandungan pati tinggi yang sulit dicerna.',
        processing: 'Dapat diolah menjadi keripik pisang, digoreng tepung, atau dibuat kolak.'
      },
      annotations: [
        { x: 30, y: 40, width: 40, height: 30, label: 'Klorofil Tinggi', reason: 'Warna hijau dominan mengindikasikan kandungan pati masih tinggi dan gula rendah.' }
      ]
    }
  },
  {
    id: 'pisang-matang',
    name: 'Pisang Matang (Ripe)',
    ripeness: 'MATANG',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=600',
    description: 'Pisang berwarna kuning cerah merata dengan sedikit bintik coklat kecil (sugar spots), beraroma harum.',
    expectedResult: {
      fruitName: 'Pisang',
      ripeness: 'MATANG',
      dominantColorName: 'Kuning Cerah',
      dominantColorHex: '#FFEB3B',
      texture: 'Berbintik',
      shape: 'Normal',
      brightness: 85,
      saturation: 80,
      rgb: { r: 255, g: 235, b: 59 },
      hsv: { h: 54, s: 77, v: 100 },
      visualExplanation: 'Warna kuning keemasan merata menutupi seluruh permukaan kulit buah. Muncul bintik-bintik coklat kecil (senosentbintik) yang menandakan konversi pati menjadi gula sederhana telah optimal.',
      recommendations: {
        storage: 'Simpan pada suhu ruang untuk dikonsumsi dalam 1-2 hari, atau masukkan ke kulkas untuk mempertahankan kekerasan kulit selama 3-5 hari tambahan (kulit luar mungkin menggelap, tapi daging tetap bagus).',
        consumption: 'Sangat baik dikonsumsi langsung sebagai buah segar, sumber energi cepat, atau ditambahkan pada sereal.',
        processing: 'Sangat cocok untuk smoothie, topping pancake, atau banana bread.'
      },
      annotations: [
        { x: 45, y: 50, width: 15, height: 15, label: 'Bintik Gula', reason: 'Bintik kecil kecoklatan mengindikasikan tingkat kemanisan tertinggi dan aroma optimal.' }
      ]
    }
  },
  {
    id: 'pisang-terlalu-matang',
    name: 'Pisang Terlalu Matang (Overripe)',
    ripeness: 'TERLALU_MATANG',
    imageUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=600',
    description: 'Pisang didominasi warna coklat kehitaman, tekstur sangat lunak, kulit berkerut, aroma alkohol/fermentasi kuat.',
    expectedResult: {
      fruitName: 'Pisang',
      ripeness: 'TERLALU_MATANG',
      dominantColorName: 'Coklat Gelap',
      dominantColorHex: '#795548',
      texture: 'Keriput',
      shape: 'Tidak Simetris',
      brightness: 30,
      saturation: 40,
      rgb: { r: 121, g: 85, b: 72 },
      hsv: { h: 16, s: 40, v: 47 },
      visualExplanation: 'Lebih dari 60% permukaan kulit buah tertutup bercak coklat kehitaman besar yang menyatu. Kulit mulai melunak ekstrem dan berkerut akibat dehidrasi serta dekomposisi struktur sel buah.',
      recommendations: {
        storage: 'Kupas kulitnya, potong-potong, lalu simpan daging buah di dalam wadah kedap udara di freezer untuk penggunaan jangka panjang.',
        consumption: 'Tekstur terlalu benyek untuk dikonsumsi langsung, namun rasanya sangat manis.',
        processing: 'Sangat ideal diolah menjadi bolu pisang (banana cake), selai pisang, atau dicampur ke dalam adonan kue cubir/pancake.'
      },
      annotations: [
        { x: 20, y: 30, width: 50, height: 40, label: 'Nekrosis Seluler', reason: 'Bercak coklat luas dan kulit berkerut menandakan kerusakan dinding seluler akibat lewat matang.' }
      ]
    }
  },

  // --- MANGGA (MANGO) ---
  {
    id: 'mangga-mentah',
    name: 'Mangga Mentah (Unripe)',
    ripeness: 'MENTAH',
    imageUrl: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=600',
    description: 'Mangga hijau pekat, bergetah, daging keras berwarna putih kekuningan, rasa masam ekstrim.',
    expectedResult: {
      fruitName: 'Mangga',
      ripeness: 'MENTAH',
      dominantColorName: 'Hijau Tua',
      dominantColorHex: '#2E7D32',
      texture: 'Halus',
      shape: 'Normal',
      brightness: 35,
      saturation: 65,
      rgb: { r: 46, g: 125, b: 50 },
      hsv: { h: 123, s: 63, v: 49 },
      visualExplanation: 'Permukaan kulit hijau tua berkilau tanpa semburat kuning atau merah. Tidak ada lekukan lunak saat ditekan. Kulit kencang bebas bintik.',
      recommendations: {
        storage: 'Simpan di dalam kantong kertas pada suhu ruang untuk mempercepat kematangan dengan menangkap gas etilen alami buah.',
        consumption: 'Sangat asam jika dimakan langsung, dapat memicu gangguan lambung bagi yang sensitif.',
        processing: 'Sangat populer dijadikan rujak serut, manisan mangga, atau sambal pencit khas Indonesia.'
      },
      annotations: [
        { x: 35, y: 35, width: 30, height: 30, label: 'Kutikula Tebal', reason: 'Kulit hijau gelap dengan lilin alami tebal menjaga kelembaban buah saat belum matang.' }
      ]
    }
  },
  {
    id: 'mangga-matang',
    name: 'Mangga Matang (Ripe)',
    ripeness: 'MATANG',
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600',
    description: 'Mangga berwarna hijau kekuningan atau kuning jingga semburat merah, beraroma manis buah segar di dekat tangkai.',
    expectedResult: {
      fruitName: 'Mangga',
      ripeness: 'MATANG',
      dominantColorName: 'Kuning Jingga',
      dominantColorHex: '#FF9800',
      texture: 'Halus',
      shape: 'Normal',
      brightness: 75,
      saturation: 85,
      rgb: { r: 255, g: 152, b: 0 },
      hsv: { h: 36, s: 100, v: 100 },
      visualExplanation: 'Gradasi warna kulit dari hijau kekuningan hingga kuning-oranye matang di sekitar pangkal buah. Tekstur kulit halus dengan kelenturan daging sedang saat ditekan lembut.',
      recommendations: {
        storage: 'Dapat disimpan di kulkas bagian sayur/buah selama 3-5 hari untuk menjaga kesegarannya agar tidak cepat membusuk.',
        consumption: 'Waktu terbaik untuk dikonsumsi segar dingin, dipotong dadu, atau dijus.',
        processing: 'Sangat lezat dibuat puding mangga, ketan mangga (mango sticky rice), atau es buah.'
      },
      annotations: [
        { x: 50, y: 25, width: 20, height: 20, label: 'Pangkal Kekuningan', reason: 'Perubahan warna dari hijau ke kuning oranye di sekitar pangkal menandakan pematangan sempurna.' }
      ]
    }
  },
  {
    id: 'mangga-terlalu-matang',
    name: 'Mangga Terlalu Matang (Overripe)',
    ripeness: 'TERLALU_MATANG',
    imageUrl: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=600',
    description: 'Mangga berwarna kusam kekuningan gelap, muncul area berair/lembek, bercak hitam sirkular lebar, aroma asam ragi.',
    expectedResult: {
      fruitName: 'Mangga',
      ripeness: 'TERLALU_MATANG',
      dominantColorName: 'Kuning Gelap Kecoklatan',
      dominantColorHex: '#BCAAA4',
      texture: 'Berbintik',
      shape: 'Penyok',
      brightness: 40,
      saturation: 45,
      rgb: { r: 188, g: 170, b: 164 },
      hsv: { h: 15, s: 13, v: 74 },
      visualExplanation: 'Kulit buah kehilangan ketegangannya, tampak berkerut halus dan melesak di beberapa bagian. Adanya bercak busuk antraknosa (hitam melingkar) akibat aktivitas mikroba pelapuk.',
      recommendations: {
        storage: 'Segera buang bagian yang membusuk/bercak hitam pekat, lalu bekukan sisa daging yang masih sehat di freezer.',
        consumption: 'Hindari konsumsi langsung jika beraroma ragi menyengat karena mengandung alkohol hasil fermentasi liar.',
        processing: 'Dapat dijadikan bahan saus mangga, campuran kue panggang, atau selai rumahan dengan tambahan gula sebagai pengawet alami.'
      },
      annotations: [
        { x: 60, y: 45, width: 18, height: 18, label: 'Antraknosa', reason: 'Bercak hitam sirkular lunak mengindikasikan infeksi jamur pada jaringan buah yang terlalu matang.' }
      ]
    }
  },

  // --- TOMAT (TOMATO) ---
  {
    id: 'tomat-mentah',
    name: 'Tomat Mentah (Unripe)',
    ripeness: 'MENTAH',
    imageUrl: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600',
    description: 'Tomat hijau muda berkilau, keras, tidak beraroma, kadar air lebih rendah dibanding tomat merah.',
    expectedResult: {
      fruitName: 'Tomat',
      ripeness: 'MENTAH',
      dominantColorName: 'Hijau Terang',
      dominantColorHex: '#8BC34A',
      texture: 'Halus',
      shape: 'Normal',
      brightness: 60,
      saturation: 55,
      rgb: { r: 139, g: 195, b: 74 },
      hsv: { h: 88, s: 62, v: 76 },
      visualExplanation: 'Kulit luar hijau pucat hingga hijau neon homogen. Pigmen likopen belum terbentuk sama sekali. Tekstur keras seperti batu saat diraba.',
      recommendations: {
        storage: 'Taruh di jendela yang terkena sinar matahari tidak langsung untuk memicu klorofil pecah dan merangsang pembentukan likopen merah.',
        consumption: 'Mengandung solanin (alkaloid) beracun ringan jika dimakan mentah dalam jumlah sangat besar. Rasanya asam-pahit.',
        processing: 'Sangat cocok ditumis, dijadikan bahan dasar sambal ijo, atau digoreng tepung (fried green tomatoes).'
      },
      annotations: [
        { x: 40, y: 40, width: 25, height: 25, label: 'Kadar Solanin', reason: 'Warna hijau pucat menandakan keberadaan alkaloid pelindung alami buah sebelum matang.' }
      ]
    }
  },
  {
    id: 'tomat-matang',
    name: 'Tomat Matang (Ripe)',
    ripeness: 'MATANG',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=600',
    description: 'Tomat berwarna merah menyala merata, kulit kencang licin, kenyal jika ditekan, kaya akan likopen.',
    expectedResult: {
      fruitName: 'Tomat',
      ripeness: 'MATANG',
      dominantColorName: 'Merah Terang',
      dominantColorHex: '#F44336',
      texture: 'Halus',
      shape: 'Normal',
      brightness: 70,
      saturation: 85,
      rgb: { r: 244, g: 67, b: 54 },
      hsv: { h: 4, s: 78, v: 96 },
      visualExplanation: 'Pigmen karotenoid dan likopen merah mendominasi permukaan kulit buah (> 95%). Sisa warna hijau di dekat kelopak hampir hilang sepenuhnya. Kulit kencang memantulkan cahaya.',
      recommendations: {
        storage: 'Gunakan segera untuk kesegaran maksimal. Jika ingin ditunda, simpan di kulkas maksimal 3-4 hari (suhu terlalu dingin dapat merusak molekul rasa tomat).',
        consumption: 'Sangat lezat dimakan langsung dalam salad, diiris untuk burger, atau dijus segar.',
        processing: 'Sangat serbaguna untuk saus pasta, sup tomat hangat, atau tumisan masakan nusantara.'
      },
      annotations: [
        { x: 45, y: 35, width: 20, height: 20, label: 'Kandungan Likopen', reason: 'Warna merah mengkilap mencerminkan puncak antioksidan likopen yang sangat menyehatkan.' }
      ]
    }
  },
  {
    id: 'tomat-terlalu-matang',
    name: 'Tomat Terlalu Matang (Overripe)',
    ripeness: 'TERLALU_MATANG',
    imageUrl: 'https://images.unsplash.com/photo-1621263764227-832f91db8502?auto=format&fit=crop&q=80&w=600',
    description: 'Tomat berwarna merah tua kehitaman/kusam, kulit keriput tipis, lembek berair, muncul bercak jamur abu-abu.',
    expectedResult: {
      fruitName: 'Tomat',
      ripeness: 'TERLALU_MATANG',
      dominantColorName: 'Merah Gelap',
      dominantColorHex: '#D32F2F',
      texture: 'Keriput',
      shape: 'Penyok',
      brightness: 40,
      saturation: 70,
      rgb: { r: 211, g: 47, b: 47 },
      hsv: { h: 0, s: 78, v: 83 },
      visualExplanation: 'Kulit mengendur dan berkerut parah akibat evaporasi air internal. Tekstur sangat lembek dan berair saat disentuh ringan. Bentuk buah mulai melesak/penyok kehilangan simetri.',
      recommendations: {
        storage: 'Jangan disimpan lagi. Harus segera diolah hari ini juga sebelum membusuk total dan ditumbuhi kapang jamur.',
        consumption: 'Kurang nikmat dimakan mentah karena sensasi tekstur lembek berair dan rasa masam berlebih.',
        processing: 'Paling bagus dimasak lama menjadi pasta tomat kental, saus bolognese, sambal matang, atau sup.'
      },
      annotations: [
        { x: 25, y: 50, width: 30, height: 25, label: 'Kehilangan Turgor', reason: 'Kulit berkerut dan melesak akibat runtuhnya tekanan turgor di dalam sel-sel air tomat.' }
      ]
    }
  },

  // --- APEL (APPLE) ---
  {
    id: 'apel-mentah',
    name: 'Apel Mentah (Unripe)',
    ripeness: 'MENTAH',
    imageUrl: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=600',
    description: 'Apel berwarna hijau pucat dingin, sangat keras, rasa sangat kelat dan masam, getah tipis.',
    expectedResult: {
      fruitName: 'Apel',
      ripeness: 'MENTAH',
      dominantColorName: 'Hijau Lemon',
      dominantColorHex: '#9E9D24',
      texture: 'Halus',
      shape: 'Normal',
      brightness: 55,
      saturation: 50,
      rgb: { r: 158, g: 157, b: 36 },
      hsv: { h: 60, s: 77, v: 62 },
      visualExplanation: 'Warna hijau muda pucat merata di seluruh buah tanpa warna merah/kuning hangat sekunder. Kulit kaku tebal. Bentuk simetris padat.',
      recommendations: {
        storage: 'Simpan bersama buah pisang matang di dalam wadah tertutup rapat untuk mempercepat proses de-greening kulit apel.',
        consumption: 'Rasa kelat asam kuat dari zat tanin tinggi, kurang ramah di mulut.',
        processing: 'Cocok dibuat cuka apel fermentasi, acar buah, atau sebagai tambahan asam alami pada sup kuliner.'
      },
      annotations: [
        { x: 40, y: 30, width: 20, height: 20, label: 'Tanin Tinggi', reason: 'Zat tanin yang melimpah menjaga buah dari serangan hama sebelum biji di dalamnya siap berkembang.' }
      ]
    }
  },
  {
    id: 'apel-matang',
    name: 'Apel Matang (Ripe)',
    ripeness: 'MATANG',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=600',
    description: 'Apel berwarna merah cerah segar dengan bintik pori kulit putih samar (lenticel), sangat renyah dan berair.',
    expectedResult: {
      fruitName: 'Apel',
      ripeness: 'MATANG',
      dominantColorName: 'Merah Crimson',
      dominantColorHex: '#E53935',
      texture: 'Berbintik',
      shape: 'Normal',
      brightness: 65,
      saturation: 80,
      rgb: { r: 229, g: 57, b: 53 },
      hsv: { h: 1, s: 75, v: 90 },
      visualExplanation: 'Warna merah cerah menutupi sebagian besar buah dengan bintik lentisel alami putih tersebar rapi di permukaan kulit. Kulit kencang licin memantulkan cahaya.',
      recommendations: {
        storage: 'Simpan di dalam laci khusus buah di dalam lemari es (0-4°C) untuk mempertahankan kerenyahan dagingnya hingga 2-3 minggu.',
        consumption: 'Waktu terbaik untuk digigit langsung menikmati kerenyahan dan rasa manis masam seimbangnya.',
        processing: 'Sangat cocok dipotong untuk salad buah, pai apel klasik (apple pie), saus apel manis, atau jus.'
      },
      annotations: [
        { x: 50, y: 40, width: 15, height: 15, label: 'Lentisel Aktif', reason: 'Bintik lentisel putih bersih menandakan pori pernafasan kulit buah bekerja sempurna pada kematangan penuh.' }
      ]
    }
  },
  {
    id: 'apel-terlalu-matang',
    name: 'Apel Terlalu Matang (Overripe)',
    ripeness: 'TERLALU_MATANG',
    imageUrl: 'https://images.unsplash.com/photo-1610398000003-12345a05260f?auto=format&fit=crop&q=80&w=600',
    description: 'Apel berwarna merah kusam kecoklatan, kulit kendur keriput halus, terasa empuk berpasir (mealy) saat digigit.',
    expectedResult: {
      fruitName: 'Apel',
      ripeness: 'TERLALU_MATANG',
      dominantColorName: 'Merah Kusam Kecoklatan',
      dominantColorHex: '#8D6E63',
      texture: 'Keriput',
      shape: 'Normal',
      brightness: 45,
      saturation: 40,
      rgb: { r: 141, g: 110, b: 99 },
      hsv: { h: 16, s: 30, v: 55 },
      visualExplanation: 'Kehilangan kilaunya, berganti warna merah pudar berkarat coklat. Kulit kendur dan berkerut halus akibat dehidrasi selular dalam penyimpanan lama.',
      recommendations: {
        storage: 'Jangan disimpan lagi pada kulkas terbuka. Segera olah untuk menghindari rasa berpasir kering yang tidak enak di lidah.',
        consumption: 'Kurang renyah untuk dikonsumsi segar karena pati telah terurai sepenuhnya dan dinding sel merenggang.',
        processing: 'Diolah menjadi kolak apel kayu manis, selai apel kental, saus mentega apel, atau dipanggang utuh dengan madu.'
      },
      annotations: [
        { x: 30, y: 55, width: 30, height: 20, label: 'Tekstur Mealy', reason: 'Daging buah melunak berpasir akibat pektin dinding sel yang larut sepenuhnya seiring penuaan.' }
      ]
    }
  },

  // --- ALPUKAT (AVOCADO) ---
  {
    id: 'alpukat-mentah',
    name: 'Alpukat Mentah (Unripe)',
    ripeness: 'MENTAH',
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=600',
    description: 'Alpukat berwarna hijau terang berkilau, keras membatu, daging buah pahit berair.',
    expectedResult: {
      fruitName: 'Alpukat',
      ripeness: 'MENTAH',
      dominantColorName: 'Hijau Rumput',
      dominantColorHex: '#4CAF50',
      texture: 'Halus',
      shape: 'Normal',
      brightness: 50,
      saturation: 65,
      rgb: { r: 76, g: 175, b: 80 },
      hsv: { h: 122, s: 57, v: 69 },
      visualExplanation: 'Kulit luar hijau cerah berkilau kencang. Tidak melunak sama sekali ketika diremas dengan telapak tangan.',
      recommendations: {
        storage: 'Letakkan di tempat hangat suhu ruang. Membungkus alpukat di dalam beras atau koran dapat mempercepat matang dalam 3-5 hari.',
        consumption: 'Sangat keras dan mengandung racun persin alami yang terasa pahit pekat serta mengganggu pencernaan.',
        processing: 'Tidak disarankan untuk diolah sebelum daging buah melunak secara merata.'
      },
      annotations: [
        { x: 45, y: 40, width: 25, height: 25, label: 'Lilin Epikutikula', reason: 'Kulit mengkilap tebal menunjukkan lapisan lilin epikutikula pelindung buah belum terurai.' }
      ]
    }
  },
  {
    id: 'alpukat-matang',
    name: 'Alpukat Matang (Ripe)',
    ripeness: 'MATANG',
    imageUrl: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=600', // Note: Using appropriate dark purplish green representation
    description: 'Alpukat berkulit hijau tua kehitaman kusam, agak berkerikil kasar, empuk kenyal saat ditekan lembut.',
    expectedResult: {
      fruitName: 'Alpukat',
      ripeness: 'MATANG',
      dominantColorName: 'Hijau Tua Gelap',
      dominantColorHex: '#1B5E20',
      texture: 'Berbintik',
      shape: 'Normal',
      brightness: 25,
      saturation: 50,
      rgb: { r: 27, g: 94, b: 32 },
      hsv: { h: 124, s: 71, v: 37 },
      visualExplanation: 'Pigmen kulit luar bertransformasi dari hijau cerah menjadi hijau zaitun tua keunguan kusam. Saat ditekan di bagian leher, terasa kenyal tanpa meninggalkan lekukan permanen.',
      recommendations: {
        storage: 'Jika sudah matang sempurna namun belum dikonsumsi, segera simpan di dalam lemari es utuh agar matangnya bertahan hingga 2-3 hari.',
        consumption: 'Puncak cita rasa gurih bermentega (buttery), rasa nutty, sangat kaya lemak sehat tak jenuh.',
        processing: 'Sangat cocok untuk olesan roti panggang (avocado toast), saus guacamole Meksiko, salad buah, jus alpukat susu, atau dimakan langsung dengan sedikit madu.'
      },
      annotations: [
        { x: 35, y: 50, width: 30, height: 30, label: 'Konsistensi Mentega', reason: 'Tekstur daging empuk mengindikasikan lemak nabati berdensitas tinggi telah terbentuk sempurna.' }
      ]
    }
  },
  {
    id: 'alpukat-terlalu-matang',
    name: 'Alpukat Terlalu Matang (Overripe)',
    ripeness: 'TERLALU_MATANG',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
    description: 'Alpukat berkulit hitam legam sangat berkerut, sangat lembek berongga, daging buah berserat coklat pekat dan berbau tengik.',
    expectedResult: {
      fruitName: 'Alpukat',
      ripeness: 'TERLALU_MATANG',
      dominantColorName: 'Hitam Kusam',
      dominantColorHex: '#212121',
      texture: 'Keriput',
      shape: 'Penyok',
      brightness: 12,
      saturation: 15,
      rgb: { r: 33, g: 33, b: 33 },
      hsv: { h: 0, s: 0, v: 13 },
      visualExplanation: 'Kulit hitam legam kusam mengkerut kendur. Terasa sensasi berongga antara kulit luar dan daging buah yang melunak ekstrem saat dipegang. Adanya noda-noda lebam coklat di daging.',
      recommendations: {
        storage: 'Buang segera jika tercium aroma asam tengik tajam. Lemak sehat di dalamnya mulai teroksidasi menjadi asam lemak bebas merugikan.',
        consumption: 'Tidak disarankan dikonsumsi langsung karena rasa pahit tengik yang tidak enak serta adanya degradasi serat coklat berlebih.',
        processing: 'Jika hanya sedikit lebam tanpa bau tengik, dapat dijadikan masker kecantikan wajah alami atau kondisioner rambut.'
      },
      annotations: [
        { x: 40, y: 30, width: 20, height: 30, label: 'Ranciditas Lemak', reason: 'Aroma tengik muncul dari oksidasi lipid nabati akibat paparan udara dalam penyimpanan berlebih.' }
      ]
    }
  }
];
