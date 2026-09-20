<?php

namespace App\Http\Requests\Client;

use App\Support\ClientValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('curp'))) {
            $this->merge([
                'curp' => ClientValidationRules::normalizeCurp($this->input('curp')),
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'phone' => ClientValidationRules::phone(),
            'email' => ['nullable', 'email', 'max:255'],
            'curp' => ClientValidationRules::curp(),
            'birthdate' => ['required', 'date'],
            'nss' => ClientValidationRules::nss(),
            'regime_end_date' => ['nullable', 'date'],
            'unemployment_assistance_discounted_weeks' => ['required', 'integer', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return ClientValidationRules::messages();
    }
}
