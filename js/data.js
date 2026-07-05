// KostPutri Mock Data & Databases
const INITIAL_USERS = [
  {
    email: "user@gmail.com",
    password: "user",
    name: "Sarah Amelia",
    phone: "+62 812-9988-7766",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    email: "mahasiswi@gmail.com",
    password: "siswa",
    name: "Dinda Lestari",
    phone: "+62 878-1234-5678",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
  }
];

const INITIAL_OWNERS = [
  {
    email: "owner@kostputri.com",
    password: "owner",
    name: "Ibu Hj. Retno Wardani",
    kostName: "Kost Lavender Premium",
    phone: "+62 812-3456-7890",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  },
  {
    email: "sophia@kostputri.com",
    password: "sophia",
    name: "Tante Sophia",
    kostName: "Kost Pinky Sweet Cozy Home",
    phone: "+62 878-8765-4321",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
  }
];

const INITIAL_KOST_LIST = [
  {
    id: 1,
    title: "Kost Putri Lavender Premium",
    price: 1850000,
    location: "Sleman, Yogyakarta",
    address: "Jl. Kaliurang KM 5.6, Gg. Pandega Marta No. 12, Sleman, DI Yogyakarta (Dekat UGM)",
    rating: 4.9,
    views: 342,
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80"
    ],
    type: "Premium",
    facilities: ["WiFi", "AC", "Kamar Mandi Dalam", "Lemari", "Kasur", "Parkir Motor"],
    rules: ["Khusus Mahasiswi/Karyawati", "Batas bertamu jam 22:00 WIB", "Tidak membawa hewan peliharaan"],
    size: "3x4 m",
    description: "Kost Lavender Premium menyajikan hunian eksklusif dengan suasana tenang, bersih, dan desain interior minimalis modern yang sangat cocok untuk mahasiswi UGM, UNY, atau karyawati. Berada di lokasi strategis dekat kuliner, laundry, dan minimarket.",
    ownerEmail: "owner@kostputri.com",
    ownerName: "Ibu Hj. Retno Wardani"
  },
  {
    id: 2,
    title: "Kost Pinky Sweet Cozy Home",
    price: 1200000,
    location: "Jatinangor, Sumedang",
    address: "Jl. Raya Jatinangor No. 45, Hegarmanah, Jatinangor, Sumedang (Dekat UNPAD)",
    rating: 4.8,
    views: 215,
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80"
    ],
    type: "Standard",
    facilities: ["WiFi", "AC", "Kamar Mandi Dalam", "Lemari", "Kasur", "Parkir Motor"],
    rules: ["Khusus Mahasiswi UNPAD/ITB", "Menjaga kebersihan bersama", "Dilarang merokok di kamar"],
    size: "3x3 m",
    description: "Kost Pinky Sweet menawarkan kenyamanan hunian kost dengan nuansa pastel pink yang aesthetic dan bersih. Didesain khusus untuk mahasiswi yang menginginkan suasana belajar yang kondusif.",
    ownerEmail: "sophia@kostputri.com",
    ownerName: "Tante Sophia"
  },
  {
    id: 3,
    title: "Kost Putri Cantika Aesthetic",
    price: 1500000,
    location: "Tembalang, Semarang",
    address: "Jl. Gondang Barat IV No. 8, Tembalang, Kota Semarang (Dekat UNDIP)",
    rating: 4.7,
    views: 180,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80"
    ],
    type: "Standard",
    facilities: ["WiFi", "Kamar Mandi Dalam", "Lemari", "Kasur", "Parkir Motor"],
    rules: ["Wajib berpakaian sopan di luar kamar", "Jam malam pukul 22.00 WIB"],
    size: "3x3 m",
    description: "Kost Putri Cantika mengutamakan kebersihan dan kerapian. Lingkungan kost sangat bersahabat, aman, tenang, dan kondusif untuk mendukung kegiatan perkuliahan mahasiswi Universitas Diponegoro (UNDIP).",
    ownerEmail: "owner@kostputri.com",
    ownerName: "Ibu Hj. Retno Wardani"
  },
  {
    id: 4,
    title: "Kost Sakura Sakura Rose Gold",
    price: 2400000,
    location: "Grogol, Jakarta Barat",
    address: "Kawasan Tomang Asri, Blok C No. 7, Grogol Petamburan, Jakarta Barat (Dekat Trisakti/UNTAR)",
    rating: 4.95,
    views: 512,
    images: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80"
    ],
    type: "Premium",
    facilities: ["WiFi", "AC", "Kamar Mandi Dalam", "Lemari", "Kasur", "Parkir Motor"],
    rules: ["Tamu menginap wajib lapor pengelola", "Dilarang membawa hewan peliharaan"],
    size: "4x4 m",
    description: "Hunian kost bintang 5 eksklusif untuk mahasiswi Trisakti atau UNTAR. Menawarkan kenyamanan privasi maksimal, fasilitas lengkap, dan desain aesthetic ala Skandinavia dengan palet warna rose-gold pink.",
    ownerEmail: "sophia@kostputri.com",
    ownerName: "Tante Sophia"
  },
  {
    id: 5,
    title: "Kost Putri Orchid Soft Pink",
    price: 1350000,
    location: "Sleman, Yogyakarta",
    address: "Jl. Gejayan, Gang Alamanda No. 5, Sleman, Yogyakarta (Dekat UNY)",
    rating: 4.6,
    views: 194,
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80"
    ],
    type: "Standard",
    facilities: ["WiFi", "Kamar Mandi Dalam", "Lemari", "Kasur", "Parkir Motor"],
    rules: ["Jam malam 23:00 WIB", "Pembayaran sewa tepat waktu di awal bulan"],
    size: "3x4 m",
    description: "Kost estetik dengan nuansa anggun dan tenang. Fasilitas lengkap dengan harga sewa yang bersahabat untuk mahasiswi UNY, Sanata Dharma, maupun UGM.",
    ownerEmail: "owner@kostputri.com",
    ownerName: "Ibu Hj. Retno Wardani"
  },
  {
    id: 6,
    title: "Kost Melati Minimalis Putih",
    price: 850000,
    location: "Tembalang, Semarang",
    address: "Jl. Banjarsari Raya No. 18, Tembalang, Semarang",
    rating: 4.5,
    views: 130,
    images: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=600&q=80"
    ],
    type: "Standard",
    facilities: ["WiFi", "Lemari", "Kasur", "Parkir Motor"],
    rules: ["Dilarang berbuat gaduh", "Menjaga kebersihan dapur bersama"],
    size: "3x3 m",
    description: "Kost putri ekonomis namun bersih dan nyaman. Dikelilingi warung makan, laundry, dan minimarket. Sangat cocok bagi mahasiswa yang mencari efisiensi biaya.",
    ownerEmail: "owner@kostputri.com",
    ownerName: "Ibu Hj. Retno Wardani"
  },
  {
    id: 7,
    title: "Kost Tulip Pastel Cozy",
    price: 1600000,
    location: "Jatinangor, Sumedang",
    address: "Gang Caringin, Ciseke, Jatinangor, Sumedang",
    rating: 4.85,
    views: 288,
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
    ],
    type: "Standard",
    facilities: ["WiFi", "AC", "Kamar Mandi Dalam", "Lemari", "Kasur", "Parkir Motor"],
    rules: ["Khusus wanita baik-baik", "Tamu laki-laki dilarang masuk kamar"],
    size: "3x3.5 m",
    description: "Kost baru dengan desain interior bergaya pastel modern. Menawarkan kenyamanan hunian semi-private dengan fasilitas lengkap yang memanjakan penghuninya.",
    ownerEmail: "sophia@kostputri.com",
    ownerName: "Tante Sophia"
  },
  {
    id: 8,
    title: "Kost Rose Garden Executive",
    price: 2800000,
    location: "Grogol, Jakarta Barat",
    address: "Jl. Kyai Tapa No. 102, Grogol, Jakarta Barat",
    rating: 4.9,
    views: 420,
    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80"
    ],
    type: "Premium",
    facilities: ["WiFi", "AC", "Kamar Mandi Dalam", "Lemari", "Kasur", "Parkir Motor"],
    rules: ["Wajib menyertakan KTP/KTM saat pendaftaran", "Tamu menginap dikenakan biaya per malam"],
    size: "4x5 m",
    description: "Hunian kost premium eksklusif khusus mahasiswi kedokteran maupun profesional muda. Fasilitas sekelas hotel dengan parkir yang aman dijaga security.",
    ownerEmail: "sophia@kostputri.com",
    ownerName: "Tante Sophia"
  },
  {
    id: 9,
    title: "Kost Lavender Sleman 2",
    price: 1400000,
    location: "Sleman, Yogyakarta",
    address: "Jl. Kaliurang KM 8.5, Sleman, Yogyakarta",
    rating: 4.75,
    views: 112,
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
    ],
    type: "Standard",
    facilities: ["WiFi", "AC", "Kamar Mandi Dalam", "Lemari", "Kasur", "Parkir Motor"],
    rules: ["Batas jam malam 22.30 WIB", "Dilarang memaku dinding kamar"],
    size: "3x4 m",
    description: "Kost cabang kedua dari Lavender Group, mengutamakan kenyamanan tinggal dengan fasilitas penunjang belajar lengkap serta lingkungan yang tenang dan aman.",
    ownerEmail: "owner@kostputri.com",
    ownerName: "Ibu Hj. Retno Wardani"
  },
  {
    id: 10,
    title: "Kost Dahlia Sweet Pink",
    price: 900000,
    location: "Jatinangor, Sumedang",
    address: "Jl. Kolonel Ahmad Syam No. 120, Jatinangor, Sumedang",
    rating: 4.6,
    views: 95,
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80"
    ],
    type: "Standard",
    facilities: ["WiFi", "Lemari", "Kasur", "Parkir Motor"],
    rules: ["Khusus mahasiswi baik-baik", "Dilarang gaduh setelah jam 21.00"],
    size: "3x3 m",
    description: "Kost putri murah meriah di kawasan Jatinangor. Lingkungan bersahabat, dekat dengan masjid, laundry, warteg, dan fotokopi.",
    ownerEmail: "sophia@kostputri.com",
    ownerName: "Tante Sophia"
  }
];

