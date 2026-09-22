<?php

namespace App\Http\Controllers;

use App\Exceptions\ClientExistsException;
use App\Http\Requests\Client\StoreClientRequest;
use App\Http\Resources\ClientExistsResource;
use App\Http\Resources\ClientResource;
use App\UseCases\Client\CreateClientUseCase;
use App\UseCases\Client\FindExistingClientUseCase;
use App\UseCases\Client\GetClientsUseCase;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function __construct(
        private readonly CreateClientUseCase $createClient,
        protected readonly FindExistingClientUseCase $findExistingClient,
        private readonly GetClientsUseCase $getClients,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Clients/Index', [
            'clients' => ClientResource::collection($this->getClients->execute()),
        ]);
    }

    public function store(StoreClientRequest $request): RedirectResponse
    {
        try {
            $client = $this->createClient->execute($request->validated());
        } catch (ClientExistsException $exception) {
            return redirect()
                ->back()
                ->withErrors([
                    'client_exists' => (new ClientExistsResource($exception))->resolve($request)['message'],
                ]);
        }

        return redirect()
            ->route('clients.index')
            ->with('success', 'Cliente registrado correctamente.');
    }
}
