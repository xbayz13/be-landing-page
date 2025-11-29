## CMS Landing Page API

API NestJS untuk mengelola konten landing page perusahaan + blog. Struktur ini memisahkan konfigurasi visual (logo, warna, hero, navigasi, CTA, dsb) dari konten blog (penulis, kategori, artikel) sehingga mudah dikonsumsi oleh landing page front-end / headless CMS.

### Arsitektur Singkat

- **Site Config Module** – menyimpan identitas brand, palet warna, header/hero, navigasi, fitur utama, testimoni, CTA, dan tautan footer.
- **Blog Module** – CRUD untuk author, kategori, dan blog post (beserta relasi & status publikasi).
- **SEO Module** – metadata builder, sitemap.xml, dan RSS feed yang mengambil data dari Site Config + Blog.
- **TypeORM + PostgreSQL** – koneksi dikonfigurasi lewat environment variable, `DATABASE_SYNCHRONIZE` bisa dimatikan di staging/production.
- **Validasi input** – global `ValidationPipe` memastikan seluruh DTO sudah tervalidasi.

## Menjalankan Proyek

```bash
cd nestjs
npm install
cp env.example .env   # sesuaikan kredensial PostgreSQL lokal

# Setup database (pilih salah satu):

# Untuk PostgreSQL via Homebrew (default):
createdb lp-cms
# Note: DATABASE_USER akan sama dengan username macOS Anda (cek dengan: psql postgres -c "\du")
# DATABASE_PASSWORD bisa dikosongkan jika menggunakan trust auth

# Untuk PostgreSQL standar (role postgres):
createdb -U postgres lp-cms

npm run start:dev
```

Server berjalan pada port `PORT` (default 3000) dengan prefix global `/api`. Endpoint kesehatan tersedia di `GET /api/health`.

### Swagger UI

- Dokumentasi interaktif tersedia di `http://localhost:<PORT>/api`.
- Schema JSON bisa diakses lewat `http://localhost:<PORT>/api-json`.
- Swagger otomatis dimutakhirkan dari decorator controller/DTO, jadi tambahkan `@ApiProperty` dsb ketika membuat field baru agar dokumentasi akurat.

## Environment Variable

Lihat `env.example`:

```
PORT=3000
SITE_BASE_URL=http://localhost:3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=ikhsanpahdian  # untuk Homebrew: gunakan username macOS Anda
DATABASE_PASSWORD=            # untuk Homebrew: biasanya kosong (trust auth)
DATABASE_NAME=lp-cms
DATABASE_SSL=false
DATABASE_SYNCHRONIZE=true   # set false di staging/production
ADMIN_API_KEY=change-me     # digunakan untuk endpoint terproteksi
```

**Catatan untuk PostgreSQL Homebrew:**
- User database adalah username macOS Anda (bukan `postgres`)
- Password bisa dikosongkan jika menggunakan trust authentication (default Homebrew)
- Cek user yang tersedia dengan: `psql postgres -c "\du"`

## Ringkasan Endpoint

Semua endpoint berada di bawah `/api`.

### Site Config

- `GET /site-config` – agregasi seluruh konfigurasi landing page.
- `GET/PUT /site-config/brand` – logo, warna, tipografi.
- `GET/PUT /site-config/hero` – judul utama, highlight, CTA utama/sekunder.
- `GET|POST|PUT|DELETE /site-config/navigation` – menu header.
- `GET|POST|PUT|DELETE /site-config/features` – daftar value proposition.
- `GET|POST|PUT|DELETE /site-config/testimonials`
- `GET|POST|PUT|DELETE /site-config/cta-blocks`
- `GET|POST|PUT|DELETE /site-config/footer-links`

### Blog

- `GET|POST|PATCH|DELETE /blog/authors`
- `GET|POST|PATCH|DELETE /blog/categories`
- `GET|POST|PATCH|DELETE /blog/posts`
  - Query `status`, `authorId`, `categoryId`, `page`, `limit` untuk filter & pagination.

### SEO Tools

- `GET /seo/metadata?postSlug=<slug>` – metadata default (title, desc, image) atau metadata spesifik artikel.
- `GET /seo/sitemap.xml` – sitemap dinamis berisi navigation + blog posts.
- `GET /seo/rss.xml` – RSS feed 20 artikel terbaru (status published).

### Keamanan API

- Endpoint mutasi (POST/PUT/PATCH/DELETE) menggunakan header `x-api-key`.
- Set nilai `ADMIN_API_KEY` di environment NestJS (dan gunakan nilai yang sama di Next.js server untuk halaman `/admin`).

## Pengembangan Selanjutnya

- Tambah autentikasi / role.
- Migrasikan schema ke migration TypeORM ketika struktur mulai stabil.
- Tambah endpoint agregasi (misal: hero + latest blog posts).
- Integrasi storage untuk upload aset (logo, hero media, cover blog).

## Testing & Build

```bash
npm run lint
npm run test        # unit
npm run test:e2e    # e2e
npm run build
npm run db:migrate  # jalankan migration TypeORM
npm run db:seed     # isi sample data
```
