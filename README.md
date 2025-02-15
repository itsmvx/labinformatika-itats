# dwdd

# Dokumentasi API `apiSoal`

API ini menyediakan endpoint untuk mengambil data soal berdasarkan berbagai kriteria seperti label tertentu, beberapa label, atau tanpa kriteria tertentu dengan opsi pembatasan jumlah data yang diambil.

## Endpoint

**`POST /api/soal`**

### Parameter Permintaan

| Parameter | Tipe Data          | Deskripsi                                                            |
| --------- | ------------------ | -------------------------------------------------------------------- |
| `label`   | string (opsional)  | ID label tunggal untuk mendapatkan soal berdasarkan label tersebut.  |
| `labels`  | array (opsional)   | Array ID label untuk mendapatkan soal berdasarkan beberapa label.    |
| `limit`   | integer (opsional) | Jumlah data maksimal yang dikembalikan (default: 50, maksimal: 250). |

### Respons

#### Format Respons JSON

```json
{
    "data": [
        {
            "id": "uuid",
            "pertanyaan": "Teks pertanyaan",
            "pilihan_jawaban": "JSON string pilihan jawaban",
            "kunci_jawaban": "Kunci jawaban",
            "label": ["Nama Label 1", "Nama Label 2"]
        }
    ],
    "message": "Pesan informasi atau error"
}
```

### Detail Logika API

1. **Tanpa Parameter**:

    - Jika permintaan tidak menyertakan `label` atau `labels`, API akan mengembalikan soal terbaru beserta labelnya dengan limit default 50.

2. **Dengan Parameter `label`**:

    - Jika permintaan menyertakan parameter `label`, API akan mengembalikan data soal yang memiliki label sesuai ID tersebut.
    - Jika tidak ditemukan soal yang sesuai, akan mengembalikan `data: null` dan pesan informasi.

3. **Dengan Parameter `labels`**:

    - Jika permintaan menyertakan parameter `labels` (array ID), API akan mengembalikan data soal yang memiliki label sesuai array ID tersebut.
    - Jika tidak ditemukan soal yang sesuai, akan mengembalikan `data: []` (array kosong) dan pesan informasi.

4. **Dengan Parameter `limit`**:
    - Jika parameter `limit` diberikan, API akan membatasi jumlah soal yang dikembalikan sesuai nilai parameter tersebut.
    - Jika `limit` melebihi 250, API akan mengatur nilai limit menjadi 250 dan memberikan pesan peringatan.

### Contoh Permintaan

#### Permintaan Tanpa Parameter

```bash
POST /api/soal
```

#### Permintaan Dengan Parameter `label`

```bash
POST /api/soal
Content-Type: application/json

{
    "label": "uuid_label"
}
```

#### Permintaan Dengan Parameter `labels`

```bash
POST /api/soal
Content-Type: application/json

{
    "labels": ["uuid_label1", "uuid_label2"]
}
```

#### Permintaan Dengan Parameter `limit`

```bash
POST /api/soal
Content-Type: application/json

{
    "limit": 100
}
```

### Contoh Respons

#### Respons Berhasil (Tanpa Parameter)

```json
{
    "data": [
        {
            "id": "uuid",
            "pertanyaan": "Teks pertanyaan",
            "pilihan_jawaban": "JSON string pilihan jawaban",
            "kunci_jawaban": "A",
            "label": ["Label 1", "Label 2"]
        }
    ],
    "message": "Data berhasil diambil."
}
```

#### Respons Berhasil (Dengan `label` atau `labels` Tanpa Data)

```json
{
    "data": null,
    "message": "Tidak ada soal yang ditemukan untuk label yang diberikan."
}
```

#### Respons Gagal (Kesalahan Validasi)

```json
{
    "data": null,
    "message": "Parameter 'labels' harus berupa array."
}
```

#### Respons Gagal (Kesalahan Server)

```json
{
    "data": null,
    "message": "Server gagal memproses permintaan."
}
```

### Catatan

-   API ini hanya mengembalikan soal yang memiliki relasi dengan label.
-   Gunakan parameter dengan benar untuk menghindari kesalahan validasi.
-   Pastikan nilai `limit` tidak melebihi batas maksimal (250).

