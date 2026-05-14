<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Models\Payment;
use App\Services\MembershipService;
use App\Http\Requests\Admin\MembershipRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class MembershipController extends Controller
{
   use AuthorizesRequests;

     public function __construct(
        private MembershipService $membershipService
    ) {}

    public function store(MembershipRequest $request)
    {
        try {
            $this->authorize('create', Membership::class);

            $membership = $this->membershipService->create($request->validated());

            return response()->json([
                'status' => 1,
                'message' => 'Contract created successfully.',
                'data' => $membership,
            ], 201);
        } catch (\Throwable $e) {
            \Log::error('Contract creation failed: ' . $e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Contract process failed. Please try again.',
            ], 500);
        }
    }
}