const INITIAL_CHATS = [
  {
    id: 1,
    kostId: 1,
    userEmail: "user@gmail.com",
    userName: "Sarah Amelia",
    ownerEmail: "owner@kostputri.com",
    ownerName: "Ibu Hj. Retno Wardani",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    lastMessage: "Silakan kak.",
    time: "10:14",
    messages: [
      { sender: "user", text: "Halo kak, apakah masih ada kamar kosong?", time: "10:05" },
      { sender: "owner", text: "Masih kak.", time: "10:08" },
      { sender: "user", text: "Apakah bisa survei besok?", time: "10:11" },
      { sender: "owner", text: "Silakan kak.", time: "10:14" }
    ]
  },
  {
    id: 2,
    kostId: 2,
    userEmail: "user@gmail.com",
    userName: "Sarah Amelia",
    ownerEmail: "sophia@kostputri.com",
    ownerName: "Tante Sophia",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    lastMessage: "Iya boleh kak, silakan datang saja besok.",
    time: "Kemarin",
    messages: [
      { sender: "user", text: "Sore tante, apakah besok jam 10 pagi bisa survei kamar Pinky Sweet?", time: "Kemarin 16:30" },
      { sender: "owner", text: "Bisa kok, tante ada di kost dari jam 9 sampai sore.", time: "Kemarin 16:35" },
      { sender: "user", text: "Baik tante, makasih infonya ya.", time: "Kemarin 16:40" },
      { sender: "owner", text: "Iya boleh kak, silakan datang saja besok.", time: "Kemarin 16:42" }
    ]
  },
  {
    id: 3,
    kostId: 3,
    userEmail: "mahasiswi@gmail.com",
    userName: "Dinda Lestari",
    ownerEmail: "owner@kostputri.com",
    ownerName: "Ibu Hj. Retno Wardani",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    lastMessage: "Tentu bisa kak, silakan kabari kalau sudah di depan gang ya.",
    time: "2 Hari Lalu",
    messages: [
      { sender: "user", text: "Halo Ibu Retno, kamar Kost Cantika Semarang masih ada?", time: "15:00" },
      { sender: "owner", text: "Halo kak, masih ada 1 kamar kosong di lantai bawah.", time: "15:15" },
      { sender: "user", text: "Bisa saya lihat fotonya lagi? Dan apakah bisa disurvei hari Minggu?", time: "15:20" },
      { sender: "owner", text: "Tentu bisa kak, silakan kabari kalau sudah di depan gang ya.", time: "15:30" }
    ]
  },
  {
    id: 4,
    kostId: 4,
    userEmail: "mahasiswi@gmail.com",
    userName: "Dinda Lestari",
    ownerEmail: "sophia@kostputri.com",
    ownerName: "Tante Sophia",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    lastMessage: "Untuk Sakura Rose harganya 2.4jt sudah bersih air dan WiFi kak.",
    time: "3 Hari Lalu",
    messages: [
      { sender: "user", text: "Halo tante, nanya dong harga Kost Sakura itu apa udah termasuk listrik?", time: "10:30" },
      { sender: "owner", text: "Listriknya pakai token sendiri ya neng, beli masing-masing.", time: "10:45" },
      { sender: "owner", text: "Untuk Sakura Rose harganya 2.4jt sudah bersih air dan WiFi kak.", time: "11:00" }
    ]
  },
  {
    id: 5,
    kostId: 5,
    userEmail: "user@gmail.com",
    userName: "Sarah Amelia",
    ownerEmail: "owner@kostputri.com",
    ownerName: "Ibu Hj. Retno Wardani",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    lastMessage: "Waalaikumsalam, iya kak boleh silakan disurvei.",
    time: "4 Hari Lalu",
    messages: [
      { sender: "user", text: "Assalamualaikum bu, untuk Kost Orchid UNY apakah masih menerima mahasiswa baru?", time: "08:12" },
      { sender: "owner", text: "Waalaikumsalam, iya kak boleh silakan disurvei.", time: "08:30" }
    ]
  }
];
