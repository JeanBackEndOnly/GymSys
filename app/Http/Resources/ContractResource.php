<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContractResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'member'          => $this->user->firstname . ' ' . $this->user->lastname,
            'membership_type' => $this->membership_type,
            'start_date'      => $this->start_date,
            'end_date'        => $this->end_date,
            'status'          => $this->status,
            'created_at'      => $this->created_at->format('M d, Y'),
        ];
    }
}