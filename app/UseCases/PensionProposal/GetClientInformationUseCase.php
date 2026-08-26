<?php

namespace App\UseCases\PensionProposal;

use App\Helpers\AgeFormatter;
use App\Models\Client;
use App\Models\ClientFamilyInformation;
use Carbon\CarbonImmutable;

class GetClientInformationUseCase
{
    /**
     * @return array<string, mixed>
     */
    public function execute(Client $client, CarbonImmutable $asOf): array
    {
        $familyInformation = $client->familyInformation;
        $childrenCount = $familyInformation?->minor_or_student_children_count;

        return [
            'full_name' => trim(implode(' ', array_filter([$client->name, $client->last_name]))),
            'curp' => $client->curp,
            'nss' => $client->nss,
            'birthdate' => $client->birthdate,
            'age' => AgeFormatter::format($client->birthdate, $asOf),
            'marital_status' => $this->maritalStatus($familyInformation),
            'children' => $childrenCount === null
                ? 'No disponible'
                : ($childrenCount === 0 ? 'No aplica' : (string) $childrenCount),
            'parents' => $familyInformation?->parents_count,
        ];
    }

    private function maritalStatus(?ClientFamilyInformation $familyInformation): string
    {
        if (! $familyInformation instanceof ClientFamilyInformation) {
            return 'No registrado';
        }

        return $familyInformation->has_spouse
            ? 'Con cónyuge registrado'
            : 'Sin cónyuge registrado';
    }
}
