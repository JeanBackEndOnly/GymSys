<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\ContractController as AdminContractController;
use App\Http\Controllers\Admin\WalkInInfoController as AdminWalkInInfoController;
use App\Http\Controllers\Admin\WalkInAttendanceController as AdminWalkInAttendanceController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ProductPaycheckController as AdminProductPaycheckController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
// Cashier Controller
use App\Http\Controllers\Cashier\UserController as CashierUserController;
use App\Http\Controllers\Cashier\ContractController as CashierContractController;
use App\Http\Controllers\Cashier\WalkInInfoController as CashierWalkInInfoController;
use App\Http\Controllers\Cashier\WalkInAttendanceController as CashierWalkInAttendanceController;
use App\Http\Controllers\Cashier\ProductController as CashierProductController;
use App\Http\Controllers\Cashier\ProductPaycheckController as CashierProductPaycheckController;
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
    Route::apiResource('users', AdminUserController::class);
    Route::post('/users/systemAccount', [AdminUserController::class, 'storeSystemAccount']); 
    Route::patch('/users/{user}/role', [AdminUserController::class, 'updateRole']);
    Route::patch('/users/{user}/approve', [AdminUserController::class, 'approveUser']);
    Route::patch('/users/{user}/deactivate', [AdminUserController::class, 'deactivateUser']);
    Route::patch('/users/{user}/archive', [AdminUserController::class, 'archiveUser']);
    
    // Contract Management
    Route::apiResource('contracts', AdminContractController::class);

    // Walk-in Management
    Route::apiResource('walkins', AdminWalkInInfoController::class);

    // Walk-in Management 
    Route::apiResource('walkins-attendance', AdminWalkInAttendanceController::class);

    // Products Management 
    Route::apiResource('products', AdminProductController::class);

    // Products paycheck Management 
    Route::apiResource('products-paycheck', AdminProductPaycheckController::class);

    // Reports Management 
    Route::apiResource('reports', AdminReportController::class);
});

// ── Cashier Routes (Cashier role only) ─────────────
Route::middleware(['auth:sanctum', 'cashier', 'active', 'throttle:60,1'])->group(function () {
    // User Management
    Route::apiResource('users', UserController::class);
    Route::post('/users/systemAccount', [UserController::class, 'storeSystemAccount']); 
    Route::patch('/users/{user}/approve', [UserController::class, 'approveUser']);
    Route::patch('/users/{user}/deactivate', [UserController::class, 'deactivateUser']);
    
    // Contract Management
    Route::apiResource('contracts', ContractController::class);

    // Walk-in Management
    Route::apiResource('walkins', WalkInInfoController::class);

    // Walk-in Management 
    Route::apiResource('walkins-attendance', WalkInAttendanceController::class);

    // Products Management 
    Route::apiResource('products', ProductController::class);

    // Products paycheck Management 
    Route::apiResource('products-paycheck', ProductPaycheckController::class);

    // Reports Management 
    Route::apiResource('reports', ReportController::class);
});