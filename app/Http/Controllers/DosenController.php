<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class DosenController extends Controller
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
            'nama' => 'required|string|max:255|unique:dosen,nama',
            'username' => 'required|string|max:255|unique:dosen,username',
            'password' => 'nullable|string|min:6',
        ]);

        try {
            $password = $validated['password'] ?? $validated['username'];
            Dosen::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama'],
                'username' => $validated['username'],
                'password' => Hash::make($password, ['rounds' => 12]),
            ]);

            return Response::json([
                'message' => 'Dosen berhasil ditambahkan',
            ], 201);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Dosen $dosen)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dosen $dosen)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:dosen,id',
            'nama' => ['required', 'string', 'max:255', Rule::unique('dosen', 'nama')->ignore($request->id)],
            'username' => ['required', 'string', 'max:255', Rule::unique('dosen', 'username')->ignore($request->id)],
            'password' => 'nullable|string|min:8',
            'laboratoriums' => 'nullable|array',
            'laboratoriums.*' => ['uuid', Rule::exists('laboratorium', 'id')],
        ]);

        try {
            $dosen = Dosen::findOrFail($validated['id']);
            $reqPassword = $validated['password'] ?? null;
            $dosen->update([
                'nama' => $validated['nama'],
                'username' => $validated['username'],
                'password' => $reqPassword ? Hash::make($validated['password'], ['rounds' => 12]) : $dosen->password,
            ]);

            if (isset($validated['laboratoriums'])) {
                $dosen->laboratorium()->sync($validated['laboratoriums']);
            }

            return Response::json([
                'message' => 'Data Dosen berhasil diperbarui',
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
            'id' => 'required|exists:dosen,id',
        ]);

        try {
            Dosen::where('id', $validated['id'])->delete();
            return Response::json([
                'message' => 'Dosen berhasil dihapus!',
            ]);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }
}
