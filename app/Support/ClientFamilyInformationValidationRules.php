<?php

namespace App\Support;

final class ClientFamilyInformationValidationRules
{
    /**
     * @return array<int, string>
     */
    public static function information(): array
    {
        return ['array'];
    }

    /**
     * @return array<int, string>
     */
    public static function hasSpouse(): array
    {
        return ['boolean'];
    }

    /**
     * @return array<int, string>
     */
    public static function dependentCount(): array
    {
        return ['integer', 'min:0'];
    }

    /**
     * @return array<string, string>
     */
    public static function attributes(string $prefix = ''): array
    {
        return [
            $prefix.'has_spouse' => 'esposo/a',
            $prefix.'minor_or_student_children_count' => 'hijos menores o estudiando',
            $prefix.'parents_count' => 'padres',
        ];
    }
}
