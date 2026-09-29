<?php

namespace App\Http\Resources;

use App\Models\ClientFamilyInformation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FamilyInformationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var ClientFamilyInformation $clientFamilyInformation */
        $clientFamilyInformation = $this->resource;

        return [
            'has_spouse' => $clientFamilyInformation->has_spouse,
            'minor_or_student_children_count' => $clientFamilyInformation->minor_or_student_children_count,
            'parents_count' => $clientFamilyInformation->parents_count,
        ];
    }
}
