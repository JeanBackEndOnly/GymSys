<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\RegisterService;

class AuthController extends Controller
{
    public function __construct(
        private \App\Services\RegisterService $registerService
    ) {}

    public function register(RegisterRequest $request)

    {
        try {
            $validated = $request->validated();
            
            $result = $this->registerService->register(
                $validated, 
                $request->hasFile('profile') ? $request->file('profile') : null
            );
            
            return response()->json([
                'status' => 'success',
                'message' => 'Registered Successfully.',
                'data' => [
                    'user' => new UserResource($result['user']),
                    'token' => $result['token'],
                ],
            ], 201);
            
        } catch (\Throwable $e) {
            Log::error('Register failed: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Register failed, please try again.'
            ], 500);
        }
    }
    public function login(LoginRequest $request)
    {
        try {
            $user = User::where('email', $request->login)
                ->orWhere('username', $request->login)
                ->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid credentials. Please try again.',
                ], 401);
            }

            if ($user->status !== 'active') {
                return response()->json(['message' => 'Account pending approval'], 403);
            }

            // Delete ALL old tokens (no currentAccessToken check needed)
            $user->tokens()->delete();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Logged in successfully.',
                'data' => [
                    'user' => new UserResource($user),
                    'token' => $token,
                ],
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Login failed: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Login failed. Please try again.',
            ], 500);
        }
    }
    public function logout()
    {
        $user = auth('sanctum')->user();

        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully.',
        ]);
    }
    public function changePassword(ChangePasswordRequest $request)
    {
        try {
            $user = auth('sanctum')->user();

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Current password is incorrect.',
                ], 422);
            }

            $user->update([
                'password' => Hash::make($request->new_password),
            ]);

            // Revoke other tokens safely
            $currentToken = $user->currentAccessToken();
            if ($currentToken) {
                $user->tokens()->where('id', '!=', $currentToken->id)->delete();
            }
            return response()->json([
                'status' => 'success',
                'message' => 'Password changed successfully.',
            ]);
        } catch (\Throwable $e) {
            Log::error('Password change failed: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Password change failed. Please try again.',
            ], 500);
        }
    }
}
