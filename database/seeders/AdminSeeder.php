<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Laboratorium;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $laboratoriums = Laboratorium::select('id', 'nama')->get();

        foreach ($laboratoriums as $laboratorium) {
            if ($laboratorium->nama === 'Bahasa Pemrograman') {
                Admin::create([
                    'id' => Str::uuid(),
                    'nama' => 'Admin Basprog 1',
                    'username' => 'adminbasprog1',
                    'password' => Hash::make('123456', ['rounds' => 12]),
                    'laboratorium_id' => $laboratorium->id,
                ]);
                Admin::create([
                    'id' => Str::uuid(),
                    'nama' => 'Admin Basprog 2',
                    'username' => 'adminbasprog2',
                    'password' => Hash::make('123456', ['rounds' => 12]),
                    'laboratorium_id' => $laboratorium->id,
                ]);
            } elseif ($laboratorium->nama === 'Rekayasa Perangkat Lunak') {
                Admin::create([
                    'id' => Str::uuid(),
                    'nama' => 'Admin RPL 1',
                    'username' => 'adminrpl1',
                    'password' => Hash::make('123456', ['rounds' => 12]),
                    'laboratorium_id' => $laboratorium->id,
                ]);
                Admin::create([
                    'id' => Str::uuid(),
                    'nama' => 'Admin RPL 2',
                    'username' => 'adminrpl2',
                    'password' => Hash::make('123456', ['rounds' => 12]),
                    'laboratorium_id' => $laboratorium->id,
                ]);
            } elseif ($laboratorium->nama === 'Jaringan Komputer') {
                Admin::create([
                    'id' => Str::uuid(),
                    'nama' => 'Admin Jarkom 1',
                    'username' => 'adminjarkom1',
                    'password' => Hash::make('123456', ['rounds' => 12]),
                    'laboratorium_id' => $laboratorium->id,
                ]);
                Admin::create([
                    'id' => Str::uuid(),
                    'nama' => 'Admin Jarkom 2',
                    'username' => 'adminjarkom2',
                    'password' => Hash::make('123456', ['rounds' => 12]),
                    'laboratorium_id' => $laboratorium->id,
                ]);
            }
        }
        Admin::create([
            'id' => Str::uuid(),
            'nama' => 'Shadow 1',
            'username' => 'shadow1',
            'password' => Hash::make('123456', ['rounds' => 12]),
            'laboratorium_id' => null,
        ]);
    }
}
