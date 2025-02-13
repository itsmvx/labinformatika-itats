<?php
namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Response;

class AdminController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|unique:admin,nama',
            'username' => 'required|string|unique:admin,username',
            'password' => 'nullable|string|min:6',
            'laboratorium_id' => 'nullable|exists:laboratorium,id'
        ]);

        try {
            $password = $validated['password'] ?? $validated['username'];
            Admin::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama'],
                'username' => $validated['username'],
                'password' => Hash::make($password, ['rounds' => 12]),
                'laboratorium_id' => $validated['laboratorium_id']
            ]);

            return Response::json([
                'message' => 'Admin berhasil ditambahkan',
            ], 201);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:admin,id',
            'nama' => ['required', 'string', Rule::unique('admin', 'nama')->ignore($request->id)],
            'username' => ['required', 'string', Rule::unique('admin', 'username')->ignore($request->id)],
            'laboratorium_id' => 'nullable|exists:laboratorium,id'
        ]);

        try {
            Admin::where('id', $validated['id'])->update([
                'nama' => $validated['nama'],
                'username' => $validated['username'],
                'laboratorium_id' => $validated['laboratorium_id']
            ]);

            return Response::json([
                'message' => 'Admin berhasil diperbarui',
            ]);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:admin,id',
        ]);
        try {
            Admin::where('id', $validated['id'])->delete();

            return Response::json([
                'message' => 'Admin berhasil dihapus'
            ]);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }
}
