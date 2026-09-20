<?php

namespace App\Support;

final class ClientValidationRules
{
    private const string CURP_REGEX = '/^[A-Z][AEIOUX][A-Z]{2}[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01])[HM](?:AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9][0-9]$/D';

    public static function normalizeCurp(string $curp): string
    {
        return strtoupper($curp);
    }

    /**
     * @return array<int, string>
     */
    public static function curp(bool $required = true): array
    {
        return [
            $required ? 'required' : 'nullable',
            'string',
            'size:18',
            'regex:'.self::CURP_REGEX,
        ];
    }

    /**
     * @return array<int, string>
     */
    public static function nss(bool $required = true): array
    {
        return [
            $required ? 'required' : 'nullable',
            'string',
            'size:11',
            'regex:/^[0-9]{11}$/D',
        ];
    }

    /**
     * @return array<int, string>
     */
    public static function phone(bool $required = false): array
    {
        return [
            $required ? 'required' : 'nullable',
            'string',
            'size:10',
            'regex:/^[0-9]{10}$/D',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function messages(string $prefix = ''): array
    {
        return [
            $prefix.'curp.size' => 'La CURP debe contener exactamente 18 caracteres.',
            $prefix.'curp.regex' => 'El formato de la CURP no es válido.',
            $prefix.'nss.size' => 'El NSS debe contener exactamente 11 dígitos.',
            $prefix.'nss.regex' => 'El NSS solamente puede contener números.',
            $prefix.'phone.size' => 'El teléfono debe contener exactamente 10 dígitos.',
            $prefix.'phone.regex' => 'El teléfono solamente puede contener números.',
        ];
    }
}
