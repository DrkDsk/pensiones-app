<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CesantiaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('cesantias')->insert([
            [
                'minimum_age' => 60.00,
                'maximum_age' => 60.49,
                'percentage' => 75.00,
            ],
            [
                'minimum_age' => 60.50,
                'maximum_age' => 61.49,
                'percentage' => 80.00,
            ],
            [
                'minimum_age' => 61.50,
                'maximum_age' => 62.49,
                'percentage' => 85.00,
            ],
            [
                'minimum_age' => 62.50,
                'maximum_age' => 63.49,
                'percentage' => 90.00,
            ],
            [
                'minimum_age' => 63.50,
                'maximum_age' => 64.49,
                'percentage' => 95.00,
            ],
            [
                'minimum_age' => 64.50,
                'maximum_age' => null,
                'percentage' => 100.00,
            ],
        ]);
    }
}
