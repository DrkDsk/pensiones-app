<?php

use App\Helpers\AgeFormatter;
use App\Helpers\CurrencyFormatter;
use App\UseCases\PensionProposal\GetFreeCapitalUseCase;
use App\UseCases\PensionProposal\GetPensionScenarioUseCase;
use App\UseCases\PensionProposal\GetProjectCostUseCase;
use App\UseCases\PensionProposal\GetRecoveredResourcesUseCase;
use Carbon\CarbonImmutable;

test('proposal helpers format age and currency for presentation', function () {
    expect(AgeFormatter::format(
        CarbonImmutable::create(1965, 3, 15),
        CarbonImmutable::create(2026, 8, 18),
    ))->toBe('61 años, 5 meses')
        ->and(CurrencyFormatter::format(35855.2))->toBe('$35,855.20');
});

test('proposal cost and free capital calculations match the reference', function () {
    $projectCost = (new GetProjectCostUseCase)->execute(
        monthlyPension: 35855.20,
        retroactiveModality40: 246204.82,
        modality10: 16426.84,
        unemploymentAssistance: 93860.61,
        lifeInsurance: 12759.35,
        clientContribution: 0,
        totalFinancing: 369251.62,
    );
    $recoveredResources = (new GetRecoveredResourcesUseCase)->execute(
        monthlyPension: 35855.20,
        pensionRetroactive: 156411.83,
        modality40Return: 40058.08,
        aforeAndInfonavit: 552903.42,
    );
    $freeCapital = (new GetFreeCapitalUseCase)->execute(
        $recoveredResources['total_recovered_resources'],
        $projectCost['total_project_cost'],
    );

    expect(round($projectCost['total_financing'], 2))->toBe(369251.62)
        ->and(round($projectCost['financing_cost'], 2))->toBe(147700.65)
        ->and(round($projectCost['total_project_cost'], 2))->toBe(552807.47)
        ->and(round($recoveredResources['total_recovered_resources'], 2))->toBe(749373.33)
        ->and(round($freeCapital, 2))->toBe(196565.86);
});

test('proposal scenario uses calculation values and derives age and next year pension', function () {
    $scenario = (new GetPensionScenarioUseCase)->execute(
        monthlyPension: 20000,
        contributedWeeks: 1500,
        averageDailySalary: 1800.50,
        birthdate: CarbonImmutable::create(1965, 3, 15),
        asOf: CarbonImmutable::create(2026, 8, 18),
    );

    expect($scenario['monthly_pension'])->toBe(20000.0)
        ->and($scenario['contributed_weeks'])->toBe(1500.0)
        ->and($scenario['average_daily_salary'])->toBe(1800.50)
        ->and($scenario['first_deposit_age'])->toBe('61 años, 5 meses')
        ->and($scenario['next_year_pension'])->toBe(23000.0);
});
