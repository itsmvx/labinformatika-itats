<?php

namespace App\Http\Controllers;

use App\Models\SesiPraktikum;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SesiPraktikumController extends Controller
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
            'nama' => [
                'required',
                'string',
                Rule::unique('sesi_praktikum', 'nama')
                    ->where('praktikum_id', $request->praktikum_id ?? ''),
            ],
            'praktikum_id' => 'required|exists:praktikum,id',
            'kuota' => 'nullable|integer|min:1',
            'hari' => 'required|string',
            'waktu_mulai' => 'required|date',
            'waktu_selesai' => 'required|date|after:waktu_mulai',
        ],[
            'nama.unique' => 'Nama Sesi Praktikum sudah ada.',
        ]);

        try {
            $waktu_mulai = Carbon::parse($validated['waktu_mulai'])->timezone('Asia/Jakarta');
            $waktu_selesai = Carbon::parse($validated['waktu_selesai'])->timezone('Asia/Jakarta');

            SesiPraktikum::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama'],
                'praktikum_id' => $validated['praktikum_id'],
                'kuota' => $validated['kuota'],
                'hari' => $validated['hari'],
                'waktu_mulai' => $waktu_mulai,
                'waktu_selesai' => $waktu_selesai,
            ]);

            return Response::json([
                'message' => 'Sesi Praktikum berhasil ditambahkan!'
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
            'id' => 'required|exists:sesi_praktikum,id',
            'nama' => [
                'required',
                'string',
                Rule::unique('sesi_praktikum', 'nama')
                    ->where('praktikum_id', $request->praktikum_id ?? '')
                    ->ignore($request->id),
            ],
            'praktikum_id' => 'required|exists:praktikum,id',
            'kuota' => 'nullable|integer|min:1',
            'hari' => 'required|string',
            'waktu_mulai' => 'required|date',
            'waktu_selesai' => 'required|date|after:waktu_mulai',
        ], [
            'nama.unique' => 'Nama Sesi Praktikum sudah ada.',
        ]);

        try {
            $waktu_mulai = Carbon::parse($validated['waktu_mulai'])->timezone('Asia/Jakarta');
            $waktu_selesai = Carbon::parse($validated['waktu_selesai'])->timezone('Asia/Jakarta');

            $sesiPraktikum = SesiPraktikum::findOrFail($validated['id']);
            $sesiPraktikum->update([
                'nama' => $validated['nama'],
                'praktikum_id' => $validated['praktikum_id'],
                'kuota' => $validated['kuota'],
                'hari' => $validated['hari'],
                'waktu_mulai' => $waktu_mulai,
                'waktu_selesai' => $waktu_selesai,
            ]);

            return Response::json([
                'message' => 'Sesi Praktikum berhasil diperbarui!'
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
            'id' => 'required|string|exists:sesi_praktikum,id',
        ]);

        try {
            $sesiPraktikum = SesiPraktikum::findOrFail($validated['id']);
            $sesiPraktikum->delete();
            return Response::json([
                'message' => 'Sesi Praktikum berhasil dihapus!'
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
