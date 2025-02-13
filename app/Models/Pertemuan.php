<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pertemuan extends Model
{
    use HasUuids, SoftDeletes;
    protected $table = 'pertemuan';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function praktikum(): BelongsTo
    {
        return $this->belongsTo(Praktikum::class, 'praktikum_id');
    }
    public function modul(): HasMany
    {
        return $this->hasMany(Modul::class, 'pertemuan_id');
    }
    public function kuis()
    {
        return $this->hasMany(Kuis::class, 'pertemuan_id');
    }

}
