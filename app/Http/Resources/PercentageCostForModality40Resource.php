<?php

namespace App\Http\Resources;

use App\Models\PercentageCostForModality40;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PercentageCostForModality40Resource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var PercentageCostForModality40 $percentageCost */
        $percentageCost = $this->resource;

        return [
            'id' => $percentageCost->id,
            'year' => $percentageCost->year,
            'percentage' => (float) $percentageCost->percentage,
        ];
    }
}
