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
        Schema::create('praktikum_praktikan', function (Blueprint $table) {
            $table->foreignUuid('praktikum_id')->constrained('praktikum')->cascadeOnDelete();
            $table->foreignUuid('praktikan_id')->constrained('praktikan')->cascadeOnDelete();
            $table->foreignUuid('aslab_id')->nullable()->constrained('aslab')->nullOnDelete();
            $table->foreignUuid('dosen_id')->nullable()->constrained('dosen')->nullOnDelete();
            $table->foreignUuid('sesi_praktikum_id')->nullable()->constrained('sesi_praktikum')->nullOnDelete();
            $table->string('krs')->nullable();
            $table->string('pembayaran')->nullable();
            $table->string('modul')->nullable();
            $table->boolean('terverifikasi')->default(false);
            $table->string('pengembalian')->nullable();
            $table->boolean('lulus')->nullable();

            $table->primary(['praktikum_id', 'praktikan_id']);
            $table->timestamps();
            $table->softDeletes();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('praktikum_praktikan');
    }
};
