<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $authUser = match (true) {
            Auth::guard('admin')->check() => Auth::guard('admin')->user(),
            Auth::guard('aslab')->check() => Auth::guard('aslab')->user(),
            Auth::guard('dosen')->check() => Auth::guard('dosen')->user(),
            Auth::guard('praktikan')->check() => Auth::guard('praktikan')->user(),
            default => null,
        };
        $role = match (true) {
            Auth::guard('admin')->check() => 'admin',
            Auth::guard('aslab')->check() => 'aslab',
            Auth::guard('dosen')->check() => 'dosen',
            Auth::guard('praktikan')->check() => 'praktikan',
            default => null,
        };
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $authUser
                    ? [
                        'id' => $authUser->id,
                        'nama' => $authUser->nama,
                        'username' => $authUser->username,
                        'avatar' =>  $authUser->avatar ?? null,
                        'laboratorium_id' => $authUser->laboratorium_id ?? null,
                    ] : null,
                'role' => $role
            ],
        ];
    }
}
