<?php

use App\Helpers\AgeFormatter;
use App\Helpers\CurrencyFormatter;
use App\UseCases\PensionProposal\GetFreeCapitalUseCase;
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
    $projectCost = (new GetProjectCostUseCase)->execute(35855.20);
    $recoveredResources = (new GetRecoveredResourcesUseCase)->execute();
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
