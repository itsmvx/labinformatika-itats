<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Aslab;
use App\Models\Dosen;
use App\Models\JenisPraktikum;
use App\Models\Kuis;
use App\Models\Label;
use App\Models\Laboratorium;
use App\Models\PeriodePraktikum;
use App\Models\Praktikan;
use App\Models\Praktikum;
use App\Models\SesiPraktikum;
use App\Models\Soal;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminPagesController extends Controller
{
    public function loginPage()
    {
        return Inertia::render('Admin/AdminLoginPage');
    }
    public function dashboardPage()
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }
//        $kuis = Kuis::with(['pertemuan.praktikum:id,nama'])
//            ->where('waktu_mulai', '>', Carbon::now('Asia/Jakarta'))
//            ->orderBy('waktu_mulai', 'asc')
//            ->get(['id', 'nama', 'waktu_mulai', 'waktu_selesai', 'pertemuan_id']);

        $queryAslab = Aslab::select('aslab.id', 'aslab.nama', 'aslab.username', 'aslab.jabatan', 'aslab.laboratorium_id')
            ->where('aslab.aktif', true);

        if ($authAdmin->laboratorium_id) {
            $queryAslab->where('aslab.laboratorium_id', $authAdmin->laboratorium_id);
        } else {
            $queryAslab->join('laboratorium', 'laboratorium.id', '=', 'aslab.laboratorium_id')
                ->selectRaw('laboratorium.nama as laboratorium_nama')
                ->orderBy('laboratorium_nama', 'asc');
            $queryAslab->with('laboratorium:id,nama');
        }

        $queryAslab->orderBy('aslab.username', 'asc');

        return Inertia::render('Admin/AdminDashboardPage', [
            'aslabs' => fn() => $queryAslab->get(),
//            'kuis' => fn() => $kuis->map(function ($item) {
//                return [
//                    'id' => $item->id,
//                    'nama' => $item->nama,
//                    'waktu_mulai' => $item->waktu_mulai,
//                    'waktu_selesai' => $item->waktu_selesai,
//                    'praktikum' => [
//                        'id' => $item->pertemuan->praktikum->id,
//                        'nama' => $item->pertemuan->praktikum->nama,
//                    ],
//                ];
//            }),
            'kuis' => []
        ]);
    }
    public function laboratoriumIndexPage(Request $request)
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        $viewPerPage = $this->getViewPerPage($request);
        $query = Laboratorium::select('id', 'nama')
            ->withCount([
                'aslab as aslab_count' => function ($query) {
                    $query->where('aktif', true);
                },
                'dosen'
            ])
            ->orderBy('nama', 'asc');

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $laboratoriums = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminLaboratoriumIndexPage', [
            'pagination' => fn() => $laboratoriums
        ]);
    }
    public function adminIndexPage(Request $request)
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        $viewPerPage = $this->getViewPerPage($request);

        $query = Admin::select('id', 'nama', 'username', 'laboratorium_id')
            ->with([
                'laboratorium' => function ($query) {
                    $query->select('laboratorium.id', 'laboratorium.nama')
                        ->orderBy('laboratorium.nama', 'asc');
                }
            ])
            ->orderBy('nama', 'asc');


        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $admins = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminAdminIndexPage', [
            'pagination' => fn() => $admins,
            'laboratoriums' => fn() => Laboratorium::select('id','nama')->orderBy('nama', 'asc')->get()
        ]);

    }
    public function aslabIndexPage(Request $request)
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        $query = Aslab::select('aslab.id', 'aslab.nama', 'aslab.username', 'aslab.jabatan', 'aslab.no_hp', 'aslab.avatar', 'aslab.aktif', 'aslab.laboratorium_id');

        if ($authAdmin->laboratorium_id) {
            $query->where('aslab.laboratorium_id', $authAdmin->laboratorium_id);
        } else {
            $query->join('laboratorium', 'laboratorium.id', '=', 'aslab.laboratorium_id')
                ->selectRaw('laboratorium.nama as laboratorium_nama')
                ->orderBy('laboratorium_nama', 'asc');
        }
        $query->with('laboratorium:id,nama');

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $query->orderBy('aslab.aktif', 'asc');
        $query->orderBy('aslab.username', 'desc');

        $viewPerPage = $this->getViewPerPage($request);
        $aslabs = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminAslabIndexPage', [
            'pagination' => fn() => $aslabs,
            'laboratoriums' => fn() => Laboratorium::select('id', 'nama')->orderBy('nama', 'asc')->get()
        ]);
    }
    public function dosenIndexPage(Request $request)
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        $viewPerPage = $this->getViewPerPage($request);

        $query = Dosen::select('id', 'nama', 'username')
            ->with([
                'laboratorium' => function ($query) {
                    $query->select('laboratorium.id', 'laboratorium.nama')
                        ->orderBy('laboratorium.nama', 'asc');
                }
            ])
            ->orderBy('nama', 'asc');


        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $dosens = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminDosenIndexPage', [
            'pagination' => fn() => $dosens,
            'laboratoriums' => fn() => Laboratorium::select('id', 'nama')->get()
        ]);
    }
    public function praktikanIndexPage(Request $request)
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        $viewPerPage = $this->getViewPerPage($request);

        $query = Praktikan::select('id', 'nama', 'username');

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $query->orderBy('created_at', 'desc');

        $praktikans = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminPraktikanIndexPage', [
            'pagination' => fn() => $praktikans,
        ]);
    }
    public function praktikanCreateUploadPage()
    {
        return Inertia::render('Admin/AdminPraktikanCreateUploadPage');
    }
    public function praktikanDetailsPage(Request $request)
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $praktikan = Praktikan::find($idParam);
            if (!$praktikan) {
                abort(404);
            }

            return Inertia::render('Admin/AdminPraktikanDetailsPage', [
                'praktikan' => fn() => $praktikan->only(['id', 'nama', 'username', 'jenis_kelamin', 'avatar']),
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }

    public function jenisPraktikumIndexPage(Request $request)
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        $query = JenisPraktikum::select('jenis_praktikum.id', 'jenis_praktikum.nama', 'jenis_praktikum.laboratorium_id');

        if ($authAdmin->laboratorium_id) {
            $query->where('jenis_praktikum.laboratorium_id', $authAdmin->laboratorium_id);
        } else {
            $query->join('laboratorium', 'laboratorium.id', '=', 'jenis_praktikum.laboratorium_id')
                ->selectRaw('laboratorium.nama as laboratorium_nama')
                ->orderBy('laboratorium_nama', 'asc');
        }
        $query->with('laboratorium:id,nama');

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $query->orderBy('jenis_praktikum.nama', 'asc');

        $viewPerPage = $this->getViewPerPage($request);
        $jenisPraktikums = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminJenisPraktikumIndexPage', [
            'pagination' => fn() => $jenisPraktikums,
            'laboratoriums' => fn() => Laboratorium::select('id', 'nama')->get()
        ]);
    }
    public function periodePraktikumIndexPage(Request $request)
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        $query = PeriodePraktikum::select('periode_praktikum.id', 'periode_praktikum.nama', 'periode_praktikum.laboratorium_id');

        if ($authAdmin->laboratorium_id) {
            $query->where('periode_praktikum.laboratorium_id', $authAdmin->laboratorium_id);
        } else {
            $query->join('laboratorium', 'laboratorium.id', '=', 'periode_praktikum.laboratorium_id')
                ->selectRaw('laboratorium.nama as laboratorium_nama')
                ->orderBy('laboratorium_nama', 'asc');
        }
        $query->with('laboratorium:id,nama');

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $query->orderBy('periode_praktikum.nama', 'asc');

        $viewPerPage = $this->getViewPerPage($request);
        $periodePraktikums = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminPeriodePraktikumIndexPage', [
            'pagination' => fn() => $periodePraktikums,
            'laboratoriums' => fn() => Laboratorium::select('id', 'nama')->get()
        ]);
    }
    public function praktikumIndexPage(Request $request)
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        $query = Praktikum::select('praktikum.id', 'praktikum.nama', 'praktikum.tahun', 'praktikum.status', 'praktikum.periode_praktikum_id')
            ->join('periode_praktikum', 'praktikum.periode_praktikum_id', '=', 'periode_praktikum.id')
            ->join('laboratorium', 'periode_praktikum.laboratorium_id', '=', 'laboratorium.id')
            ->with('periode:id,nama');

        if ($authAdmin->laboratorium_id) {
            $query->where('periode_praktikum.laboratorium_id', $authAdmin->laboratorium_id);
        }

        $search = $request->query('search');
        if ($search) {
            $query->where('praktikum.nama', 'like', '%' . $search . '%');
        }

        $query->orderBy('praktikum.tahun', 'desc')
            ->orderBy('laboratorium.nama', 'asc')
            ->orderBy('praktikum.nama', 'desc');

        $viewPerPage = $this->getViewPerPage($request);
        $praktikums = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminPraktikumIndexPage', [
            'currentDate' => Carbon::now()->timezone('Asia/Jakarta')->toDateString(),
            'pagination' => fn() => $praktikums,
        ]);
    }
    public function praktikumCreatePage()
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        $queryJenisPraktikum = JenisPraktikum::select('id', 'nama', 'laboratorium_id')->with('laboratorium:id,nama');
        if ($authAdmin->laboratorium_id) {
            $queryJenisPraktikum->where('laboratorium_id', $authAdmin->laboratorium_id);
        }

        $queryPeriodePraktikum = PeriodePraktikum::select('id', 'nama', 'laboratorium_id')->with('laboratorium:id,nama');
        if ($authAdmin->laboratorium_id) {
            $queryPeriodePraktikum->where('laboratorium_id', $authAdmin->laboratorium_id);
        }

        $jenisPraktikums = $queryJenisPraktikum->orderBy('created_at', 'desc')->get();
        $periodePraktikums = $queryPeriodePraktikum->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/AdminPraktikumCreatePage', [
            'currentDate' => Carbon::now()->timezone('Asia/Jakarta')->toDateString(),
            'laboratoriums' => fn() => Laboratorium::select('id', 'nama')->get(),
            'jenisPraktikums' => fn() => $jenisPraktikums,
            'periodePraktikums' => fn() => $periodePraktikums->sortBy(fn($periode) => $this->romanToInt($periode->nama))
        ]);
    }
    public function praktikumDetailsPage(Request $request)
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
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
            if ($authAdmin->laboratorium_id) {
                $queryJenisPraktikum->where('laboratorium_id', $authAdmin->laboratorium_id);
            }

            $queryPeriodePraktikum = PeriodePraktikum::select('id', 'nama', 'laboratorium_id')->with('laboratorium:id,nama');
            if ($authAdmin->laboratorium_id) {
                $queryPeriodePraktikum->where('laboratorium_id', $authAdmin->laboratorium_id);
            }

            $jenisPraktikums = $queryJenisPraktikum->orderBy('created_at', 'desc')->get();
            $periodePraktikums = $queryPeriodePraktikum->orderBy('created_at', 'desc')->get();

            return Inertia::render('Admin/AdminPraktikumDetailsPage', [
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
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
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

            return Inertia::render('Admin/AdminPraktikumPraktikanIndexPage', [
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

    //KUIS//
    public function labelIndexPage(Request $request)
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        $query = Label::select('id', 'nama')->orderBy('created_at', 'desc');

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $viewPerPage = $this->getViewPerPage($request);
        $labelKuis = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminLabelIndexPage', [
            'pagination' => fn() => $labelKuis,
        ]);
    }
    public function soalIndexPage(Request $request)
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        $query = Soal::select('id', 'pertanyaan', 'pilihan_jawaban', 'kunci_jawaban')
            ->with('label:id,nama')
            ->orderBy('created_at', 'desc');

        $search = $request->query('search');
        if ($search) {
            $query->where('pertanyaan', 'like', '%' . $search . '%');
        }

        $viewPerPage = $this->getViewPerPage($request);
        $soalKuis = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminSoalIndexPage', [
            'pagination' => fn() => $soalKuis,
        ]);
    }
    public function soalCreatePage()
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        return Inertia::render('Admin/AdminSoalCreatePage', [
            'labels' => fn() => Label::select('id', 'nama')->orderBy('created_at', 'desc')->get(),
        ]);
    }
    public function soalCreateUploadPage()
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        return Inertia::render('Admin/AdminSoalCreateUploadPage', [
            'labels' => fn() => Label::select('id', 'nama')->orderBy('created_at', 'desc')->get(),
        ]);
    }
    public function soalUpdatePage(Request $request)
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $soal = Soal::with(['label:id',])->findOrFail($idParam);
            $formattedSoal = [
                'id' => $soal->id,
                'pertanyaan' => $soal->pertanyaan,
                'pilihan_jawaban' => $soal->pilihan_jawaban,
                'kunci_jawaban' => $soal->kunci_jawaban,
                'label' => $soal->label->pluck('id')->toArray(),
            ];

            return Inertia::render('Admin/AdminSoalUpdatePage', [
                'soal' => fn() => $formattedSoal,
                'labels' => fn() => Label::select('id', 'nama')->orderBy('created_at', 'desc')->get(),
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function kuisIndexPage(Request $request)
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        $query = Kuis::select([
            'kuis.id as id',
            'kuis.nama as kuis_nama',
            'kuis.waktu_mulai',
            'kuis.waktu_selesai',
            'pertemuan.id as pertemuan_id',
            'pertemuan.nama as pertemuan_nama',
            'praktikum.id as praktikum_id',
            'praktikum.nama as praktikum_nama',
            DB::raw('(SELECT COUNT(*) FROM soal_kuis WHERE soal_kuis.kuis_id = kuis.id) as jumlah_soal')
        ])
            ->leftJoin('pertemuan', 'kuis.pertemuan_id', '=', 'pertemuan.id')
            ->leftJoin('praktikum', 'pertemuan.praktikum_id', '=', 'praktikum.id')
            ->orderBy('kuis.created_at', 'desc');

        $search = $request->query('search');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('kuis.nama', 'like', '%' . $search . '%')
                    ->orWhere('pertemuan.nama', 'like', '%' . $search . '%')
                    ->orWhere('praktikum.nama', 'like', '%' . $search . '%');
            });
        }

        $viewPerPage = $this->getViewPerPage($request);
        $kuis = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminKuisIndexPage', [
            'pagination' => $kuis
        ]);
    }
    public function kuisCreatePage()
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        return Inertia::render('Admin/AdminKuisCreatePage', [
            'currentDate' => Carbon::now('Asia/Jakarta')->toDateTimeString(),
            'labels' => fn() => Label::select('id', 'nama')->orderBy('created_at', 'desc')->get(),
            'praktikums' => fn() => Praktikum::select('id','nama')
                ->where('praktikum.status', true)
                ->with('pertemuan:id,nama,praktikum_id')
                ->get()
        ]);
    }
    public function kuisUpdatePage(Request $request)
    {
        $authAdmin = Auth::guard('admin')->user();
        if (!$authAdmin) {
            abort(401);
        }

        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $kuis = Kuis::with('soal:id,pertanyaan')->findOrFail($idParam);

            return Inertia::render('Admin/AdminKuisUpdatePage', [
                'kuis' => fn() => [
                    'id' => $kuis->id,
                    'nama' => $kuis->nama,
                    'deskripsi' => $kuis->deskripsi,
                    'waktu_mulai' => $kuis->waktu_mulai,
                    'waktu_selesai' => $kuis->waktu_selesai,
                    'pertemuan_id' => $kuis->pertemuan_id,
                    'soal' => $kuis->soal->map(fn ($item) => [
                        'id' => $item->id,
                        'pertanyaan' => $item->pertanyaan,
                    ])
                ],
                'labels' => fn() => Label::select('id', 'nama')->orderBy('created_at', 'desc')->get(),
                'praktikums' => fn() => Praktikum::select('id','nama')
                    ->where('praktikum.status', true)
                    ->with('pertemuan:id,nama,praktikum_id')
                    ->get()
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }

}
