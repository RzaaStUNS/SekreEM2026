<?php

// --- 1. FORCE JSON (OBAT AMPUH) ---
// Paksa Laravel menganggap ini request API. 
// Jadi kalau error, dia gak bakal cari class 'View', tapi langsung return JSON.
$_SERVER['HTTP_ACCEPT'] = 'application/json';

// --- 2. CONFIGURATION ---
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// --- 3. CACHE NUKE (PEMBERSIH CACHE) ---
// Hapus config cache yang sering bikin path error di Vercel
$cacheDir = __DIR__ . '/../bootstrap/cache';
if (is_dir($cacheDir)) {
    $files = glob($cacheDir . '/*.php');
    if ($files) {
        foreach ($files as $file) {
            if (basename($file) !== '.gitignore') {
                @unlink($file);
            }
        }
    }
}

// --- 4. AUTOLOAD ---
require __DIR__ . '/../vendor/autoload.php';

try {
    // --- 5. BOOTSTRAP ---
    $app = require_once __DIR__ . '/../bootstrap/app.php';

    // --- 6. FIX STORAGE PATH (VERCEL READ-ONLY) ---
    $storage = '/tmp/storage';
    if (!is_dir($storage)) {
        mkdir($storage, 0777, true);
    }
    
    // Bind path baru
    $app->useStoragePath($storage);
    
    // Buat folder struktur storage
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

    // --- 7. RUN APP ---
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $response = $kernel->handle(
        $request = Illuminate\Http\Request::capture()
    );
    $response->send();
    $kernel->terminate($request, $response);

} catch (\Throwable $e) {
    // Error Handler Terakhir (JSON Format)
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        "message" => "Critical Error",
        "error" => $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine(),
        "trace" => explode("\n", $e->getTraceAsString()) // Potong trace biar rapi
    ]);
}
