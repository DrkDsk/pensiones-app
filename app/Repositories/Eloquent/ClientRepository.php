<?php

namespace App\Repositories\Eloquent;

use App\Models\Client;
use App\Repositories\Contract\ClientRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

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

        $clientData = is_array($data['client'] ?? null) ? $data['client'] : $data;

        foreach (['phone', 'email', 'curp'] as $field) {
            if (array_key_exists($field, $clientData) && $clientData[$field] !== null && $clientData[$field] !== '') {
                $criteria[$field] = $clientData[$field];
            }
        }

        $socialSecurityInformation = is_array($data['social_security_information'] ?? null)
            ? $data['social_security_information']
            : [];
        $nss = $socialSecurityInformation['nss'] ?? null;

        if ($criteria === [] && ($nss === null || $nss === '')) {
            return null;
        }

        return Client::query()
            ->where(function ($query) use ($criteria, $nss): void {
                foreach ($criteria as $field => $value) {
                    $query->orWhere($field, $value);
                }

                if ($nss !== null && $nss !== '') {
                    $query->orWhereHas(
                        'socialSecurityInformation',
                        fn ($query) => $query->where('nss', $nss),
                    );
                }
            })
            ->first();
    }

    public function findWithFamilyInformation(int $clientId): ?Client
    {
        return Client::query()
            ->with(['familyInformation', 'socialSecurityInformation'])
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
            ->with(['familyInformation', 'socialSecurityInformation'])
            ->when($normalizedTerm !== '', function ($query) use ($normalizedTerm): void {
                $query->where(function ($query) use ($normalizedTerm): void {
                    $query
                        ->where('name', 'like', "%{$normalizedTerm}%")
                        ->orWhere('last_name', 'like', "%{$normalizedTerm}%")
                        ->orWhere('phone', 'like', "%{$normalizedTerm}%")
                        ->orWhere('email', 'like', "%{$normalizedTerm}%")
                        ->orWhere('curp', 'like', "%{$normalizedTerm}%")
                        ->orWhereHas(
                            'socialSecurityInformation',
                            fn ($query) => $query->where('nss', 'like', "%{$normalizedTerm}%"),
                        );
                });
            })
            ->orderBy('name')
            ->limit($limit)
            ->get();

        return $clients;
    }

    /**
     * @return LengthAwarePaginator<int, Client>
     */
    public function paginateWithSocialSecurityInformation(int $perPage = 10): LengthAwarePaginator
    {
        return Client::query()
            ->with('socialSecurityInformation')
            ->paginate($perPage);
    }
}
