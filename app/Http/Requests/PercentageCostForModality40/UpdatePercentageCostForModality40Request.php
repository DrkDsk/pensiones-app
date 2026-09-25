<?php

namespace App\Http\Requests\PercentageCostForModality40;

use App\Models\PercentageCostForModality40;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePercentageCostForModality40Request extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var PercentageCostForModality40|null $percentageCost */
        $percentageCost = $this->route('percentageCostForModality40');

        return [
            'year' => [
                'required',
                'integer',
                'between:1900,2100',
                Rule::unique('percentage_cost_for_modality_40', 'year')->ignore($percentageCost),
            ],
            'percentage' => ['required', 'numeric', 'decimal:0,3', 'between:0,99.999'],
        ];
    }
}
