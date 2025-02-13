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
        Schema::create('dosen_laboratorium', function (Blueprint $table) {
            $table->foreignUuid('dosen_id')->constrained('dosen')->cascadeOnDelete();
            $table->foreignUuid('laboratorium_id')->constrained('laboratorium')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dosen_laboratorium');
    }
};
