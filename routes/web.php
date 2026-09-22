<?php

use App\Http\Controllers\CalculateController;
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
});

require __DIR__.'/settings.php';
