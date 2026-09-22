<?php

use App\Models\Client;

function clientListingData(int $index): array
{
    return [
        'name' => "Client {$index}",
        'last_name' => "Last name {$index}",
        'phone' => str_pad((string) $index, 10, '0', STR_PAD_LEFT),
        'email' => "client{$index}@example.com",
        'curp' => 'GOCG850101HDFRRN09',
        'birthdate' => '1985-01-01',
        'nss' => str_pad((string) $index, 11, '0', STR_PAD_LEFT),
        'regime_end_date' => null,
        'unemployment_assistance_discounted_weeks' => 0,
        'notes' => null,
    ];
}

function createClientsForListing(int $count): void
{
    foreach (range(1, $count) as $index) {
        Client::query()->create(clientListingData($index));
    }
}

test('client listing endpoint returns registered clients', function () {
    createClientsForListing(3);

    $this->getJson(route('clients.index'))
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonPath('data.0.name', 'Client 1')
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'last_name',
                    'phone',
                    'email',
                    'curp',
                    'birthdate',
                    'nss',
                ],
            ],
            'links',
            'meta',
        ]);
});

test('client listing endpoint paginates fifteen clients per page', function () {
    createClientsForListing(20);

    $this->getJson(route('clients.index'))
        ->assertOk()
        ->assertJsonCount(15, 'data')
        ->assertJsonPath('meta.per_page', 15)
        ->assertJsonPath('meta.total', 20)
        ->assertJsonPath('meta.last_page', 2);
});

test('client listing endpoint returns the remaining clients on the second page', function () {
    createClientsForListing(20);

    $this->getJson(route('clients.index', ['page' => 2]))
        ->assertOk()
        ->assertJsonCount(5, 'data')
        ->assertJsonPath('meta.current_page', 2)
        ->assertJsonPath('meta.from', 16)
        ->assertJsonPath('meta.to', 20)
        ->assertJsonPath('meta.total', 20);
});

test('client listing endpoint returns an empty paginated collection', function () {
    $this->getJson(route('clients.index'))
        ->assertOk()
        ->assertJsonPath('data', [])
        ->assertJsonPath('meta.current_page', 1)
        ->assertJsonPath('meta.per_page', 15)
        ->assertJsonPath('meta.total', 0);
});
