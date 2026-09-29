<?php

namespace App\UseCases\Calculate;

use App\Models\Client;
use App\Models\ClientFamilyInformation;
use App\Models\ClientSocialSecurityInformation;
use App\Repositories\Contract\ClientFamilyInformationRepositoryInterface;
use App\Repositories\Contract\ClientRepositoryInterface;
use App\Repositories\Contract\ClientSocialSecurityInformationRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Throwable;

readonly class StoreCalculateUseCase
{
    public function __construct(
        private ClientRepositoryInterface $clientRepository,
        private ClientFamilyInformationRepositoryInterface $clientFamilyInformationRepository,
        private ClientSocialSecurityInformationRepositoryInterface $socialSecurityInformationRepository,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     *
     * @throws Throwable
     */
    public function execute(array $data): Client
    {
        return DB::transaction(function () use ($data): Client {
            if (! empty($data['client_id'])) {
                $client = $this->clientRepository->find((int) $data['client_id']);

                if (! $client instanceof Client) {
                    throw (new ModelNotFoundException)->setModel(Client::class, [$data['client_id']]);
                }

                return $client;
            }

            $client = $this->clientRepository->create($this->clientData($data));

            if (! $client instanceof Client) {
                throw new ModelNotFoundException;
            }

            $socialSecurityInformation = $this->socialSecurityInformationRepository->create(
                $this->socialSecurityInformationData($data, $client),
            );

            if (! $socialSecurityInformation instanceof ClientSocialSecurityInformation) {
                throw new ModelNotFoundException;
            }

            $familyInformation = $this->clientFamilyInformationRepository->create(
                $this->familyInformationData($data, $client),
            );

            if (! $familyInformation instanceof ClientFamilyInformation) {
                throw new ModelNotFoundException;
            }

            return $client;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function clientData(array $data): array
    {
        $client = is_array($data['client'] ?? null) ? $data['client'] : [];
        $allowedFields = array_flip([
            'name',
            'last_name',
            'phone',
            'email',
            'curp',
            'birthdate',
            'notes',
        ]);

        $clientData = array_intersect_key($client, $allowedFields);

        foreach ($clientData as $field => $value) {
            $clientData[$field] = $value === '' ? null : $value;
        }

        return $clientData;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function socialSecurityInformationData(array $data, Client $client): array
    {
        $socialSecurityInformation = is_array($data['social_security_information'] ?? null)
            ? $data['social_security_information']
            : [];

        $allowedFields = array_flip([
            'nss',
            'regime_end_date',
            'unemployment_assistance_discounted_weeks',
            'total_contributed_weeks',
        ]);

        return [
            'client_id' => $client->id,
            ...array_intersect_key($socialSecurityInformation, $allowedFields),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function familyInformationData(array $data, Client $client): array
    {
        $familyInformation = is_array($data['family_information'] ?? null)
            ? $data['family_information']
            : [];

        $allowedFields = array_flip([
            'has_spouse',
            'minor_or_student_children_count',
            'parents_count',
        ]);

        return [
            'client_id' => $client->id,
            ...array_intersect_key($familyInformation, $allowedFields),
        ];
    }
}
