<?php

namespace App\Services;

use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class RegisterService
{
    public function register(array $data, $profileImage = null): array
    {
        return DB::transaction(function () use ($data, $profileImage) {
            $data['password'] = Hash::make($data['password']);
            $data['qr_code'] = $data['qr_code'] ?? uniqid('QR-');
            
            if ($profileImage) {
                $data['profile'] = $profileImage->store('profiles', 'public');
            }
            
            $user = User::create($data);
            
            $user->membership_fee()->create([
                'user_id' => $user->id,
                'payment_amount' => $data['payment_amount'],
                'payment_type' => $data['payment_type'],
                'or_number' => $data['or_number'] ?? null,
                'transaction_id' => $data['transaction_id'] ?? null,
                'paid_at' => now(),
            ]);
            
            $isAdminLoggedIn = auth('sanctum')->check() && auth('sanctum')->user()->isAdmin();
            
            if ($isAdminLoggedIn) {
                return [
                    'user' => $user,
                    'message' => 'Account created successfully by admin',
                ];
            }
            
            $token = $user->createToken('auth_token')->plainTextToken;
            
            return [
                'user' => $user,
                'token' => $token,
            ];
        });
    }
}