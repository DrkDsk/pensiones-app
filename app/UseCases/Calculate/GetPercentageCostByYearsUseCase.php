<?php

namespace App\UseCases\Calculate;

use App\Models\PercentageCostForModality40;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class GetPercentageCostByYearsUseCase
{
    /**
     * @param array<int> $years
     * @return Collection<int, float>
     */
    public function execute(array $years): Collection
    {
        return Cache::remember(
            'percentage_cost_for_modality_40',
            now()->addDay(),
            static fn() => PercentageCostForModality40::query()
                ->orderBy('year')
                ->pluck('percentage', 'year')
                ->map(fn($percentage) => (float)$percentage),
        );
    }
}
