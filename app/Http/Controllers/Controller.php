<?php

namespace App\Http\Controllers;

use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

abstract class Controller
{
    //
    public function getViewPerPage(Request $request)
    {
        $viewList = [ "15", "30", "50", "100" ];
        $viewPerPage = $request->query('view');

        if (!in_array($viewPerPage, $viewList)) {
            return $viewPerPage = 15;
        } else {
            return $viewPerPage = intval($viewPerPage);
        }

    }
    public function queryExceptionResponse(QueryException $exception)
    {
        return Response::json([
            'message' => config('app.debug')
                ? $exception->getMessage()
                : 'Server gagal memproses permintaan'
        ], 500);
    }
    public function romanToInt($roman) {
        $romans = [
            'I' => 1, 'II' => 2, 'III' => 3, 'IV' => 4, 'V' => 5,
            'VI' => 6, 'VII' => 7, 'VIII' => 8, 'IX' => 9, 'X' => 10,
            'XI' => 11, 'XII' => 12, 'XIII' => 13, 'XIV' => 14, 'XV' => 15
        ];
        return $romans[$roman] ?? 999;
    }
}
