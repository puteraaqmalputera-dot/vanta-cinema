# SKRIP VIDEO DEMO & PEMBENTANGAN PROJEK AKHIR (5–10 MINIT)
## KURSUS: DFV 10023 — FRONT-END PROGRAMMING
### PENSYARAH: ENCIK MOHAMED SAIFUDDIN KHAN BIN MOHEMED YACOB
### TEMA: THEME 3 (MOVIE / TV SHOW EXPLORER) — PROJEK: VANTA CINEMA (3 APIS)

---

## PANDUAN RAKAMAN VIDEO
- **Tempoh Sasaran:** 6 hingga 8 minit (memenuhi syarat 5–10 minit).
- **Format:** Rakaman skrin (Screen Recording) dengan suara pembentang jelas.
- **Skrin Dibuka:** Pelayar web (Google Chrome) menunjukkan laman web yang sedang berjalan di `http://localhost:5173`.

---

## SUSUNAN PEMBENTANGAN (TIMELINE)

### 0:00 – 1:00 | Bahagian 1: Pengenalan Diri & Projek
**Tindakan pada Skrin:** Buka laman utama (Discover Page). Tunjukkan logo "VANTA CINEMA".
> **Skrip Percakapan:**
> *"Assalamualaikum dan salam sejahtera kepada Encik Mohamed Saifuddin Khan dan rakan-rakan sekelas. Nama saya [Nama Anda] dari kelas DFK Semester 1. Hari ini saya akan membentangkan Projek Akhir bagi kursus DFV 10023 Front-End Programming.*
>
> *Bagi projek ini, saya telah memilih **Theme 3: Movie / TV Show Explorer**. Nama aplikasi web yang saya bangunkan ialah **VANTA CINEMA**, sebuah platform penemuan filem dan siri televisyen bertaraf premium yang dibina 100% menggunakan rangka kerja **Vue 3**, **Vite**, dan **Pinia**.*
>
> *Menepati syarat projek yang memerlukan **3 API** (1 Unik dan 2 Dikongsi), aplikasi ini telah mengintegrasikan 3 perkhidmatan REST API sepenuhnya."*

---

