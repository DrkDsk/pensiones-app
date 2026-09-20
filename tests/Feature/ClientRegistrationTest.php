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

test('create use case normalizes curp before checking duplicates', function () {
    Client::query()->create(validClientData([
        'curp' => 'GOCG850101HDFRRN09',
    ]));

    expect(fn () => app(CreateClientUseCase::class)->execute(validClientData([
        'phone' => '5587654321',
        'email' => 'other@example.com',
        'curp' => 'gocg850101hdfrrn09',
        'nss' => '10987654321',
    ])))->toThrow(ClientExistsException::class);
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

test('creation endpoint normalizes curp to uppercase', function () {
    $this->postJson(route('clients.store'), validClientData([
        'curp' => 'gocg850101hdfrrn09',
    ]))
        ->assertCreated()
        ->assertJsonPath('data.curp', 'GOCG850101HDFRRN09');

    $this->assertDatabaseHas('clients', [
        'curp' => 'GOCG850101HDFRRN09',
    ]);
});

it('rejects an invalid curp on creation', function (string $curp) {
    $this->postJson(route('clients.store'), validClientData(['curp' => $curp]))
        ->assertUnprocessable()
        ->assertJsonValidationErrors('curp');

    $this->assertDatabaseCount('clients', 0);
})->with([
    'too short' => 'ABC123',
    'arbitrary characters' => '123456789012345678',
    'seventeen characters' => 'GOCG850101HDFRRN0',
    'nineteen characters' => 'GOCG850101HDFRRN099',
]);

it('rejects an invalid nss on creation', function (string $nss) {
    $this->postJson(route('clients.store'), validClientData(['nss' => $nss]))
        ->assertUnprocessable()
        ->assertJsonValidationErrors('nss');

    $this->assertDatabaseCount('clients', 0);
})->with([
    'too short' => '1234567890',
    'too long' => '123456789012',
    'non-numeric' => '12345ABC901',
]);

it('rejects an invalid phone on creation', function (string $phone) {
    $this->postJson(route('clients.store'), validClientData(['phone' => $phone]))
        ->assertUnprocessable()
        ->assertJsonValidationErrors('phone');

    $this->assertDatabaseCount('clients', 0);
})->with([
    'too short' => '961123456',
    'too long' => '96112345678',
    'country code' => '+529611234567',
    'hyphens' => '961-123-4567',
    'letters' => 'abcdefghij',
]);

test('creation endpoint accepts valid mexican identifiers as strings', function () {
    $this->postJson(route('clients.store'), validClientData([
        'phone' => '9611234567',
        'curp' => 'GOCG850101HDFRRN09',
        'nss' => '12345678901',
    ]))->assertCreated();

    $this->assertDatabaseHas('clients', [
        'phone' => '9611234567',
        'curp' => 'GOCG850101HDFRRN09',
        'nss' => '12345678901',
    ]);
});
