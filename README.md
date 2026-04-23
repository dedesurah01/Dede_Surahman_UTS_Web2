# 🥟 Cireng Isi - Online Shop Camilan Kenyal Favorit

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Web-blue?style=for-the-badge" alt="Web">
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript" alt="JS">
  <img src="https://img.shields.io/badge/Storage-LocalStorage-orange?style=for-the-badge" alt="Storage">
  <img src="https://img.shields.io/badge/Data-JSON-lightgrey?style=for-the-badge&logo=json" alt="JSON">
</p>

---

## 📝 Deskripsi Project

**Cireng Isi** adalah platform *e-commerce* yang berfokus pada penjualan camilan khas Indonesia, yaitu **Cireng (Aci Goreng) dengan berbagai pilihan isian** — mulai dari ayam pedas, keju, rendang, hingga coklat. Proyek ini dirancang untuk memberikan pengalaman belanja online yang mudah, cepat, dan menyenangkan bagi pecinta camilan.

Sistem ini dibangun sebagai proyek **Full Client-Side** menggunakan arsitektur ringan namun bertenaga. Seluruh pengelolaan data (User, Produk, Keranjang, dan Transaksi) dilakukan menggunakan **Vanilla JavaScript** dengan pemanfaatan **LocalStorage** sebagai media penyimpanan database lokal yang persisten.

---

## ✨ Fitur Unggulan

### 🛍️ Pengalaman Belanja Modern
- **Product Catalog:** 12 varian produk cireng isi dengan kategori Pedas, Original, Vegetarian, dan Manis.
- **Smart Cart:** Manajemen keranjang belanja dinamis dengan fitur tambah/kurang/hapus dan kalkulasi total otomatis.
- **Gratis Ongkir:** Progress bar gratis ongkir otomatis untuk pembelian di atas Rp 50.000.
- **Advanced Search & Filter:** Pencarian produk berdasarkan nama, kategori, rentang harga, dan pengurutan (harga/rating/terpopuler).
- **Wishlist:** Simpan produk favorit untuk dikunjungi kembali kapan saja.
- **Pagination:** Tampilan produk per halaman agar lebih rapi dan cepat dimuat.

### 🎨 Desain & Interaktivitas
- **Responsive Layout:** Antarmuka yang sepenuhnya adaptif (Mobile, Tablet, Desktop) menggunakan Tailwind CSS.
- **Dark & Light Mode:** Dukungan tema visual yang dapat disesuaikan dengan preferensi pengguna, tersimpan persisten.
- **Dynamic Rating:** Sistem penilaian bintang per produk per pengguna yang tampil secara dinamis.
- **Toast Notification:** Notifikasi pop-up elegan untuk setiap aksi pengguna (tambah cart, wishlist, checkout, dll).
- **Product Detail Modal:** Modal detail produk lengkap tanpa pindah halaman.

### 🔐 Keamanan & Administrasi
- **Auth System:** Simulasi fitur Login, Register, dan Logout dengan validasi email unik dan password minimal 6 karakter.
- **Admin Dashboard:** Panel khusus admin untuk memantau total pesanan, pendapatan, pengguna terdaftar, dan daftar produk.
- **Manajemen Pesanan:** Admin dapat mengubah status pesanan (Diproses → Dikirim → Selesai → Dibatalkan).
- **Upload Gambar Produk:** Admin dapat mengganti gambar produk langsung dari panel admin, disimpan sebagai base64 di LocalStorage.
- **Persistence Data:** Data tetap tersimpan aman di browser meskipun halaman dimuat ulang.

### 📦 Checkout & Riwayat
- **Form Checkout:** Input nama, alamat, nomor HP, dan pilihan metode pembayaran (COD, Transfer, GoPay, OVO).
- **Generate ID Transaksi:** Setiap pesanan mendapat ID unik otomatis berformat `CRG-XXXXX-XXXX`.
- **Order History:** Riwayat semua pesanan pengguna beserta detail lengkap per transaksi.

---

## 🚀 Teknologi yang Digunakan

| Layer | Teknologi |
| :--- | :--- |
| **Frontend UI** | [Tailwind CSS](https://tailwindcss.com/) (via CDN) |
| **Programming Language** | JavaScript (ES6+) Vanilla |
| **Database/Storage** | Web Storage API (LocalStorage) |
| **Data Format** | JSON (JavaScript Object Notation) |
| **Deployment** | GitHub Pages |

---

## 🌐 Demo Aplikasi

Aplikasi telah berhasil dideploy dan dapat diakses secara publik melalui tautan berikut:

👉 [**Live Demo Cireng Isi di GitHub Pages**]([https://dedesurah01.github.io/Dede_Surahman_UTS_Web2/])

---

## 🗂️ Struktur Project

```
cireng-shop/
├── index.html          # Halaman Login & Register
├── shop.html           # Halaman Toko / Katalog Produk
├── cart.html           # Halaman Keranjang Belanja
├── checkout.html       # Halaman Checkout
├── orders.html         # Halaman Riwayat Pesanan
├── admin.html          # Halaman Admin Panel
├── data/
│   └── products.json   # Data dummy produk (12 varian)
└── js/
    ├── utils.js        # Fungsi utilitas (toast, format, dark mode, dll)
    ├── auth.js         # Modul autentikasi (login, register, logout)
    ├── cart.js         # Modul keranjang & wishlist
    ├── products.js     # Modul produk (render, filter, rating, upload gambar)
    └── checkout.js     # Modul checkout & riwayat pesanan
```

---

## 💻 Cara Instalasi Lokal

1. **Clone Repository**
```bash
git clone https:[https://github.com/Dede_Surahman_UTS_Web2/]
```

2. **Masuk ke folder project**
```bash
cd cireng-shop
```

3. **Jalankan dengan Live Server**

Buka folder menggunakan **VS Code**, lalu klik kanan `index.html` → **Open with Live Server**.

> Atau bisa langsung buka file `index.html` di browser (beberapa fitur fetch JSON memerlukan server lokal).

---

## 🔑 Akun Demo

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@cireng.com | admin123 |
| **User** | Daftar sendiri via halaman Register | min. 6 karakter |

---

## 📸 Halaman Aplikasi

| Halaman | Deskripsi |
| :--- | :--- |
| `index.html` | Login & Register dengan validasi |
| `shop.html` | Katalog produk, search, filter, wishlist |
| `cart.html` | Keranjang belanja dengan progress gratis ongkir |
| `checkout.html` | Form pengiriman & pilihan pembayaran |
| `orders.html` | Riwayat & detail transaksi |
| `admin.html` | Dashboard admin, manajemen pesanan & upload gambar produk |

---

## 👨‍💻 Developer

Dibuat dengan ❤️ sebagai proyek UTS Pemrograman Web.