# API Documentation

## Check NPM (GET)

### Endpoint

**GET** `/api/check-npm`

### Request Parameters

| Parameter | Type   | Required | Description        |
| --------- | ------ | -------- | ------------------ |
| `npm`     | string | Yes      | NPM to be checked. |

### Response

#### Success Response (200)

```json
{
    "message": "NPM bisa digunakan!"
}
```

#### Conflict Response (409)

```json
{
    "message": "NPM sudah terdaftar!"
}
```

#### Error Response (500)

```json
{
    "message": "Server gagal memproses permintaan"
}
```

---

## Check NPM (POST)

### Endpoint

**POST** `/api/check-npm`

### Request Body

| Parameter | Type   | Required | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| `npm`     | array  | Yes      | Array of NPMs to be checked. |
| `npm.*`   | string | Yes      | Each item in the NPM array.  |

#### Example Request

```json
{
    "npm": ["123456789", "987654321"]
}
```

### Response

#### Success Response (200)

```json
{
    "message": "Semua NPM dapat digunakan",
    "errors": []
}
```

#### Conflict Response (409)

```json
{
    "message": "Ada sebagian data dengan NPM yang sudah terdaftar, cek errors untuk informasi lengkapnya",
    "errors": ["123456789"]
}
```

#### Error Response (500)

```json
{
    "message": "Server gagal memproses permintaan"
}
```

---

### Catatan

-   Pastikan parameter yang dikirimkan sesuai dengan format yang diminta untuk menghindari kesalahan validasi.
-   Gunakan endpoint ini hanya untuk memeriksa ketersediaan NPM, tidak untuk tujuan lain.
-   Jika terjadi kesalahan server, coba ulangi beberapa saat lagi atau hubungi tim teknis.

---

## Get Praktikans

### Endpoint

**POST** `/api/get-praktikans`

### Request Body

| Parameter   | Type   | Required | Description                                                             |
| ----------- | ------ | -------- | ----------------------------------------------------------------------- |
| `search`    | string | No       | Search query to filter praktikans by `nama` or `npm` (optional).        |
| `npm`       | array  | Yes      | Array of NPMs to filter praktikans.                                     |
| `npm.*`     | string | Yes      | Each item in the NPM array.                                             |
| `columns`   | array  | No       | Array of columns to select (`id`, `nama`, `npm`, `username`, `avatar`). |
| `columns.*` | string | No       | Valid column name (`id`, `nama`, `npm`, `username`, `avatar`).          |

#### Example Request

```json
{
    "search": "John",
    "npm": ["123456789", "987654321"],
    "columns": ["id", "nama", "npm"]
}
```

### Response

#### Success Response (200)

If data is found:

```json
{
    "message": "Berhasil mengambil data!",
    "data": [
        {
            "id": 1,
            "nama": "John Doe",
            "npm": "123456789"
        }
    ]
}
```

If no data matches the query:

```json
{
    "message": "Server berhasil memproses permintaan, namun tidak ada data yang sesuai dengan pencarian diminta",
    "data": []
}
```

#### Error Response (500)

```json
{
    "message": "Server gagal memproses permintaan"
}
```

---

<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

-   [Simple, fast routing engine](https://laravel.com/docs/routing).
-   [Powerful dependency injection container](https://laravel.com/docs/container).
-   Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
-   Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
-   Database agnostic [schema migrations](https://laravel.com/docs/migrations).
-   [Robust background job processing](https://laravel.com/docs/queues).
-   [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

-   **[Vehikl](https://vehikl.com/)**
-   **[Tighten Co.](https://tighten.co)**
-   **[WebReinvent](https://webreinvent.com/)**
-   **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
-   **[64 Robots](https://64robots.com)**
-   **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
-   **[Cyber-Duck](https://cyber-duck.co.uk)**
-   **[DevSquad](https://devsquad.com/hire-laravel-developers)**
-   **[Jump24](https://jump24.co.uk)**
-   **[Redberry](https://redberry.international/laravel/)**
-   **[Active Logic](https://activelogic.com)**
-   **[byte5](https://byte5.de)**
-   **[OP.GG](https://op.gg)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
