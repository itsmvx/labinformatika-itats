<?php

namespace Database\Seeders;

use App\Models\Laboratorium;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LaboratoriumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $laboratoriums = [
            'Bahasa Pemrograman',
            'Rekayasa Perangkat Lunak',
            'Jaringan Komputer',
        ];

        foreach ($laboratoriums as $laboratorium) {
            Laboratorium::create([
                'id' => Str::uuid(),
                'nama' => $laboratorium,
            ]);
        }
    }
}
