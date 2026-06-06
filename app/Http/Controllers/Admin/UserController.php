<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\UserCreateRequest;
use App\Http\Requests\Admin\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private \App\Services\RegisterService $registerService
    ) {}

    public function store(UserCreateRequest $request)
    {
        try {
            $this->authorize('create', User::class);
            $validated = $request->validated();
            
            $result = $this->registerService->register(
                $validated, 
                $request->hasFile('profile') ? $request->file('profile') : null
            );
            
            return response()->json([
                'status' => 'success',
                'message' => 'Registered Successfully.',
                'data' => [
                    'user' => new UserResource($result['user'])
                ],
            ], 201);
        } catch (\Throwable $e) {
           \Log::error('Failed' . $e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Creating user failed. Please try again.',
            ], 500);
        }
    }

    public function update(UserUpdateRequest $request, User $user)
    {
        try {
            $this->authorize('update', $user);
            $validated = $request->validated();
            $validated["profile"] = $user->profile;
            $validated["icon"] = $user->icon;

            if ($request->hasFile('profile')) {
                if ($user->profile && Storage::disk('public')->exists($user->profile)) {
                    Storage::disk('public')->delete($user->profile);
                }
                $validated["profile"] = $request->file('profile')->store('profiles', 'public');
            }

            if ($request->hasFile('icon')) {
                if ($user->icon && Storage::disk('public')->exists($user->icon)) {
                    Storage::disk('public')->delete($user->icon);
                }
                $validated["icon"] = $request->file('icon')->store('icons', 'public');
            }

            $user->update($validated);

            if ($user->wasChanged('status') && $user->status !== 'active') {
                $user->tokens()->delete();
            }

            return response()->json([
                'status' => 1,
                'message' => $user->firstname . ' updated successfully.',
                'data' => new UserResource($user->fresh()),
            ], 200);
        } catch (\Throwable $e) {
           \Log::error('Failed' . $e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Update user failed. Please try again.',
            ], 500);
        }
    }
    
    public function show(User $user)
    {
        try {
            $this->authorize('view', $user);

            return response()->json([
                'status' => 1,
                'message' => 'User fetched successfully.',
                'data' => new UserResource($user),
            ], 200);
        } catch (\Throwable $e) {
            \Log::error('Failed' . $e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Failed to fetch user data. Please try again.',
            ], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $this->authorize('viewAny', User::class);

            $users = User::query()
                ->when($request->search, function ($query) use ($request) {
                    $query->where(function ($q) use ($request) {
                        $q->where('firstname', 'like', "%{$request->search}%")
                        ->orWhere('lastname', 'like', "%{$request->search}%")
                        ->orWhere('email', 'like', "%{$request->search}%")
                        ->orWhere('username', 'like', "%{$request->search}%");
                    });
                })
                ->when($request->role, function ($query) use ($request) {
                    $query->where('role', $request->role);
                })
                ->when($request->status, function ($query) use ($request) {
                    $query->where('status', $request->status);
                })
                ->paginate($request->per_page ?? 15);

            // Apply UserResource to the paginated collection
            $users->getCollection()->transform(function ($user) {
                return new UserResource($user);
            });

            return response()->json([
                'status' => 1,
                'message' => 'Users fetched successfully.',
                'data' => $users,
            ], 200);
        } catch (\Throwable $e) {
            \Log::error('Failed' . $e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Failed to fetch user data. Please try again.',
            ], 500);
        }
    }

    public function destroy(User $user)
    {
        try {
            $this->authorize('delete', $user);
            
            if ($user->profile && Storage::disk('public')->exists($user->profile)) {
                Storage::disk('public')->delete($user->profile);
            }

            if ($user->icon && Storage::disk('public')->exists($user->icon)) {
                Storage::disk('public')->delete($user->icon);
            }

            $name = $user->firstname . ' ' . $user->lastname;
            $user->delete(); 

            return response()->json([
                'status' => 1,
                'message' => 'User ' . $name . ' deleted successfully.',
            ], 200);
        } catch (\Throwable $e) {
            \Log::error('Failed' . $e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Failed to delete user. Please try again.',
            ], 500);
        }
    }

    public function storeCashier(UserCreateRequest $request){
        try {
            $this->authorize('create', User::class);
            $validated = $request->validated();

            unset($validated['role']);
            $validated['role'] = 'cashier';
            
            $result = $this->registerService->register(
                $validated, 
                $request->hasFile('profile') ? $request->file('profile') : null
            );
            
            return response()->json([
                'status' => 'success',
                'message' => 'Registered Successfully.',
                'data' => [
                    'user' => new UserResource($result['user'])
                ],
            ], 201);
        } catch (\Throwable $e) {
           \Log::error('Failed' . $e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Creating user failed. Please try again.',
            ], 500);
        }
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => ['required', 'string', 'in:member,cashier,staff'], // NO admin
        ]);

        $this->authorize('updateRole', [$user, $request->role]);

        // Cannot change your own role
        if (auth('sanctum')->id() === $user->id) {
            return response()->json([
                'status' => 0,
                'message' => 'You cannot change your own role.',
            ], 403);
        }

        // Cannot change another admin's role
        if ($user->role === 'admin') {
            return response()->json([
                'status' => 0,
                'message' => 'Cannot change another admin\'s role.',
            ], 403);
        }

        $user->update(['role' => $request->role]);

        return response()->json([
            'status' => 1,
            'message' => 'Role updated successfully.',
        ]);
    }

    public function approveUser(User $user)
    {
        $this->authorize('approve', $user);

        $user->status = 'active';
        $user->save();  // ← Not update()

        return response()->json([
            'status' => 1,
            'message' => $user->firstname . ' approved successfully.',
        ]);
    }
    public function disapproveUser(User $user)
    {
        $this->authorize('disapprove', $user);

        $user->status = 'archive';
        $user->save();  // ← Not update()

        return response()->json([
            'status' => 1,
            'message' => $user->firstname . ' approved successfully.',
        ]);
    }
}