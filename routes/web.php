<?php

use App\Http\Controllers\CalculateController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
    Route::inertia('clients', 'Clients/Index')->name('clients.index');
    Route::inertia('clients/store', 'Clients/Create')->name('clients.create');
    Route::get('calculate', [CalculateController::class, 'index'])->name('calculate');
    Route::get('calculate/clients/search', [CalculateController::class, 'searchClients'])
        ->name('calculate.clients.search');
    Route::post('calculate/store', [CalculateController::class, 'store'])->name('calculate.store');
});

require __DIR__.'/settings.php';
