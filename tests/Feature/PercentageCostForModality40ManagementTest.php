<?php

use App\Models\PercentageCostForModality40;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('percentage management page receives records through inertia props', function () {
    createPercentageCost(['year' => 2025, 'percentage' => 13.347]);
    createPercentageCost(['year' => 2024, 'percentage' => 12.256]);

    $this->get(route('percentage.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Percentage/Index')
            ->has('percentages.data', 2)
            ->where('percentages.data.0.year', 2024)
            ->where('percentages.data.0.percentage', 12.256)
            ->has('percentages.data.0', fn (Assert $percentage) => $percentage
                ->hasAll('id', 'year', 'percentage')));
});

test('percentage management page requires authentication', function () {
    auth()->logout();

    $this->get(route('percentage.index'))
        ->assertRedirect(route('login'));
});

test('a percentage cost can be created', function () {
    $this->from(route('percentage.index'))
        ->post(route('cesantia.percentage-costs.store'), [
            'year' => 2031,
            'percentage' => 19.891,
        ])
        ->assertRedirect(route('percentage.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('percentage_cost_for_modality_40', [
        'year' => 2031,
        'percentage' => 19.891,
    ]);
});

test('invalid percentage cost data is rejected', function () {
    $this->post(route('cesantia.percentage-costs.store'), [
        'year' => 1899,
        'percentage' => -1,
    ])->assertSessionHasErrors(['year', 'percentage']);

    $this->assertDatabaseCount('percentage_cost_for_modality_40', 0);
});

test('a duplicate year cannot be created', function () {
    PercentageCostForModality40::query()->create([
        'year' => 2031,
        'percentage' => 19.891,
    ]);

    $this->post(route('cesantia.percentage-costs.store'), [
        'year' => 2031,
        'percentage' => 20.981,
    ])->assertSessionHasErrors('year');

    $this->assertDatabaseCount('percentage_cost_for_modality_40', 1);
});

test('the year can be updated', function () {
    $percentageCost = createPercentageCost();

    $this->from(route('percentage.index'))
        ->put(route('cesantia.percentage-costs.update', $percentageCost), [
            'year' => 2032,
            'percentage' => 19.891,
        ])
        ->assertRedirect(route('percentage.index'));

    $this->assertDatabaseHas('percentage_cost_for_modality_40', [
        'id' => $percentageCost->id,
        'year' => 2032,
    ]);
});

test('the percentage can be updated', function () {
    $percentageCost = createPercentageCost();

    $this->put(route('cesantia.percentage-costs.update', $percentageCost), [
        'year' => 2031,
        'percentage' => 20.981,
    ])->assertSessionHasNoErrors();

    $this->assertDatabaseHas('percentage_cost_for_modality_40', [
        'id' => $percentageCost->id,
        'percentage' => 20.981,
    ]);
});

test('a record can keep its own year when updated', function () {
    $percentageCost = createPercentageCost();

    $this->put(route('cesantia.percentage-costs.update', $percentageCost), [
        'year' => 2031,
        'percentage' => 20.981,
    ])->assertSessionHasNoErrors();
});

test('a record cannot use another records year', function () {
    createPercentageCost(['year' => 2031]);
    $percentageCost = createPercentageCost(['year' => 2032]);

    $this->put(route('cesantia.percentage-costs.update', $percentageCost), [
        'year' => 2031,
        'percentage' => 20.981,
    ])->assertSessionHasErrors('year');

    expect($percentageCost->fresh()?->year)->toBe(2032);
});

test('a percentage cost can be deleted', function () {
    $percentageCost = createPercentageCost();

    $this->from(route('percentage.index'))
        ->delete(route('cesantia.percentage-costs.destroy', $percentageCost))
        ->assertRedirect(route('percentage.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('percentage_cost_for_modality_40', [
        'id' => $percentageCost->id,
    ]);
});

/**
 * @param  array<string, mixed>  $overrides
 */
function createPercentageCost(array $overrides = []): PercentageCostForModality40
{
    return PercentageCostForModality40::query()->create(array_merge([
        'year' => 2031,
        'percentage' => 19.891,
    ], $overrides));
}
