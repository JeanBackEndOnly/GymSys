<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;

class ContractResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = [
            'id'              => $this->id,
            'member'          => $this->user->firstname . ' ' . $this->user->lastname,
            'start_date'      => $this->start_date,
            'end_date'        => $this->end_date,
            'status'          => $this->status,
            'created_at'      => $this->created_at->format('M d, Y'),
        ];

        // Only show payment details if user can view the contract
       if (Gate::allows('view', $this->resource) && $this->relationLoaded('payment') && $this->payment) {
            $data['payment'] = [
                'payment_type'    => $this->payment->payment_type,
                'payment_amount'  => $this->payment->payment_amount,
                'payment_status'  => $this->payment->payment_status,
                'or_number'       => $this->payment->or_number,
                'transaction_id'  => $this->payment->transaction_id,
                'paid_at'         => $this->payment->paid_at?->format('M d, Y'),
            ];
        }

        return $data;
    }
}