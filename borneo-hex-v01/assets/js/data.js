/*
 * BORNEO HEX — Data produk & tetapan
 * ------------------------------------------------------------
 * Satu-satunya tempat untuk ubah harga, item dan nombor WhatsApp.
 * Nanti boleh diganti dengan data dari Google Sheets (tab Produk)
 * tanpa ubah paparan — struktur medan kekal sama.
 *
 * mod:    "sewa" atau "jual"
 * harga:  nombor (RM). null = "Tanya harga"
 * unit:   teks unit harga, contoh "/ 3 hari", "/ unit"
 * kategori (sewa sahaja): kanopi | perabot | sejuk | elektrik | audio
 * ikon:   nama ilustrasi (lihat ICONS dalam app.js)
 * gambar: laluan foto sebenar, contoh "images/kanopi-20x20.jpg".
 *         Biar null sehingga foto sebenar dimuat naik.
 * aktif:  false = disembunyikan dari web (tak dipadam)
 */
window.BH = {
  tetapan: {
    namaPerniagaan: "BORNEO HEX",
    tagline: "Canopy & Event Solution",
    whatsapp: "60148128806",
    whatsappPaparan: "014-812 8806",
    kawasan: "Sarawak",
    pangkalan: "Bintulu, Sarawak",
    tempohSewaAsas: 3
  },

  produk: [
    /* ===== SEWA — KANOPI (item utama) ===== */
    {
      id: "sewa-kanopi-20x20", mod: "sewa", kategori: "kanopi", utama: true,
      nama: "Kanopi 20 × 20 kaki",
      ringkas: "Saiz utama kenduri & majlis",
      harga: 350, unit: "/ 3 hari",
      ciri: ["Keluasan 20' × 20' (± 6m × 6m)", "Muat anggaran 4–5 meja bulat", "Pasukan kami hantar & pasang"],
      ikon: "kanopi", gambar: null, aktif: true
    },
    {
      id: "sewa-popup-10x10", mod: "sewa", kategori: "kanopi",
      nama: "Pop-Up Tent 10 × 10 kaki",
      ringkas: "Khemah lipat kompak, pasang pantas",
      harga: 80, unit: "/ 3 hari",
      ciri: ["Keluasan 10' × 10' (± 3m × 3m)", "Sesuai gerai, kaunter & pos kawalan", "Tambahan untuk ruang kecil"],
      ikon: "kanopiKecil", gambar: null, aktif: true
    },
    {
      id: "sewa-arabian-20x20", mod: "sewa", kategori: "kanopi",
      nama: "Arabian Canopy 20 × 20 kaki",
      ringkas: "Bumbung tinggi melengkung",
      harga: 350, unit: "/ 3 hari",
      ciri: ["Saiz 20' × 20'", "Sesuai majlis perkahwinan & VIP"],
      ikon: "arabian", gambar: null,
      aktif: false // PERLU SAHKAN: masih disewa atau tidak?
    },

    /* ===== SEWA — TAMBAHAN ===== */
    { id: "sewa-kerusi-plastik", mod: "sewa", kategori: "perabot", nama: "Kerusi Plastik", ringkas: "Boleh susun, tahan lasak", harga: 3, unit: "/ unit", ikon: "kerusi", gambar: null, aktif: true },
    { id: "sewa-kerusi-banquet", mod: "sewa", kategori: "perabot", nama: "Kerusi Banquet", ringkas: "Berkusyen, untuk majlis rasmi", harga: 45, unit: "/ unit", ikon: "kerusiBanquet", gambar: null, aktif: true },
    { id: "sewa-meja-2x6", mod: "sewa", kategori: "perabot", nama: "Meja Panjang 2 × 6 kaki", ringkas: "Pendaftaran & hidangan", harga: 35, unit: "/ unit", ikon: "meja", gambar: null, aktif: true },
    { id: "sewa-meja-3x6", mod: "sewa", kategori: "perabot", nama: "Meja Panjang 3 × 6 kaki", ringkas: "Permukaan luas untuk buffet", harga: 45, unit: "/ unit", ikon: "meja", gambar: null, aktif: true },
    { id: "sewa-meja-4x8", mod: "sewa", kategori: "perabot", nama: "Meja Panjang 4 × 8 kaki", ringkas: "Katering & pameran", harga: 60, unit: "/ unit", ikon: "meja", gambar: null, aktif: true },
    { id: "sewa-meja-bulat-8", mod: "sewa", kategori: "perabot", nama: "Meja Bulat 8 Orang", ringkas: "Meja tetamu standard", harga: 80, unit: "/ unit", ikon: "mejaBulat", gambar: null, aktif: true },
    { id: "sewa-meja-bulat-10", mod: "sewa", kategori: "perabot", nama: "Meja Bulat 10 Orang", ringkas: "Meja tetamu besar", harga: 80, unit: "/ unit", ikon: "mejaBulat", gambar: null, aktif: true },

    { id: "sewa-kipas-siling", mod: "sewa", kategori: "sejuk", nama: "Kipas Siling Kanopi", ringkas: "Digantung di bumbung kanopi", harga: 45, unit: "/ unit", ikon: "kipasSiling", gambar: null, aktif: true },
    { id: "sewa-kipas-industri", mod: "sewa", kategori: "sejuk", nama: "Kipas Industri", ringkas: "Aliran udara kuat", harga: 150, unit: "/ unit", ikon: "kipas", gambar: null, aktif: true },
    { id: "sewa-air-cooler", mod: "sewa", kategori: "sejuk", nama: "Air Cooler", ringkas: "Penyejuk udara bertangki air", harga: 250, unit: "/ unit", ikon: "cooler", gambar: null, aktif: true },

    { id: "sewa-lampu", mod: "sewa", kategori: "elektrik", nama: "Lampu Kanopi", ringkas: "LED untuk majlis waktu malam", harga: 25, unit: "/ unit", ikon: "lampu", gambar: null, aktif: true },
    { id: "sewa-kabel", mod: "sewa", kategori: "elektrik", nama: "Kabel Sambungan", ringkas: "Heavy-duty & soket agihan", harga: 150, unit: "/ set", ikon: "kabel", gambar: null, aktif: true },

    { id: "sewa-pa", mod: "sewa", kategori: "audio", nama: "PA System", ringkas: "Set speaker, mixer & mikrofon", harga: null, unit: "", ikon: "pa", gambar: null, aktif: true },
    { id: "sewa-speaker", mod: "sewa", kategori: "audio", nama: "Speaker", ringkas: "Pengumuman & muzik latar", harga: null, unit: "", ikon: "speaker", gambar: null, aktif: true },
    { id: "sewa-mikrofon", mod: "sewa", kategori: "audio", nama: "Mikrofon", ringkas: "Ucapan & juruacara", harga: null, unit: "", ikon: "mikrofon", gambar: null, aktif: true },

    /* ===== JUAL — KANOPI BARU ===== */
    {
      id: "jual-kanopi-10x10", mod: "jual", kategori: "kanopi",
      nama: "Kanopi 10 × 10 kaki",
      ringkas: "Gerai, pos kawalan, kaunter",
      harga: 1800, unit: "/ set",
      ciri: ["Keluasan 10' × 10' (± 3m × 3m)", "Unit baharu", "Sesuai gerai & perniagaan kecil"],
      ikon: "kanopiKecil", gambar: null, aktif: true
    },
    {
      id: "jual-kanopi-20x10", mod: "jual", kategori: "kanopi",
      nama: "Kanopi 20 × 10 kaki",
      ringkas: "Memanjang — buffet & pameran",
      harga: 2300, unit: "/ set",
      ciri: ["Keluasan 20' × 10' (± 6m × 3m)", "Unit baharu", "Sesuai ruang buffet & booth"],
      ikon: "kanopiPanjang", gambar: null, aktif: true
    },
    {
      id: "jual-kanopi-20x20", mod: "jual", kategori: "kanopi", utama: true,
      nama: "Kanopi 20 × 20 kaki",
      ringkas: "Saiz paling popular untuk majlis",
      harga: 2900, unit: "/ set",
      ciri: ["Keluasan 20' × 20' (± 6m × 6m)", "Unit baharu", "Sesuai surau, persatuan & usahawan sewa"],
      ikon: "kanopi", gambar: null, aktif: true
    },
    /* Item jualan lama — disembunyikan kerana saiz jualan kini 10x10, 20x10, 20x20 sahaja */
    { id: "jual-gazebo-3x3", mod: "jual", kategori: "kanopi", nama: "Gazebo 3m × 3m", ringkas: "Gazebo kompak", harga: 650, unit: "/ unit", ikon: "kanopiKecil", gambar: null, aktif: false },
    { id: "jual-popup-3x3", mod: "jual", kategori: "kanopi", nama: "Pop-Up Tent 3m × 3m", ringkas: "Khemah lipat", harga: 160, unit: "/ unit", ikon: "kanopiKecil", gambar: null, aktif: false }
  ],

  kategoriSewa: [
    { id: "semua", label: "Semua" },
    { id: "perabot", label: "Kerusi & Meja" },
    { id: "sejuk", label: "Kipas & Penyejuk" },
    { id: "elektrik", label: "Lampu & Elektrik" },
    { id: "audio", label: "Audio" }
  ],

  jenisMajlis: [
    "Kenduri / Perkahwinan", "Hari Jadi", "Majlis Keluarga", "Korporat / Syarikat",
    "Komuniti / Kampung", "Sekolah", "Agama / Persatuan", "Booth / Perniagaan", "Lain-lain"
  ]
};
