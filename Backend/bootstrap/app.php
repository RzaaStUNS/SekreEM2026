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
        // Matikan CSRF untuk API biar nggak nyangkut
        $middleware->validateCsrfTokens(except: [
            'api/*',
            'login',
            '/api/login',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Paksa Laravel selalu membalas error dengan JSON (jangan di-redirect)
        $exceptions->shouldRenderJsonWhen(function (\Illuminate\Http\Request $request, \Throwable $e) {
            return true;
        });
    })->create();
