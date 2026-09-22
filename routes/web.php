<?php

use App\Http\Controllers\CalculateController;
use App\Http\Controllers\CesantiaController;
use App\Http\Controllers\ClientController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
    Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
    Route::post('clients', [ClientController::class, 'store'])->name('clients.store');
    Route::inertia('clients/store', 'Clients/Create')->name('clients.create');
    Route::get('calculate', [CalculateController::class, 'index'])->name('calculate');
    Route::get('calculate/clients/search', [CalculateController::class, 'searchClients'])
        ->name('calculate.clients.search');
    Route::post('calculate/store', [CalculateController::class, 'store'])->name('calculate.store');
    Route::post('cesantia/percentage-costs', [CesantiaController::class, 'store'])
        ->name('cesantia.percentage-costs.store');
    Route::put('cesantia/percentage-costs/{percentageCostForModality40}', [CesantiaController::class, 'update'])
        ->name('cesantia.percentage-costs.update');
    Route::delete('cesantia/percentage-costs/{percentageCostForModality40}', [CesantiaController::class, 'destroy'])
        ->name('cesantia.percentage-costs.destroy');
});

require __DIR__.'/settings.php';
