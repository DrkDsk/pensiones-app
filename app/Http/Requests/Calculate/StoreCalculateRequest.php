<?php

namespace App\Http\Requests\Calculate;

use App\Support\ClientValidationRules;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCalculateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $client = $this->input('client');

        if (! is_array($client)) {
            return;
        }

        if (isset($client['curp']) && is_string($client['curp'])) {
            $client['curp'] = ClientValidationRules::normalizeCurp($client['curp']);
        }

        $this->merge([
            'client' => $client,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $hasExistingClient = $this->filled('client_id');
        $eighteenthBirthday = $this->eighteenthBirthday();

        return [
            'client_id' => [
                'nullable',
                'integer',
                Rule::exists('clients', 'id'),
            ],
            'client' => [
                Rule::excludeIf($hasExistingClient),
                Rule::requiredIf(! $hasExistingClient),
                'array',
            ],
            'client.name' => [
                Rule::excludeIf($hasExistingClient),
                Rule::requiredIf(! $hasExistingClient),
                'nullable',
                'string',
                'max:255',
            ],
            'client.last_name' => [Rule::excludeIf($hasExistingClient), 'nullable', 'string', 'max:255'],
            'client.phone' => [
                Rule::excludeIf($hasExistingClient),
                ...ClientValidationRules::phone(),
            ],
            'client.email' => [
                Rule::excludeIf($hasExistingClient),
                'nullable',
                'string',
                'max:255',
                'email',
            ],
            'client.curp' => [
                Rule::excludeIf($hasExistingClient),
                Rule::requiredIf(! $hasExistingClient),
                ...ClientValidationRules::curp(required: false),
            ],
            'client.birthdate' => [
                Rule::excludeIf($hasExistingClient),
                Rule::requiredIf(! $hasExistingClient),
                'date',
                'before_or_equal:'.now()->subYears(18)->toDateString(),
            ],
            'client.nss' => [
                Rule::excludeIf($hasExistingClient),
                Rule::requiredIf(! $hasExistingClient),
                ...ClientValidationRules::nss(required: false),
            ],
            'client.regime_end_date' => [
                Rule::excludeIf($hasExistingClient),
                'nullable',
                'date',
                'after:client.birthdate',
                ...($eighteenthBirthday !== null ? ['after:'.$eighteenthBirthday] : []),
            ],
            'client.unemployment_assistance_discounted_weeks' => [
                Rule::excludeIf($hasExistingClient),
                Rule::requiredIf(! $hasExistingClient),
                'integer',
                'min:0',
            ],
            'client.notes' => [Rule::excludeIf($hasExistingClient), 'nullable', 'string'],
            'family_information' => [
                Rule::excludeIf($hasExistingClient),
                Rule::requiredIf(! $hasExistingClient),
                'array',
            ],
            'family_information.has_spouse' => [
                Rule::excludeIf($hasExistingClient),
                'required',
                'boolean',
            ],
            'family_information.minor_or_student_children_count' => [
                Rule::excludeIf($hasExistingClient),
                'required',
                'integer',
                'min:0',
            ],
            'family_information.parents_count' => [
                Rule::excludeIf($hasExistingClient),
                'required',
                'integer',
                'min:0',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'client_id' => 'cliente',
            'client.name' => 'nombre',
            'client.last_name' => 'apellidos',
            'client.phone' => 'telefono',
            'client.email' => 'correo electronico',
            'client.curp' => 'CURP',
            'client.birthdate' => 'fecha de nacimiento',
            'client.nss' => 'NSS',
            'client.regime_end_date' => 'fecha de baja de regimen',
            'client.unemployment_assistance_discounted_weeks' => 'semanas descontadas por ayuda de desempleo',
            'client.notes' => 'notas',
            'family_information.has_spouse' => 'esposo/a',
            'family_information.minor_or_student_children_count' => 'hijos menores o estudiando',
            'family_information.parents_count' => 'padres',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            ...ClientValidationRules::messages('client.'),
            'client.email.email' => 'El correo electronico debe tener un formato valido y un dominio existente.',
            'client.birthdate.before_or_equal' => 'El cliente debe tener al menos 18 anos cumplidos.',
            'client.regime_end_date.after' => 'La fecha de baja de regimen debe ser posterior a la fecha en que el cliente cumplio 18 anos.',
        ];
    }

    private function eighteenthBirthday(): ?string
    {
        $birthdate = $this->input('client.birthdate');

        if (! is_string($birthdate) || $birthdate === '') {
            return null;
        }

        try {
            return CarbonImmutable::parse($birthdate)->addYears(18)->toDateString();
        } catch (\Throwable) {
            return null;
        }
    }
}
