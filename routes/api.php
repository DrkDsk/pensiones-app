<?php

use App\Http\Controllers\CesantiaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', static function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('cesantia', [CesantiaController::class, 'index']);
