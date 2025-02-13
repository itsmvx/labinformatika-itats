<?php

namespace App\Http\Controllers;

use App\Models\PeriodePraktikum;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class PeriodePraktikumController extends Controller
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
            'nama' => 'required|string|unique:periode_praktikum,nama',
            'laboratorium_id' => 'required|exists:laboratorium,id',
        ]);

        try {
            PeriodePraktikum::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama'],
                'laboratorium_id' => $validated['laboratorium_id'],
            ]);
            return Response::json([
                'message' => 'Periode Praktikum berhasil ditambahkan'
            ]);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
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
            'id' => 'required|string|exists:periode_praktikum,id',
            'nama' => 'required|string|unique:periode_praktikum,nama,' . $request->id,
            'laboratorium_id' => 'required|exists:laboratorium,id',
        ]);

        try {
            PeriodePraktikum::where('id', $validated['id'])->update([
                'nama' => $validated['nama'],
                'laboratorium_id' => $validated['laboratorium_id']
            ]);
            return Response::json([
                'message' => 'Periode Praktikum berhasil diperbarui'
            ]);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:periode_praktikum,id',
        ]);

        try {
            PeriodePraktikum::where('id', $validated['id'])->delete();
            return Response::json([
                'message' => 'Periode Praktikum berhasil dihapus'
            ]);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }
}
