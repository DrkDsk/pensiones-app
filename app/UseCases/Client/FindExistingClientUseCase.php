<?php

namespace App\UseCases\Client;

use App\Models\Client;
use App\Repositories\Contract\ClientRepositoryInterface;

readonly class FindExistingClientUseCase
{
    public function __construct(
        private ClientRepositoryInterface $clientRepository,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): ?Client
    {
        return $this->clientRepository->findExistingClient($data);
    }
}
