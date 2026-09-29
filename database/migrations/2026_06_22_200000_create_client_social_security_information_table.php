<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_social_security_information', static function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('nss', 11)->unique();
            $table->date('regime_end_date')->nullable();
            $table->unsignedInteger('unemployment_assistance_discounted_weeks')->default(0);
            $table->unsignedInteger('total_contributed_weeks')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_social_security_information');
    }
};
