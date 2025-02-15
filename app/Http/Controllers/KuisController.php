<?php

namespace App\Http\Controllers;

use App\Models\Kuis;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class KuisController extends Controller
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
            'pertemuan_id' => 'required|uuid',
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'waktu_mulai' => 'required|date',
            'waktu_selesai' => 'required|date|after:waktu_mulai',
            'labels' => 'nullable|array',
            'labels.*' => 'uuid',
        ]);

        $deskripsi = json_decode($validated['deskripsi'], true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                'message' => 'Deskripsi Kuis tidak valid.',
            ], 422);
        }

        DB::beginTransaction();
        try {
            $waktu_mulai = Carbon::parse($validated['waktu_mulai'])->timezone('Asia/Jakarta');
            $waktu_selesai = Carbon::parse($validated['waktu_selesai'])->timezone('Asia/Jakarta');

            $kuis = Kuis::create([
                'id' => Str::uuid(),
                'pertemuan_id' => $validated['pertemuan_id'],
                'nama' => $validated['nama'],
                'deskripsi' => $validated['deskripsi'],
                'waktu_mulai' => $waktu_mulai,
                'waktu_selesai' => $waktu_selesai,
            ]);

            if (!empty($validated['labels'])) {
                $soalData = collect($validated['labels'])->mapWithKeys(function ($soalId) use ($kuis) {
                    return [
                        $soalId => [
                            'id' => Str::uuid(),
                        ],
                    ];
                });

                $kuis->soal()->attach($soalData);
            }

            DB::commit();
            return response()->json([
                'message' => 'Kuis berhasil dibuat.',
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validasi gagal.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => config('app.debug') ? $e->getMessage() : 'Server gagal memproses permintaan.',
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
            'pertemuan_id' => 'required|uuid',
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'waktu_mulai' => 'required|date',
            'waktu_selesai' => 'required|date|after:waktu_mulai',
            'labels' => 'nullable|array',
            'labels.*' => 'uuid',
            'id' => 'required|exists:kuis,id',
        ]);

        $deskripsi = json_decode($validated['deskripsi'], true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                'message' => 'Deskripsi Kuis tidak valid.',
            ], 422);
        }

        DB::beginTransaction();
        try {
            $waktu_mulai = Carbon::parse($validated['waktu_mulai'])->timezone('Asia/Jakarta');
            $waktu_selesai = Carbon::parse($validated['waktu_selesai'])->timezone('Asia/Jakarta');

            $kuis = Kuis::findOrFail($validated['id']);

            $kuis->update([
                'pertemuan_id' => $validated['pertemuan_id'],
                'nama' => $validated['nama'],
                'deskripsi' => $validated['deskripsi'],
                'waktu_mulai' => $waktu_mulai,
                'waktu_selesai' => $waktu_selesai,
            ]);

            if (!empty($validated['labels'])) {
                $soalData = collect($validated['labels'])->mapWithKeys(function ($soalId) {
                    return [
                        $soalId => [
                            'id' => Str::uuid(),
                        ],
                    ];
                })->toArray();

                $kuis->soal()->sync($soalData);
            }

            DB::commit();
            return response()->json([
                'message' => 'Kuis berhasil diperbarui.',
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validasi gagal.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => config('app.debug') ? $e->getMessage() : 'Server gagal memproses permintaan.',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:kuis,id',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $kuis = Kuis::findOrFail($validated['id']);
                $kuis->delete();
            });

            return Response::json([
                'message' => 'Kuis berhasil dihapus.',
            ]);
        } catch (\Exception $e) {
            return Response::json([
                'message' => config('app.debug') ? $e->getMessage() : 'Server gagal memproses permintaan.',
            ], 500);
        }
    }
}
