<?php

namespace App\Http\Controllers;

use App\Models\LabelSoal;
use App\Models\Soal;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class SoalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|array',
            'label.*' => 'required|string|uuid|exists:label,id',
            'pertanyaan' => 'required|string',
            'pilihan_jawaban' => 'required|string',
            'kunci_jawaban' => 'required|string',
        ]);
        DB::beginTransaction();

        try {
            $soal = Soal::create([
                'id' => Str::uuid(),
                'pertanyaan' => $validated['pertanyaan'],
                'pilihan_jawaban' => $validated['pilihan_jawaban'],
                'kunci_jawaban' => $validated['kunci_jawaban'],
            ]);

            $soal->label()->sync($validated['label']);

            DB::commit();

            return Response::json([
                'message' => 'Soal berhasil ditambahkan!'
            ]);
        } catch (QueryException $e) {
            DB::rollBack();
            $message = config('app.debug') ? $e->getMessage() : 'Server gagal memproses permintaan';
            return Response::json([
                'message' => $message
            ], 500);
        }
    }
    public function storeMass(Request $request)
    {
        $validated = $request->validate([
            'data' => 'required|array',
            'data.*.label' => 'nullable|array',
            'data.*.label.*' => 'nullable|string|uuid|exists:label,id',
            'data.*.pertanyaan' => 'required|string',
            'data.*.pilihan_jawaban' => 'required|string',
            'data.*.kunci_jawaban' => 'required|string|in:A,B,C,D,E',
        ]);

        DB::beginTransaction();

        try {
            foreach ($validated['data'] as $soalData) {
                $soal = Soal::create([
                    'id' => Str::uuid(),
                    'pertanyaan' => $soalData['pertanyaan'],
                    'pilihan_jawaban' => $soalData['pilihan_jawaban'],
                    'kunci_jawaban' => $soalData['kunci_jawaban'],
                ]);

                if (!empty($soalData['label'])) {
                    $soal->label()->sync($soalData['label']);
                }
            }

            DB::commit();

            return Response::json([
                'message' => 'Semua soal berhasil ditambahkan!',
            ], 201);
        } catch (QueryException $e) {
            DB::rollBack();
            $message = config('app.debug') ? $e->getMessage() : 'Server gagal memproses permintaan';
            return Response::json([
                'message' => $message,
            ], 500);
        } catch (\Exception $e) {
            DB::rollBack();
            return Response::json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(Soal $soalKuis)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Soal $soalKuis)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:soal,id',
            'label' => 'required|array',
            'label.*' => 'required|string|uuid|exists:label,id',
            'pertanyaan' => 'required|string',
            'pilihan_jawaban' => 'required|string',
            'kunci_jawaban' => 'required|string',
        ]);

        DB::beginTransaction();

        try {
            $soal = Soal::findOrFail($validated['id']);
            $soal->update([
                'pertanyaan' => $validated['pertanyaan'],
                'pilihan_jawaban' => $validated['pilihan_jawaban'],
                'kunci_jawaban' => $validated['kunci_jawaban'],
            ]);
            $soal->label()->sync($validated['label']);

            DB::commit();

            return Response::json([
                'message' => 'Soal berhasil diperbarui!'
            ]);
        } catch (QueryException $e) {
            DB::rollBack();
            $message = config('app.debug') ? $e->getMessage() : 'Server gagal memproses permintaan';
            return Response::json([
                'message' => $message
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|exists:soal,id',
        ]);

        try {
            Soal::where('id', $validated['id'])->delete();
            return Response::json([
                'message' => 'Soal berhasil dihapus!'
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan'
            ], 500);
        }
    }
    public function apiSoal(Request $request)
    {
        try {
            $label = $request->input('label');
            $labels = $request->input('labels');
            $limit = $request->input('limit', 50);

            $limit = $limit > 250 ? 250 : $limit;

            $query = DB::table('soal')
                ->select('soal.id', 'soal.pertanyaan')
                ->distinct();

            if ($label) {
                $query->join('label_soal', 'soal.id', '=', 'label_soal.soal_id')
                    ->where('label_soal.label_id', $label);
            }

            if ($labels && is_array($labels)) {
                $query->join('label_soal as ls', 'soal.id', '=', 'ls.soal_id')
                    ->whereIn('ls.label_id', $labels)
                    ->groupBy('soal.id', 'soal.pertanyaan')
                    ->havingRaw('COUNT(DISTINCT ls.label_id) = ?', [count($labels)]);
            }

            $soalByLabels = $query->limit($limit)->get();

            if ($soalByLabels->isEmpty()) {
                return Response::json([
                    'data' => [],
                    'message' => $label || $labels
                        ? 'Soal dengan label yang diberikan tidak ditemukan.'
                        : 'Tidak ada soal yang tersedia.',
                ]);
            }

            return Response::json([
                'data' => $soalByLabels,
                'message' => $limit === 250
                    ? 'Limit maksimal 250 diterapkan.'
                    : 'Data berhasil diambil.',
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan',
            ], 500);
        }
    }
}
