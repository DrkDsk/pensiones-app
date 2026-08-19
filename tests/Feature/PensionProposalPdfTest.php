<?php

use App\Models\Client;
use App\Models\ClientFamilyInformation;

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

    $response = $this->getJson(route('clients.pension-proposal.pdf', $client->id));

    $response
        ->assertOk()
        ->assertHeader('content-type', 'application/pdf')
        ->assertDownload('propuesta-pension-jose-alfredo-palacios.pdf');

    expect($response->getContent())->toStartWith('%PDF-');
});

test('pension proposal endpoint returns not found for an unknown client', function () {
    $this->getJson(route('clients.pension-proposal.pdf', 999))
        ->assertNotFound();
});
