<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Aslab;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
}
