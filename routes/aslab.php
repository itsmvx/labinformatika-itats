<?php

use App\Http\Controllers\Pages\AslabPagesController;
use Illuminate\Support\Facades\Route;

Route::prefix('aslab')->name('aslab.')->middleware('guard:aslab')->group(function () {
    Route::get('/dashboard', [AslabPagesController::class, 'dashboardPage'])->name('dashboard');
    Route::get('/profile', [AslabPagesController::class, 'profilePage'])->name('profile');

    Route::prefix('praktikum')->name('praktikum.')->group(function () {
        Route::get('/', [AslabPagesController::class, 'praktikumIndexPage'])->name('index');
        Route::get('/details', [AslabPagesController::class, 'praktikumDetailsPage'])->name('details');
    });
});
