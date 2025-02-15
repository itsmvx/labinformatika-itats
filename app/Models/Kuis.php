<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kuis extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'kuis';
    protected $guarded = ['id'];

    public function pertemuan()
    {
        return $this->belongsTo(Pertemuan::class, 'pertemuan_id');
    }
    public function soal()
    {
        return $this->belongsToMany(Soal::class, 'soal_kuis', 'kuis_id', 'soal_id');
    }

}
