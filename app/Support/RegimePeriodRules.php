<?php

namespace App\Support;

final class RegimePeriodRules
{
    public static function rules(string $prefix = 'regime_periods')
    {
        return [
            $prefix => [
                'required',
                'array',
                'min:1',
            ],

            "{$prefix}.*.regime_type" => [
                'required',
                'string',
                'in:custom,modalidad_40,modalidad_10',
            ],

            "{$prefix}.*.regime_name" => [
                'required',
                'string',
            ],

            "{$prefix}.*.contribution_start_date" => [
                'required',
                'date_format:Y-m-d',
            ],

            "{$prefix}.*.contribution_end_date" => [
                'required',
                'date_format:Y-m-d',
            ],

            "{$prefix}.*.time" => [
                'required',
                'numeric',
                'min:0',
            ],

            "{$prefix}.*.integrated_balance" => [
                'required',
                'numeric',
                'min:0',
            ],

            "{$prefix}.*.is_fixed" => [
                'required',
                'boolean',
            ],
        ];
    }
}
