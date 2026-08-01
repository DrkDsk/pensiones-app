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
        Schema::create('cesantias', static function (Blueprint $table) {
            $table->id();
            $table->decimal('minimum_age', 5);
            $table->decimal('maximum_age', 5)->nullable();
            $table->decimal('percentage', 5);
            $table->timestamps();

            $table->index(['minimum_age', 'maximum_age']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cesantia');
    }
};
