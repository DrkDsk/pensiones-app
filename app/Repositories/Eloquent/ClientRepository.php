<?php

namespace App\Repositories\Eloquent;

use App\Models\Client;
use App\Repositories\Contract\ClientRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ClientRepository extends BaseRepository implements ClientRepositoryInterface
{
    public function __construct(Client $model)
    {
        parent::__construct($model);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function findExistingClient(array $data): ?Client
    {
        $criteria = [];

        foreach (['phone', 'email', 'curp', 'nss'] as $field) {
            if (array_key_exists($field, $data) && $data[$field] !== null && $data[$field] !== '') {
                $criteria[$field] = $data[$field];
            }
        }

        if ($criteria === []) {
            return null;
        }

        return Client::query()
            ->where(function ($query) use ($criteria): void {
                foreach ($criteria as $field => $value) {
                    $query->orWhere($field, $value);
                }
            })
            ->first();
    }

    public function findWithFamilyInformation(int $clientId): ?Client
    {
        return Client::query()
            ->with('familyInformation')
            ->find($clientId);
    }

    /**
     * @return Collection<int, Client>
     */
    public function searchByTerm(string $term, int $limit = 10): Collection
    {
        $normalizedTerm = trim($term);

        /** @var Collection<int, Client> $clients */
        $clients = Client::query()
            ->with('familyInformation')
            ->when($normalizedTerm !== '', function ($query) use ($normalizedTerm): void {
                $query->where(function ($query) use ($normalizedTerm): void {
                    $query
                        ->where('name', 'like', "%{$normalizedTerm}%")
                        ->orWhere('last_name', 'like', "%{$normalizedTerm}%")
                        ->orWhere('phone', 'like', "%{$normalizedTerm}%")
                        ->orWhere('email', 'like', "%{$normalizedTerm}%")
                        ->orWhere('curp', 'like', "%{$normalizedTerm}%");
                });
            })
            ->orderBy('name')
            ->limit($limit)
            ->get();

        return $clients;
    }
}
