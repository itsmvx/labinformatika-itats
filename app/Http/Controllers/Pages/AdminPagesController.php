<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Aslab;
use App\Models\Dosen;
use App\Models\JenisPraktikum;
use App\Models\Laboratorium;
use App\Models\PeriodePraktikum;
use App\Models\Praktikan;
use App\Models\Praktikum;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
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

}
