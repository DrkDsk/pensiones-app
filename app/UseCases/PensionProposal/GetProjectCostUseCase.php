<?php

namespace App\UseCases\PensionProposal;

class GetProjectCostUseCase
{
    /**
     * @return array<string, float>
     */
    public function execute(float $monthlyPension): array
    {
        // Inputs temporales hasta que el cálculo de financiamiento sea persistido.
        $retroactiveModality40 = 246204.82;
        $modality10 = 16426.84;
        $unemploymentAssistance = 93860.61;
        $lifeInsurance = 12759.35;
        $clientContribution = 0.00;
        $financingRate = 0.40;

        $totalFinancing = $retroactiveModality40
            + $modality10
            + $unemploymentAssistance
            + $lifeInsurance
            + $clientContribution;
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
            'total_project_cost' => $totalFinancing + $financingCost + $fees,
        ];
    }
}
