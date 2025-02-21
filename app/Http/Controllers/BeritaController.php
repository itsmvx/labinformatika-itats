<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use App\Models\JenisPraktikum;
use App\Models\Laboratorium;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;
use Illuminate\Database\QueryException;
use Inertia\Inertia;
use function Symfony\Component\String\b;

class BeritaController extends Controller
{
    public function index(Request $request)
    {
        $query = Berita::select([
            'id',
            'judul',
            'slug',
            'deskripsi',
            'updated_at',
            'admin_id',
            'jenis_praktikum_id',
            'laboratorium_id',
        ])
            ->with(['admin:id,nama', 'laboratorium:id,nama', 'jenis_praktikum:id,nama'])
            ->orderBy('updated_at', 'desc');

        $search = $request->query('search');
        if ($search) {
            $search = $request->query('search');
            if ($search) {
                $query->where('judul', 'like', '%' . $search . '%');
            }
        }

        $viewPerPage = $this->getViewPerPage($request);
        $beritas = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('BeritaIndexPage', [
            'pagination' => fn() => $beritas,
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:berita,slug',
            'deskripsi' => 'required|string|max:255',
            'prasyarat' => 'required|string',
            'konten' => 'required|string',
            'alur' => 'nullable|string',
            'admin_id' => 'nullable|uuid|exists:admin,id',
            'laboratorium_id' => 'nullable|uuid|exists:laboratorium,id',
            'jenis_praktikum_id' => 'nullable|uuid|exists:jenis_praktikum,id',
        ]);

        try {
            Berita::create([
                'id' => Str::uuid(),
                'judul' => $validated['judul'],
                'slug' => Str::slug($validated['slug']),
                'deskripsi' => $validated['deskripsi'],
                'prasyarat' => $validated['prasyarat'],
                'konten' => $validated['konten'],
                'admin_id' => $validated['admin_id'],
                'laboratorium_id' => $validated['laboratorium_id'],
                'jenis_praktikum_id' => $validated['jenis_praktikum_id'],
            ]);
            return Response::json([
                'message' => 'Berita berhasil ditambahkan',
            ]);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }
    public function show(Request $request, $slug)
    {
        if (!$slug) {
            abort(404);
        }

        $berita = Berita::select([
            'id',
            'judul',
            'deskripsi',
            'prasyarat',
            'konten',
            'updated_at',
            'admin_id',
            'jenis_praktikum_id',
            'laboratorium_id',
        ])
            ->with(['admin:id,nama', 'laboratorium:id,nama', 'jenis_praktikum:id,nama'])
            ->where('slug', $slug)
            ->orWhere('id', $slug)
            ->first();

        if (!$berita) {
            abort(404);
        }

        return Inertia::render('BeritaDetailsPage', [
            'berita' => fn() => $berita,
        ])->withViewData([
            'metaDescription' => $berita->deskripsi,
            'metaAuthor' => $berita->laboratorium?->nama ? "Laboratorium " . $berita->laboratorium->nama : null,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|uuid|exists:berita,id',
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:berita,slug',
            'deskripsi' => 'required|string|max:255',
            'prasyarat' => 'required|string',
            'konten' => 'required|string',
            'alur' => 'nullable|string',
            'admin_id' => 'nullable|uuid|exists:admin,id',
            'laboratorium_id' => 'nullable|uuid|exists:laboratorium,id',
            'jenis_praktikum_id' => 'nullable|uuid|exists:jenis_praktikum,id',
        ]);

        try {
            Berita::where('id', $validated['id'])->update([
                'judul' => $validated['judul'],
                'slug' => Str::slug($validated['slug']),
                'deskripsi' => $validated['deskripsi'],
                'prasyarat' => $validated['prasyarat'],
                'konten' => $validated['konten'],
                'admin_id' => $validated['admin_id'],
                'laboratorium_id' => $validated['laboratorium_id'],
                'jenis_praktikum_id' => $validated['jenis_praktikum_id'],
            ]);
            return Response::json([
                'message' => 'Berita berhasil diperbarui',
            ]);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|uuid|exists:berita,id',
        ]);
        try {
            Berita::where('id', $validated['id'])->delete();
            return Response::json([
                'message' => 'Berita berhasil dihapus',
            ]);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }
}
