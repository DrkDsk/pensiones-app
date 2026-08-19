<?php

namespace App\DTOs\PensionProposal;

readonly class GeneratedPdfDTO
{
    public function __construct(
        public string $contents,
        public string $filename,
    ) {}
}
