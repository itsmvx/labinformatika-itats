<?php

namespace App\Http\Controllers;

use App\Models\Pertemuan;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PertemuanController extends Controller
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
                Rule::unique('pertemuan', 'nama')
                    ->where('praktikum_id', $request->praktikum_id ?? ''),
            ],
            'praktikum_id' => 'required|exists:praktikum,id',
        ],[
            'nama.unique' => 'Nama Pertemuan sudah ada.',
        ]);

        try {
            Pertemuan::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama'],
                'praktikum_id' => $validated['praktikum_id'],
            ]);

            return Response::json([
                'message' => 'Pertemuan Praktikum berhasil ditambahkan!'
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
            'id' => 'required|exists:pertemuan,id',
            'nama' => [
                'required',
                'string',
                Rule::unique('pertemuan', 'nama')
                    ->where('praktikum_id', $request->praktikum_id ?? '')
                    ->ignore($request->id),
            ],
        ], [
            'nama.unique' => 'Nama Pertemuan sudah ada.',
        ]);

        try {
            $pertemuan = Pertemuan::findOrFail($validated['id']);
            $pertemuan->update([
                'nama' => $validated['nama']
            ]);

            return Response::json([
                'message' => 'Pertemuan Praktikum berhasil diperbarui!'
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
            'id' => 'required|string|exists:pertemuan,id',
        ]);

        try {
            $pertemuan = Pertemuan::findOrFail($validated['id']);
            $pertemuan->delete();
            return Response::json([
                'message' => 'Pertemuan Praktikum berhasil dihapus!'
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
