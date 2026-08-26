<?php

namespace App\UseCases\PensionProposal;

use App\Helpers\AgeFormatter;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;

class GetPensionScenarioUseCase
{
    /**
     * @return array<string, mixed>
     */
    public function execute(
        float $monthlyPension,
        float $contributedWeeks,
        float $averageDailySalary,
        CarbonInterface $birthdate,
        CarbonImmutable $asOf,
    ): array {
        return [
            'contributed_weeks' => $contributedWeeks,
            'average_daily_salary' => $averageDailySalary,
            'first_deposit_age' => AgeFormatter::format($birthdate, $asOf),
            'process_start_date' => $asOf,
            'monthly_pension' => $monthlyPension,
            'next_year_pension' => $monthlyPension * 1.15,
            'christmas_bonus' => 32737.36,
        ];
    }
}
