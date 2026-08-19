<?php

namespace App\Helpers;

class CurrencyFormatter
{
    public static function format(float|int $amount): string
    {
        return '$'.number_format((float) $amount, 2, '.', ',');
    }
}
