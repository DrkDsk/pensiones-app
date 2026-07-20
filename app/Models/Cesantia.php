<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cesantia extends Model
{
    protected $table = 'cesantias';
    protected $fillable = [
        'minimum_age',
        'maximum_age',
        'percentage',
    ];

    protected function casts(): array
    {
        return [
            'minimum_age' => 'decimal:2',
            'maximum_age' => 'decimal:2',
            'percentage' => 'decimal:2',
        ];
    }

    public static function findPercentageByAge(float $age): ?float
    {
        $cesantia = self::query()
            ->where('minimum_age', '<=', $age)
            ->where(function ($query) use ($age) {
                $query
                    ->whereNull('maximum_age')
                    ->orWhere('maximum_age', '>=', $age);
            })
            ->first();

        return $cesantia
            ? (float) $cesantia->percentage
            : null;
    }
}
