<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class BanList extends Model
{
    use HasUuids;
    protected $table = 'ban_list';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];
}
