<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductPaycheckStoreRequest;
use App\Http\Resources\ProductPaycheckResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\ProductPaycheck;
use App\Models\User;

class ProductPaycheckController extends Controller
{
    use AuthorizesRequests;

    public function store(ProductPaycheckStoreRequest $request)
    {
        try {
            $validated = $request->validated();    
            $this->authorize('create', ProductPaycheck::class);

            $isUserInactive = User::where('id', $validated["sold_by"])
                                ->where('status', 'active') // Fix: 'active' not 'pending'
                                ->exists();
            if (!$isUserInactive) {
                return response()->json([
                    'status' => 0,
                    'message' => 'The user must be active. Please try again.',
                ], 400);
            }

            if ($validated["paid_by"] !== null) {
                $isUserInactive = User::where('id', $validated["paid_by"])
                                    ->where('status', 'active') // Fix: 'active' not 'pending'
                                    ->exists();
                if (!$isUserInactive) {
                    return response()->json([
                        'status' => 0,
                        'message' => 'The user must be active. Please try again.',
                    ], 400);
                }
            }

            $products = ProductPaycheck::create($validated);

            return response()->json([
                'status' => 1,
                'message' => 'Product pay check successfully created.',
                'data' => new ProductPaycheckResource($products),
            ], 201);
            
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Server error. Please try again.'
            ], 500);
        }
    }
}