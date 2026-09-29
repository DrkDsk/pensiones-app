<?php

namespace App\Repositories\Eloquent;

use App\Models\ClientSocialSecurityInformation;
use App\Repositories\Contract\ClientSocialSecurityInformationRepositoryInterface;

class ClientSocialSecurityInformationRepository extends BaseRepository implements ClientSocialSecurityInformationRepositoryInterface
{
    public function __construct(ClientSocialSecurityInformation $model)
    {
        parent::__construct($model);
    }
}
