<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientSocialSecurityInformation extends Model
{
    protected $table = 'client_social_security_information';

    protected $fillable = [
        'client_id',
        'nss',
        'regime_end_date',
        'unemployment_assistance_discounted_weeks',
        'total_contributed_weeks',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'regime_end_date' => 'date',
            'unemployment_assistance_discounted_weeks' => 'integer',
            'total_contributed_weeks' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Client, $this>
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
