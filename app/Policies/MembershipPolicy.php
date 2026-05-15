<?php

namespace App\Policies;

use App\Models\Membership;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MembershipPolicy
{
    public function view(User $user, Membership $membership): bool
    {
        return in_array($user->role, ['admin', 'cashier']);
        return $user->id === $membership->user_id;
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

    public function update(User $user, Membership $membership): bool
    {
        return in_array($user->role, ['admin', 'cashier']);
    }

    public function delete(User $user, Membership $membership): bool
    {
        return $user->role === 'admin';
    }
}
