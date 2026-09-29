<?php

namespace App\Http\Controllers;

use App\Http\Requests\Calculate\StoreCalculateRequest;
use App\Http\Resources\ClientResource;
use App\UseCases\Calculate\SearchClientsUseCase;
use App\UseCases\Calculate\StoreCalculateUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class CalculateController extends Controller
{
    public function index(SearchClientsUseCase $searchClients): Response
    {
        return Inertia::render('Calculate', [
            'clients' => ClientResource::collection(
                $searchClients->execute('', 6),
            )->resolve(),
            'selectedClient' => null,
            'filters' => [
                'search' => '',
            ],
        ]);
    }

    public function searchClients(Request $request, SearchClientsUseCase $searchClients): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        return response()->json([
            'clients' => ClientResource::collection(
                $searchClients->execute((string) ($validated['search'] ?? '')),
            )->resolve(),
        ]);
    }

    /**
     * @throws Throwable
     */
    public function store(StoreCalculateRequest $request, StoreCalculateUseCase $storeCalculate): RedirectResponse
    {
        $storeCalculate->execute($request->validated());

        return to_route('calculate');
    }
}
