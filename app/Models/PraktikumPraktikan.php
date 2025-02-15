<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PraktikumPraktikan extends Model
{
    use HasUuids;
    protected $table = 'praktikum_praktikan';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];
}
