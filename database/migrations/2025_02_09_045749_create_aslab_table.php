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
        Schema::create('aslab', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama');
            $table->string('no_hp')->nullable();
            $table->string('avatar')->nullable();
            $table->string('jabatan');
            $table->boolean('aktif')->default(true);
            $table->string('username')->unique();
            $table->string('password');
            $table->foreignUuid('laboratorium_id')->constrained('laboratorium')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aslab');
    }
};
