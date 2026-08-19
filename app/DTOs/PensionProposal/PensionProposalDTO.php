<?php

namespace App\DTOs\PensionProposal;

use Carbon\CarbonImmutable;

readonly class PensionProposalDTO
{
    /**
     * @param  array<string, mixed>  $client
     * @param  array<string, mixed>  $pensionScenario
     * @param  array<string, float>  $projectCost
     * @param  array<string, float>  $recoveredResources
     */
    public function __construct(
        public array $client,
        public array $pensionScenario,
        public array $projectCost,
        public array $recoveredResources,
        public float $freeCapital,
        public CarbonImmutable $generatedAt,
    ) {}
}
