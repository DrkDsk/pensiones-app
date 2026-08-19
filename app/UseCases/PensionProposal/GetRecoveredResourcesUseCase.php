<?php

namespace App\UseCases\PensionProposal;

class GetRecoveredResourcesUseCase
{
    /**
     * @return array<string, float>
     */
    public function execute(): array
    {
        // Valores temporales hasta que los recursos recuperados sean persistidos.
        $pensionRetroactive = 156411.83;
        $modality40Return = 40058.08;
        $aforeAndInfonavit = 552903.42;

        return [
            'pension_retroactive' => $pensionRetroactive,
            'modality_40_return' => $modality40Return,
            'afore_and_infonavit' => $aforeAndInfonavit,
            'total_recovered_resources' => $pensionRetroactive + $modality40Return + $aforeAndInfonavit,
        ];
    }
}
