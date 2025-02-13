<?php

namespace App\Http\Controllers;

use App\Models\Modul;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ModulController extends Controller
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
                Rule::unique('modul', 'nama')
                    ->where('pertemuan_id', $request->pertemuan_id ?? ''),
            ],
            'topik' => 'required|string',
            'pertemuan_id' => 'required|exists:pertemuan,id',
        ], [
            'nama.unique' => 'Nama modul sudah ada untuk pertemuan yang dipilih.',
        ]);

        try {
            Modul::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama'],
                'topik' => $validated['topik'],
                'pertemuan_id' => $validated['pertemuan_id'],
            ]);

            return Response::json([
                'message' => 'Modul Pertemuan berhasil ditambahkan!'
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
    public function show(Modul $modul)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Modul $modul)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:modul,id',
            'nama' => [
                'required',
                'string',
                Rule::unique('modul', 'nama')
                    ->where('pertemuan_id', $request->pertemuan_id ?? '')
                    ->ignore($request->id),
            ],
            'topik' => 'required|string',
        ], [
            'nama.unique' => 'Nama modul sudah ada untuk pertemuan yang dipilih.',
        ]);

        try {
            $modul = Modul::findOrFail($validated['id']);
            $modul->update([
                'nama' => $validated['nama'],
                'topik' => $validated['topik'],
            ]);

            return Response::json([
                'message' => 'Modul Pertemuan berhasil diperbarui!'
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
            'id' => 'required|exists:modul,id',
        ]);

        try {
            $modul = Modul::findOrFail($validated['id']);
            $modul->delete();
            return Response::json([
                'message' => 'Modul Pertemuan berhasil dihapus!'
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
