<?php

use App\Http\Controllers\CesantiaController;
use App\Http\Controllers\PercentageCostModality40Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', static function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('cesantia', [CesantiaController::class, 'index']);
Route::get('percentage-cost-modality-40', [PercentageCostModality40Controller::class, 'index']);
