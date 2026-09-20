<?php

use App\Exceptions\ClientExistsException;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use App\UseCases\Client\CreateClientUseCase;
use App\UseCases\Client\FindExistingClientUseCase;

function validClientData(array $overrides = []): array
{
    return array_merge([
        'name' => 'Maria',
        'last_name' => 'Lopez',
        'phone' => '5512345678',
        'email' => 'maria@example.com',
        'curp' => 'LOMM800101HDFPRR09',
        'birthdate' => '1980-01-01',
        'nss' => '12345678901',
        'regime_end_date' => null,
        'unemployment_assistance_discounted_weeks' => 0,
        'notes' => null,
    ], $overrides);
}

test('creates a client when none of the identifying fields exists', function () {
    $client = app(CreateClientUseCase::class)->execute(validClientData());

    expect($client)->toBeInstanceOf(Client::class);
    $this->assertDatabaseHas('clients', ['id' => $client->id]);
});

it('throws when an identifying field already belongs to a client', function (string $field, string $value) {
    Client::query()->create(validClientData());

    $newData = validClientData([
        'phone' => '5587654321',
        'email' => 'other@example.com',
        'curp' => 'GODE900202MDFNRS08',
        'nss' => '10987654321',
        $field => $value,
    ]);

    expect(fn () => app(CreateClientUseCase::class)->execute($newData))
        ->toThrow(ClientExistsException::class);
})->with([
    'phone' => ['phone', '5512345678'],
    'email' => ['email', 'maria@example.com'],
    'curp' => ['curp', 'LOMM800101HDFPRR09'],
    'nss' => ['nss', '12345678901'],
]);

test('a null phone does not match another null phone', function () {
    Client::query()->create(validClientData(['phone' => null]));

    $client = app(CreateClientUseCase::class)->execute(validClientData([
        'phone' => null,
        'email' => 'other@example.com',
        'curp' => 'GODE900202MDFNRS08',
        'nss' => '10987654321',
    ]));

    expect($client)->toBeInstanceOf(Client::class);
    $this->assertDatabaseCount('clients', 2);
});

test('a null email does not match another null email', function () {
    Client::query()->create(validClientData(['email' => null]));

    $client = app(CreateClientUseCase::class)->execute(validClientData([
        'phone' => '5587654321',
        'email' => null,
        'curp' => 'GODE900202MDFNRS08',
        'nss' => '10987654321',
    ]));

    expect($client)->toBeInstanceOf(Client::class);
    $this->assertDatabaseCount('clients', 2);
});

test('find existing client returns the matching client', function () {
    $existing = Client::query()->create(validClientData());

    $found = app(FindExistingClientUseCase::class)->execute([
        'curp' => $existing->curp,
        'nss' => '10987654321',
    ]);

    expect($found?->is($existing))->toBeTrue();
});

test('find existing client returns null when no field matches', function () {
    Client::query()->create(validClientData());

    $found = app(FindExistingClientUseCase::class)->execute([
        'phone' => null,
        'email' => null,
        'curp' => 'GODE900202MDFNRS08',
        'nss' => '10987654321',
    ]);

    expect($found)->toBeNull();
});

test('creation endpoint returns a resource with http 422 for an existing client', function () {
    Client::query()->create(validClientData());

    $this->postJson(route('clients.store'), validClientData())
        ->assertUnprocessable()
        ->assertJsonPath('data.message', ClientExistsException::DEFAULT_MESSAGE);
});

test('creation endpoint returns a client resource after creating a client', function () {
    $response = $this->postJson(route('clients.store'), validClientData());

    $response
        ->assertCreated()
        ->assertJsonPath('data.name', 'Maria')
        ->assertJsonPath('data.curp', 'LOMM800101HDFPRR09')
        ->assertJsonStructure([
            'data' => array_keys((new ClientResource(new Client))->resolve()),
        ]);

    $this->assertDatabaseCount('clients', 1);
});
