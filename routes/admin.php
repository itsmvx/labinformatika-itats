<?php

use App\Http\Controllers\Pages\AdminPagesController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware('guard:admin')->group(function () {
    Route::get('/dashboard', [AdminPagesController::class, 'dashboardPage'])->name('dashboard');

    Route::prefix('laboratorium')->name('laboratorium.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'laboratoriumIndexPage'])->name('index');
    });
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'adminIndexPage'])->name('index');
    });
    Route::prefix('dosen')->name('dosen.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'dosenIndexPage'])->name('index');
    });
    Route::prefix('aslab')->name('aslab.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'aslabIndexPage'])->name('index');
        Route::get('/create', [AdminPagesController::class, 'aslabCreatePage'])->name('create');
        Route::get('/update', [AdminPagesController::class, 'aslabUpdatePage'])->name('update');
    });
    Route::prefix('praktikan')->name('praktikan.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'praktikanIndexPage'])->name('index');
        Route::get('/create', [AdminPagesController::class, 'praktikanCreatePage'])->name('create');
        Route::get('/create-upload', [AdminPagesController::class, 'praktikanCreateUploadPage'])->name('create-upload');
        Route::get('/details', [AdminPagesController::class, 'praktikanDetailsPage'])->name('details');
    });
    Route::prefix('praktikum')->name('praktikum.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'praktikumIndexPage'])->name('index');
        Route::get('/create', [AdminPagesController::class, 'praktikumCreatePage'])->name('create');
        Route::get('/details', [AdminPagesController::class, 'praktikumDetailsPage'])->name('details');
        Route::prefix('praktikan')->name('praktikan.')->group(function () {
            Route::get('/', [AdminPagesController::class, 'praktikumPraktikanIndexPage'])->name('index');
        });

        Route::prefix('/nilai')->name('nilai.')->group(function () {
            Route::get('/', [AdminPagesController::class, 'praktikumNilaiIndexPage'])->name('index');
        });
    });
    Route::prefix('jenis-praktikum')->name('jenis-praktikum.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'jenisPraktikumIndexPage'])->name('index');
    });
    Route::prefix('periode-praktikum')->name('periode-praktikum.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'periodePraktikumIndexPage'])->name('index');
    });
    Route::prefix('kuis')->name('kuis.')->group(function () {
        Route::prefix('label')->name('label.')->group(function () {
            Route::get('/', [AdminPagesController::class, 'labelIndexPage'])->name('index');
        });
        Route::prefix('soal')->name('soal.')->group(function () {
            Route::get('/', [AdminPagesController::class, 'soalIndexPage'])->name('index');
            Route::get('/create', [AdminPagesController::class, 'soalCreatePage'])->name('create');
            Route::get('/create-upload', [AdminPagesController::class, 'soalCreateUploadPage'])->name('create-upload');
            Route::get('/update', [AdminPagesController::class, 'soalUpdatePage'])->name('update');
        });

        Route::get('/', [AdminPagesController::class, 'kuisIndexPage'])->name('index');
        Route::get('/create', [AdminPagesController::class, 'kuisCreatePage'])->name('create');
        Route::get('/update', [AdminPagesController::class, 'kuisUpdatePage'])->name('update');
    });
    Route::prefix('nilai-praktikum')->name('nilai-praktikum.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'nilaiIndexPage'])->name('index');
        Route::get('/{praktikum_id}', [AdminPagesController::class, 'nilaiDetailsPage'])->name('details');
    });
});
