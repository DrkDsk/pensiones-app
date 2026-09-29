<?php

namespace App\Http\Requests\Client;

use App\Support\ClientFamilyInformationValidationRules;
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
        $client = $this->input('client');

        if (is_array($client) && isset($client['curp']) && is_string($client['curp'])) {
            $this->merge([
                'client' => [
                    ...$client,
                    'curp' => ClientValidationRules::normalizeCurp($client['curp']),
                ],
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'client' => ['required', 'array'],
            'client.name' => ['required', 'string', 'max:255'],
            'client.last_name' => ['nullable', 'string', 'max:255'],
            'client.phone' => ClientValidationRules::phone(),
            'client.email' => ['nullable', 'email', 'max:255'],
            'client.curp' => ClientValidationRules::curp(),
            'client.birthdate' => ['required', 'date'],
            'client.notes' => ['nullable', 'string'],
            'social_security_information' => ['required', 'array'],
            'social_security_information.nss' => ClientValidationRules::nss(),
            'social_security_information.regime_end_date' => ['nullable', 'date'],
            'social_security_information.unemployment_assistance_discounted_weeks' => ['required', 'integer', 'min:0'],
            'social_security_information.total_contributed_weeks' => ['required', 'integer', 'min:0'],
            'family_information' => ['required', ...ClientFamilyInformationValidationRules::information()],
            'family_information.has_spouse' => ['required', ...ClientFamilyInformationValidationRules::hasSpouse()],
            'family_information.minor_or_student_children_count' => ['required', ...ClientFamilyInformationValidationRules::dependentCount()],
            'family_information.parents_count' => ['required', ...ClientFamilyInformationValidationRules::dependentCount()],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return ClientFamilyInformationValidationRules::attributes('family_information.');
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            ...ClientValidationRules::messages('client.'),
            ...ClientValidationRules::messages('social_security_information.'),
        ];
    }
}
