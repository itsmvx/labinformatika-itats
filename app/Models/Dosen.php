<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Dosen extends Authenticatable
{
    use HasUuids, SoftDeletes;
    protected $table = 'dosen';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function laboratorium(): BelongsToMany
    {
        return $this->belongsToMany(Laboratorium::class, 'dosen_laboratorium', 'dosen_id', 'laboratorium_id');
    }
}
