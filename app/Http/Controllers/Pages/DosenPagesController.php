<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DosenPagesController extends Controller
{
    public function loginPage()
    {
        return Inertia::render('Dosen/DosenLoginPage');
    }
}
