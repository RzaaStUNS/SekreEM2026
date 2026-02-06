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
        Schema::create('prokers', function (Blueprint $table) {
            $table->id(); // ID otomatis
            $table->string('name'); // Nama Proker
            $table->string('division'); // Divisi (bendahara, sekum, dll)
            $table->date('startDate'); // Tanggal Mulai
            $table->date('endDate'); // Tanggal Selesai
            $table->string('time')->nullable(); // Waktu (boleh kosong)
            $table->text('description')->nullable(); // Deskripsi (boleh kosong)
            $table->string('link')->nullable(); // Link Dokumen (boleh kosong)
            $table->timestamps(); // Created_at & Updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prokers');
    }
};