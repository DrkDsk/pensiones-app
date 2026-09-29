<?php

namespace App\Http\Resources;

use App\Models\ClientSocialSecurityInformation;
use DateTimeInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientSocialSecurityInformationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var ClientSocialSecurityInformation $information */
        $information = $this->resource;

        return [
            'nss' => $information->nss,
            'regime_end_date' => $this->formatDate($information->regime_end_date),
            'unemployment_assistance_discounted_weeks' => $information->unemployment_assistance_discounted_weeks,
            'total_contributed_weeks' => $information->total_contributed_weeks,
        ];
    }

    private function formatDate(mixed $value): ?string
    {
        if ($value instanceof DateTimeInterface) {
            return $value->format('Y-m-d');
        }

        return is_string($value) ? $value : null;
    }
}
