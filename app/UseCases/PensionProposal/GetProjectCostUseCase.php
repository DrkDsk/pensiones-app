<?php

namespace App\UseCases\PensionProposal;

class GetProjectCostUseCase
{
    /**
     * @return array<string, float>
     */
    public function execute(
        float $monthlyPension,
        float $retroactiveModality40,
        float $modality10,
        float $unemploymentAssistance,
        float $lifeInsurance,
        float $clientContribution,
        float $totalFinancing,
    ): array {
        $financingRate = 0.40;

        $financingCost = $totalFinancing * $financingRate;
        $fees = $monthlyPension;

        return [
            'retroactive_modality_40' => $retroactiveModality40,
            'modality_10' => $modality10,
            'unemployment_assistance' => $unemploymentAssistance,
            'life_insurance' => $lifeInsurance,
            'client_contribution' => $clientContribution,
            'total_financing' => $totalFinancing,
            'financing_rate' => $financingRate,
            'financing_cost' => $financingCost,
            'fees' => $fees,
            'total_project_cost' => $totalFinancing + $financingCost + $fees + $clientContribution,
        ];
    }
}
