<?php

// 1. Panggil Autoload (Otak Laravel)
require __DIR__ . '/../vendor/autoload.php';

// 2. Mulai Aplikasi
$app = require_once __DIR__ . '/../bootstrap/app.php';

// --- PENTING: MENGATASI READ-ONLY VERCEL ---
// Kita paksa Laravel menggunakan folder sementara (/tmp) 
// untuk menyimpan cache, log, dan session.
$storagePath = '/tmp/storage';

if (!is_dir($storagePath)) {
    mkdir($storagePath, 0777, true);
}

// Redirect path storage ke /tmp
$app->useStoragePath($storagePath);
// -------------------------------------------

// 3. Jalankan Kernel (Standar Laravel)
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$response->send();

$kernel->terminate($request, $response);
