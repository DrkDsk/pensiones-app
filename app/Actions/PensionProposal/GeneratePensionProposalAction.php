<?php

namespace App\Actions\PensionProposal;

use App\DTOs\PensionProposal\GeneratedPdfDTO;
use App\DTOs\PensionProposal\PensionProposalDTO;
use App\Services\PensionProposalPdfService;
use App\UseCases\PensionProposal\GetClientInformationUseCase;
use App\UseCases\PensionProposal\GetFreeCapitalUseCase;
use App\UseCases\PensionProposal\GetPensionScenarioUseCase;
use App\UseCases\PensionProposal\GetProjectCostUseCase;
use App\UseCases\PensionProposal\GetRecoveredResourcesUseCase;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;

readonly class GeneratePensionProposalAction
{
    public function __construct(
        private GetClientInformationUseCase $getClientInformation,
        private GetPensionScenarioUseCase $getPensionScenario,
        private GetProjectCostUseCase $getProjectCost,
        private GetRecoveredResourcesUseCase $getRecoveredResources,
        private GetFreeCapitalUseCase $getFreeCapital,
        private PensionProposalPdfService $pdf,
    ) {}

    public function execute(int $clientId): GeneratedPdfDTO
    {
        $generatedAt = CarbonImmutable::now();
        $client = $this->getClientInformation->execute($clientId, $generatedAt);
        $pensionScenario = $this->getPensionScenario->execute();
        $projectCost = $this->getProjectCost->execute($pensionScenario['monthly_pension']);
        $recoveredResources = $this->getRecoveredResources->execute();
        $freeCapital = $this->getFreeCapital->execute(
            $recoveredResources['total_recovered_resources'],
            $projectCost['total_project_cost'],
        );

        $proposal = new PensionProposalDTO(
            client: $client,
            pensionScenario: $pensionScenario,
            projectCost: $projectCost,
            recoveredResources: $recoveredResources,
            freeCapital: $freeCapital,
            generatedAt: $generatedAt,
        );

        return new GeneratedPdfDTO(
            contents: $this->pdf->generate($proposal),
            filename: 'propuesta-pension-'.Str::slug($client['full_name']).'.pdf',
        );
    }
}
