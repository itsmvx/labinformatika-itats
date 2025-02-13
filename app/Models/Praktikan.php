<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Praktikan extends Authenticatable
{
    use HasUuids, SoftDeletes;
    protected $table = 'praktikan';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];
}
