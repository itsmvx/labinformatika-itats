<?php

use App\Http\Controllers\PraktikanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::name('api.')->group(function () {
//    Route::get('soal', [SoalController::class, 'apiSoal'])->name('soal');

    Route::get('check-npm', [PraktikanController::class, 'checkNpmGET'])->name('check-npm-get');
    Route::post('check-npm', [PraktikanController::class, 'checkNpmPOST'])->name('check-npm-post');
    Route::get('/praktikans', [PraktikanController::class, 'getPraktikans'])->name('praktikans');

    Route::post('/verify-npm', [PraktikanController::class, 'verifyNpm'])->name('verify-npm');
});
