<?php

namespace App\Http\Controllers;

use App\Models\Laboratorium;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class LaboratoriumController extends Controller
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
            'nama' => 'required|string|unique:laboratorium,nama',
        ]);

        try {
            Laboratorium::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama'],
            ]);
            return Response::json([
                'message' => 'Laboratorium berhasil ditambahkan!',
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
            'id' => 'required|exists:laboratorium,id',
            'nama' => 'required|string|unique:laboratorium,nama,' . $request->id ?? '',
        ]);

        try {
            $laboratorium = Laboratorium::find($validated['id']);
            $laboratorium->update([
                'nama' => $validated['nama'],
            ]);
            return Response::json([
                'message' => 'Laboratorium berhasil diupdate!',
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
            'id' => 'required|exists:laboratorium,id',
        ]);

        try {
            Laboratorium::where('id', $validated['id'])->delete();
            return Response::json([
                'message' => 'Laboratorium berhasil dihapus!',
            ]);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }
}
