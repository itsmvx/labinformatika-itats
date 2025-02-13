<?php

namespace App\Http\Controllers;

use App\Models\Praktikum;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PraktikumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|unique:praktikum,nama',
            'tahun' => 'required|integer|min:1977|max:2077',
            'status' => 'required|boolean',
            'jenis_praktikum_id' => 'required|exists:jenis_praktikum,id',
            'periode_praktikum_id' => 'required|exists:periode_praktikum,id',
        ], [
            'nama.required' => 'Nama Praktikum harus diisi!',
            'nama.string' => 'Format Nama Praktikum tidak valid!',
            'nama.unique' => 'Praktikum sudah terdaftar!',
            'tahun.required' => 'Tahun Praktikum harus diisi!',
            'tahun.integer' => 'Tahun Praktikum harus berupa angka!',
            'tahun.min' => 'Tahun Praktikum tidak boleh kurang dari 1977!',
            'tahun.max' => 'Tahun Praktikum tidak boleh lebih dari tahun Cyberpunk!',
            'status.required' => 'Status Praktikum harus diisi!',
            'status.boolean' => 'Format Status Praktikum tidak valid!',
            'jenis_praktikum_id.required' => 'Jenis Praktikum harus dipilih!',
            'jenis_praktikum_id.exists' => 'Jenis Praktikum tidak ditemukan!',
            'periode_praktikum_id.required' => 'Periode Praktikum harus dipilih!',
            'periode_praktikum_id.exists' => 'Periode Praktikum tidak ditemukan!',
        ]);

        try {
            Praktikum::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama'],
                'tahun' => $validated['tahun'],
                'status' => $validated['status'],
                'jenis_praktikum_id' => $validated['jenis_praktikum_id'],
                'periode_praktikum_id' => $validated['periode_praktikum_id']
            ]);
            return Response::json([
                'message' => 'Praktikum berhasil ditambahkan!'
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:praktikum,id',
            'nama' => [
                'required',
                'string',
                Rule::unique('praktikum', 'nama')->ignore($request->id),
            ],
            'tahun' => 'required|integer|min:1977|max:2077',
            'status' => 'required|boolean',
            'jenis_praktikum_id' => 'required|exists:jenis_praktikum,id',
            'periode_praktikum_id' => 'required|exists:periode_praktikum,id',
        ], [
            'tahun.min' => 'Tahun Praktikum tidak boleh sebelum dari 1977!',
            'tahun.max' => 'Tahun Praktikum tidak boleh lebih dari tahun Cyberpunk!',
        ]);

        try {
            Praktikum::where('id', $validated['id'])->update([
                'nama' => $validated['nama'],
                'tahun' => $validated['tahun'],
                'status' => $validated['status'],
                'jenis_praktikum_id' => $validated['jenis_praktikum_id'],
                'periode_praktikum_id' => $validated['periode_praktikum_id']
            ]);
            return Response::json([
                'message' => 'Praktikum berhasil diperbarui!'
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan'
            ], 500);
        }
    }

    /**
     * @throws ValidationException
     */
    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:praktikum,id',
            'status' => 'required|boolean',
        ]);

        try {
            Praktikum::where('id', $validated['id'])->update([
                'status' => $validated['status']
            ]);

            return Response::json([
                'message' => 'Status Praktikum berhasil diperbarui'
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|exists:praktikum,id',
        ]);

        try {
            Praktikum::where('id', $validated['id'])->delete();
            return Response::json([
                'message' => 'Praktikum berhasil dihapus!'
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan'
            ], 500);
        }
    }
}
