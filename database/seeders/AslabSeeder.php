<?php

namespace Database\Seeders;

use App\Models\Aslab;
use App\Models\Laboratorium;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class AslabSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $data = [
            [
                'nama' => 'Mochamad Luthfan Rianda Putra',
                'npm' => '06.2021.1.07397',
                'jabatan' => 'Koordinator'
            ],
            [
                'nama' => 'Indy Adira Khalfani',
                'npm' => '06.2021.1.07434',
                'jabatan' => 'Admin'
            ],
            [
                'nama' => 'Latiful Sirri',
                'npm' => '06.2021.1.07461',
                'jabatan' => 'Hardware-Software'
            ],
            [
                'nama' => 'Chatarina Natassya Putri',
                'npm' => '06.2021.1.07482',
                'jabatan' => 'Sekretaris'
            ],
            [
                'nama' => 'Afzal Musyaffa Lathif Ashrafil Adam',
                'npm' => '06.2022.1.07587',
                'jabatan' => 'Koordinator'
            ],
            [
                'nama' => 'Windi Nitasya Lubis',
                'npm' => '06.2022.1.07590',
                'jabatan' => 'Admin'
            ],
            [
                'nama' => 'Marikh Kasiful Izzat',
                'npm' => '06.2022.1.07610',
                'jabatan' => 'Koordinator'
            ],
            [
                'nama' => 'Gregoria Stefania Kue Siga',
                'npm' => '06.2022.1.07626',
                'jabatan' => 'Bendahara'
            ],
        ];
        $labJarkom = Laboratorium::where('nama', 'Jaringan Komputer')->first();
        $aslabs = array_map(function ($aslab) use ($faker, $labJarkom) {
            return [
                'id' => Str::uuid(),
                'nama' => $aslab['nama'],
                'no_hp' => $faker->randomElement(['0857','0812','0858','0898','0838']).$faker->numerify('########'),
                'username' => $aslab['npm'],
                'password' => Hash::make($aslab['npm'], [ 'rounds' => 12 ]),
                'jabatan' => $aslab['jabatan'],
                'laboratorium_id' => $labJarkom->id,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $data);

        Aslab::insert($aslabs);
    }
}
