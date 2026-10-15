# SIMONKIN Internal

Aplikasi web untuk memantau kinerja pegawai berdasarkan jadwal rapat & disposisi.

## Hak akses

| Fitur                                               |       Admin        |             User              |
| --------------------------------------------------- | :----------------: | :---------------------------: |
| Dashboard                                           |   ✅ semua data    |     ✅ data tugas sendiri     |
| Jadwal rapat (tambah / edit / hapus / ekspor Excel) |         ✅         |              ❌               |
| Tugas Saya – lapor status kinerja + file + catatan  | ✅ (bisa mewakili) |    ✅ hanya tugas miliknya    |
| Kalender                                            |      ✅ semua      | ✅ tugas sendiri + event umum |
| Event & reminder                                    |     ✅ kelola      |         👁️ lihat saja         |
| Data pegawai, Akses pengguna, Rekap, Pengaturan     |         ✅         |              ❌               |

## Aturan status kinerja

- **EFEKTIF** → wajib unggah file bukti (pdf, png, jpg, jpeg, doc(x), xls(x), ppt(x); maks 10 MB).
- **TIDAK EFEKTIF** → kolom file otomatis kosong (file lama dihapus).
- **Catatan** diisi manual oleh pegawai.

## Instalasi (Windows / Linux)

```bash
pip install -r requirements.txt
python app.py                 # mode pengembangan: http://localhost:5000
```

Untuk dipakai di jaringan kantor (lebih stabil):

```bash
waitress-serve --host=0.0.0.0 --port=5000 app:app
```

Pegawai lain cukup membuka `http://<IP-komputer-server>:5000` dari browser.

**Login awal:** `admin` / `admin123` → segera ganti password (ikon kunci di kanan atas).
Akun contoh: `budi` / `user123`, `siti` / `user123`.

## Variabel lingkungan (opsional)

| Variabel        | Default        | Keterangan                                                 |
| --------------- | -------------- | ---------------------------------------------------------- |
| `SEED_DEMO`     | `1`            | `0` = jangan buat data contoh saat database pertama dibuat |
| `DATA_DIR`      | `./data`       | lokasi database & file unggahan                            |
| `MAX_UPLOAD_MB` | `10`           | batas ukuran file bukti                                    |
| `APP_TZ`        | `Asia/Jakarta` | zona waktu                                                 |
| `PORT`          | `5000`         | port server                                                |

Untuk memulai dengan data kosong: hapus folder `data/`, lalu jalankan `SEED_DEMO=0 python app.py`.

## Backup

Menu **Pengaturan → Unduh Backup Database**. Salin juga folder `data/uploads` (berisi file bukti).
