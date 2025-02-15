<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class LabelSoal extends Model
{
    use HasUuids;
    protected $table = 'label_soal';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];
}
