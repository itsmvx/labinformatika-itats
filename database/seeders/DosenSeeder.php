<?php

namespace Database\Seeders;

use App\Models\Dosen;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DosenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dosens = [
            'Dr. Tutuk Indriyani, S.T.,M.Kom.',
            'Citra Nurina Prabiantissa, S.S.T.,M.Tr.Kom.',
            'Gusti Eka Yuliastuti, S.Kom.,M.Kom.',
            'Muchamad Kurniawan, S.Kom.,M.Kom.',
            'Dr. Rahmi Rizkiana Putri, S.ST.,M.Kom.',
            'Nanang Fakhrur Rozi, S.ST.,M.Kom.',
            'Danang Haryo Sulaksono, S.ST., M.T.',
            'Andy Rachman, S.T.,M.Kom'
        ];
        $faker = \Faker\Factory::create();
        foreach ($dosens as $dosen) {
            $number = $faker->unique()->regexify('411[0-9]{5}');
            Dosen::create([
                'id' => Str::uuid(),
                'nama' => $dosen,
                'username' => $number,
                'password' => Hash::make('123456', ['rounds' => 12]),
            ]);
        }
    }
}
