## CMS Landing Page API

API NestJS untuk mengelola konten landing page perusahaan + blog. Struktur ini memisahkan konfigurasi visual (logo, warna, hero, navigasi, CTA, dsb) dari konten blog (penulis, kategori, artikel) sehingga mudah dikonsumsi oleh landing page front-end / headless CMS.

### Arsitektur Singkat

- **Site Config Module** – menyimpan identitas brand, palet warna, header/hero, navigasi, fitur utama, testimoni, CTA, dan tautan footer.
- **Blog Module** – CRUD untuk author, kategori, dan blog post (beserta relasi & status publikasi).
- **SEO Module** – metadata builder, sitemap.xml, dan RSS feed yang mengambil data dari Site Config + Blog.
- **Media Module** – upload & katalog aset (gambar, video, dsb) dengan driver lokal bawaan dan opsi migrasi ke AWS S3.
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
JWT_SECRET=super-secret-change-me      # secret untuk tanda tangan JWT
JWT_EXPIRES_IN=3600                    # durasi token dalam detik (default 1 jam)
SUPERADMIN_EMAIL=superadmin@lp-cms.local   # optional: override default seed email
SUPERADMIN_PASSWORD=Pass@word123           # optional: override default seed password
MEDIA_STORAGE_DRIVER=local               # local | s3
MEDIA_UPLOAD_DIR=./uploads/media
MEDIA_BASE_URL=http://localhost:3000/media
AWS_S3_BUCKET=
AWS_S3_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
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

### Media

- `GET /media` – daftar aset dengan pagination + pencarian nama file/mime type.
- `POST /media` – upload file (`multipart/form-data`, field `file`, max 10MB). Dilindungi JWT.
- `DELETE /media/:id` – hapus metadata sekaligus file fisik (lokal/S3). Dilindungi JWT.
- Default driver **local** menyimpan file di `MEDIA_UPLOAD_DIR` dan otomatis disajikan lewat `/media/*`.
- Jika mengganti `MEDIA_STORAGE_DRIVER=s3`, lengkapi variabel AWS di atas (bucket, region, key/secret). URL file akan mengikuti `MEDIA_BASE_URL` sehingga mudah diarahkan ke CDN/custom domain.

### SEO Tools

- `GET /seo/metadata?postSlug=<slug>` – metadata default (title, desc, image) atau metadata spesifik artikel.
- `GET /seo/sitemap.xml` – sitemap dinamis berisi navigation + blog posts.
- `GET /seo/rss.xml` – RSS feed 20 artikel terbaru (status published).

### Keamanan API

- Endpoint mutasi (POST/PUT/PATCH/DELETE) dilindungi dengan JWT bearer token.
- Login melalui `POST /api/auth/login` dengan payload `{ "email": "...", "password": "..." }`.
- Gunakan token yang diterima sebagai `Authorization: Bearer <token>` pada request selanjutnya (termasuk aksi yang dipanggil dari Next.js admin).

## Pengembangan Selanjutnya

- Tambah autentikasi / role.
- Migrasikan schema ke migration TypeORM ketika struktur mulai stabil.
- Tambah endpoint agregasi (misal: hero + latest blog posts).

## Testing & Build

```bash
npm run lint
npm run test        # unit
npm run test:e2e    # e2e
npm run build
npm run db:migrate  # jalankan migration TypeORM
npm run db:seed     # isi sample data
```

### Akun Superadmin (Seed)

- `npm run db:seed` otomatis membuat akun superadmin (table `users`).
- Nilai default:
  - Email: `superadmin@lp-cms.local`
  - Password: `Pass@word123` (akan di-hash menggunakan bcrypt).
- Ganti kredensial segera setelah login pertama; Anda bisa override nilai default lewat environment `SUPERADMIN_EMAIL` dan `SUPERADMIN_PASSWORD` sebelum menjalankan seed.
