<?php

namespace App\Http\Controllers;

use App\Http\Requests\PercentageCostForModality40\StorePercentageCostForModality40Request;
use App\Http\Requests\PercentageCostForModality40\UpdatePercentageCostForModality40Request;
use App\Models\Cesantia;
use App\Models\PercentageCostForModality40;
use App\UseCases\Cesantia\CreatePercentageCostForModality40UseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CesantiaController extends Controller
{
    public function __construct(
        private readonly CreatePercentageCostForModality40UseCase $createPercentageCost,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'age' => 'required',
        ]);

        $age = round($request->input('age'), 2);

        return response()->json([
            'message' => 'Cesantia obtenida correctamente',
            'data' => Cesantia::findPercentageByAge($age),
        ]);
    }

    public function store(StorePercentageCostForModality40Request $request): RedirectResponse
    {
        $this->createPercentageCost->execute($request->validated());

        return redirect()
            ->back()
            ->with('success', 'Costo porcentual de Modalidad 40 registrado correctamente.');
    }

    public function update(
        UpdatePercentageCostForModality40Request $request,
        PercentageCostForModality40 $percentageCostForModality40,
    ): RedirectResponse {
        $percentageCostForModality40->update($request->validated());

        return redirect()
            ->back()
            ->with('success', 'Costo porcentual de Modalidad 40 actualizado correctamente.');
    }

    public function destroy(PercentageCostForModality40 $percentageCostForModality40): RedirectResponse
    {
        $percentageCostForModality40->delete();

        return redirect()
            ->back()
            ->with('success', 'Costo porcentual de Modalidad 40 eliminado correctamente.');
    }
}
