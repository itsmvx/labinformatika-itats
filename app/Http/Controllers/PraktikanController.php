<?php

namespace App\Http\Controllers;

use App\Models\BanList;
use App\Models\Praktikan;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PraktikanController extends Controller
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
                'unique:praktikan,username',
            ],
            'password' => 'nullable|string|min:6',
        ], [
            'username.required' => 'NPM wajib diisi',
            'username.string' => 'Format NPM tidak sesuai',
            'username.min' => 'NPM Wajib diisi',
            'username.regex' => 'Format NPM tidak sesuai 06.xxxx.1.xxxxx',
            'username.unique' => 'NPM sudah terdaftar!',
        ]);


        try {
            $password = $validated['password'] ?? $validated['username'];
            Praktikan::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama'],
                'username' => $validated['username'],
                'password' => Hash::make($password, ['rounds' => 12]),
            ]);

            return Response::json([
                'message' => 'Praktikan berhasil ditambahkan!',
            ]);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }
    public function storeMass(Request $request)
    {
        $validated = $request->validate([
            'praktikans' => 'required|array',
            'praktikans.*.nama' => 'required|string',
            'praktikans.*.npm' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            $now = Carbon::now('Asia/Jakarta');
            $praktikansData = array_map(function ($praktikan) use ($now) {
                return [
                    'id' => Str::uuid(),
                    'nama' => $praktikan['nama'],
                    'username' => $praktikan['npm'],
                    'password' => Hash::make($praktikan['npm'], ['rounds' => 12]),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }, $validated['praktikans']);

            Praktikan::upsert(
                $praktikansData,
                ['username'],
                ['nama', 'password', 'updated_at']
            );

            DB::commit();

            return Response::json([
                'message' => 'Semua Praktikan berhasil diproses!',
            ], 201);
        } catch (QueryException $exception) {
            DB::rollBack();
            return $this->queryExceptionResponse($exception);
        }
    }

    public function checkNpmGET(Request $request)
    {
        $validated = $request->validate([
            'npm' => 'required|string',
        ]);

        try {
            $isNPMExists = Praktikan::where('username', $validated['npm'])->exists();

            return Response::json([
                'message' => $isNPMExists ? 'NPM sudah terdaftar!' : 'NPM bisa digunakan!',
            ], $isNPMExists ? 409 : 200);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }
    public function checkNpmPOST(Request $request)
    {
        $validated = $request->validate([
            'npm' => 'required|array',
            'npm.*' => 'required|string',
        ]);

        try {
            $npmExists = Praktikan::select('username')
                ->whereIn('username', $validated['npm'])
                ->get()
                ->pluck('username')
                ->toArray();

            return Response::json([
                'message' => empty($npmExists) ? 'Semua NPM dapat digunakan' : 'Ada sebagian data dengan NPM yang sudah terdaftar, cek errors untuk informasi lengkapnya',
                'errors' => $npmExists,
            ], empty($npmExists) ? 200 : 409);
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
            'id' => 'required|exists:praktikan,id',
            'nama' => 'required|string|min:1',
            'username' => 'required|string|min:1|regex:/^\d{2}\.\d{4}\.\d{1}\.\d{5}$/|unique:praktikan,username,' . $request->id,
            'jenis_kelamin' => 'nullable|in:Laki-Laki,Perempuan',
        ], [
            'username.required' => 'NPM wajib diisi',
            'username.string' => 'Format NPM tidak sesuai',
            'username.min' => 'NPM Wajib diisi',
            'username.regex' => 'Format NPM tidak sesuai 06.xxxx.1.xxxxx',
            'username.unique' => 'NPM sudah terdaftar!',
        ]);

        try {
            Praktikan::where('id', $validated['id'])->update([
                'nama' => $validated['nama'],
                'username' => $validated['username'],
                'jenis_kelamin' => $validated['jenis_kelamin'] ?? null,
            ]);

            return Response::json([
                'message' => 'Data Praktikan berhasil diperbarui',
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
            'id' => 'required|exists:praktikan,id',
        ]);

        try {
            Praktikan::where('id', $validated['id'])->delete();
            return Response::json([
                'message' => 'Data Praktikan berhasil dihapus!',
            ]);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }

    public function getPraktikans(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|min:1',
            'npm' => 'required|array',
            'npm.*' => 'required|string',
            'columns' => 'nullable|array',
            'columns.*' => 'string|in:id,nama,npm,avatar',
        ]);

        $columnsParam = $request->get('columns');
        $searchParam = $request->get('search');
        $npmParam = $request->get('npm');

        try {
            $query = Praktikan::select($columnsParam ?? ['id','nama','username']);

            if ($searchParam) {
                $query->where('nama', 'like', '%' . $searchParam . '%');
            }

            if ($npmParam) {
                $query->whereIn('username', $npmParam);
            }

            $praktikans = $query->get();

            return Response::json([
                'message' => empty($praktikans)
                    ? 'Server berhasil memproses permintaan, namun tidak ada data yang sesuai dengan pencarian diminta'
                    : 'Berhasil mengambil data!',
                'data' => $praktikans->map(function ($praktikan) {
                    return [
                        'id' => $praktikan->id,
                        'nama' => $praktikan->nama,
                        'npm' => $praktikan->username,
                    ];
                }),
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan',
            ]);
        }
    }

    public function uploadAvatar(Request $request)
    {
        $validated = $request->validate([
            'avatar' => 'required|file|mimes:jpg,jpeg,png|max:10240',
            'id' => 'required|exists:praktikan,id',
        ]);

        DB::beginTransaction();

        try {
            $praktikan = Praktikan::findOrFail($validated['id']);

            if ($praktikan->avatar) {
                Storage::disk('praktikan')->delete($praktikan->avatar);
            }

            $extension = $request->file('avatar')->getClientOriginalExtension();
            $randomString = Str::random(8);
            $filename = $praktikan->nama . '-' . $praktikan->username . '-' . $randomString . '.' . $extension;

            $avatarPath = $request->file('avatar')->storeAs('/', $filename, 'praktikan');
            $praktikan->update(['avatar' => $avatarPath]);

            DB::commit();

            return response()->json([
                'message' => 'Avatar berhasil diunggah!',
                'avatar_url' => $avatarPath,
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();

            if (isset($avatarPath)) {
                Storage::disk('praktikan')->delete($avatarPath);
            }

            return response()->json([
                'message' => config('app.debug') ? $exception->getMessage() : 'Gagal mengunggah avatar..',
            ], 500);
        }
    }
    public function addBanList(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:praktikan,id',
            'alasan' => 'nullable|string|min:1',
        ]);

        $authPraktikan = Auth::guard('praktikan')->user();
        if (!$authPraktikan || ($authPraktikan->id !== $validated['id'])) {
            return Response::json([
                'message' => 'Hey.. ngapain kamu?'
            ], 403);
        }

        try {
            BanList::create([
                'praktikan_id' => $validated['id'],
                'alasan' => $validated['alasan'] ?? 'Tidak diketahui',
                'kadaluarsa' => Carbon::now('Asia/Jakarta')->addWeeks(2),
            ]);
            return Response::json([
                'message' => 'Berhasil memproses ban list'
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan',
            ]);
        }
    }
}
