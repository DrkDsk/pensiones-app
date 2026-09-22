<?php

namespace App\Providers;

use App\Repositories\Contract\ClientFamilyInformationRepositoryInterface;
use App\Repositories\Contract\ClientRepositoryInterface;
use App\Repositories\Contract\PercentageCostForModality40RepositoryInterface;
use App\Repositories\Eloquent\ClientFamilyInformationRepository;
use App\Repositories\Eloquent\ClientRepository;
use App\Repositories\Eloquent\PercentageCostForModality40Repository;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(ClientRepositoryInterface::class, ClientRepository::class);
        $this->app->bind(ClientFamilyInformationRepositoryInterface::class, ClientFamilyInformationRepository::class);
        $this->app->bind(
            PercentageCostForModality40RepositoryInterface::class,
            PercentageCostForModality40Repository::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
