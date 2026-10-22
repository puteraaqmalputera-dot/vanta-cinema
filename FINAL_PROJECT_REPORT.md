# LAPORAN PROJEK AKHIR (FINAL PROJECT REPORT)
## KURSUS: DFV 10023 — FRONT-END PROGRAMMING
### PROGRAM: DIPLOMA TEKNOLOGI MAKLUMAT (DFK) | SEMESTER 1 (SESI JULAI – DISEMBER 2026)
### INSTITUSI: TVETMARA BESUT

---

| Maklumat Kursus & Projek | Butiran |
| :--- | :--- |
| **Nama Pelajar** | [NAMA PELAJAR] |
| **No. Matrik / ID Pelajar** | [NO. MATRIK] |
| **Kursus** | DFV 10023 / Front-End Programming |
| **Pensyarah** | Mohamed Saifuddin Khan bin Mohemed Yacob |
| **Tema Pilihan** | **Theme 3: Movie / TV Show Explorer** |
| **Tajuk Projek** | **VANTA CINEMA — Premium Movie & TV Discovery Web Application** |
| **Bilangan API** | **3 Third-Party APIs (1 Unik + 2 Dikongsi)** |
| **Wajaran Markah** | 40% daripada Gred Keseluruhan |
| **Tarikh Hantar** | 1 November 2026 |

---

## 1. PENGENALAN PROJEK (PROJECT OVERVIEW)

**VANTA CINEMA** merupakan sebuah aplikasi web penemuan filem dan siri televisyen moden yang dibina berasaskan rangka kerja **Vue 3 (Composition API)**. Aplikasi ini dibangunkan untuk memenuhi keperluan Projek Akhir bagi kursus DFV 10023 (Front-End Programming) di bawah Theme 3 (*Movie / TV Show Explorer*).

### 1.1 Objektif Pembangunan
1. Mengaplikasikan konsep **HTML5 Semantic Elements** dan **CSS Responsive** untuk menghasilkan antaramuka pengguna bertaraf industri.
2. Mengintegrasikan **tiga (3) Third-Party REST API**:
   - **API 1 (Unik):** TMDB API (The Movie Database)
   - **API 2 (Dikongsi):** TVmaze API
   - **API 3 (Dikongsi):** Hipo Universities API (Menyediakan maklumat *University details: name, country, website*)
3. Mempraktikkan pengurusan keadaan global (*state management*) menggunakan **Pinia** dan penyimpanan setempat (**localStorage**).
4. Melaksanakan teknik pengaturcaraan **JavaScript ES2022+** termasuk pengendalian tak segerak (*asynchronous programming*), *debouncing*, dan pengurusan ralat (*error handling*).
5. Menerapkan persediaan penerbitan awan ke platform **Vercel Hosting**.

---

## 2. SPESIFIKASI TEKNOLOGI & SENIBINA SISTEM

### 2.1 Teknologi Utama
- **Framework:** Vue.js 3.5+ (Composition API dengan `<script setup>`)
- **Build Tool:** Vite 5.4+
- **Routing:** Vue Router 4.5+ (History Mode dengan *scroll restoration*)
- **State Management:** Pinia 2.2+ (diintegrasikan bersama browser `localStorage`)
- **Ikonografi:** Lucide Icons (`@lucide/vue`)
- **Styling:** CSS3 Custom Properties (Design Tokens), Flexbox & CSS Grid
- **Deployment Platform:** Vercel Static Hosting

### 2.2 Struktur Direktori Projek
```text
PutraCinema/
├── .env.example              # Fail templat pembolehubah persekitaran
├── .gitignore                # Pengecualian fail git (node_modules, .env, dist)
├── index.html                # Dokumen kemasukan HTML5 utama
├── package.json              # Definisi pakej dan skrip binaan
├── vercel.json               # Konfigurasi SPA rewrite untuk Vercel
├── vite.config.js            # Konfigurasi Vite & alias path '@'
└── src/
    ├── App.vue               # Kerangka utama aplikasi (Header, RouterView, Footer)
    ├── main.js               # Titik permulaan Vue, Pinia, dan Router
    ├── components/
    │   ├── common/           # Komponen guna semula (Badge, Poster, Filter, Skeletons, Modals)
    │   ├── layout/           # AppHeader, AppFooter, MobileNavigation
    │   ├── movie/            # MovieCard
    │   ├── tv/               # TVShowCard
    │   ├── university/       # UniversityCard (Name, Country, Website)
    │   ├── watchlist/        # WatchlistItem
    │   └── mood/             # MoodCard
    ├── composables/          # Logik gubahan (useDebounce)
    ├── router/               # Konfigurasi 9 laluan URL aplikasi
    ├── services/             # Integrasi TMDB, TVmaze, Universities, normalize & fetch client
    ├── stores/               # Pinia store untuk simpanan Watchlist
    ├── styles/               # tokens.css, global.css, utilities.css
    └── views/                # Discover, Movies, MovieDetails, TVSeries, TVDetails, Universities, Watchlist, MoodMatch, NotFound
```

