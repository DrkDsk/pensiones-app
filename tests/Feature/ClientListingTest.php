<?php

use App\Models\Client;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

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

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('client listing page receives registered clients through inertia props', function () {
    createClientsForListing(3);

    $this->get(route('clients.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Clients/Index')
            ->has('clients.data', 3)
            ->where('clients.data.0.name', 'Client 1')
            ->has('clients.data.0', fn (Assert $client) => $client
                ->hasAll('id', 'name', 'last_name', 'phone', 'email', 'curp', 'birthdate', 'nss')
                ->etc())
            ->has('clients.links')
            ->has('clients.meta'));
});

test('client listing page paginates fifteen clients per page', function () {
    createClientsForListing(20);

    $this->get(route('clients.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Clients/Index')
            ->has('clients.data', 15)
            ->where('clients.meta.per_page', 15)
            ->where('clients.meta.total', 20)
            ->where('clients.meta.last_page', 2));
});

test('client listing page receives the remaining clients on the second page', function () {
    createClientsForListing(20);

    $this->get(route('clients.index', ['page' => 2]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Clients/Index')
            ->has('clients.data', 5)
            ->where('clients.meta.current_page', 2)
            ->where('clients.meta.from', 16)
            ->where('clients.meta.to', 20)
            ->where('clients.meta.total', 20));
});

test('client listing page receives an empty paginated collection', function () {
    $this->get(route('clients.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Clients/Index')
            ->where('clients.data', [])
            ->where('clients.meta.current_page', 1)
            ->where('clients.meta.per_page', 15)
            ->where('clients.meta.total', 0));
});

test('client listing page requires authentication', function () {
    auth()->logout();

    $this->get(route('clients.index'))
        ->assertRedirect(route('login'));
});
