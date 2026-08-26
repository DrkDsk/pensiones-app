<?php

namespace App\Http\Requests\PensionProposal;

use Illuminate\Foundation\Http\FormRequest;

class GeneratePensionProposalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'monthly_pension' => ['present', 'numeric', 'min:0'],
            'contributed_weeks' => ['present', 'numeric', 'min:0'],
            'average_daily_salary' => ['present', 'numeric', 'min:0'],
            'modality_10_value' => ['present', 'numeric', 'min:0'],
            'total_financing' => ['present', 'numeric', 'min:0'],
            'pension_retroactive' => ['present', 'numeric', 'min:0'],
            'modality_40_recovered_amount' => ['present', 'numeric', 'min:0'],
            'financing' => ['present', 'array'],
            'financing.pagoRetroactivo' => ['present', 'numeric', 'min:0'],
            'financing.pagoAyudaDeDesempleo' => ['present', 'numeric', 'min:0'],
            'financing.seguroDeVida' => ['present', 'numeric', 'min:0'],
            'financing.aportacionCliente' => ['present', 'numeric', 'min:0'],
            'projection' => ['present', 'array'],
            'projection.retirement97Sar92' => ['present', 'numeric', 'min:0'],
        ];
    }
}
