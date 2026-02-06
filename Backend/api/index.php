<?php

// --- 1. BYPASS ZOMBIE CACHE (SOLUSI FINAL) ---
// Kita tipu Laravel agar mencari cache di folder /tmp (yang kosong).
// Ini akan memaksa Laravel mengabaikan file cache korup di folder read-only.
$tmpCache = '/tmp/bootstrap/cache';
if (!is_dir($tmpCache)) mkdir($tmpCache, 0777, true);

putenv("APP_CONFIG_CACHE={$tmpCache}/config.php");
putenv("APP_ROUTES_CACHE={$tmpCache}/routes.php");
putenv("APP_EVENTS_CACHE={$tmpCache}/events.php");
putenv("APP_SERVICES_CACHE={$tmpCache}/services.php");
putenv("APP_PACKAGES_CACHE={$tmpCache}/packages.php");

// --- 2. CONFIGURATION ---
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// --- 3. AUTOLOAD ---
require __DIR__ . '/../vendor/autoload.php';

try {
    // --- 4. BOOTSTRAP ---
    $app = require_once __DIR__ . '/../bootstrap/app.php';

    // --- 5. FIX STORAGE PATH (VERCEL READ-ONLY) ---
    // Paksa storage ke /tmp agar bisa nulis log & session
    $storage = '/tmp/storage';
    if (!is_dir($storage)) {
        mkdir($storage, 0777, true);
    }
    
    $app->useStoragePath($storage);
    
    // Buat struktur folder storage lengkap
    $subdirs = [
        'framework/views', 
        'framework/cache/data', 
        'framework/sessions', 
        'logs', 
        'app/public'
    ];
    foreach ($subdirs as $dir) {
        if (!is_dir("$storage/$dir")) mkdir("$storage/$dir", 0777, true);
    }

    // --- 6. RUN APP ---
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $response = $kernel->handle(
        $request = Illuminate\Http\Request::capture()
    );
    $response->send();
    $kernel->terminate($request, $response);

} catch (\Throwable $e) {
    // Error Handler JSON
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        "message" => "Server Error",
        "error" => $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ]);
}
