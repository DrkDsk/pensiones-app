<?php

namespace App\Http\Controllers;

use App\Http\Requests\GetPercentageCostsForModality40Request;
use App\UseCases\Calculate\GetPercentageCostByYearsUseCase;
use Illuminate\Http\JsonResponse;

class PercentageCostModality40Controller extends Controller
{
    public function index(
        GetPercentageCostsForModality40Request $request, GetPercentageCostByYearsUseCase $useCase): JsonResponse
    {
        $percentages = $useCase->execute(
            $request->validated('years'),
        );

        return response()->json([
            'message' => 'Porcentajes obtenidos correctamente',
            'data' => $percentages,
        ]);
    }
}
