## Figma Implementation Rules
- Selalu baca node Figma menggunakan tool MCP Figma terlebih dahulu sebelum menulis kode.
- Ekstrak hex color, font-size, font-weight, border-radius, dan padding/gap persis sesuai data node Figma.
- Implementasikan komponen menggunakan React + Tailwind CSS (sesuaikan dengan setup proyek).
- Gunakan pendekatan mobile-first responsive; ubah layout horizontal menjadi vertikal pada breakpoint mobile (`sm:`/`md:`).
- Pecah UI menjadi komponen modular di folder `src/components/` daripada menumpuk semua kode dalam satu file.