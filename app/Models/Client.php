<?php

namespace App\Models;

use App\Support\ClientValidationRules;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property CarbonImmutable $birthdate
 */
class Client extends Model
{
    protected $fillable = [
        'name',
        'last_name',
        'phone',
        'email',
        'curp',
        'birthdate',
        'notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'birthdate' => 'date',
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

    /**
     * @return HasOne<ClientSocialSecurityInformation, $this>
     */
    public function socialSecurityInformation(): HasOne
    {
        return $this->hasOne(ClientSocialSecurityInformation::class);
    }
}
