<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProkerController;
// Route Login HARUS di sini (Tanpa middleware auth)
Route::post('/login', [AuthController::class, 'login']);

// Route yang butuh token (Baru pakai auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/prokers', [ProkerController::class, 'index']);
Route::post('/prokers', [ProkerController::class, 'store']);
Route::put('/prokers/{id}', [ProkerController::class, 'update']);
Route::delete('/prokers/{id}', [ProkerController::class, 'destroy']);
});
