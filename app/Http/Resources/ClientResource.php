<?php

namespace App\Http\Resources;

use App\Models\Client;
use DateTimeInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Client $client */
        $client = $this->resource;

        return [
            'id' => $client->id,
            'name' => $client->name,
            'last_name' => $client->last_name,
            'phone' => $client->phone,
            'email' => $client->email,
            'curp' => $client->curp,
            'birthdate' => $this->formatDate($client->birthdate),
            'nss' => $client->nss,
            'regime_end_date' => $this->formatDate($client->regime_end_date),
            'unemployment_assistance_discounted_weeks' => $client->unemployment_assistance_discounted_weeks,
            'notes' => $client->notes,
            'created_at' => $client->created_at?->toISOString(),
            'updated_at' => $client->updated_at?->toISOString(),
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
