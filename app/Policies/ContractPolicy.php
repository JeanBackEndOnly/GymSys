<?php

namespace App\Policies;

use App\Models\Contract;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ContractPolicy
{
    public function view(User $user, Contract $contract): bool
    {
        if (in_array($user->role, ['admin', 'cashier'])) {
            return true;
        }

        return $user->id === $contract->user_id;
    }


    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'cashier']);
    }

    public function create(User $user): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'cashier') {
            $targetUser = User::find(request('user_id'));
            return $targetUser && $targetUser->role === 'member';
        }

        return false;
    }

    public function update(User $user, Contract $contract): bool
    {
        return in_array($user->role, ['admin', 'cashier']);
    }

    public function delete(User $user, Contract $contract): bool
    {
        return $user->role === 'admin';
    }
}
