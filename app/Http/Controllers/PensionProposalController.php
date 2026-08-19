<?php

namespace App\Http\Controllers;

use App\Actions\PensionProposal\GeneratePensionProposalAction;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class PensionProposalController extends Controller
{
    public function __invoke(int $clientId, GeneratePensionProposalAction $generateProposal): Response
    {
        $pdf = $generateProposal->execute($clientId);

        return response($pdf->contents, ResponseAlias::HTTP_OK, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$pdf->filename.'"',
            'Content-Length' => (string) strlen($pdf->contents),
        ]);
    }
}
