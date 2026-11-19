# Haidar Hafiz — Jasa Pembuatan Website

Website jasa pembuatan website, lengkap dengan portofolio karya yang sudah jadi.
Alamat: **https://bisnispamekasan.biz.id**

Dibuat dengan HTML, CSS, dan JavaScript murni: tanpa framework, tanpa build, dan tanpa Google Fonts
(semua font tersimpan di folder `assets/fonts`). Di-hosting gratis di GitHub Pages.

## Cara membuka di komputer

Klik dua kali `index.html`, atau jalankan server lokal:

```bash
npx serve .
```

## Isi folder

```
index.html                 seluruh isi halaman (teks, harga, FAQ, kontak)
404.html                   halaman "tidak ditemukan"
assets/css/style.css       tampilan; warna utama ada di bagian :root paling atas
assets/js/main.js          animasi, cuplikan karya di hero, menu HP, FAQ, formulir → WhatsApp
assets/js/vendor/lenis.min.js   scroll halus (Lenis 1.1.13, lisensi MIT)
assets/fonts/              Newsreader & Plus Jakarta Sans (sudah dipangkas)
assets/img/karya/          screenshot karya (desktop & HP, format WebP, beberapa ukuran)
assets/img/og.jpg          gambar pratinjau saat link dibagikan (1200×630)
CNAME                      nama domain untuk GitHub Pages
robots.txt, sitemap.xml    petunjuk untuk Google
```

## Mengubah isi

| Yang diubah | Tempatnya |
|---|---|
| Teks, judul, FAQ | `index.html` (setiap bagian diberi komentar `<!-- ... -->`) |
| Kata yang berganti di judul (kafe, toko, UMKM, ...) | `index.html`, bagian `HERO`: elemen `rot__w` dan teks `sr-only` di sebelahnya |
| Harga & isi paket | `index.html`, bagian `HARGA` |
| Nomor WhatsApp | `assets/js/main.js` baris `WA_NUMBER`, lalu cari-ganti `6285230732988` di `index.html` |
| Email, GitHub, LinkedIn | `index.html`, bagian `KONTAK` dan `FOOTER` |
| Warna | `assets/css/style.css`, bagian `:root` |

## Memperbarui website yang sudah online

Setelah mengubah file, jalankan di folder ini:

```bash
node tools/versi.mjs        # beri nomor versi baru pada CSS & JS (agar pengunjung tidak melihat versi lama dari cache)
git add -A
git commit -m "Perbarui isi website"
git push
```

GitHub Pages memperbarui website dalam 1–2 menit. Jika mengubah halaman secara besar, perbarui juga
tanggal `<lastmod>` di `sitemap.xml`.

## Menambah atau mengganti karya

Setiap karya adalah satu blok `<article class="work">` di bagian `KARYA`. Salin satu blok, lalu ganti teks dan gambarnya.
Cuplikan yang berganti di hero ada di bagian `HERO` (`reel__img` dan tombol `reel__dot`).

Gambar yang dibutuhkan per karya (taruh di `assets/img/karya/`):

| File | Isi | Ukuran |
|---|---|---|
| `nama-d-800.webp`, `nama-d-1300.webp`, `nama-d-1800.webp` | Screenshot desktop (lebar 1440, tinggi ±1500 px agar bisa digulir saat kursor diarahkan) | lebar 800 / 1300 / 1800 px |
| `nama-m-420.webp`, `nama-m-780.webp` | Screenshot HP (390×844) | lebar 420 / 780 px |

## Tentang karya kafe

Website kafe klien ditampilkan dengan **nama dan data yang disamarkan**. Screenshot diambil dari salinan
website yang namanya diganti menjadi "teduh — Coffee & Kitchen", lokasi, alamat, dan kontaknya diganti
data fiktif, dan logo yang tampak di foto sudah dihapus. Website asli klien tidak diubah sama sekali.

## Domain & Google

DNS domain diatur di panel Domainesia (nameserver `nsx1/nsx2.domainesia.com`):

| Tipe | Host | Nilai |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | haidarhafiz21.github.io |

Agar muncul di Google: daftarkan domain di Google Search Console (properti **Domain**), verifikasi lewat
record TXT di DNS, lalu kirim `sitemap.xml` dan minta pengindeksan halaman utama.

## Fitur

- Hero gelap dengan judul yang kata-katanya berganti dan cuplikan karya yang berputar dalam bingkai 3D.
- Animasi halus: teks muncul per kata, panel karya terbuka seperti tirai, parallax ringan,
  scroll halus (khusus mouse/trackpad), dan screenshot karya bergulir saat kursor diarahkan.
- Ramah semua perangkat: diuji di 360, 390, 820, 1280, 1440, dan 1920 px, juga di mesin Safari (WebKit).
- Menghormati pengaturan "kurangi gerakan": animasi dan cuplikan otomatis dimatikan.
- Tetap tampil lengkap walau JavaScript gagal dimuat.
- Formulir kontak menyusun pesan otomatis lalu membuka WhatsApp; tidak ada data yang disimpan.
- SEO: judul & deskripsi lokal (Pamekasan, Madura), canonical, data terstruktur, sitemap, dan gambar pratinjau link.
