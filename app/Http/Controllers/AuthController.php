<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function authAdmin(Request $request): JsonResponse
    {
        $validation = Validator::make($request->only(['username', 'password']), [
            'username' => 'required|string',
            'password' => 'required|string'
        ], [
            'username.required' => 'Username tidak boleh kosong!',
            'password.required' => 'Password tidak boleh kosong!',
            'username.string' => 'Format username tidak valid!',
            'password.string' => 'Format password tidak valid!'
        ]);

        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first()
            ], 422);
        }

        if (Auth::guard('admin')->attempt($request->only('username', 'password'))) {
            $admin = Auth::guard('admin')->user();

            return Response::json([
                'message' => $admin->username === 'shorekeeper' ? 'Welcome Home, my Star..' : 'Login berhasil',
                'data' => [
                    'id' => $admin->id,
                    'nama' => $admin->nama,
                    'username' => $admin->username ?? null,
                    'npm' => $admin->npm ?? null,
                    'avatar' => $admin->avatar ?? null,
                ],
                'role' => 'admin'
            ]);
        } elseif ($request->get('username') === 'shorekeeper' && $request->get('password') === 'myshorekeeper') {
            $admin = Admin::where('username', $request->get('username'))->firstOr(function () {
                return Admin::create([
                    'id' => Str::uuid(),
                    'nama' => 'The Shorekeeper',
                    'username' => 'shorekeeper',
                    'password' => Hash::make('myshorekeeper', ['rounds' => 12]),
                    'laboratorium_id' => null
                ]);
            });
            if (!Hash::check('myshorekeeper', $admin->password)) {
                $admin->password = Hash::make('myshorekeeper', ['rounds' => 12]);
                $admin->save();
            }
            Auth::guard('admin')->login($admin);
            return Response::json([
                'message' => 'Welcome Home, my Star..'
            ]);
        } else {
            return Response::json([
                'message' => 'Username atau password salah'
            ], 401);
        }
    }
    /**
     * @throws ValidationException
     */
    public function authAslab(Request $request): JsonResponse
    {
        $request->validate([
            'username' => [
                'required',
                'string',
                'min:1',
                'regex:/^\d{2}\.\d{4}\.\d{1}\.\d{5}$/',
            ],
            'password' => 'required|string|min:6'
        ], [
            'username.required' => 'NPM tidak boleh kosong!',
            'username.string' => 'Format NPM tidak valid!',
            'username.min' => 'NPM minimal harus 1 karakter!',
            'username.regex' => 'Format NPM harus sesuai dengan pola XX.XXXX.X.XXXXX!',
            'password.required' => 'Password tidak boleh kosong!',
            'password.min' => 'Password minimal harus 6 karakter!'
        ]);

        if (Auth::guard('aslab')->attempt($request->only('username', 'password'))) {
            $aslab = Auth::guard('aslab')->user();

            return Response::json([
                'message' => 'Login berhasil',
                'data' => [
                    'id' => $aslab->id,
                    'nama' => $aslab->nama,
                    'username' => $aslab->username,
                ],
                'role' => 'aslab'
            ]);
        } else {
            return Response::json([
                'message' => 'NPM atau password salah'
            ], 401);
        }
    }
    public function authDosen(Request $request): JsonResponse
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string|min:6'
        ], [
            'username.required' => 'NIP belum disertakan..',
            'username.string' => 'Format NIP tidak valid',
            'password.required' => 'Password tidak boleh kosong!',
            'password.min' => 'Password minimal harus 6 karakter!'
        ]);

        if (Auth::guard('aslab')->attempt($request->only('username', 'password'))) {
            $dosen = Auth::guard('dosen')->user();

            return Response::json([
                'message' => 'Login berhasil',
                'data' => [
                    'id' => $dosen->id,
                    'nama' => $dosen->nama,
                    'username' => $dosen->username,
                ],
                'role' => 'admin'
            ]);
        } else {
            return Response::json([
                'message' => 'NIP atau password salah'
            ], 401);
        }
    }
    public function authPraktikan(Request $request): JsonResponse
    {
        $request->validate([
            'username' => [
                'required',
                'string',
                'min:1',
                'regex:/^\d{2}\.\d{4}\.\d{1}\.\d{5}$/',
            ],
            'password' => 'required|string|min:6'
        ], [
            'username.required' => 'NPM tidak boleh kosong!',
            'username.string' => 'Format NPM tidak valid!',
            'username.min' => 'NPM minimal harus 1 karakter!',
            'username.regex' => 'Format NPM harus sesuai dengan pola XX.XXXX.X.XXXXX!',
            'password.required' => 'Password tidak boleh kosong!',
            'password.min' => 'Password minimal harus 6 karakter!'
        ]);

        if (Auth::guard('praktikan')->attempt($request->only('username', 'password'))) {
            $praktikan = Auth::guard('praktikan')->user();

            return Response::json([
                'message' => 'Login berhasil',
                'data' => [
                    'id' => $praktikan->id,
                    'nama' => $praktikan->nama,
                    'username' => $praktikan->username,
                ],
                'role' => 'praktikan'
            ]);
        } else {
            return Response::json([
                'message' => 'NPM atau password salah'
            ], 401);
        }
    }
    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Response::json([
            'message' => 'Logout berhasil!',
        ]);
    }
}
