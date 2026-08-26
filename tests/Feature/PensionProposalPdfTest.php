<?php

use App\Models\Client;
use App\Models\ClientFamilyInformation;

function pensionProposalPayload(): array
{
    return [
        'monthly_pension' => 35855.20,
        'contributed_weeks' => 1457,
        'average_daily_salary' => 1862.71,
        'modality_10_value' => 16426.84,
        'total_financing' => 369251.62,
        'pension_retroactive' => 156411.83,
        'modality_40_recovered_amount' => 40058.08,
        'financing' => [
            'pagoRetroactivo' => 246204.82,
            'pagoAyudaDeDesempleo' => 93860.61,
            'seguroDeVida' => 12759.35,
            'aportacionCliente' => 0,
        ],
        'projection' => [
            'retirement97Sar92' => 552903.42,
        ],
    ];
}

test('pension proposal endpoint downloads a pdf for an existing client', function () {
    $client = Client::query()->create([
        'name' => 'José Alfredo',
        'last_name' => 'Palacios',
        'curp' => 'PAAA650315HQTRLR00',
        'birthdate' => '1965-03-15',
        'nss' => '14816514849',
        'unemployment_assistance_discounted_weeks' => 0,
    ]);

    ClientFamilyInformation::query()->create([
        'client_id' => $client->id,
        'has_spouse' => true,
        'minor_or_student_children_count' => 2,
        'parents_count' => 1,
    ]);

    $response = $this->postJson(
        route('clients.pension-proposal.pdf', $client->id),
        pensionProposalPayload(),
    );

    $response
        ->assertOk()
        ->assertHeader('content-type', 'application/pdf')
        ->assertDownload('propuesta-pension-jose-alfredo-palacios.pdf');

    expect($response->getContent())->toStartWith('%PDF-');
});

test('pension proposal endpoint returns not found for an unknown client', function () {
    $this->postJson(route('clients.pension-proposal.pdf', 999), pensionProposalPayload())
        ->assertNotFound();
});

test('pension proposal endpoint accepts zero calculation values', function () {
    $client = Client::query()->create([
        'name' => 'Cliente',
        'birthdate' => '1965-03-15',
        'curp' => 'PAAA650315HQTRLR00',
        'nss' => '14816514849',
        'unemployment_assistance_discounted_weeks' => 0,
    ]);
    $payload = pensionProposalPayload();
    $payload['monthly_pension'] = 0;
    $payload['financing']['aportacionCliente'] = 0;

    $this->postJson(route('clients.pension-proposal.pdf', $client->id), $payload)
        ->assertOk();
});
