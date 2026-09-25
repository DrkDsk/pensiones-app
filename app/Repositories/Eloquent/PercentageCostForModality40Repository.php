<?php

namespace App\Repositories\Eloquent;

use App\Models\PercentageCostForModality40;
use App\Repositories\Contract\PercentageCostForModality40RepositoryInterface;

class PercentageCostForModality40Repository extends BaseRepository implements PercentageCostForModality40RepositoryInterface
{
    public function __construct(PercentageCostForModality40 $model)
    {
        parent::__construct($model);
    }
}
