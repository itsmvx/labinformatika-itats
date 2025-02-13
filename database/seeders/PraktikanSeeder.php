<?php

namespace Database\Seeders;

use App\Models\Praktikan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class PraktikanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        $data = [
            [ 'id' => Str::uuid(), 'nama' => 'Aoi Rama Hakim', 'npm' => '06.2024.1.01322' ],
            [ 'id' => Str::uuid(), 'nama' => 'Shiori Naya Azkia', 'npm' => '06.2024.1.01323' ],
            [ 'id' => Str::uuid(), 'nama' => 'Ren Fikri Maulana', 'npm' => '06.2024.1.01324' ],
            [ 'id' => Str::uuid(), 'nama' => 'Sakura Kinan Najwa', 'npm' => '06.2024.1.01325' ],
            [ 'id' => Str::uuid(), 'nama' => 'Itsuki Arga Fadhil', 'npm' => '06.2024.1.01326' ],
            [ 'id' => Str::uuid(), 'nama' => 'Yuzuki Dhea Khairina', 'npm' => '06.2024.1.01327' ],
            [ 'id' => Str::uuid(), 'nama' => 'Kenji Rafif Azzam', 'npm' => '06.2024.1.01328' ],
            [ 'id' => Str::uuid(), 'nama' => 'Mai Zahra Izzati', 'npm' => '06.2024.1.01329' ],
            [ 'id' => Str::uuid(), 'nama' => 'Hajime Rizky Fauzan', 'npm' => '06.2024.1.01330' ],
            [ 'id' => Str::uuid(), 'nama' => 'Akane Rika Amalia', 'npm' => '06.2024.1.01331' ],
            [ 'id' => Str::uuid(), 'nama' => 'Kaito Reyhan Syahputra', 'npm' => '06.2024.1.01332' ],
            [ 'id' => Str::uuid(), 'nama' => 'Hinata Gita Safira', 'npm' => '06.2024.1.01333' ],
            [ 'id' => Str::uuid(), 'nama' => 'Tsubasa Azzam Ramadhan', 'npm' => '06.2024.1.01334' ],
            [ 'id' => Str::uuid(), 'nama' => 'Satsuki Rani Nabila', 'npm' => '06.2024.1.01335' ],
            [ 'id' => Str::uuid(), 'nama' => 'Minato Farel Hakim', 'npm' => '06.2024.1.01336' ],
            [ 'id' => Str::uuid(), 'nama' => 'Nao Bunga Azzahra', 'npm' => '06.2024.1.01337' ],
            [ 'id' => Str::uuid(), 'nama' => 'Ichika Dani Fikri', 'npm' => '06.2024.1.01338' ],
            [ 'id' => Str::uuid(), 'nama' => 'Riko Naya Fadhilah', 'npm' => '06.2024.1.01339' ],
            [ 'id' => Str::uuid(), 'nama' => 'Yuki Tama Aditya', 'npm' => '06.2024.1.01340' ],
            [ 'id' => Str::uuid(), 'nama' => 'Kazumi Ira Khairina', 'npm' => '06.2024.1.01341' ],
            [ 'id' => Str::uuid(), 'nama' => 'Asuka Dika Ramadhan', 'npm' => '06.2024.1.01342' ],
            [ 'id' => Str::uuid(), 'nama' => 'Mikasa Lala Azzahra', 'npm' => '06.2024.1.01343' ],
            [ 'id' => Str::uuid(), 'nama' => 'Eren Gibran Maulana', 'npm' => '06.2024.1.01344' ],
            [ 'id' => Str::uuid(), 'nama' => 'Mai Tiara Khairunisa', 'npm' => '06.2024.1.01345' ],
            [ 'id' => Str::uuid(), 'nama' => 'Touma Baim Fadillah', 'npm' => '06.2024.1.01346' ],
            [ 'id' => Str::uuid(), 'nama' => 'Rei Gina Safitri', 'npm' => '06.2024.1.01347' ],
            [ 'id' => Str::uuid(), 'nama' => 'Shin Aska Hakim', 'npm' => '06.2024.1.01348' ],
            [ 'id' => Str::uuid(), 'nama' => 'Erina Fia Amalia', 'npm' => '06.2024.1.01349' ],
            [ 'id' => Str::uuid(), 'nama' => 'Kouji Rafa Zaydan', 'npm' => '06.2024.1.01350' ],
            [ 'id' => Str::uuid(), 'nama' => 'Misaki Lira Zahira', 'npm' => '06.2024.1.01351' ],
            [ 'id' => Str::uuid(), 'nama' => 'Tetsuya Raka Maulana', 'npm' => '06.2024.1.01352' ],
            [ 'id' => Str::uuid(), 'nama' => 'Emilia Sasa Khalila', 'npm' => '06.2024.1.01353' ],
            [ 'id' => Str::uuid(), 'nama' => 'Sora Dimas Ramadhan', 'npm' => '06.2024.1.01354' ],
            [ 'id' => Str::uuid(), 'nama' => 'Mei Mila Zahwa', 'npm' => '06.2024.1.01355' ],
            [ 'id' => Str::uuid(), 'nama' => 'Riku Tama Arsyad', 'npm' => '06.2024.1.01356' ],
            [ 'id' => Str::uuid(), 'nama' => 'Nao Tita Rasyidah', 'npm' => '06.2024.1.01357' ],
            [ 'id' => Str::uuid(), 'nama' => 'Kazuto Arya Zain', 'npm' => '06.2024.1.01358' ],
            [ 'id' => Str::uuid(), 'nama' => 'Aqua Citra Hafiza', 'npm' => '06.2024.1.01359' ],
            [ 'id' => Str::uuid(), 'nama' => 'Hajime Rizal Maulana', 'npm' => '06.2024.1.01360' ],
            [ 'id' => Str::uuid(), 'nama' => 'Chika Fira Khalisa', 'npm' => '06.2024.1.01361' ],
            [ 'id' => Str::uuid(), 'nama' => 'Yuu Tama Ramzi', 'npm' => '06.2024.1.01362' ],
            [ 'id' => Str::uuid(), 'nama' => 'Yuna Gina Amara', 'npm' => '06.2024.1.01363' ],
            [ 'id' => Str::uuid(), 'nama' => 'Issei Raka Fadhil', 'npm' => '06.2024.1.01364' ],
            [ 'id' => Str::uuid(), 'nama' => 'Sayaka Mila Safira', 'npm' => '06.2024.1.01365' ],
            [ 'id' => Str::uuid(), 'nama' => 'Nagisa Baim Zidan', 'npm' => '06.2024.1.01366' ],
            [ 'id' => Str::uuid(), 'nama' => 'Rika Tya Amira', 'npm' => '06.2024.1.01367' ],
            [ 'id' => Str::uuid(), 'nama' => 'Takumi Farel Rizki', 'npm' => '06.2024.1.01368' ],
            [ 'id' => Str::uuid(), 'nama' => 'Mai Arin Zahra', 'npm' => '06.2024.1.01369' ],
            [ 'id' => Str::uuid(), 'nama' => 'Kenshin Zaid Fauzan', 'npm' => '06.2024.1.01370' ],
            [ 'id' => Str::uuid(), 'nama' => 'Hina Zara Khalida', 'npm' => '06.2024.1.01371' ],
            [ 'id' => Str::uuid(), 'nama' => 'Nana Sari Alifa', 'npm' => '06.2024.1.01372' ],
            [ 'id' => Str::uuid(), 'nama' => 'Yumi Dini Yasmin', 'npm' => '06.2024.1.01373' ],
            [ 'id' => Str::uuid(), 'nama' => 'Luffy Raka Ramadhan', 'npm' => '06.2024.1.01374' ],
            [ 'id' => Str::uuid(), 'nama' => 'Riko Afiqah Ayu', 'npm' => '06.2024.1.01375' ],
            [ 'id' => Str::uuid(), 'nama' => 'Ryu Adi Putra', 'npm' => '06.2024.1.01376' ],
            [ 'id' => Str::uuid(), 'nama' => 'Sakura Aira Azizah', 'npm' => '06.2024.1.01377' ],
            [ 'id' => Str::uuid(), 'nama' => 'Kyo Rafli Muhammad', 'npm' => '06.2024.1.01378' ],
            [ 'id' => Str::uuid(), 'nama' => 'Hinata Nisa Dhiya', 'npm' => '06.2024.1.01379' ],
            [ 'id' => Str::uuid(), 'nama' => 'Kouji Alif Maulana', 'npm' => '06.2024.1.01380' ],
            [ 'id' => Str::uuid(), 'nama' => 'Shiro Andi Haris', 'npm' => '06.2024.1.01381' ],
            [ 'id' => Str::uuid(), 'nama' => 'Miku Rizki Suprayogi', 'npm' => '06.2024.1.01382' ],
            [ 'id' => Str::uuid(), 'nama' => 'Kei Izzat Fauzi', 'npm' => '06.2024.1.01383' ],
            [ 'id' => Str::uuid(), 'nama' => 'Yuuki Shafira Dinda', 'npm' => '06.2024.1.01384' ],
            [ 'id' => Str::uuid(), 'nama' => 'Toma Khairul Muktar', 'npm' => '06.2024.1.01385' ],
            [ 'id' => Str::uuid(), 'nama' => 'Mari Farhanah Azalia', 'npm' => '06.2024.1.01386' ],
            [ 'id' => Str::uuid(), 'nama' => 'Riku Harris Aulia', 'npm' => '06.2024.1.01387' ],
            [ 'id' => Str::uuid(), 'nama' => 'Tatsuya Rani Salsabila', 'npm' => '06.2024.1.01388' ],
            [ 'id' => Str::uuid(), 'nama' => 'Megumi Dimas Rizki', 'npm' => '06.2024.1.01389' ],
            [ 'id' => Str::uuid(), 'nama' => 'Yui Shifa Zahra', 'npm' => '06.2024.1.01390' ],
            [ 'id' => Str::uuid(), 'nama' => 'Akio Mila Ramadhan', 'npm' => '06.2024.1.01391' ],
            [ 'id' => Str::uuid(), 'nama' => 'Kazuma Rafi Ridho', 'npm' => '06.2024.1.01392' ],
            [ 'id' => Str::uuid(), 'nama' => 'Sora Dinda Khairunisa', 'npm' => '06.2024.1.01393' ],
            [ 'id' => Str::uuid(), 'nama' => 'Mitsuhi Alif Rasyid', 'npm' => '06.2024.1.01394' ],
            [ 'id' => Str::uuid(), 'nama' => 'Natsuki Hilman Aditama', 'npm' => '06.2024.1.01395' ],
            [ 'id' => Str::uuid(), 'nama' => 'Nanako Sinta Aulia', 'npm' => '06.2024.1.01396' ],
            [ 'id' => Str::uuid(), 'nama' => 'Rika Bella Fadila', 'npm' => '06.2024.1.01397' ],
            [ 'id' => Str::uuid(), 'nama' => 'Yuuto Raza Miftah', 'npm' => '06.2024.1.01398' ],
            [ 'id' => Str::uuid(), 'nama' => 'Saki Nur Anisa', 'npm' => '06.2024.1.01399' ],
            [ 'id' => Str::uuid(), 'nama' => 'Haru Rizky Tanvir', 'npm' => '06.2024.1.01400' ],
            [ 'id' => Str::uuid(), 'nama' => 'Fujiko Daniswara', 'npm' => '06.2024.1.01401' ],
            [ 'id' => Str::uuid(), 'nama' => 'Tsubasa Rayhan Hakim', 'npm' => '06.2024.1.01402' ],
            [ 'id' => Str::uuid(), 'nama' => 'Misaki Firda Aulia', 'npm' => '06.2024.1.01403' ],
            [ 'id' => Str::uuid(), 'nama' => 'Kazuki Faris Ramadhan', 'npm' => '06.2024.1.01404' ],
            [ 'id' => Str::uuid(), 'nama' => 'Haruka Amir Munir', 'npm' => '06.2024.1.01405' ],
            [ 'id' => Str::uuid(), 'nama' => 'Sora Maulana Aqil', 'npm' => '06.2024.1.01406' ],
            [ 'id' => Str::uuid(), 'nama' => 'Shiori Haniati', 'npm' => '06.2024.1.01407' ],
            [ 'id' => Str::uuid(), 'nama' => 'Takahiro Naufal', 'npm' => '06.2024.1.01408' ],
            [ 'id' => Str::uuid(), 'nama' => 'Arisa Cinta Zahra', 'npm' => '06.2024.1.01409' ],
            [ 'id' => Str::uuid(), 'nama' => 'Hiroshi Faizal Rizki', 'npm' => '06.2024.1.01410' ],
            [ 'id' => Str::uuid(), 'nama' => 'Yoshiko Fadillah Putri', 'npm' => '06.2024.1.01411' ],
            [ 'id' => Str::uuid(), 'nama' => 'Kaori Rizqiana Yu', 'npm' => '06.2024.1.01431' ],
            [ 'id' => Str::uuid(), 'nama' => 'Shunichi Wafi Maulana', 'npm' => '06.2024.1.01432' ],
            [ 'id' => Str::uuid(), 'nama' => 'Reina Rasyid Alfarizi', 'npm' => '06.2024.1.01433' ],
            [ 'id' => Str::uuid(), 'nama' => 'Kiyomi Syarif Akbar', 'npm' => '06.2024.1.01434' ],
            [ 'id' => Str::uuid(), 'nama' => 'Kota Nazim Rizky', 'npm' => '06.2024.1.01435' ],
            [ 'id' => Str::uuid(), 'nama' => 'Taka Nadia Aslam', 'npm' => '06.2024.1.01436' ],
            [ 'id' => Str::uuid(), 'nama' => 'Maiyumi Andra Syafiq', 'npm' => '06.2024.1.01437' ],
            [ 'id' => Str::uuid(), 'nama' => 'Renji Khairul Firdaus', 'npm' => '06.2024.1.01438' ],
            [ 'id' => Str::uuid(), 'nama' => 'Yume Hadi Azwaldi', 'npm' => '06.2024.1.01439' ],
            [ 'id' => Str::uuid(), 'nama' => 'Saki Maulida Afifa', 'npm' => '06.2024.1.01440' ],
            [ 'id' => Str::uuid(), 'nama' => 'Elaina Annisa Zahra', 'npm' => '06.2024.1.01234' ],
        ];
        $praktikans = array_map(function ($praktikan) use ($faker) {
            $username = strtolower(preg_replace('/\s+/', '', $praktikan['nama']) . $faker->unique()->numerify('###'));
            return [
                'id' => $praktikan['id'],
                'nama' => $praktikan['nama'],
                'username' => $praktikan['npm'],
                'password' => Hash::make($praktikan['npm'], [ 'rounds' => 12 ]),
                'avatar' => null,
                'created_at' => now('Asia/Jakarta'),
                'updated_at' => now('Asia/Jakarta'),
            ];
        }, $data);
        Praktikan::insert($praktikans);
    }
}
