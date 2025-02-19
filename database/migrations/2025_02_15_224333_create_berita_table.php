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
        Schema::create('berita', function (Blueprint $table) {
            $table->uuid('id');
            $table->string('judul');
            $table->string('slug')->unique();
            $table->string('deskripsi');
            $table->text('prasyarat');
            $table->text('konten');

            $table->foreignUuid('admin_id')->nullable()->constrained('admin')->nullOnDelete();
            $table->foreignUuid('laboratorium_id')->nullable()->constrained('laboratorium')->nullOnDelete();
            $table->foreignUuid('jenis_praktikum_id')->nullable()->constrained('jenis_praktikum')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('berita');
    }
};
