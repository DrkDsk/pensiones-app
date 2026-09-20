<?php

namespace App\UseCases\Client;

use App\Exceptions\ClientExistsException;
use App\Models\Client;
use App\Repositories\Contract\ClientRepositoryInterface;
use App\Support\ClientValidationRules;
use LogicException;

readonly class CreateClientUseCase
{
    public function __construct(
        private FindExistingClientUseCase $findExistingClient,
        private ClientRepositoryInterface $clientRepository,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): Client
    {
        if (isset($data['curp']) && is_string($data['curp'])) {
            $data['curp'] = ClientValidationRules::normalizeCurp($data['curp']);
        }

        if ($this->findExistingClient->execute($data) instanceof Client) {
            throw new ClientExistsException;
        }

        $client = $this->clientRepository->create($data);

        if (! $client instanceof Client) {
            throw new LogicException('The client repository did not return a client.');
        }

        return $client;
    }
}
