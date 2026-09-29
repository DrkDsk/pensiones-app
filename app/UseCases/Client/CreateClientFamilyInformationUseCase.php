<?php

namespace App\UseCases\Client;

use App\Models\Client;

final readonly class CreateClientFamilyInformationUseCase
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Client $client, array $data): void
    {
        $client->familyInformation()->create($data);
    }
}
