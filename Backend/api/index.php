<?php

// --- 1. CONFIGURATION ---
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// --- 2. CACHE NUKE (PENTING!) ---
// Hapus cache bawaan build yang sering bikin error path mismatch di Vercel
$cacheDir = __DIR__ . '/../bootstrap/cache';
$files = glob($cacheDir . '/*.php');
if ($files) {
    foreach ($files as $file) {
        if (basename($file) !== '.gitignore') {
            @unlink($file); // Hapus config.php, packages.php, services.php
        }
    }
}

// --- 3. AUTOLOAD ---
require __DIR__ . '/../vendor/autoload.php';

try {
    // --- 4. BOOTSTRAP ---
    $app = require_once __DIR__ . '/../bootstrap/app.php';

    // --- 5. FIX STORAGE PATH (VERCEL READ-ONLY) ---
    $storage = '/tmp/storage';
    if (!is_dir($storage)) {
        mkdir($storage, 0777, true);
    }
    
    // Bind path baru
    $app->useStoragePath($storage);
    
    // Buat folder struktur storage yang dibutuhkan Laravel
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
    // Error Handler Darurat
    http_response_code(500);
    echo "<div style='font-family:monospace; background:#fff0f0; color:#d00; padding:20px; border:1px solid #d00;'>";
    echo "<h1>💥 Error Tertangkap!</h1>";
    echo "<h3>" . $e->getMessage() . "</h3>";
    echo "<p><strong>File:</strong> " . $e->getFile() . " (Line " . $e->getLine() . ")</p>";
    echo "<pre style='background:#fff; padding:10px; border:1px solid #ccc; overflow:auto;'>" . $e->getTraceAsString() . "</pre>";
    echo "</div>";
}
