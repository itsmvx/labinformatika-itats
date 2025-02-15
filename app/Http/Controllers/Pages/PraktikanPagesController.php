<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\BanList;
use App\Models\JenisPraktikum;
use App\Models\Praktikan;
use App\Models\Praktikum;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PraktikanPagesController extends Controller
{
    public function loginPage()
    {
        return Inertia::render('Praktikan/PraktikanLoginPage');
    }
    public function registerPage()
    {
        return Inertia::render('Praktikan/PraktikanRegistrationPage');
    }
    public function dashboardPage()
    {
        return Inertia::render('Praktikan/PraktikanDashboardPage');
    }
    public function profilePage()
    {
        $authPraktikan = Auth::guard('praktikan')->user();
        if (!$authPraktikan) {
            abort(401);
        }

        $isBanned = BanList::where('praktikan_id', $authPraktikan->id)->latest('created_at')->first();
        $stillBanned = $isBanned && Carbon::parse($isBanned->kadaluarsa, 'Asia/Jakarta')->greaterThan(Carbon::now('Asia/Jakarta'));
        if ($isBanned && $stillBanned) {
            return Inertia::render('BanListPage', [
                'banList' => fn() => $isBanned
            ]);
        } elseif ($isBanned) {
            BanList::where('id', $isBanned->id)->delete();
        }

        return Inertia::render('Praktikan/PraktikanProfilePage', [
            'praktikan' => fn() => Praktikan::select('id','nama','username','jenis_kelamin','avatar')->where('id', $authPraktikan->id)->first(),
        ]);
    }
    public function banListPage()
    {
        $authPraktikan = Auth::guard('praktikan')->user();
        if (!$authPraktikan) {
            abort(401);
        }

        $isBanned = BanList::where('praktikan_id', $authPraktikan->id)->latest('created_at')->first();

        if (!$isBanned) {
            abort(403);
        }

        return Inertia::render('BanListPage', [
            'banList' => fn() => $isBanned
        ]);
    }

    public function praktikumIndexPage(Request $request)
    {
        $authPraktikan = Auth::guard('praktikan')->user();
        if (!$authPraktikan) {
            abort(401);
        }

        $search = $request->query->get('search');

        return Inertia::render('Praktikan/PraktikanPraktikumIndexPage', [
            'currentDate' => fn() => Carbon::now('Asia/Jakarta'),
            'praktikums' => fn() => Praktikum::select([
                'praktikum.id',
                'praktikum.nama',
                'praktikum_praktikan.terverifikasi',
                'sesi_praktikum.id as sesi_id',
                'sesi_praktikum.nama as sesi_nama',
                'sesi_praktikum.hari',
                'sesi_praktikum.waktu_mulai',
                'sesi_praktikum.waktu_selesai',
                'aslab.id as aslab_id',
                'aslab.nama as aslab_nama',
                'aslab.no_hp as aslab_no_hp',
            ])
                ->join('praktikum_praktikan', 'praktikum.id', '=', 'praktikum_praktikan.praktikum_id')
                ->leftJoin('sesi_praktikum', 'praktikum_praktikan.sesi_praktikum_id', '=', 'sesi_praktikum.id')
                ->leftJoin('aslab', 'praktikum_praktikan.aslab_id', '=', 'aslab.id')
                ->where('praktikum_praktikan.praktikan_id', $authPraktikan->id)
                ->when($search, function ($query, $search) {
                    $query->where('praktikum.nama', 'like', "%{$search}%");
                })
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'nama' => $item->nama,
                        'terverifikasi' => (bool) $item->terverifikasi,
                        'sesi' => $item->sesi_id ? [
                            'id' => $item->sesi_id,
                            'nama' => $item->sesi_nama,
                            'hari' => $item->hari,
                            'waktu_mulai' => $item->waktu_mulai,
                            'waktu_selesai' => $item->waktu_selesai,
                        ] : null,
                        'aslab' => $item->aslab_id ? [
                            'id' => $item->aslab_id,
                            'nama' => $item->aslab_nama,
                            'no_hp' => $item->aslab_no_hp,
                        ] : null,
                    ];
                }),
        ]);
    }
    public function praktikumCreatePage(Request $request)
    {
        $authPraktikan = Auth::guard('praktikan')->user();
        if (!$authPraktikan) {
            abort(401);
        }

        return Inertia::render('Praktikan/PraktikanPraktikumCreatePage', [
            'currentDate' => fn() => Carbon::now('Asia/Jakarta'),
            'jenisPraktikums' => JenisPraktikum::with([
                'praktikum' => function ($query) use ($authPraktikan) {
                    $query->where('status', true)
                        ->with([
                            'periode',
                            'sesi' => function ($sesiQuery) {
                                $sesiQuery->select([
                                    'id',
                                    'nama',
                                    'hari',
                                    'waktu_mulai',
                                    'waktu_selesai',
                                    'kuota',
                                    'praktikum_id',
                                    DB::raw('
                                    (kuota - (
                                        SELECT COUNT(*)
                                        FROM praktikum_praktikan
                                        WHERE praktikum_praktikan.sesi_praktikum_id = sesi_praktikum.id
                                    )) as sisa_kuota
                                ')
                                ]);
                            }
                        ])
                        ->select([
                            'id',
                            'nama',
                            'jenis_praktikum_id',
                            'periode_praktikum_id',
                            'tahun',
                            'status',
                            DB::raw("
                            (NOT EXISTS (
                                SELECT 1
                                FROM praktikum_praktikan
                                WHERE praktikum_praktikan.praktikum_id = praktikum.id
                                AND praktikum_praktikan.praktikan_id = '$authPraktikan->id'
                            )) as available
                        ")
                        ]);
                }
            ])->get(),
        ]);
    }

}
