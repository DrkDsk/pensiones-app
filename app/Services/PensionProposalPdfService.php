<?php

namespace App\Services;

use App\DTOs\PensionProposal\PensionProposalDTO;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Contracts\View\Factory as ViewFactory;

readonly class PensionProposalPdfService
{
    public function __construct(
        private ViewFactory $views,
    ) {}

    public function generate(PensionProposalDTO $proposal): string
    {
        $options = new Options;
        $options->set('defaultFont', 'DejaVu Sans');
        $options->set('isRemoteEnabled', false);
        $options->set('isPhpEnabled', false);

        $dompdf = new Dompdf($options);
        $dompdf->setPaper('letter', 'portrait');
        $dompdf->loadHtml($this->views->make('pdf.pension-proposal', [
            'proposal' => $proposal,
        ])->render());
        $dompdf->render();

        return $dompdf->output();
    }
}
