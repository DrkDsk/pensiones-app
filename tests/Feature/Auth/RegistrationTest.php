<?php

use App\Models\User;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('guests are redirected to login from the registration screen', function () {
    $response = $this->get(route('register'));

    $response->assertRedirect(route('login'));
});

test('authenticated users can render the registration screen', function () {
    $response = $this
        ->actingAs(User::factory()->create())
        ->get(route('register'));

    $response->assertOk();
});

test('guests cannot register new users', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect(route('login'));
    $this->assertDatabaseMissing('users', ['email' => 'test@example.com']);
});

test('authenticated users can register new users', function () {
    $response = $this
        ->actingAs(User::factory()->create())
        ->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

    $this->assertAuthenticated();
    $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    $response->assertRedirect(route('dashboard', absolute: false));
});
