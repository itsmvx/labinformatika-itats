<?php

use App\Http\Controllers\Pages\PraktikanPagesController;
use Illuminate\Support\Facades\Route;

Route::prefix('praktikan')->name('praktikan.')->middleware('guard:praktikan')->group(function () {
    Route::get('/dashboard', [PraktikanPagesController::class, 'dashboardPage'])->name('dashboard');
    Route::get('/profil', [PraktikanPagesController::class, 'profilePage'])->name('profile');

    Route::prefix('praktikum')->name('praktikum.')->group(function () {
        Route::get('/', [PraktikanPagesController::class, 'praktikumIndexPage'])->name('index');
        Route::get('/register', [PraktikanPagesController::class, 'praktikumCreatePage'])->name('create');
    });

});
