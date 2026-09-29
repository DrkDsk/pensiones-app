<?php

namespace App\Repositories\Contract;

use App\Models\Client;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ClientRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function findExistingClient(array $data): ?Client;

    public function findWithFamilyInformation(int $clientId): ?Client;

    /**
     * @return LengthAwarePaginator<int, Client>
     */
    public function paginateWithSocialSecurityInformation(int $perPage = 10): LengthAwarePaginator;

    /**
     * @return Collection<int, Client>
     */
    public function searchByTerm(string $term, int $limit = 10): Collection;
}
