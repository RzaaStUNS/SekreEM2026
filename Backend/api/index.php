<?php
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
