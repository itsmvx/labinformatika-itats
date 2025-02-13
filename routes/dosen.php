<?php

use App\Http\Controllers\Pages\DosenPagesController;
use Illuminate\Support\Facades\Route;

Route::prefix('dosen')->name('dosen.')->middleware('guard:dosen')->group(function () {
    Route::get('/dashboard', [DosenPagesController::class, 'dashboardPage'])->name('dashboard');
});
