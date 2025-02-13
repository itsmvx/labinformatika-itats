<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\BanList;
use App\Models\Praktikan;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
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
}
