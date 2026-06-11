<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\User;
use App\Http\Requests\Admin\ContractUpdateRequest;
use App\Http\Resources\ContractResource;
use Illuminate\Support\Facades\DB;

class ContractService
{
    public function create(array $data): Contract
    {
        return DB::transaction(function () use ($data) {

            // Check if user is active
            $user = User::where('id', $data['user_id'])
                        ->where('status', 'active')
                        ->first();
            if (!$user) {
                throw new \Exception('User is not active. Cannot create contract.');
            }

            // check if the user has already an active contract
            $userContract = User::with("contract")->find($data['user_id']);
            if (!$userContract) {
                throw new \Exception('User not found.');
            }
            if ($userContract->contract && $userContract->contract->status === 'active') {
                throw new \Exception('User has an active contract. Cannot create new contract.');
            }

            $contract = Contract::create([
                'user_id' => $data['user_id'],
                'contract_type' => $data['contract_type'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'status' => $data['status'] ?? 'active',
            ]);

            $contract->payment()->create([
                'user_id'          => $data['user_id'],
                'payment_type'     => $data['payment_type'],
                'contract_amount'   => $data['contract_amount'],
                'payment_amount'   => $data['payment_amount'],
                'or_number'        => $data['or_number'] ?? null,
                'transaction_id'   => $data['transaction_id'] ?? null,
                'payment_status'   => $data['payment_status'] ?? 'pending'
            ]);

            return $contract;
        });
    }

    public function update(ContractUpdateRequest $request, Contract $contract)
    {
        try {
            $this->authorize('update', $contract);

            $contract->update($request->validated());

            return response()->json([
                'status' => 1,
                'message' => 'Contract updated successfully.',
                'data' => new ContractResource($contract->fresh()),
            ], 200);
        } catch (\Throwable $e) {
            \Log::error('Failed', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => 0,
                'message' => 'Contract update failed. Please try again.',
            ], 500);
        }
    }
}