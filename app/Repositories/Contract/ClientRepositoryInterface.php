<?php

namespace App\Repositories\Contract;

use App\Models\Client;
use Illuminate\Database\Eloquent\Collection;

interface ClientRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @param array<string, mixed> $data
     */
    public function findExistingClient(array $data): ?Client;

    public function findWithFamilyInformation(int $clientId): ?Client;

    /**
     * @return Collection<int, Client>
     */
    public function searchByTerm(string $term, int $limit = 10): Collection;
}
