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
        Schema::create('label_soal', function (Blueprint $table) {
            $table->foreignUuid('label_id')->constrained('label')->cascadeOnDelete();
            $table->foreignUuid('soal_id')->constrained('soal')->cascadeOnDelete();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('label_soal');
    }
};
