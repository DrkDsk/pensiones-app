<?php

namespace App\UseCases\Client;

use App\Exceptions\ClientExistsException;
use App\Models\Client;
use App\Models\ClientSocialSecurityInformation;
use App\Repositories\Contract\ClientRepositoryInterface;
use App\Repositories\Contract\ClientSocialSecurityInformationRepositoryInterface;
use App\Support\ClientValidationRules;
use Illuminate\Support\Facades\DB;
use LogicException;
use Throwable;

readonly class CreateClientUseCase
{
    public function __construct(
        private FindExistingClientUseCase $findExistingClient,
        private ClientRepositoryInterface $clientRepository,
        private ClientSocialSecurityInformationRepositoryInterface $socialSecurityInformationRepository,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     *
     * @throws Throwable
     */
    public function execute(array $data): Client
    {
        if (isset($data['client']['curp']) && is_string($data['client']['curp'])) {
            $data['client']['curp'] = ClientValidationRules::normalizeCurp($data['client']['curp']);
        }

        if ($this->findExistingClient->execute($data) instanceof Client) {
            throw new ClientExistsException;
        }

        return DB::transaction(function () use ($data): Client {
            $client = $this->clientRepository->create($data['client']);

            if (! $client instanceof Client) {
                throw new LogicException('The client repository did not return a client.');
            }

            $socialSecurityInformation = $this->socialSecurityInformationRepository->create([
                'client_id' => $client->id,
                ...$data['social_security_information'],
            ]);

            if (! $socialSecurityInformation instanceof ClientSocialSecurityInformation) {
                throw new LogicException('The social security information repository did not return a model.');
            }

            return $client->setRelation('socialSecurityInformation', $socialSecurityInformation);
        });
    }
}
