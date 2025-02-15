<?php

namespace App\Http\Controllers;

use App\Models\Praktikum;
use App\Models\PraktikumPraktikan;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class PraktikumPraktikanController extends Controller
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
        $authPraktikan = Auth::guard('praktikan')->user();
        if (!$authPraktikan) {
            return Response::json([
                'message' => 'Belum terautentikasi sebagai Praktikan'
            ], 401);
        }

        $validated = $request->validate([
            'praktikum_id' => 'required|exists:praktikum,id',
            'sesi_praktikum_id' => 'required|exists:sesi_praktikum,id',
            'krs' => 'required|file|mimes:pdf|max:4096',
            'pembayaran' => 'required|file|mimes:pdf|max:4096',
            'modul' => 'nullable|file|mimes:png,jpg,jpeg|max:5120',
        ]);

        DB::beginTransaction();
        try {
            $isExistsPraktikumPraktikan = PraktikumPraktikan::where('praktikan_id', $authPraktikan->id)
                ->where('praktikum_id', $validated['praktikum_id'])
                ->exists();
            if ($isExistsPraktikumPraktikan) {
                DB::rollBack();
                return Response::json([
                    'message' => 'Praktikan sudah terdaftar ke Praktikum yang dipilih'
                ], 409);
            }

            $praktikum = Praktikum::findOrFail($validated['praktikum_id']);
            $praktikumSlug = Str::slug($praktikum->nama, '-');

            $extensionKrs = $request->file('krs')->getClientOriginalExtension();
            $filenameKrs = $authPraktikan->username . '_' . $authPraktikan->nama . '_' . 'KRS' . '.' . $extensionKrs;

            $extensionPembayaran = $request->file('pembayaran')->getClientOriginalExtension();
            $filenamePembayaran = $authPraktikan->username . '_' . $authPraktikan->nama . '_' . 'PEMBAYARAN-PRAKTIKUM' . '.' . $extensionPembayaran;

            $modulPath = null;

            if ($request->hasFile('modul')) {
                $extensionModul = $request->file('modul')->getClientOriginalExtension();
                $filenameModul = $authPraktikan->username . '_' . $authPraktikan->nama . '_' . 'PEMBAYARAN-MODUL' . '.' .$extensionModul;
                $modulPath = $request->file('modul')->storeAs('/' . $praktikumSlug, $filenameModul, 'praktikum');
            }
            $krsPath = $request->file('krs')->storeAs('/' . $praktikumSlug, $filenameKrs, 'praktikum');
            $pembayaranPath = $request->file('pembayaran')->storeAs('/' . $praktikumSlug, $filenamePembayaran, 'praktikum');

            PraktikumPraktikan::insert([
                'praktikan_id' => $authPraktikan->id,
                'praktikum_id' => $validated['praktikum_id'],
                'sesi_praktikum_id' => $validated['sesi_praktikum_id'],
                'krs' => $krsPath,
                'pembayaran' => $pembayaranPath,
                'modul' => $modulPath
            ]);

            DB::commit();
            return Response::json([
                'message' => 'Berhasil mendaftar ke Praktikum yang dipilih!'
            ]);
        } catch (QueryException $exception) {
            DB::rollBack();
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan.',
            ], 500);
        }
    }
    public function storeMass(Request $request)
    {
        $validated = $request->validate([
            'praktikan_ids' => 'required|array',
            'praktikan_ids.*' => 'uuid',
            'praktikum_id' => 'required|uuid|exists:praktikum,id',
        ]);

        DB::beginTransaction();
        try {
            $praktikum = Praktikum::findOrFail($validated['praktikum_id']);
            $praktikum->praktikan()->sync($validated['praktikan_ids']);

            DB::commit();
            return Response::json([
                'message' => 'Praktikan berhasil didaftarkan ke Praktikum!',
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return Response::json([
                'message' => 'Validasi gagal.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return Response::json([
                'message' => config('app.debug')
                    ? $e->getMessage()
                    : 'Server gagal memproses permintaan.',
            ], 500);
        }
    }
    public function verifikasi(Request $request)
    {
        $validated = $request->validate([
            'praktikan_id' => 'required|exists:praktikan,id',
            'praktikum_id' => 'required|exists:praktikum,id',
            'sesi_praktikum_id' => 'required|exists:sesi_praktikum,id',
            'aslab_id' => 'required|exists:aslab,id',
            'terverifikasi' => 'required|boolean',
        ]);

        DB::beginTransaction();
        try {
            $updateData = [
                'sesi_praktikum_id' => $validated['sesi_praktikum_id'],
                'aslab_id' => $validated['aslab_id'],
                'terverifikasi' => $validated['terverifikasi'],
            ];

//            if ($validated['terverifikasi']) {
//                $updateData['pengembalian'] = null;
//            }

            PraktikumPraktikan::where('praktikan_id', $validated['praktikan_id'])
                ->where('praktikum_id', $validated['praktikum_id'])
                ->update($updateData);

            DB::commit();
            return Response::json([
                'message' => $validated['terverifikasi'] ? 'Praktikan berhasil diverifikasi!' : 'Berhasil membatalkan verifikasi!',
            ]);
        } catch (QueryException $exception) {
            DB::rollBack();
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan.',
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'praktikum_id' => 'required|uuid|exists:praktikum,id',
            'praktikan_id' => 'required|uuid|exists:praktikan,id',
        ]);

        DB::beginTransaction();
        try {
            $praktikum = Praktikum::findOrFail($validated['praktikum_id']);
            $isDetached = $praktikum->praktikan()->detach($validated['praktikan_id']);

            DB::commit();

            if ($isDetached) {
                return Response::json([
                    'message' => 'Praktikan berhasil dihapus dari Praktikum!',
                ], 200);
            } else {
                return Response::json([
                    'message' => 'Praktikan tidak terdaftar pada Praktikum ini.',
                ], 404);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return Response::json([
                'message' => 'Validasi gagal.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return Response::json([
                'message' => config('app.debug')
                    ? $e->getMessage()
                    : 'Server gagal memproses permintaan.',
            ], 500);
        }
    }
}
