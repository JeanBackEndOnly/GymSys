<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Payment;
use App\Services\ContractService;
use App\Http\Requests\Admin\ContractRequest;
use App\Http\Requests\Admin\ContractUpdateRequest;
use App\Http\Resources\ContractResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private ContractService $contractService
    ) {}

    public function index(Request $request)
    {
        try {
            $this->authorize('viewAny', Contract::class);

            $contracts = Contract::query()
                ->with(['user', 'payment'])
                ->when($request->search, function ($query) use ($request) {
                    $query->whereHas('user', function ($q) use ($request) {
                        $q->where('firstname', 'like', "%{$request->search}%")
                          ->orWhere('lastname', 'like', "%{$request->search}%");
                    });
                })
                ->when($request->status, function ($query) use ($request) {
                    $query->where('status', $request->status);
                })
                ->when($request->contract_type, function ($query) use ($request) {
                    $query->where('contract_type', $request->contract_type);
                })
                ->latest()
                ->paginate($request->per_page ?? 15);

            $contracts->getCollection()->transform(function ($contract) {
                return new ContractResource($contract);
            });

            return response()->json([
                'status' => 1,
                'message' => 'Contracts fetched successfully.',
                'data' => $contracts,
            ], 200);
        } catch (\Throwable $e) {
            \Log::error('Fetch Contracts failed: ' . $e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Failed to fetch Contracts. Please try again.',
            ], 500);
        }
    }
    public function store(ContractRequest $request)
    {
        try {
            $this->authorize('create', Contract::class);

            $contract = $this->contractService->create($request->validated());
            
            return response()->json([
                'status' => 1,
                'message' => 'Contract created successfully.',
                'data' => new ContractResource($contract->load(['user', 'payment'])),
            ], 201);
        } catch (\Throwable $e) {
            \Log::error('Contract creation failed: ' . $e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Contract process failed. Please try again.',
            ], 500);
        }
    }


    public function show(Contract $contract)
    {
        try {
            $this->authorize('view', $contract);

            return response()->json([
                'status' => 1,
                'message' => 'Contract fetched successfully.',
                'data' => new ContractResource($contract->load(['user', 'payment'])),
            ], 200);
        } catch (\Throwable $e) {
            \Log::error('Fetch Contract failed: ' . $e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Failed to fetch Contract. Please try again.',
            ], 500);
        }
    }

    public function update(ContractUpdateRequest $request, Contract $contract)
    {
        try {
            $this->authorize('update', $contract);

            $contract->update($request->validated());

            $paymentData = $request->only([
                'payment_status',
                'payment_amount',
                'payment_type',
                'or_number',
                'transaction_id'
            ]);
            
            if (!empty($paymentData) && $contract->payment) {
                $contract->payment()->update($paymentData);
            }

            return response()->json([
                'status' => 1,
                'message' => 'Contract updated successfully.',
                'data' => new ContractResource($contract->fresh(['user', 'payment'])),
            ], 200);
        } catch (\Throwable $e) {
            \Log::error('Contract update failed: ' . $e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Contract update failed. Please try again.',
            ], 500);
        }
    }

    public function destroy(Contract $contract)
    {
        try {
            $this->authorize('delete', $contract);

            // Delete payment first
            if ($contract->payment) {
                $contract->payment->delete();
            }

            $memberName = $contract->user->firstname . ' ' . $contract->user->lastname;
            $contract->delete();

            return response()->json([
                'status' => 1,
                'message' => $memberName . '\'s Contract deleted successfully.',
            ], 200);
        } catch (\Throwable $e) {
            \Log::error('Contract delete failed: ' . $e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Failed to delete Contract. Please try again.',
            ], 500);
        }
    }
}