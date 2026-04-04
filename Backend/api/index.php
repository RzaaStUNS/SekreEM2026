<?php

// --- CHEAT CODE CORS VERCEL (WAJIB PALING ATAS) ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Cegat preflight request (OPTIONS) dari browser dan langsung kasih izin 200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// --------------------------------------------------

// Paksa respon JSON agar tidak error View
$_SERVER['HTTP_ACCEPT'] = 'application/json';

// Panggil Autoload
require __DIR__ . '/../vendor/autoload.php';

// Booting Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';

// FIX VERCEL READ-ONLY: Alihkan storage ke /tmp
$storagePath = '/tmp/storage';
if (!is_dir($storagePath)) {
    mkdir($storagePath, 0777, true);
    mkdir("$storagePath/framework/views", 0777, true);
    mkdir("$storagePath/framework/sessions", 0777, true);
    mkdir("$storagePath/framework/cache", 0777, true);
}
$app->useStoragePath($storagePath);

// Jalankan Kernel
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);
$response->send();
$kernel->terminate($request, $response);
