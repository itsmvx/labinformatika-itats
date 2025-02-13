<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SesiPraktikum extends Model
{
    use HasUuids, SoftDeletes;
    protected $table = 'sesi_praktikum';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function praktikum(): BelongsTo
    {
        return $this->BelongsTo(Praktikum::class, 'praktikum_id');
    }

}
