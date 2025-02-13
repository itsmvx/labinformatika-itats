<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Aslab extends Authenticatable
{
    use HasUuids, SoftDeletes;
    protected $table = 'aslab';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];
    protected $casts = [
        'status' => 'boolean',
    ];


    public function laboratorium(): BelongsTo
    {
        return $this->belongsTo(Laboratorium::class, 'laboratorium_id');
    }
}
