<?php

use App\Models\Client;
use App\Models\ClientFamilyInformation;
use App\Models\User;

test('client search includes family information', function () {
    $user = User::factory()->create();
    $client = Client::query()->create([
        'name' => 'Maria',
        'last_name' => 'Lopez',
        'curp' => 'LOMM800101HDFPRR09',
        'birthdate' => '1980-01-01',
        'nss' => '12345678901',
        'unemployment_assistance_discounted_weeks' => 0,
    ]);

    ClientFamilyInformation::query()->create([
        'client_id' => $client->id,
        'has_spouse' => true,
        'minor_or_student_children_count' => 2,
        'parents_count' => 1,
    ]);

    $response = $this
        ->actingAs($user)
        ->getJson(route('calculate.clients.search', ['search' => 'Maria']));

    $response
        ->assertOk()
        ->assertJsonPath('clients.0.id', $client->id)
        ->assertJsonPath('clients.0.family_information.has_spouse', true)
        ->assertJsonPath('clients.0.family_information.minor_or_student_children_count', 2)
        ->assertJsonPath('clients.0.family_information.parents_count', 1);
});

test('calculate store accepts an existing client id', function () {
    $user = User::factory()->create();
    $client = Client::query()->create([
        'name' => 'Maria',
        'curp' => 'LOMM800101HDFPRR09',
        'birthdate' => '1980-01-01',
        'nss' => '12345678901',
        'unemployment_assistance_discounted_weeks' => 0,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('calculate.store'), [
            'client_id' => $client->id,
        ]);

    $response->assertRedirect(route('calculate'));
    $this->assertDatabaseCount('clients', 1);
    $this->assertDatabaseCount('client_family_information', 0);
});

test('calculate store rejects a missing existing client id', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('calculate'))
        ->post(route('calculate.store'), [
            'client_id' => 999,
        ]);

    $response
        ->assertRedirect(route('calculate'))
        ->assertSessionHasErrors('client_id');
});

test('calculate store rejects missing required new client fields', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('calculate'))
        ->post(route('calculate.store'), [
            'client_id' => null,
            'client' => [
                'name' => '',
                'curp' => '',
            ],
        ]);

    $response
        ->assertRedirect(route('calculate'))
        ->assertSessionHasErrors([
            'client.name',
            'client.curp',
            'client.birthdate',
            'client.nss',
            'client.unemployment_assistance_discounted_weeks',
            'family_information.has_spouse',
            'family_information.minor_or_student_children_count',
            'family_information.parents_count',
        ]);
});

test('calculate store creates a new client from required client fields', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('calculate.store'), [
            'client_id' => null,
            'client' => [
                'name' => 'Alfredo',
                'last_name' => 'Palacios',
                'phone' => '(55) 1234-5678',
                'curp' => 'paaa800101hdflll09',
                'birthdate' => '1980-01-01',
                'nss' => '12345678901',
                'regime_end_date' => '2024-12-31',
                'unemployment_assistance_discounted_weeks' => '4',
                'notes' => 'Cliente nuevo para calculo.',
            ],
            'family_information' => [
                'has_spouse' => '1',
                'minor_or_student_children_count' => '2',
                'parents_count' => '1',
            ],
        ]);

    $response->assertRedirect(route('calculate'));

    $this->assertDatabaseHas('clients', [
        'name' => 'Alfredo',
        'last_name' => 'Palacios',
        'phone' => '5512345678',
        'curp' => 'PAAA800101HDFLLL09',
        'birthdate' => '1980-01-01 00:00:00',
        'nss' => '12345678901',
        'regime_end_date' => '2024-12-31 00:00:00',
        'unemployment_assistance_discounted_weeks' => 4,
        'notes' => 'Cliente nuevo para calculo.',
    ]);

    $this->assertDatabaseHas('client_family_information', [
        'has_spouse' => true,
        'minor_or_student_children_count' => 2,
        'parents_count' => 1,
    ]);
});

test('calculate store rejects invalid client contact formats', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('calculate'))
        ->post(route('calculate.store'), [
            'client_id' => null,
            'client' => [
                'name' => 'Alfredo',
                'phone' => '55 1234',
                'email' => 'alfredo',
                'curp' => 'CURP_INVALIDA',
                'birthdate' => now()->addDay()->toDateString(),
                'nss' => '123',
                'unemployment_assistance_discounted_weeks' => '-1',
            ],
            'family_information' => [
                'has_spouse' => '1',
                'minor_or_student_children_count' => '-1',
                'parents_count' => '-1',
            ],
        ]);

    $response
        ->assertRedirect(route('calculate'))
        ->assertSessionHasErrors([
            'client.phone',
            'client.email',
            'client.curp',
            'client.birthdate',
            'client.nss',
            'client.unemployment_assistance_discounted_weeks',
            'family_information.minor_or_student_children_count',
            'family_information.parents_count',
        ]);
});

test('calculate store rejects a new client under 18 years old', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('calculate'))
        ->post(route('calculate.store'), [
            'client_id' => null,
            'client' => [
                'name' => 'Menor',
                'curp' => 'PAAA800101HDFLLL09',
                'birthdate' => now()->subYears(18)->addDay()->toDateString(),
                'nss' => '12345678901',
                'unemployment_assistance_discounted_weeks' => '0',
            ],
            'family_information' => [
                'has_spouse' => '0',
                'minor_or_student_children_count' => '0',
                'parents_count' => '0',
            ],
        ]);

    $response
        ->assertRedirect(route('calculate'))
        ->assertSessionHasErrors('client.birthdate');
});

test('calculate store rejects regime end date that is not after birthdate', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('calculate'))
        ->post(route('calculate.store'), [
            'client_id' => null,
            'client' => [
                'name' => 'Alfredo',
                'curp' => 'PAAA800101HDFLLL09',
                'birthdate' => '1980-01-01',
                'nss' => '12345678901',
                'regime_end_date' => '1980-01-01',
                'unemployment_assistance_discounted_weeks' => '0',
            ],
            'family_information' => [
                'has_spouse' => '0',
                'minor_or_student_children_count' => '0',
                'parents_count' => '0',
            ],
        ]);

    $response
        ->assertRedirect(route('calculate'))
        ->assertSessionHasErrors('client.regime_end_date');
});

test('calculate store rejects regime end date that is not after eighteenth birthday', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('calculate'))
        ->post(route('calculate.store'), [
            'client_id' => null,
            'client' => [
                'name' => 'Alfredo',
                'curp' => 'PAAA800101HDFLLL09',
                'birthdate' => '1980-01-01',
                'nss' => '12345678901',
                'regime_end_date' => '1998-01-01',
                'unemployment_assistance_discounted_weeks' => '0',
            ],
            'family_information' => [
                'has_spouse' => '0',
                'minor_or_student_children_count' => '0',
                'parents_count' => '0',
            ],
        ]);

    $response
        ->assertRedirect(route('calculate'))
        ->assertSessionHasErrors('client.regime_end_date');
});
