<?php

use Illuminate\Support\Facades\Route;

// Halaman welcome default (biarkan saja)
Route::get('/', function () {
    return view('welcome');
});

// Route /api/login JANGAN ADA DI SINI! (Sudah ada di routes/api.php)
// Route /sanctum/csrf-cookie JUGA HAPUS! (Kita tidak pakai cookie lagi)