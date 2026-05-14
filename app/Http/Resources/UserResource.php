<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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

        // Add detail fields only for single user requests
        if ($request->routeIs('users.show') || $request->isMethod('post')) {
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
                'qr_code'    => $this->qr_code ? asset('storage/' . $this->qr_code) : null,
                'profile'    => $this->profile ? asset('storage/' . $this->profile) : null,
                'icon'       => $this->icon ? asset('storage/' . $this->icon) : null,
            ]);
        }

        return $data;
    }
}