<?php

namespace App\Services;

use App\Models\Membership;
use Illuminate\Support\Facades\DB;

class MembershipService
{
    public function create(array $data): Membership
    {
        return DB::transaction(function () use ($data) {
            $membership = Membership::create([
                'user_id'         => $data['user_id'],
                'membership_type' => $data['membership_type'],
                'start_date'      => $data['start_date'],
                'end_date'        => $data['end_date'],
                'status'          => $data['status'] ?? 'active',
            ]);

            $membership->payment()->create([
                'user_id'          => $data['user_id'],
                'payment_type'     => $data['payment_type'],
                'payment_amount'   => $data['payment_amount'],
                'or_number'        => $data['or_number'] ?? null,
                'transaction_id'   => $data['transaction_id'] ?? null,
                'payment_status'   => $data['payment_status'] ?? 'pending',
                'contract_status'  => $data['contract_status'] ?? 'active',
            ]);

            return $membership->load('payment', 'user');
        });
    }
}