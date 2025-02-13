<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PeriodePraktikum extends Model
{
    use HasUuids, SoftDeletes;
    protected $table = 'periode_praktikum';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function laboratorium(): BelongsTo
    {
        return $this->belongsTo(Laboratorium::class, 'laboratorium_id');
    }
    public function praktikum(): HasMany
    {
        return $this->hasMany(Praktikum::class, 'periode_praktikum_id');
    }
}
