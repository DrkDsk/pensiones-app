<?php

namespace App\UseCases\Cesantia;

use App\Models\PercentageCostForModality40;
use App\Repositories\Contract\PercentageCostForModality40RepositoryInterface;
use LogicException;

readonly class CreatePercentageCostForModality40UseCase
{
    public function __construct(
        private PercentageCostForModality40RepositoryInterface $percentageCostRepository,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): PercentageCostForModality40
    {
        $percentageCost = $this->percentageCostRepository->create($data);

        if (! $percentageCost instanceof PercentageCostForModality40) {
            throw new LogicException('The percentage cost repository did not return a percentage cost.');
        }

        return $percentageCost;
    }
}
