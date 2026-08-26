<?php

namespace App\Actions\PensionProposal;

use App\DTOs\PensionProposal\GeneratedPdfDTO;
use App\DTOs\PensionProposal\PensionProposalDTO;
use App\Models\Client;
use App\Repositories\Contract\ClientRepositoryInterface;
use App\Services\PensionProposalPdfService;
use App\UseCases\PensionProposal\GetClientInformationUseCase;
use App\UseCases\PensionProposal\GetFreeCapitalUseCase;
use App\UseCases\PensionProposal\GetPensionScenarioUseCase;
use App\UseCases\PensionProposal\GetProjectCostUseCase;
use App\UseCases\PensionProposal\GetRecoveredResourcesUseCase;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Str;

readonly class GeneratePensionProposalAction
{
    public function __construct(
        private ClientRepositoryInterface $clients,
        private GetClientInformationUseCase $getClientInformation,
        private GetPensionScenarioUseCase $getPensionScenario,
        private GetProjectCostUseCase $getProjectCost,
        private GetRecoveredResourcesUseCase $getRecoveredResources,
        private GetFreeCapitalUseCase $getFreeCapital,
        private PensionProposalPdfService $pdf,
    ) {}

    /**
     * @param  array<string, mixed>  $calculation
     */
    public function execute(int $clientId, array $calculation): GeneratedPdfDTO
    {
        $generatedAt = CarbonImmutable::now();
        $client = $this->clients->findWithFamilyInformation($clientId);

        if (! $client instanceof Client) {
            throw (new ModelNotFoundException)->setModel(Client::class, [$clientId]);
        }

        $clientInformation = $this->getClientInformation->execute($client, $generatedAt);
        $monthlyPension = (float) $calculation['monthly_pension'];
        $financing = $calculation['financing'];
        $projection = $calculation['projection'];

        $pensionScenario = $this->getPensionScenario->execute(
            monthlyPension: $monthlyPension,
            contributedWeeks: (float) $calculation['contributed_weeks'],
            averageDailySalary: (float) $calculation['average_daily_salary'],
            birthdate: $client->birthdate,
            asOf: $generatedAt,
        );
        $projectCost = $this->getProjectCost->execute(
            monthlyPension: $monthlyPension,
            retroactiveModality40: (float) $financing['pagoRetroactivo'],
            modality10: (float) $calculation['modality_10_value'],
            unemploymentAssistance: (float) $financing['pagoAyudaDeDesempleo'],
            lifeInsurance: (float) $financing['seguroDeVida'],
            clientContribution: (float) $financing['aportacionCliente'],
            totalFinancing: (float) $calculation['total_financing'],
        );
        $recoveredResources = $this->getRecoveredResources->execute(
            monthlyPension: $monthlyPension,
            pensionRetroactive: (float) $calculation['pension_retroactive'],
            modality40Return: (float) $calculation['modality_40_recovered_amount'],
            aforeAndInfonavit: (float) $projection['retirement97Sar92'],
        );
        $freeCapital = $this->getFreeCapital->execute(
            $recoveredResources['total_recovered_resources'],
            $projectCost['total_project_cost'],
        );

        $proposal = new PensionProposalDTO(
            client: $clientInformation,
            pensionScenario: $pensionScenario,
            projectCost: $projectCost,
            recoveredResources: $recoveredResources,
            freeCapital: $freeCapital,
            generatedAt: $generatedAt,
        );

        return new GeneratedPdfDTO(
            contents: $this->pdf->generate($proposal),
            filename: 'propuesta-pension-'.Str::slug($clientInformation['full_name']).'.pdf',
        );
    }
}
