<?php

namespace App\UseCases\PensionProposal;

class GetFreeCapitalUseCase
{
    public function execute(float $totalRecoveredResources, float $totalProjectCost): float
    {
        return $totalRecoveredResources - $totalProjectCost;
    }
}
