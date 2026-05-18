<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = [
            'id'        => $this->id,
            'full_name' => $this->firstname . ' ' . $this->lastname,
            'email'     => $this->email,
            'username'  => $this->username,
            'role'      => $this->role,
            'status'    => $this->status,
            'joined'    => $this->created_at->format('M d, Y'),
        ];

        // Only include PII if authorized via Gate policy
        if (Gate::allows('viewSensitive', $this->resource)) {
            $data = array_merge($data, [
                'firstname'  => $this->firstname,
                'middlename' => $this->middlename,
                'lastname'   => $this->lastname,
                'suffix'     => $this->suffix,
                'contact'    => $this->contact,
                'address'    => $this->address,
                'birthday'   => $this->birthday,
                'birthplace' => $this->birthplace,
                'sex'        => $this->sex,
                'height'     => $this->height,
                'weight'     => $this->weight,
                'profile'    => $this->profile ? asset('storage/' . $this->profile) : null,
                'qr_code'    => $this->qr_code ? asset('storage/' . $this->qr_code) : null,
            ]);
        }

        // Add membership fee information (always include basic info)
        if ($this->relationLoaded('membership_fee') && $this->membership_fee) {
            $data['membership_fee'] = [
                'id'              => $this->membership_fee->id,
                'payment_amount'  => $this->membership_fee->payment_amount,
                'payment_type'    => $this->membership_fee->payment_type,
                'payment_status'  => $this->membership_fee->payment_status,
                'or_number'       => $this->membership_fee->or_number,
                'transaction_id'  => $this->membership_fee->transaction_id,
                'paid_at'         => $this->membership_fee->paid_at?->format('M d, Y'),
                'created_at'      => $this->membership_fee->created_at?->format('M d, Y'),
            ];
        } else {
            $data['membership_fee'] = null;
        }

        return $data;
    }
}