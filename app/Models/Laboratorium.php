<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Laboratorium extends Model
{
    use HasUuids, SoftDeletes;
    protected $table = 'laboratorium';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function admin(): HasMany
    {
        return $this->hasMany(Admin::class, 'laboratorium_id');
    }
    public function aslab(): HasMany
    {
        return $this->hasMany(Aslab::class, 'laboratorium_id');
    }
    public function dosen(): BelongsToMany
    {
        return $this->belongsToMany(Dosen::class, 'dosen_laboratorium', 'laboratorium_id', 'dosen_id');
    }
}