---

## 3. INTEGRASI TIGA (3) THIRD-PARTY API

Aplikasi ini menepati sepenuhnya syarat pensyarah di mana setiap pelajar **WAJIB menggunakan 3 API**: 1 API Unik + 2 API Dikongsi.

### 3.1 API 1 — The Movie Database (TMDB API) [API UNIK]
- **Kategori:** Wajib & Unik kepada projek ini.
- **Base URL:** `https://api.themoviedb.org/3`
- **Kaedah Pengesahan:** Bearer Token via Header HTTP Authorization (`VITE_TMDB_READ_TOKEN`).
- **Endpoint yang Digunakan:**
  - `GET /trending/movie/week` — Menyenaraikan filem sohor kini mingguan untuk Hero Carousel.
  - `GET /movie/popular` — Filem popular semasa.
  - `GET /movie/top_rated` — Filem dengan penarafan tertinggi sepanjang zaman.
  - `GET /discover/movie` — Penapisan filem berdasarkan genre, tahun terbitan, dan nilai penarafan.
  - `GET /search/movie` — Carian kata kunci tajuk filem secara langsung.
  - `GET /genre/movie/list` — Senarai nama dan ID genre filem.
  - `GET /movie/{id}?append_to_response=credits,videos,recommendations,similar` — Data terperinci filem, kru, barisan pelakon, dan video trailer rasmi YouTube.

### 3.2 API 2 — TVmaze API [API DIKONGSI #1]
- **Kategori:** API Hiburan Tambahan.
- **Base URL:** `https://api.tvmaze.com`
- **Kaedah Pengesahan:** Tiada kekunci API diperlukan (Open Public API).
- **Endpoint yang Digunakan:**
  - `GET /search/shows?q={query}` — Carian langsung siri televisyen.
  - `GET /shows?page={page}` — Menjelajah katalog siri televisyen.
  - `GET /shows/{id}?embed[]=cast&embed[]=seasons` — Maklumat terperinci siri, pelakon, dan musim.
  - `GET /shows/{id}/episodes` — Senarai lengkap episod bagi setiap musim.
  - `GET /schedule?country=US&date={YYYY-MM-DD}` — Jadual siaran televisyen secara *real-time* bagi tarikh semasa.

### 3.3 API 3 — Hipo Universities API [API DIKONGSI #2: UNIVERSITY DETAILS]
- **Kategori:** Maklumat Institusi Pengajian Tinggi (*University details: name, country, website*).
- **Base URL:** `http://universities.hipolabs.com/search` & fallback `https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json`
- **Kaedah Pengesahan:** Terbuka (Public).
- **Data yang Dipaparkan:**
  - **Name:** Nama rasmi universiti / kolej pengajian tinggi.
  - **Country:** Negara institusi (dengan penapis negara seperti Malaysia, US, UK, Australia, Japan, dsb.).
  - **Website:** Pautan klik terus ke laman web rasmi universiti (`web_pages[0]`).
- **Ciri-Ciri Paparan:**
  - Carian kata kunci universiti dengan *debounce 350ms*.
  - *Country filter dropdown* & butang pil pantas (Malaysia 🇲🇾, US 🇺🇸, UK 🇬🇧, Australia 🇦🇺, Japan 🇯🇵, Canada 🇨🇦, All Countries 🌐).
  - Status *Live API Connected*.
  - Keadaan **Loading Skeletons**, **Error State** dengan butang *Retry*, dan **Empty State**.
  - Responsif penuh pada semua peranti.

---

## 4. PEMETAAN RUBRIK PENILAIAN (RUBRIC MAPPING)

