<?php

use App\Models\Client;
use App\Models\ClientFamilyInformation;
use App\Models\ClientSocialSecurityInformation;
use App\Models\User;
use App\UseCases\Calculate\SearchClientsUseCase;
use Inertia\Testing\AssertableInertia as Assert;

test('calculate page includes eager loaded client information', function () {
    $user = User::factory()->create();
    $client = Client::query()->create([
        'name' => 'Juan',
        'last_name' => 'Perez',
        'curp' => 'PEPJ800101HDFRRL09',
        'birthdate' => '1980-01-01',
    ]);

    ClientSocialSecurityInformation::query()->create([
        'client_id' => $client->id,
        'nss' => '98765432101',
        'regime_end_date' => '2024-12-31',
        'unemployment_assistance_discounted_weeks' => 4,
        'total_contributed_weeks' => 1200,
    ]);

    ClientFamilyInformation::query()->create([
        'client_id' => $client->id,
        'has_spouse' => true,
        'minor_or_student_children_count' => 2,
        'parents_count' => 0,
    ]);

    $loadedClient = app(SearchClientsUseCase::class)
        ->execute('', 6)
        ->firstWhere('id', $client->id);

    expect($loadedClient)->not->toBeNull()
        ->and($loadedClient->relationLoaded('socialSecurityInformation'))->toBeTrue()
        ->and($loadedClient->relationLoaded('familyInformation'))->toBeTrue()
        ->and($loadedClient->socialSecurityInformation?->nss)->toBe('98765432101')
        ->and($loadedClient->familyInformation?->has_spouse)->toBeTrue();

    $this->actingAs($user)
        ->get(route('calculate'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Calculate')
            ->where('clients.0.id', $client->id)
            ->where('clients.0.social_security_information.nss', '98765432101')
            ->where('clients.0.social_security_information.total_contributed_weeks', 1200)
            ->where('clients.0.family_information.has_spouse', true)
            ->where('clients.0.family_information.minor_or_student_children_count', 2)
            ->where('clients.0.family_information.parents_count', 0));
});

test('client search includes family information', function () {
    $user = User::factory()->create();
    $client = Client::query()->create([
        'name' => 'Maria',
        'last_name' => 'Lopez',
        'curp' => 'LOMM800101HDFPRR09',
        'birthdate' => '1980-01-01',
    ]);

    ClientSocialSecurityInformation::query()->create([
        'client_id' => $client->id,
        'nss' => '12345678901',
        'unemployment_assistance_discounted_weeks' => 0,
        'total_contributed_weeks' => 1200,
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
    $response->assertJsonPath(
        'clients.0.social_security_information.nss',
        '12345678901',
    );

    $this->actingAs($user)
        ->getJson(route('calculate.clients.search', ['search' => '12345678901']))
        ->assertOk()
        ->assertJsonPath('clients.0.id', $client->id);
});

test('calculate store accepts an existing client id', function () {
    $user = User::factory()->create();
    $client = Client::query()->create([
        'name' => 'Maria',
        'curp' => 'LOMM800101HDFPRR09',
        'birthdate' => '1980-01-01',
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
            'social_security_information.nss',
            'social_security_information.unemployment_assistance_discounted_weeks',
            'social_security_information.total_contributed_weeks',
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
                'phone' => '5512345678',
                'curp' => 'paaa800101hdflll09',
                'birthdate' => '1980-01-01',
                'notes' => 'Cliente nuevo para calculo.',
            ],
            'social_security_information' => [
                'nss' => '12345678901',
                'regime_end_date' => '2024-12-31',
                'unemployment_assistance_discounted_weeks' => '4',
                'total_contributed_weeks' => '1200',
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
        'notes' => 'Cliente nuevo para calculo.',
    ]);

    $this->assertDatabaseHas('client_social_security_information', [
        'nss' => '12345678901',
        'regime_end_date' => '2024-12-31 00:00:00',
        'unemployment_assistance_discounted_weeks' => 4,
        'total_contributed_weeks' => 1200,
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
            ],
            'social_security_information' => [
                'nss' => '123',
                'unemployment_assistance_discounted_weeks' => '-1',
                'total_contributed_weeks' => '-1',
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
            'social_security_information.nss',
            'social_security_information.unemployment_assistance_discounted_weeks',
            'social_security_information.total_contributed_weeks',
            'family_information.minor_or_student_children_count',
            'family_information.parents_count',
        ]);
});

test('calculate store does not strip formatting from phone or nss', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('calculate'))
        ->post(route('calculate.store'), [
            'client_id' => null,
            'client' => [
                'name' => 'Alfredo',
                'phone' => '961-123-4567',
                'curp' => 'GOCG850101HDFRRN09',
                'birthdate' => '1985-01-01',
            ],
            'social_security_information' => [
                'nss' => '12345-678901',
                'unemployment_assistance_discounted_weeks' => '0',
                'total_contributed_weeks' => '1200',
            ],
            'family_information' => [
                'has_spouse' => '0',
                'minor_or_student_children_count' => '0',
                'parents_count' => '0',
            ],
        ]);

    $response
        ->assertRedirect(route('calculate'))
        ->assertSessionHasErrors([
            'client.phone',
            'social_security_information.nss',
        ]);

    $this->assertDatabaseCount('clients', 0);
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
            ],
            'social_security_information' => [
                'nss' => '12345678901',
                'unemployment_assistance_discounted_weeks' => '0',
                'total_contributed_weeks' => '1200',
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
            ],
            'social_security_information' => [
                'nss' => '12345678901',
                'regime_end_date' => '1980-01-01',
                'unemployment_assistance_discounted_weeks' => '0',
                'total_contributed_weeks' => '1200',
            ],
            'family_information' => [
                'has_spouse' => '0',
                'minor_or_student_children_count' => '0',
                'parents_count' => '0',
            ],
        ]);

    $response
        ->assertRedirect(route('calculate'))
        ->assertSessionHasErrors('social_security_information.regime_end_date');
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
            ],
            'social_security_information' => [
                'nss' => '12345678901',
                'regime_end_date' => '1998-01-01',
                'unemployment_assistance_discounted_weeks' => '0',
                'total_contributed_weeks' => '1200',
            ],
            'family_information' => [
                'has_spouse' => '0',
                'minor_or_student_children_count' => '0',
                'parents_count' => '0',
            ],
        ]);

    $response
        ->assertRedirect(route('calculate'))
        ->assertSessionHasErrors('social_security_information.regime_end_date');
});
