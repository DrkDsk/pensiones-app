<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clients', static function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('last_name')->nullable();
            $table->string('phone', 10)->nullable()->index();
            $table->string('email')->nullable()->index();
            $table->string('curp', 18);
            $table->date('birthdate');
            $table->string('nss', 11);
            $table->date('regime_end_date')->nullable();
            $table->unsignedInteger('unemployment_assistance_discounted_weeks');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['phone', 'email']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
