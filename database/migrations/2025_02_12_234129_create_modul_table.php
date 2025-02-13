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
        Schema::create('modul', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama');
            $table->string('topik');
            $table->foreignUuid('pertemuan_id')->constrained('pertemuan')->cascadeOnDelete();

            $table->unique(['pertemuan_id', 'nama']);
            $table->timestamps();
            $table->softDeletes();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modul');
    }
};
