# Cut & Vibez

Platform marketplace jasa edit video yang menghubungkan kreator konten dengan editor profesional. Dilengkapi sistem **escrow** untuk keamanan pembayaran, **brief terstruktur**, **revisi terpusat**, dan **workspace kolaboratif**.

## Fitur Utama

### Untuk Klien (Client)
- **Katalog Editor** — Filter by kategori, rating, harga, kecepatan respon
- **Detail Paket & Brief** — Pilih paket (Starter/Pro/Bulk), isi brief detail, bayar via escrow
- **Pesanan & Progres** — Timeline real-time, status tab, notifikasi revisi
- **Serah Terima & Ulasan** — Approve draf final, unduh video tanpa watermark, berikan rating & review

### Untuk Editor (Mitra)
- **Dashboard** — Ringkasan performa, pesanan aktif, permintaan baru, pendapatan
- **Permintaan Brief** — Terima/tolak project baru dengan detail lengkap
- **Workspace** — Kelola revisi, unggah draf, kirim file, komunikasi dengan klien
- **Pencairan & Performa** — Saldo escrow, riwayat transaksi, tarik dana ke rekening

### Keamanan & Transparansi
- **Escrow Protection** — Dana ditahan sampai klien approve hasil akhir
- **Revisi Tidak Terbatas** — Hingga klien puas (sesuai paket)
- **Invoice Resmi** — Otomatis tergenerate saat project selesai

---

## Teknologi

| Layer | Stack |
|-------|-------|
| Frontend | React 19 + Vite 7 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 + CSS Variables (design tokens) |
| State | React Context + Hooks (AppContext) |
| Fonts | Poppins (display), Inter (body), Afacad Flux (label) |
| Icons | Inline SVG |

---

## Struktur Project

```
cutvibez/
├── public/
├── src/
│   ├── components/          # Shared UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── EditorCatalog.jsx
│   │   ├── EditorCard.jsx
│   │   ├── HeroSection.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Stats.jsx
│   │   ├── Testimonials.jsx
│   │   ├── Categories.jsx
│   │   ├── CTA.jsx
│   │   └── Layout.jsx
│   ├── context/
│   │   └── AppContext.jsx   # Global state (editors, orders, briefs)
│   ├── pages/               # Route pages
│   │   ├── Beranda.jsx
│   │   ├── DetailPaket.jsx
│   │   ├── Pesanan.jsx
│   │   ├── SerahTerima.jsx
│   │   ├── EditorDashboard.jsx
│   │   ├── EditorPermintaan.jsx
│   │   ├── EditorWorkspace.jsx
│   │   └── EditorPencairan.jsx
│   ├── styles/
│   │   └── tokens.css       # Design tokens (colors, spacing, typography)
│   ├── App.jsx              # Routes definition
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind + tokens import
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

---

## Cara Menjalankan di Local

### Prasyarat
- **Node.js** v18+ (recommended v20 LTS)
- **npm** v9+ (atau pnpm/yarn)

### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/Faizaditya-oss/cutvibez.git
cd cutvibez

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
```

Server akan berjalan di `http://localhost:5173` (atau port lain jika 5173 digunakan).

### Build Production

```bash
# Build untuk deploy
npm run build

# Preview build lokal
npm run preview
```

Output build ada di folder `dist/`.

---

## Alur Demo (Prototipe)

Data menggunakan **dummy hardcoded** di `src/context/AppContext.jsx`:

1. **Beranda** → Klik kartu editor (contoh: Raka Pratama)
2. **Detail Paket** → Pilih paket "Pro" → Isi brief → Kirim
3. **Pesanan** → Lihat status "Dikerjakan" → Klik detail
4. **Serah Terima** → Beri rating 5 bintang + ulasan → Submit
5. **Editor Dashboard** (manual navigate ke `/editor/dashboard`) → Lihat statistik
6. **Editor Permintaan** → Terima brief baru → Otomatis buat pesanan
7. **Editor Workspace** → Tab "Revisi & Draf" → Kirim draf v1
8. **Editor Pencairan** → Tab "Tarik Dana" → Ajukan penarikan

> **Catatan:** Semua data hilah saat refresh (belum ada backend/database).

---



## Scripts Tersedia

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Start dev server (hot reload) |
| `npm run build` | Production build ke `dist/` |
| `npm run preview` | Preview build production lokal |

---

## Roadmap

- [ ] Backend API (Supabase/Firebase/Node.js)
- [ ] Autentikasi & Role-based access
- [ ] Real-time notifications (WebSocket)
- [ ] File upload ke cloud storage (S3/Cloudinary)
- [ ] Payment gateway integration (Midtrans/Xendit)
- [ ] Unit & E2E testing
- [ ] CI/CD deployment

---

## Lisensi

MIT License — bebas digunakan untuk pembelajaran dan pengembangan lebih lanjut.

---

