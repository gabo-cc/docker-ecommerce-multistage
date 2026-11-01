<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'sku' => fake()->unique()->bothify('PROD-####-??'),
            'description' => fake()->sentence(15),
            'price' => fake()->randomFloat(2, 5, 1500),
            'stock' => fake()->numberBetween(0, 100),
            'image_url' => null,
            'is_active' => true,
        ];
    }
}
