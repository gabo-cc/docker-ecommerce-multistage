<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $baseUrl = 'https://xpyazbwzjpqmrvaoorbd.supabase.co/storage/v1/object/public/productos/';

        $products = [
            [
                'name' => 'Laptop Lenovo IdeaPad',
                'sku' => 'LAP-LEN-001',
                'description' => 'Laptop para estudio y trabajo con almacenamiento SSD.',
                'price' => 749.99,
                'stock' => 12,
                'image_url' => $baseUrl . 'laptop-lenovo.jpg',
                'is_active' => true,
            ],
            [
                'name' => 'Mouse inalámbrico Logitech',
                'sku' => 'MOU-LOG-001',
                'description' => 'Mouse inalámbrico ergonómico con conexión USB.',
                'price' => 24.99,
                'stock' => 35,
                'image_url' => $baseUrl . 'mouse-logitech.jpg',
                'is_active' => true,
            ],
            [
                'name' => 'Teclado mecánico',
                'sku' => 'TEC-MEC-001',
                'description' => 'Teclado mecánico con iluminación y conexión USB.',
                'price' => 64.50,
                'stock' => 20,
                'image_url' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Monitor Samsung 24 pulgadas',
                'sku' => 'MON-SAM-001',
                'description' => 'Monitor Full HD para oficina y entretenimiento.',
                'price' => 189.99,
                'stock' => 8,
                'image_url' => $baseUrl . 'monitor-samsung.jpg',
                'is_active' => true,
            ],
            [
                'name' => 'Audífonos Bluetooth',
                'sku' => 'AUD-BLU-001',
                'description' => 'Audífonos inalámbricos con micrófono integrado.',
                'price' => 45.00,
                'stock' => 25,
                'image_url' => $baseUrl . 'audifonos-bluetooth.jpg',
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['sku' => $product['sku']],
                $product
            );
        }
    }
}
