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
        Schema::create('jawaban_kuis', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('jawaban');
            $table->foreignUuid('soal_kuis_id')->constrained('soal_kuis')->cascadeOnDelete();
            $table->boolean('status')->nullable();
            $table->timestamps();

            $table->index('soal_kuis_id');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jawaban_kuis');
    }
};
