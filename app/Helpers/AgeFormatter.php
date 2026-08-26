<?php

namespace App\Helpers;

use Carbon\CarbonInterface;

class AgeFormatter
{
    public static function format(CarbonInterface $birthdate, CarbonInterface $asOf): string
    {
        if ($birthdate->isAfter($asOf)) {
            return 'No disponible';
        }

        $difference = $birthdate->diff($asOf);
        $years = $difference->y;
        $months = $difference->m;
        $formattedYears = $years.' '.($years === 1 ? 'año' : 'años');

        if ($months === 0) {
            return $formattedYears;
        }

        return $formattedYears.', '.$months.' '.($months === 1 ? 'mes' : 'meses');
    }
}
