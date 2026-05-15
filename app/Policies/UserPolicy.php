<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'cashier']);
    }

    public function view(User $user, User $model): bool
    {
        return $user->id === $model->id || $user->role === 'admin';
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'cashier']);
    }

    public function viewSensitive(User $user, User $model): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->id === $model->id;
    }

    public function update(User $user, User $model): bool
    {
        return in_array($user->role, ['admin', 'cashier']);
    }

    public function delete(User $user, User $model): bool
    {
        return $user->role === 'admin';
    }

    public function updateRole(User $user, User $model): bool
    {
        return $user->role === 'admin' && $user->id !== $model->id;
    }
}
