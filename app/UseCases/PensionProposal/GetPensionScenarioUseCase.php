<?php

namespace App\UseCases\PensionProposal;

use Carbon\CarbonImmutable;

class GetPensionScenarioUseCase
{
    /**
     * @return array<string, mixed>
     */
    public function execute(): array
    {
        // Valores temporales hasta que exista persistencia del cálculo de pensión.
        return [
            'contributed_weeks' => 1456.51,
            'average_daily_salary' => 1862.71,
            'first_deposit_age' => '64 años, 3 meses',
            'process_start_date' => CarbonImmutable::create(2026, 6, 15),
            'monthly_pension' => 35855.20,
            'next_year_pension' => 37647.96,
            'christmas_bonus' => 32737.36,
        ];
    }
}
