# API Endpoint: /verify-npm

## URL
```
POST /verify-npm
```

## Request
### Header
| Key           | Value           |
|--------------|----------------|
| Content-Type | application/json |

### Body
Payload yang dikirim harus berupa JSON dengan key `npm`, yang berupa string tunggal

#### Contoh Request Body
```json
{
    "npm": "06.2024.1.01234"
}

```

## Response
Response akan mengembalikan status keberadaan NPM serta data mahasiswa jika ditemukan.

### Struktur Response

### Contoh Response
#### Jika request berhasil dan data ditemukan
```json
{
    "exists": true,
    "data": {
        "nama": "Asep Saipul Hamdan Jamaludin",
        "npm": "06.2024.1.01234"
    }
}
```
#### Jika request berhasil dan data tidak ditemukan
```json
{
    "exists": false,
    "data": null
}
```
## Status Code
| Kode | Deskripsi |
|------|-----------|
| 200  | Request berhasil diproses |
| 400  | Request tidak valid |
| 500  | Kesalahan server |
