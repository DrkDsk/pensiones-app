<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PercentageCostForModality40 extends Model
{
    protected $table = 'percentage_cost_for_modality_40';

    protected $fillable = [
        'year',
        'percentage',
    ];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'percentage' => 'decimal:3',
        ];
    }
}
