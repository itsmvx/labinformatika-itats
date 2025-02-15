<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Soal extends Model
{
    use HasUuids, SoftDeletes;
    protected $table = 'soal';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function label()
    {
        return $this->belongsToMany(Label::class, 'label_soal', 'soal_id', 'label_id');
    }
    public function kuis()
    {
        return $this->belongsToMany(Kuis::class, 'soal_kuis', 'soal_id', 'kuis_id');
    }

}
