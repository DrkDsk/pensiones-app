<?php

namespace Database\Seeders;

use App\Models\PercentageCostForModality40;
use Illuminate\Database\Seeder;

class PercentageCostForModality40Seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $percentages = [
            [
                'year' => 2020,
                'percentage' => 10.075,
            ],
            [
                'year' => 2021,
                'percentage' => 10.075,
            ],
            [
                'year' => 2022,
                'percentage' => 10.075,
            ],
            [
                'year' => 2023,
                'percentage' => 11.166,
            ],
            [
                'year' => 2024,
                'percentage' => 12.156,
            ],
            [
                'year' => 2025,
                'percentage' => 13.347,
            ],
            [
                'year' => 2026,
                'percentage' => 14.438,
            ],
            [
                'year' => 2027,
                'percentage' => 15.528,
            ],
            [
                'year' => 2028,
                'percentage' => 16.619,
            ],
            [
                'year' => 2029,
                'percentage' => 17.709,
            ],
            [
                'year' => 2030,
                'percentage' => 18.800,
            ],
        ];


        foreach ($percentages as $percentage) {
            PercentageCostForModality40::query()->updateOrCreate(
                [
                    'year' => $percentage['year'],
                ],
                [
                    'percentage' => $percentage['percentage'],
                ],
            );
        }

    }
}
