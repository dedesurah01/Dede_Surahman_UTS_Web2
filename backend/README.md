# 🥟 Cireng Isi - Backend API

Backend REST API untuk **Cireng Isi Online Shop** menggunakan Node.js, Express, dan MongoDB.

---

## 🚀 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Upload**: Multer (untuk gambar produk)
- **CORS**: Support multi-origin
- **Environment**: dotenv

---

## 📦 Instalasi

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Buat file `.env` di root folder backend:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cireng_shop
```

> **Catatan:** Pastikan MongoDB sudah berjalan di localhost port 27017, atau gunakan MongoDB Atlas dengan connection string yang sesuai.

### 3. Seed Database (Opsional)

Isi database dengan data produk dari `cireng-shop/data/products.json`:

```bash
node seeders/productSeeder.js
```

Output:
```
✅ 12 produk berhasil dimasukkan ke database
```

### 4. Jalankan Server

**Mode Development (dengan auto-reload):**
```bash
npm run dev
```

**Mode Production:**
```bash
npm start
```

Server akan berjalan di: `http://localhost:5000`

---

## 📡 API Endpoints

### **Base URL**: `http://localhost:5000/api`

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/products` | Ambil semua produk (support search, filter, sort, pagination) |
| `GET` | `/products/search?q=ayam` | Cari produk by nama/deskripsi/kategori |
| `GET` | `/products/:id` | Ambil produk by ID |
| `POST` | `/products` | Tambah produk baru |
| `PUT` | `/products/:id` | Update produk by ID |
| `PATCH` | `/products/:id/image` | Upload gambar produk |
| `DELETE` | `/products/:id` | Hapus produk by ID |

---

## 📖 API Documentation

### 1. **GET /api/products**

Ambil semua produk dengan filter & pagination.

**Query Parameters:**

| Param | Tipe | Deskripsi | Default |
|-------|------|-----------|---------|
| `search` | String | Cari berdasarkan nama atau deskripsi | - |
| `category` | String | Filter by kategori (`pedas`, `original`, `vegetarian`, `manis`, `all`) | `all` |
| `minPrice` | Number | Harga minimum | - |
| `maxPrice` | Number | Harga maksimum | - |
| `sort` | String | Urutan: `price-asc`, `price-desc`, `rating`, `popular` | - |
| `page` | Number | Halaman pagination | `1` |
| `limit` | Number | Jumlah produk per halaman | `12` |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama": "Cireng Isi Ayam Pedas",
      "price": 15000,
      "image": "https://...",
      "description": "...",
      "category": "pedas",
      "rating": 4.8,
      "sold": 320,
      "stock": 50,
      "createdAt": "2026-07-03T09:00:00.000Z",
      "updatedAt": "2026-07-03T09:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 12,
    "totalPages": 1
  }
}
```

---

### 2. **GET /api/products/:id**

Ambil detail produk berdasarkan ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nama": "Cireng Isi Ayam Pedas",
    "price": 15000,
    ...
  }
}
```

---

### 3. **POST /api/products**

Tambah produk baru (admin only).

**Request Body:**
```json
{
  "nama": "Cireng Isi Seafood",
  "price": 20000,
  "image": "https://example.com/image.jpg",
  "description": "Cireng isi seafood segar",
  "category": "original",
  "stock": 30,
  "rating": 4.5,
  "sold": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": { ...produk_baru },
  "message": "Produk berhasil ditambahkan"
}
```

---

### 4. **PUT /api/products/:id**

Update produk (partial update didukung).

**Request Body:**
```json
{
  "price": 18000,
  "stock": 40
}
```

**Response:**
```json
{
  "success": true,
  "data": { ...produk_updated },
  "message": "Produk berhasil diperbarui"
}
```

---

### 5. **PATCH /api/products/:id/image**

Upload gambar produk baru.

**Request:** Form-data
- `image`: File gambar (jpg, png, webp, max 2MB)

**Response:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "/uploads/product-1234567890.jpg",
    "product": { ...produk_updated }
  },
  "message": "Gambar produk berhasil diperbarui"
}
```

---

### 6. **DELETE /api/products/:id**

Hapus produk berdasarkan ID.

**Response:**
```json
{
  "success": true,
  "message": "Produk 'Cireng Isi Ayam Pedas' berhasil dihapus"
}
```

---

## 🗂️ Struktur Folder

```
backend/
├── config/
│   └── db.js              # Konfigurasi MongoDB
├── controllers/
│   └── productController.js  # Logika bisnis produk
├── models/
│   └── Product.js         # Schema Mongoose
├── routes/
│   └── productRoutes.js   # Route definitions
├── seeders/
│   └── productSeeder.js   # Seeder database dari JSON
├── uploads/               # Folder untuk gambar upload
│   └── .gitkeep
├── .env                   # Environment variables
├── .gitignore
├── package.json
├── server.js              # Entry point server
└── README.md
```

---

## 🛡️ Error Handling

Semua error dikembalikan dalam format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**HTTP Status Codes:**
- `200 OK` - Request berhasil
- `201 Created` - Resource berhasil dibuat
- `400 Bad Request` - Input tidak valid
- `404 Not Found` - Resource tidak ditemukan
- `500 Internal Server Error` - Error server

---

## 📝 Notes

- ID produk di-generate otomatis (auto-increment dari ID tertinggi)
- Upload gambar disimpan di folder `uploads/`
- Gambar dapat berupa URL eksternal atau path lokal
- CORS sudah diaktifkan untuk development (ubah origin saat production)

---

## 👨‍💻 Developer

Backend API untuk tugas UTS Pemrograman Web.
