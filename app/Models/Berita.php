<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Berita extends Model
{
    use HasUuids, SoftDeletes;
    protected $table = 'berita';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }
    public function jenis_praktikum(): BelongsTo
    {
        return $this->belongsTo(JenisPraktikum::class, 'jenis_praktikum_id');
    }
    public function laboratorium(): BelongsTo
    {
        return $this->belongsTo(Laboratorium::class, 'laboratorium_id');
    }
}
