<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ContractController;
use App\Http\Resources\UserResource;

// ── Public Routes ──────────────────────────────
Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1');

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:10,1');

// ── Authenticated Routes (any logged-in user) ──
Route::middleware(['auth:sanctum', 'active', 'throttle:60,1'])->group(function () {
    Route::get('/user', function (Request $request) {
        return new UserResource($request->user());
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
});

// ── Admin Routes (admin role only) ─────────────
Route::middleware(['auth:sanctum', 'admin', 'active', 'throttle:60,1'])->group(function () {
    // User Management
    Route::apiResource('users', UserController::class);
    Route::patch('/users/{user}/role', [UserController::class, 'updateRole']);
    Route::patch('/users/{user}/approve', [UserController::class, 'approveUser']);
    
    // Contract Management
    Route::apiResource('contracts', ContractController::class);
});