<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Aslab;
use App\Models\JenisPraktikum;
use App\Models\Laboratorium;
use App\Models\PeriodePraktikum;
use App\Models\Praktikum;
use App\Models\SesiPraktikum;
use Carbon\Carbon;
use GuzzleHttp\Psr7\Response;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AslabPagesController extends Controller
{
    public function loginPage()
    {
        return Inertia::render('Aslab/AslabLoginPage');
    }
    public function dashboardPage()
    {
        return Inertia::render('Aslab/AslabDashboardPage');
    }
    public function profilePage()
    {
        $authAslab = Auth::guard('aslab')->user();
        if (!$authAslab) {
            abort(401);
        }

        return Inertia::render('Aslab/AslabProfilePage', [
            'aslab' => fn() => Aslab::select('id','nama', 'username','avatar', 'laboratorium_id')->where('id', $authAslab->id)->with('laboratorium:id,nama')->first(),
        ]);
    }
    public function praktikumIndexPage(Request $request)
    {
        $authAslab = Auth::guard('aslab')->user();
        if (!$authAslab) {
            abort(401);
        }

        $query = Praktikum::select('praktikum.id', 'praktikum.nama', 'praktikum.tahun', 'praktikum.status', 'praktikum.periode_praktikum_id')
            ->join('periode_praktikum', 'praktikum.periode_praktikum_id', '=', 'periode_praktikum.id')
            ->join('laboratorium', 'periode_praktikum.laboratorium_id', '=', 'laboratorium.id')
            ->with('periode:id,nama');

        // Filter berdasarkan laboratorium_id Aslab
        if ($authAslab->laboratorium_id) {
            $query->where('periode_praktikum.laboratorium_id', $authAslab->laboratorium_id);
        }

        // Filter pencarian
        $search = $request->query('search');
        if ($search) {
            $query->where('praktikum.nama', 'like', '%' . $search . '%');
        }

        // Urutan data
        $query->orderBy('praktikum.tahun', 'desc')
            ->orderBy('laboratorium.nama', 'asc')
            ->orderBy('praktikum.nama', 'desc');

        // Pagination
        $viewPerPage = $request->query('per_page', 10);
        $praktikums = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Aslab/AslabPraktikumIndexPage', [
            'currentDate' => now()->timezone('Asia/Jakarta')->toDateString(),
            'pagination' => fn() => $praktikums,
        ]);
    }
    public function praktikumCreatePage(Request $request)
    {
        $authAslab = Auth::guard('aslab')->user();
        if (!$authAslab) {
            abort(401);
        }

        $queryJenisPraktikum = JenisPraktikum::select('id', 'nama', 'laboratorium_id')->with('laboratorium:id,nama');
        if ($authAslab->laboratorium_id) {
            $queryJenisPraktikum->where('laboratorium_id', $authAslab->laboratorium_id);
        }

        $queryPeriodePraktikum = PeriodePraktikum::select('id', 'nama', 'laboratorium_id')->with('laboratorium:id,nama');
        if ($authAslab->laboratorium_id) {
            $queryPeriodePraktikum->where('laboratorium_id', $authAslab->laboratorium_id);
        }

        $jenisPraktikums = $queryJenisPraktikum->orderBy('created_at', 'desc')->get();
        $periodePraktikums = $queryPeriodePraktikum->orderBy('created_at', 'desc')->get();

        return Inertia::render('Aslab/AslabPraktikumCreatePage', [
            'currentDate' => Carbon::now()->timezone('Asia/Jakarta')->toDateString(),
            'laboratoriums' => fn() => Laboratorium::select('id', 'nama')->get(),
            'jenisPraktikums' => fn() => $jenisPraktikums,
            'periodePraktikums' => fn() => $periodePraktikums->sortBy(fn($periode) => $this->romanToInt($periode->nama))
        ]);
    }
    public function praktikumDetailsPage(Request $request)
    {
        $authAslab = Auth::guard('aslab')->user();
        if (!$authAslab) {
            abort(401);
        }
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $praktikum = Praktikum::with([
                'jenis:id,nama',
                'periode:id,nama',
                'pertemuan' => fn($query) => $query
                    ->select('id', 'praktikum_id', 'nama')
                    ->orderBy('nama', 'asc'),
                'pertemuan.modul' => fn($query) => $query
                    ->select('id', 'pertemuan_id', 'nama', 'topik')
                    ->orderBy('nama', 'asc'),
                'sesi' => fn($query) => $query
                    ->select('id', 'nama', 'kuota', 'hari', 'waktu_mulai', 'waktu_selesai', 'praktikum_id')
                    ->orderBy('nama', 'asc')
            ])->find($idParam);

            if (!$praktikum) {
                abort(404);
            }

            $queryJenisPraktikum = JenisPraktikum::select('id', 'nama', 'laboratorium_id')->with('laboratorium:id,nama');
            if ($authAslab->laboratorium_id) {
                $queryJenisPraktikum->where('laboratorium_id', $authAslab->laboratorium_id);
            }

            $queryPeriodePraktikum = PeriodePraktikum::select('id', 'nama', 'laboratorium_id')->with('laboratorium:id,nama');
            if ($authAslab->laboratorium_id) {
                $queryPeriodePraktikum->where('laboratorium_id', $authAslab->laboratorium_id);
            }

            $jenisPraktikums = $queryJenisPraktikum->orderBy('created_at', 'desc')->get();
            $periodePraktikums = $queryPeriodePraktikum->orderBy('created_at', 'desc')->get();

            return Inertia::render('Aslab/AslabPraktikumDetailsPage', [
                'currentDate' => fn () => Carbon::now('Asia/Jakarta'),
                'praktikum' => fn() => $praktikum->only([
                    'id',
                    'nama',
                    'tahun',
                    'status',
                    'jenis',
                    'periode',
                    'pertemuan',
                    'sesi'
                ]),
                'jenisPraktikums' => fn() => $jenisPraktikums,
                'periodePraktikums' => fn() => $periodePraktikums->sortBy(fn($periode) => $this->romanToInt($periode->nama))
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function praktikumPraktikanIndexPage(Request $request)
    {
        $authAslab = Auth::guard('aslab')->user();
        if (!$authAslab) {
            abort(401);
        }
        $idParam = $request->query('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $praktikum = Praktikum::select('id', 'nama', 'tahun', 'jenis_praktikum_id')
                ->where('id', $idParam)
                ->with([
                    'jenis:id,laboratorium_id',
                    'praktikan' => fn($query) => $query
                        ->select('praktikan.id', 'praktikan.nama', 'praktikan.username')
                        ->addSelect([
                            'krs' => 'praktikum_praktikan.krs',
                            'pembayaran' => 'praktikum_praktikan.pembayaran',
                            'modul' => 'praktikum_praktikan.modul',
                            'terverifikasi' => 'praktikum_praktikan.terverifikasi',
                            'aslab_id' => 'praktikum_praktikan.aslab_id',
                            'sesi_praktikum_id' => 'praktikum_praktikan.sesi_praktikum_id',
                        ])
                        ->with([
                            'sesi:id,nama',
                            'aslab:id,nama',
                        ]),
                ])
                ->first();

            if (!$praktikum) {
                abort(404);
            }


            $laboratoriumId = $praktikum->jenis->laboratorium_id;

            return Inertia::render('Aslab/AslabPraktikumPraktikanIndexPage', [
                'currentDate' => Carbon::now('Asia/Jakarta'),
                'praktikum' => fn() => [
                    'id' => $praktikum->id,
                    'nama' => $praktikum->nama,
                    'tahun' => $praktikum->tahun,
                    'praktikan' => $praktikum->praktikan->map(fn($p) => [
                        'id' => $p->id,
                        'nama' => $p->nama,
                        'username' => $p->username,
                        'krs' => $p->krs,
                        'pembayaran' => $p->pembayaran,
                        'modul' => $p->modul,
                        'terverifikasi' => (bool) $p->terverifikasi,
                        'aslab' => $p->aslab
                            ? ['id' => $p->aslab->id, 'nama' => $p->aslab->nama]
                            : null,
                        'sesi' => $p->sesi
                            ? ['id' => $p->sesi->id, 'nama' => $p->sesi->nama]
                            : null,
                    ]),
                ],
                'sesiPraktikums' => fn() => SesiPraktikum::select([
                    'sesi_praktikum.id',
                    'sesi_praktikum.nama',
                    'sesi_praktikum.hari',
                    'sesi_praktikum.waktu_mulai',
                    'sesi_praktikum.waktu_selesai',
                    'sesi_praktikum.kuota',
                    DB::raw("CASE WHEN sesi_praktikum.kuota IS NULL THEN NULL ELSE (sesi_praktikum.kuota - COUNT(CASE WHEN praktikum_praktikan.terverifikasi = 1 THEN 1 END)) END AS sisa_kuota"),
                ])
                    ->leftJoin('praktikum_praktikan', 'sesi_praktikum.id', '=', 'praktikum_praktikan.sesi_praktikum_id')
                    ->where('sesi_praktikum.praktikum_id', $idParam)
                    ->groupBy(
                        'sesi_praktikum.id',
                        'sesi_praktikum.nama',
                        'sesi_praktikum.hari',
                        'sesi_praktikum.waktu_mulai',
                        'sesi_praktikum.waktu_selesai',
                        'sesi_praktikum.kuota'
                    )
                    ->orderBy('sesi_praktikum.nama', 'asc')
                    ->get()
                    ->map(fn($sesi) => [
                        'id' => $sesi->id,
                        'nama' => $sesi->nama,
                        'kuota' => $sesi->kuota,
                        'sisa_kuota' => $sesi->sisa_kuota !== null ? (int) $sesi->sisa_kuota : null,
                        'hari' => $sesi->hari,
                        'waktu_mulai' => $sesi->waktu_mulai,
                        'waktu_selesai' => $sesi->waktu_selesai,
                    ]),
                'aslabs' => fn() => Aslab::select([
                    'aslab.id',
                    'aslab.nama',
                    'aslab.username',
                    'aslab.avatar',
                    DB::raw('COUNT(praktikum_praktikan.praktikan_id) AS kuota')
                ])
                    ->leftJoin('praktikum_praktikan', function ($join) use ($idParam) {
                        $join->on('aslab.id', '=', 'praktikum_praktikan.aslab_id')
                            ->where('praktikum_praktikan.praktikum_id', '=', $idParam);
                    })
                    ->when($laboratoriumId, fn($query) => $query->where('aslab.laboratorium_id', $laboratoriumId)) // Filter dengan laboratorium_id jika ada
                    ->where('aslab.aktif', true)
                    ->groupBy('aslab.id', 'aslab.nama', 'aslab.username')
                    ->orderBy('aslab.username', 'asc')
                    ->get()
                    ->map(fn($aslab) => [
                        'id' => $aslab->id,
                        'nama' => $aslab->nama,
                        'avatar' => $aslab->avatar,
                        'username' => $aslab->username,
                        'kuota' => (int) $aslab->kuota,
                    ]),
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }


}
