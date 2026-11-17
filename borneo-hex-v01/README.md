# BORNEO HEX — Laman Web v2

Laman sewa & jual kanopi BORNEO HEX (Bintulu, Sarawak). Live: https://borneo-hex.web.app

## Struktur
```
index.html            Laman pelanggan (Sewa / Beli → senarai → WhatsApp)
admin.html            Alat dalaman: salin harga, jawapan pantas WA, senarai fail gambar
assets/js/data.js     SEMUA produk, harga & tetapan (nombor WhatsApp, kawasan)
assets/js/app.js      Logik laman pelanggan
assets/js/icons.js    Ilustrasi produk sementara
assets/css/main.css   Gaya (Navy / Oren / Kuning / Off-White)
images/               (cipta) foto sebenar produk
```

## Ubah harga atau item
Edit `assets/js/data.js` sahaja. `aktif: false` sembunyikan item tanpa memadam.
Untuk guna foto sebenar: letak fail dalam `images/` dan isi `gambar: "images/nama-fail.jpg"`.

## Pratonton tempatan
```bash
python3 -m http.server 8080
```
Buka `http://localhost:8080`.

## Deploy
```bash
firebase deploy --only hosting
```

## Seterusnya
- Sambung senarai tempahan ke Google Sheets (tab Tempahan / Lead) dan baca harga dari tab Produk.
- Log masuk untuk `admin.html`.
