<?php

namespace App\UseCases\Calculate;

use App\Models\PercentageCostForModality40;
use Illuminate\Support\Collection;

class GetPercentageCostByYearsUseCase
{
    /**
     * @param array<int> $years
     * @return Collection<int, float>
     */
    public function execute(array $years): Collection
    {
        $normalizedYears = collect($years)
            ->map(fn($year) => (int)$year)
            ->filter()
            ->unique()
            ->values();

        return PercentageCostForModality40::query()
            ->whereIn('year', $normalizedYears)
            ->orderBy('year')
            ->get(['year', 'percentage'])
            ->mapWithKeys(
                fn(PercentageCostForModality40 $item) => [
                    $item->year => (float)$item->percentage,
                ],
            );
    }
}
