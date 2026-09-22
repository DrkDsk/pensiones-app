<?php

namespace App\UseCases\Client;

use App\Models\Client;
use App\Repositories\Contract\ClientRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

readonly class GetClientsUseCase
{
    public function __construct(
        private ClientRepositoryInterface $clientRepository,
    ) {}

    /**
     * @return LengthAwarePaginator<int, Client>
     */
    public function execute(): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, Client> $clients */
        $clients = $this->clientRepository->paginate(15);

        return $clients;
    }
}
