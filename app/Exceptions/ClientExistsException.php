<?php

namespace App\Exceptions;

use DomainException;

class ClientExistsException extends DomainException
{
    public const DEFAULT_MESSAGE = 'Ya existe un cliente con los datos proporcionados.';

    public function __construct()
    {
        parent::__construct(self::DEFAULT_MESSAGE);
    }
}
