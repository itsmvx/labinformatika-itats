<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Label extends Model
{
    use HasUuids, SoftDeletes;
    protected $table = 'label';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function soal()
    {
        return $this->belongsToMany(Soal::class, 'label_soal', 'label_id', 'soal_id');
    }
}
