<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@ecommerce.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('Admin123*'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'cliente@ecommerce.com'],
            [
                'name' => 'Cliente de Prueba',
                'password' => Hash::make('Cliente123*'),
                'role' => 'customer',
            ]
        );
    }
}
