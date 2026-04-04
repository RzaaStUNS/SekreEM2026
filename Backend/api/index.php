<?php

// --- CHEAT CODE CORS ULTIMATE ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Cegat preflight request (OPTIONS) dari browser
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Paksa respon JSON agar tidak error View
$_SERVER['HTTP_ACCEPT'] = 'application/json';

// 1. Bikin folder /tmp/storage duluan SEBELUM Laravel nyala
$storagePath = '/tmp/storage';
if (!is_dir($storagePath)) {
    mkdir($storagePath, 0777, true);
    mkdir("$storagePath/framework/views", 0777, true);
    mkdir("$storagePath/framework/sessions", 0777, true);
    mkdir("$storagePath/framework/cache", 0777, true);
}

// 2. Belokin paksa cache bootstrap ke folder /tmp yang udah dibikin
$_SERVER['APP_SERVICES_CACHE'] = '/tmp/storage/framework/cache/services.php';
$_SERVER['APP_PACKAGES_CACHE'] = '/tmp/storage/framework/cache/packages.php';
$_SERVER['APP_CONFIG_CACHE'] = '/tmp/storage/framework/cache/config.php';
$_SERVER['APP_ROUTES_CACHE'] = '/tmp/storage/framework/cache/routes.php';
$_SERVER['APP_EVENTS_CACHE'] = '/tmp/storage/framework/cache/events.php';

// Panggil Autoload
require __DIR__ . '/../vendor/autoload.php';

// Booting Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Set storage path ke /tmp
$app->useStoragePath($storagePath);

// Jalankan Kernel
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);
$response->send();
$kernel->terminate($request, $response);