### 1:00 – 2:45 | Bahagian 2: Integrasi Tiga (3) Third-Party API
**Tindakan pada Skrin:** 
1. Tunjukkan Hero Carousel filem sohor kini (TMDB API - Unik).
2. Tunjukkan baris "Television Spotlight" dan klik pautan ke halaman TV Series (TVmaze API - Dikongsi 1).
3. Klik menu **Universities** di navigasi header (Universities API - Dikongsi 2).
> **Skrip Percakapan:**
> *"Bagi memenuhi syarat 3 API dalam projek ini:*
> 1. *API Pertama (API UNIK): **TMDB (The Movie Database)** — Digunakan secara eksklusif dalam projek ini untuk memuatkan filem trending mingguan, filem popular, trailer rasmi YouTube, dan penarafan global.*
> 2. *API Kedua (API DIKONGSI #1): **TVmaze API** — Digunakan untuk menjelajah siri televisyen, panduan episod bagi setiap musim, serta jadual siaran TV langsung harian (Airing Schedule).*
> 3. *API Ketiga (API DIKONGSI #2): **Hipo Universities API** — Digunakan pada halaman University Directory bagi memaparkan maklumat institusi pengajian tinggi merangkumi tiga butiran utama: **Nama Universiti (Name)**, **Negara (Country)**, dan **Laman Web Rasmi (Website)**.*
>
> *Kesemua data diseragamkan (*normalize*) ke dalam format entiti yang konsisten menggunakan helper khusus di fail `normalize.js`."*

---

### 2:45 – 4:15 | Bahagian 3: Demonstrasi API Ketiga — Universities Directory
**Tindakan pada Skrin:**
1. Buka halaman **Universities** (`/universities`).
2. Tunjukkan status "Live API Connected".
3. Tunjukkan kad-kad universiti di Malaysia: ada Nama, Negara (Malaysia), dan butang klik "Official Website".
4. Klik salah satu pautan (cth: Universiti Malaya) dan tunjukkan ia membuka tab baru ke laman web rasmi universiti.
5. Gunakan carian: taip "Teknologi" atau "Kebangsaan" (tunjukkan animasi debouncing 350ms).
6. Tukar penapis negara ke "Japan" atau "United Kingdom".
> **Skrip Percakapan:**
> *"Sekarang mari kita lihat pelaksanaan API Ketiga iaitu **University Details API**. Pada halaman ini:*
> - *Setiap kad memaparkan butiran lengkap: Nama Universiti, Negara, dan pautan langsung ke Official Website.*
> - *Pengguna boleh menapis mengikut negara pilihan (seperti Malaysia, United Kingdom, Jepun, dsb.) atau memilih 'All Countries'.*
> - *Carian dilengkapi teknik **Debounce 350ms** untuk carian nama institusi.*
> - *Halaman ini lengkap dengan keadaan **Loading Shimmer**, **Error State** dengan butang Retry, serta **Empty State** sekiranya tiada padanan dijumpai."*

---

### 4:15 – 5:30 | Bahagian 4: Carian, Penapisan & Pengendalian Ralat Filem
**Tindakan pada Skrin:** 
1. Klik menu **Movies**.
2. Taip tajuk filem pada Search bar (tunjukkan debouncing 350ms).
3. Kosongkan carian dan tunjukkan penapis: pilih Genre (cth: Sci-Fi), pilih Rating (7.0+), ubah susunan.
4. Tunjukkan URL di browser berubah serentak (sync query params).
5. Klik salah satu kad filem untuk membuka **Movie Details** (`/movie/:id`).
6. Klik butang **Watch Trailer** — tunjukkan popup YouTube Trailer dimainkan. Tekan kekunci `Escape` untuk menutup popup.
> **Skrip Percakapan:**
> *"Beralih ke **Movie Explorer**, saya membangunkan sistem carian berkuasa tinggi:*
> - *Carian menggunakan **Debounce ~350ms** bersama **AbortController** untuk membatalkan *request* lama.*
> - *Penapis **Genre**, **Tahun**, dan **Min Rating** diselaraskan ke dalam URL Query Parameter secara dinamik.*
> - *Pada halaman butiran filem, pengguna boleh menonton trailer YouTube rasmi melalui popup modal yang mesra kebolehcapaian di mana audio dimatikan secara automatik apabila ditutup."*

---

### 5:30 – 6:45 | Bahagian 5: Ciri Interaktif Watchlist, TV Guide & Mood Match
**Tindakan pada Skrin:**
1. Navigasi ke **TV Series Details** (`/tv/:id`). Tunjukkan tab pertukaran Season 1, Season 2, dan senarai episod.
2. Klik ikon **Watchlist** pada kad filem/TV.
3. Pergi ke halaman **Watchlist** (`/watchlist`). Tunjukkan data tersimpan, tanda 'Watched', dan muat semula laman web (F5) untuk buktikan `localStorage` berfungsi.
4. Buka halaman **Mood Match** (`/mood-match`). Pilih mood "Adrenaline Rush", pilih era, dan klik "Find My Movies".
> **Skrip Percakapan:**
> *"Pada siri televisyen, episod dikumpulkan secara kemas mengikut musim (*Season Selector*).*
>
> *Bagi ciri interaktif:*
> 1. *Ciri **Personal Watchlist**: Menggunakan **Pinia Store** dan browser **localStorage**. Pengguna boleh menyimpan filem atau siri TV dan menanda status 'Watched' tanpa memerlukan pangkalan data.*
> 2. *Ciri **Mood Match Engine**: Enjin cadangan yang memadankan emosi pengguna kepada genre TMDB secara tepat."*

---

### 6:45 – 7:45 | Bahagian 6: Reka Bentuk Responsif & Penerbitan Vercel
**Tindakan pada Skrin:**
1. Tekan `F12` dan ubah mod kepada peranti mudah alih (iPhone / Android).
2. Tunjukkan menu Hamburger, susunan grid responsif pada semua halaman (Movies, TV, Universities), dan tiada limpahan teks.
3. Tunjukkan fail `vercel.json` dalam VS Code.
> **Skrip Percakapan:**
> *"Dari sudut CSS Responsif, laman web ini menggunakan reka bentuk cecair (Fluid CSS) berasaskan CSS Grid dan Flexbox. Apabila dibuka pada telefon pintar (375px), navigasi bertukar kepada menu drawer mudah alih dan kad universiti serta poster menyesuaikan diri secara automatik tanpa limpahan skrin.*
>
> *Bagi penerbitan awan, projek ini sedia untuk dideploy ke **Vercel** dengan konfigurasi fail `vercel.json` bagi memastikan Vue Router History Mode tidak menghasilkan ralat 404."*

---

### 7:45 – 8:00 | Bahagian 7: Penutup
> **Skrip Percakapan:**
> *"Kesimpulannya, projek **VANTA CINEMA** ini telah berjaya mengintegrasikan ketiga-tiga API yang disyaratkan serta memenuhi kesemua 11 kriteria dalam rubrik pentaksiran DFV 10023. Terima kasih kepada Encik Mohamed Saifuddin Khan atas tunjuk ajar sepanjang semester ini. Sekian, terima kasih."*
