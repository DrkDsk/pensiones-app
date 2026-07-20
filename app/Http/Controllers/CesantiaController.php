<?php

namespace App\Http\Controllers;

use App\Models\Cesantia;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CesantiaController extends Controller
{
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
}
