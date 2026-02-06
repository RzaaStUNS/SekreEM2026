<?php

// Konfigurasi Error Reporting Tingkat Dewa
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// 1. Panggil Autoload
require __DIR__ . '/../vendor/autoload.php';

try {
    // 2. Bootstrapping Laravel
    $app = require_once __DIR__ . '/../bootstrap/app.php';

    // --- FIX VERCEL STORAGE (PENTING) ---
    // Alihkan semua penulisan file ke folder sementara (/tmp)
    $storage = '/tmp/storage';
    if (!is_dir($storage)) {
        mkdir($storage, 0777, true);
    }
    
    // Bind path storage baru ke aplikasi
    $app->useStoragePath($storage);
    
    // Trik tambahan: Buat folder spesifik agar view/cache tidak error
    $dirs = ['framework/views', 'framework/cache', 'framework/sessions', 'logs'];
    foreach ($dirs as $dir) {
        if (!is_dir("$storage/$dir")) mkdir("$storage/$dir", 0777, true);
    }
    // -------------------------------------

    // 3. Jalankan Aplikasi
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

    $response = $kernel->handle(
        $request = Illuminate\Http\Request::capture()
    );

    $response->send();
    $kernel->terminate($request, $response);

} catch (\Throwable $e) {
    // 4. TANGKAP ERROR FATAL (Jaring Pengaman)
    // Jika Laravel crash, kode ini yang akan jalan
    http_response_code(500);
    echo "<div style='background: #fee; color: #b00; padding: 20px; font-family: monospace;'>";
    echo "<h1>🔥 FATAL ERROR TERTANGKAP</h1>";
    echo "<h3>Pesan Error:</h3>";
    echo "<pre style='font-size: 1.2em;'>" . $e->getMessage() . "</pre>";
    echo "<h3>Lokasi File:</h3>";
    echo "<pre>" . $e->getFile() . " di baris " . $e->getLine() . "</pre>";
    echo "<h3>Stack Trace:</h3>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
    echo "</div>";
}