| Bil | Kriteria Rubrik | Peratus | Bukti Pelaksanaan & Kod Sumber |
| :---: | :--- | :---: | :--- |
| **1** | **Framework (Vue.js)** | 15% | Dibina 100% menggunakan **Vue 3 Composition API** (`<script setup>`), Single-File Components (SFC), reaktif ref/computed/watch, sistem penghalaan rasmi **Vue Router**, dan pengurusan data reaktif **Pinia Store**. |
| **2** | **API Unique (TMDB)** | 10% | Menggunakan **TMDB v3/v4 REST API** untuk penemuan filem global yang unik kepada projek ini. |
| **3** | **Optional 2nd API (TVmaze)** | 10% | Menambah integrasi penuh **TVmaze API** bagi siri televisyen, episod panduan bersiri, dan jadual siaran langsung harian. |
| **4** | **API Integration Quality (Termasuk API 3: Universities)** | 15% | Fail `apiClient.js` dengan kawalan had masa (*timeout AbortController*), `universities.js` dengan fallback HTTPS, penyeragaman data (`normalize.js`), penapisan kod HTML berbahaya TVmaze, dan composite IDs. |
| **5** | **HTML Semantic** | 8% | Menggunakan tag semantik sepenuhnya: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, butang `aria-label`, serta *skip-link* ke kandungan utama bagi kebolehcapaian (*accessibility*). |
| **6** | **CSS Responsive** | 10% | Reka bentuk adaptif tanpa limpahan (*no horizontal overflow*) pada resolusi 375px (telefon pintar), 768px (tablet), 1024px (komputer riba) dan 1440px (skrin lebar). Nisbah poster terjaga rapi pada nisbah `2:3`. |
| **7** | **JavaScript** | 8% | Menulis kod moden JavaScript ES2022+, fungsi *debounce* 350ms tersuai, manipulasi tatasusunan (*array mapping, filtering, reducing*), dan storan `localStorage` dengan penomboran versi (*schema versioning*). |
| **8** | **Loading & Error State** | 7% | Komponen `SkeletonGrid` dan `SkeletonCard` animasi shimmer semasa memuatkan data; komponen `ErrorState` dengan butang *Retry*; dan `EmptyState` dengan navigasi pantas apabila tiada rekod dijumpai. |
| **9** | **Search & Filter** | 7% | Carian berkesan dengan penangguhan *debounce* 350ms, gabungan penapis Genre, Tahun, Penarafan Bintang, Negara Universiti, dan Susunan yang diselaraskan serentak dengan URL parameter. |
| **10** | **Vercel Deployment** | 5% | Persediaan fail `vercel.json` bagi mengatasi isu 404 pada mod sejarah Vue Router semasa muat semula laman web (*browser refresh*). Berjaya diuji pada binaan `dist/`. |
| **11** | **Code Quality** | 5% | Pembahagian modular yang bersih mengikut piawaian industri (`views/`, `components/`, `services/`, `stores/`, `styles/`), dokumentasi lengkap dalam `README.md`, dan bebas amaran binaan. |
| **JUMLAH** | | **100%** | **(Menyumbang 40% Gred Akhir DFV 10023)** |

---

## 5. PANDUAN PELAKSANAAN & PENERBITAN (DEPLOYMENT)

### 5.1 Menjalankan Projek Secara Lokal (Local Dev)
1. Buka PowerShell pada folder projek:
   ```powershell
   cd C:\Users\USER\Desktop\PutraCinema
   ```
2. Pasang kebergantungan pakej:
   ```powershell
   npm.cmd install
   ```
3. Mulakan pelayan pembangunan:
   ```powershell
   npm.cmd run dev
   ```
4. Buka pelayar web pada alamat: `http://localhost:5173`.

### 5.2 Penerbitan ke Vercel (Hosting)
1. Muat naik kod sumber projek ke GitHub (fail `.env` dan `node_modules` telah dikecualikan secara selamat melalui `.gitignore`).
2. Log masuk ke akaun **Vercel** dan pilih **Add New Project**.
3. Import repositori GitHub tersebut.
4. Tetapkan konfigurasi:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Masukkan kunci persekitaran (Environment Variables):
   - `VITE_TMDB_READ_TOKEN` = *(Token Akses TMDB anda)*
6. Klik butang **Deploy**. Pautan Vercel rasmi sedia diserahkan.

---

## 6. KESIMPULAN

Projek **VANTA CINEMA** telah berjaya disiapkan dengan menyatukan **tiga (3) REST API luaran**:
1. **TMDB API (API Unik)**
2. **TVmaze API (API Dikongsi)**
3. **Universities API (API Dikongsi — University Details: Name, Country, Website)**

Aplikasi ini menepati kesemua 11 kriteria dalam rubrik penilaian DFV 10023 dengan cemerlang, responsif pada semua saiz skrin, dan dilengkapi keadaan pemuatan (*loading state*) serta ralat (*error state*) yang kukuh.
