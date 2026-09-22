<?php

namespace App\Http\Controllers;

use App\Exceptions\ClientExistsException;
use App\Http\Requests\Client\StoreClientRequest;
use App\Http\Resources\ClientExistsResource;
use App\Http\Resources\ClientResource;
use App\UseCases\Client\CreateClientUseCase;
use App\UseCases\Client\FindExistingClientUseCase;
use App\UseCases\Client\GetClientsUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class ClientController extends Controller
{
    public function __construct(
        private readonly CreateClientUseCase $createClient,
        protected readonly FindExistingClientUseCase $findExistingClient,
        private readonly GetClientsUseCase $getClients,
    ) {}

    public function index(): AnonymousResourceCollection
    {
        return ClientResource::collection($this->getClients->execute());
    }

    public function store(StoreClientRequest $request): JsonResponse
    {
        try {
            $client = $this->createClient->execute($request->validated());
        } catch (ClientExistsException $exception) {
            return (new ClientExistsResource($exception))
                ->response()
                ->setStatusCode(Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return (new ClientResource($client))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
}
