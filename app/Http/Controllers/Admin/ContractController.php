<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Membership;
use App\Models\Payment;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ContractController extends Controller
{
   use AuthorizesRequests;

    public function store(){
        try {
            $this->authorize('create', Membership::class);

            return response()->json([
                'status' => 1,
                'message' => 'Contract created successfully.' 
            ], 201);
        } catch (\Throwable $e) {
            \Log::error('An error occured: ' . $e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Contract process failed, please try again.'
            ], 500);
        }
    }
}
