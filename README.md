# Backend (NestJS)

Repository ini berisi backend API untuk proyek — dibangun menggunakan NestJS (v11) dengan Prisma sebagai ORM untuk MySQL.

README ini berisi deskripsi singkat, prasyarat, dan langkah-langkah untuk menjalankan aplikasi backend secara lokal (instruksi ditulis untuk Windows PowerShell, namun perintah juga berlaku di macOS/Linux dengan sedikit penyesuaian untuk path).

## Ringkasan singkat

- Framework: NestJS (v11)
- Database: MySQL (via Prisma)
- ORM / Migrasi: Prisma
- API docs: Swagger tersedia di `/api/docs` saat server berjalan
- Port default: 5000 (lihat `src/main.ts`)

## Prasyarat

- Node.js (disarankan versi 18+)
- npm
- MySQL (jalankan lokal atau gunakan service remote). Anda perlu mengatur `DATABASE_URL` di environment.

Contoh format `DATABASE_URL` untuk MySQL:

```
mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

Contoh untuk PowerShell (set sementara untuk sesi saat ini):

```powershell
$env:DATABASE_URL = "mysql://root:password@localhost:3306/backend_db"
```

Atau buat file `.env` di folder `backend` dengan isi:

```
DATABASE_URL="mysql://root:password@localhost:3306/backend_db"
```

## Instalasi

1. Masuk ke folder backend dan install dependensi:

```powershell
npm install
```

## Menyiapkan database (Prisma)

```powershell
# Generate Prisma client
npx prisma generate

# Migrasi:
npx prisma migrate deploy

# Jalankan seed (script ada di package.json via prisma.seed):
npx prisma db seed
```

Catatan:

- Script seed di proyek ini menjalankan `ts-node prisma/seed.ts` (lihat `package.json`).

## Menjalankan server

- Mode development (watch):

```powershell
npm run start:dev
```

Server berjalan default pada port `5000`. API docs Swagger tersedia di:

```
http://localhost:5000/api/docs
```
