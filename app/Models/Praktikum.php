<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Praktikum extends Model
{
    use HasUuids, SoftDeletes;
    protected $table = 'praktikum';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];
    protected $casts = [
        'status' => 'boolean',
    ];

    public function jenis(): BelongsTo
    {
        return $this->belongsTo(JenisPraktikum::class, 'jenis_praktikum_id');
    }
    public function periode(): BelongsTo
    {
        return $this->belongsTo(PeriodePraktikum::class, 'periode_praktikum_id');
    }
    public function pertemuan(): HasMany
    {
        return $this->hasMany(Pertemuan::class, 'praktikum_id');
    }
    public function sesi(): HasMany
    {
        return $this->hasMany(SesiPraktikum::class, 'praktikum_id');
    }
    public function praktikan(): BelongsToMany
    {
        return $this->belongsToMany(Praktikan::class, 'praktikum_praktikan', 'praktikum_id', 'praktikan_id');
    }
}
