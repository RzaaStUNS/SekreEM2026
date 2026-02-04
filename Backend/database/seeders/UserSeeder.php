<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Daftar user, email, dan password sesuai request terbaru
        $users = [
            [
                'name' => 'Ketua Umum',
                'email' => 'ketum@em.uns.ac.id',
                'password' => 'ketum_emailkompuns2026'
            ],
            [
                'name' => 'Wakil Ketua Umum',
                'email' => 'waketum@em.uns.ac.id',
                'password' => 'waketum_emailkompuns2026'
            ],
            [
                'name' => 'Sekretaris Umum',
                'email' => 'sekum@em.uns.ac.id',
                'password' => 'sekum_emailkompuns2026'
            ],
            [
                'name' => 'Bendahara Umum',
                'email' => 'bendum@em.uns.ac.id',
                'password' => 'bendum_emailkompuns2026'
            ],
            [
                'name' => 'Biro Personalia',
                'email' => 'personalia@em.uns.ac.id',
                'password' => 'personalia_emailkompuns2026'
            ],
            [
                'name' => 'Ekonomi Kreatif',
                'email' => 'ekraf@em.uns.ac.id',
                'password' => 'ekraf_emailkompuns2026'
            ],
            [
                'name' => 'PSDM',
                'email' => 'psdm@em.uns.ac.id',
                'password' => 'psdm_emailkompuns2026'
            ],
            [
                'name' => 'Minat & Bakat',
                'email' => 'mikat@em.uns.ac.id',
                'password' => 'mikat_emailkompuns2026'
            ],
            [
                'name' => 'Hubungan Masyarakat',
                'email' => 'humas@em.uns.ac.id',
                'password' => 'humas_emailkompuns2026'
            ],
            [
                'name' => 'Sosial Masyarakat',
                'email' => 'sosma@em.uns.ac.id',
                'password' => 'sosma_emailkompuns2026'
            ],
            [
                'name' => 'Media & Informasi',
                'email' => 'medinfo@em.uns.ac.id',
                'password' => 'medinfo_emailkompuns2026'
            ],
            [
                'name' => 'Riset & Data',
                'email' => 'rnd@em.uns.ac.id',
                'password' => 'rnd_emailkompuns2026'
            ],
        ];

        // Looping insert data
        foreach ($users as $user) { 
            User::create([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make($user['password']), // Password di-hash
            ]);
        }
    }
}