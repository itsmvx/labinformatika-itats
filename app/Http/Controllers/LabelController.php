<?php

namespace App\Http\Controllers;

use App\Models\Label;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class LabelController extends Controller
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
            'nama' => 'required|string|unique:label,nama',
        ]);

        try {
            Label::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama']
            ]);
            return Response::json([
                'message' => 'Label Kuis berhasil ditambahkan!'
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
            'id' => 'required|exists:label,id',
            'nama' => 'required|string',
        ]);

        try {
            $labelKuis = Label::findOrFail($validated['id']);
            $labelKuis->update([
                'nama' => $validated['nama']
            ]);
            return Response::json([
                'message' => 'Label Kuis berhasil diperbarui!'
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
            'id' => 'required|exists:label,id',
        ]);

        try {
            $labelKuis = Label::findOrFail($validated['id']);
            $labelKuis->delete();
            return Response::json([
                'message' => 'Label Kuis berhasil dihapus!'
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
