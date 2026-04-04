<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // HAPUS/KOMENTARI line statefulApi() kalau masih ada
        // $middleware->statefulApi(); 
        
        // 1. TAMBAHKAN INI: PERINTAH TEGAS UNTUK MATIKAN CSRF DI API
        $middleware->validateCsrfTokens(except: [
            'api/*',       // Abaikan CSRF untuk semua yang depannya api/
            'login',       // Abaikan untuk login
            '/api/login',  // Abaikan spesifik
        ]);
    })
    -->withExceptions(function (Exceptions $exceptions) {
        // Paksa Laravel selalu membalas error dengan JSON (jangan di-redirect)
        $exceptions->shouldRenderJsonWhen(function (\Illuminate\Http\Request $request, \Throwable $e) {
            return true;
        });
    })->create();
