<?php

namespace App\UseCases\PensionProposal;

class GetRecoveredResourcesUseCase
{
    /**
     * @return array<string, float>
     */
    public function execute(
        float $monthlyPension,
        float $pensionRetroactive,
        float $modality40Return,
        float $aforeAndInfonavit,
    ): array {
        return [
            'fees' => $monthlyPension,
            'pension_retroactive' => $pensionRetroactive,
            'modality_40_return' => $modality40Return,
            'afore_and_infonavit' => $aforeAndInfonavit,
            'total_recovered_resources' => $pensionRetroactive + $modality40Return + $aforeAndInfonavit,
        ];
    }
}
