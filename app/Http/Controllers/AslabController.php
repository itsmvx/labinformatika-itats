<?php

namespace App\Http\Controllers;

use App\Models\Aslab;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AslabController extends Controller
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
            'nama' => 'required|string|min:1',
            'username' => [
                'required',
                'string',
                'min:1',
                'regex:/^\d{2}\.\d{4}\.\d{1}\.\d{5}$/',
                'unique:aslab,username',
            ],
            'password' => 'nullable|string|min:6',
            'no_hp' => 'nullable|regex:/^\d+$/',
            'jabatan' => 'required',
            'laboratorium_id' => 'required|exists:laboratorium,id',
        ], [
            'username.required' => 'Username harus diisi',
            'username.string' => 'Format NPM tidak sesuai',
            'username.min' => 'Format NPM tidak sesuai',
            'username.regex' => 'Format NPM tidak sesuai!',
            'username.unique' => 'NPM sudah terdaftar',
            'no_hp.regex' => 'Format Nomor HP tidak sesuai',
        ]);

        try {
            $password = $validated['password'] ?? $validated['username'];
            $noHp = $validated['no_hp'] ?? null;
            Aslab::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama'],
                'username' => $validated['username'],
                'password' => Hash::make($password, ['rounds' => 12]),
                'jabatan' => $validated['jabatan'],
                'no_hp' => $noHp,
                'laboratorium_id' => $validated['laboratorium_id'],
            ]);

            return Response::json([
                'message' => 'Data Aslab berhasil ditambahkan',
            ], 201);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Aslab $aslab)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Aslab $aslab)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:aslab,id',
            'nama' => 'required|string|min:1',
            'username' => [
                'required',
                'string',
                'min:1',
                'regex:/^\d{2}\.\d{4}\.\d{1}\.\d{5}$/',
                Rule::unique('aslab', 'username')->ignore($request->id),
            ],
            'password' => 'nullable|string|min:6',
            'no_hp' => 'nullable|regex:/^\d+$/',
            'jabatan' => 'required',
            'laboratorium_id' => 'nullable|exists:laboratorium,id',
        ], [
            'username.required' => 'Username harus diisi',
            'username.string' => 'Format NPM tidak sesuai',
            'username.min' => 'Format NPM tidak sesuai',
            'username.regex' => 'Format NPM tidak sesuai!',
            'username.unique' => 'NPM sudah terdaftar',
            'no_hp.regex' => 'Format Nomor HP tidak sesuai',
        ]);


        try {
            $aslab = Aslab::findOrFail($validated['id']);
            $updateLaboratorium = $validated['laboratorium_id'] ?? $aslab->laboratorium_id;
            $updateNoHp = $validated['no_hp'] ?? $aslab->no_hp;

            $aslab->update([
                'nama' => $validated['nama'],
                'username' => $validated['username'],
                'jabatan' => $validated['jabatan'],
                'no_hp' => $updateNoHp,
                'laboratorium_id' => $updateLaboratorium
            ]);

            return Response::json([
                'message' => 'Data Aslab berhasil diperbarui',
            ]);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }
    public function updateAktif(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:aslab,id',
            'aktif' => 'required|boolean',
        ]);

        try {
            Aslab::where('id', $validated['id'])->update([
                'aktif' => $validated['aktif']
            ]);

            return Response::json([
                'message' => 'Status Aktif Aslab berhasil diperbarui'
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
            'id' => 'required|exists:aslab,id',
        ]);

        try {
            Aslab::where('id', $validated['id'])->delete();

            return Response::json([
                'message' => 'Data Aslab berhasil dihapus',
            ]);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }

    public function uploadAvatar(Request $request)
    {
        $validated = $request->validate([
            'avatar' => 'required|file|mimes:jpg,jpeg,png|max:5120',
            'id' => 'required|exists:aslab,id',
        ]);

        DB::beginTransaction();

        try {
            $aslab = Aslab::findOrFail($validated['id']);

            if ($aslab->avatar) {
                Storage::disk('aslab')->delete($aslab->avatar);
            }

            $extension = $request->file('avatar')->getClientOriginalExtension();
            $randomString = Str::random(8);
            $filename = $aslab->nama . '-' . $aslab->npm . '-' . $randomString . '.' . $extension;

            $avatarPath = $request->file('avatar')->storeAs('/', $filename, 'aslab');
            $aslab->update(['avatar' => $avatarPath]);

            DB::commit();

            return response()->json([
                'message' => 'Profil berhasil diunggah!',
                'avatar_url' => $avatarPath,
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();

            if (isset($avatarPath)) {
                Storage::disk('aslab')->delete($avatarPath);
            }

            return response()->json([
                'message' => config('app.debug') ? $exception->getMessage() : 'Gagal mengunggah avatar..',
            ], 500);
        }
    }

}
