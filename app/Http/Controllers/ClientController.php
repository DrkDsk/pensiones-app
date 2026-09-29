<?php

namespace App\Http\Controllers;

use App\Exceptions\ClientExistsException;
use App\Http\Requests\Client\StoreClientRequest;
use App\Http\Resources\ClientExistsResource;
use App\Http\Resources\ClientResource;
use App\UseCases\Client\CreateClientFamilyInformationUseCase;
use App\UseCases\Client\CreateClientUseCase;
use App\UseCases\Client\FindExistingClientUseCase;
use App\UseCases\Client\GetClientsUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class ClientController extends Controller
{
    public function __construct(
        private readonly CreateClientUseCase $createClient,
        private readonly CreateClientFamilyInformationUseCase $createClientFamilyInformation,
        protected readonly FindExistingClientUseCase $findExistingClient,
        private readonly GetClientsUseCase $getClients,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Clients/Index', [
            'clients' => ClientResource::collection($this->getClients->execute()),
        ]);
    }

    public function store(StoreClientRequest $request): RedirectResponse|JsonResponse
    {
        try {
            $validated = $request->validated();
            $clientData = [
                'client' => $validated['client'],
                'social_security_information' => $validated['social_security_information'],
            ];
            /** @var array<string, mixed> $familyInformation */
            $familyInformation = $validated['family_information'];

            $client = DB::transaction(function () use ($clientData, $familyInformation) {
                $client = $this->createClient->execute($clientData);

                $this->createClientFamilyInformation->execute(
                    $client,
                    $familyInformation,
                );

                return $client;
            });
        } catch (ClientExistsException $exception) {
            if ($request->expectsJson()) {
                return response()->json(
                    (new ClientExistsResource($exception))->resolve($request),
                    HttpResponse::HTTP_CONFLICT,
                );
            }

            return redirect()
                ->back()
                ->withErrors([
                    'client_exists' => (new ClientExistsResource($exception))->resolve($request)['message'],
                ]);
        }

        if ($request->expectsJson()) {
            $client->loadMissing('familyInformation');

            return (new ClientResource($client))
                ->response()
                ->setStatusCode(HttpResponse::HTTP_CREATED);
        }

        return redirect()
            ->route('clients.index')
            ->with('success', 'Cliente registrado correctamente.');
    }
}
