<?php

namespace App\Models;

use App\Support\ClientValidationRules;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Client extends Model
{
    protected $fillable = [
        'name',
        'last_name',
        'phone',
        'email',
        'curp',
        'birthdate',
        'nss',
        'regime_end_date',
        'unemployment_assistance_discounted_weeks',
        'notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'birthdate' => 'date',
            'regime_end_date' => 'date',
            'unemployment_assistance_discounted_weeks' => 'integer',
        ];
    }

    /**
     * @return Attribute<string, string>
     */
    protected function curp(): Attribute
    {
        return Attribute::make(
            set: ClientValidationRules::normalizeCurp(...),
        );
    }

    /**
     * @return HasOne<ClientFamilyInformation, $this>
     */
    public function familyInformation(): HasOne
    {
        return $this->hasOne(ClientFamilyInformation::class);
    }
}
