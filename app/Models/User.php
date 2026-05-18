<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Membership_fee;
use App\Models\Contract;

#[Fillable(['firstname',
        'middlename',
        'lastname',
        'suffix',
        'username',
        'email',
        'password',
        'contact',
        'address',
        'birthday',
        'birthplace',
        'qr_code',
        'sex',
        'height',
        'weight',
        'status',])]
        
#[Hidden('password')]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function isAdmin(): bool{
        return $this->role === 'admin';
    }
    public function isCashier(): bool{
        return $this->role === 'cashier';
    }
    public function memberhsip_fee(): HasOne{
        return $this->hasOne(Membership_fee::class);
    }
    public function contract(): HasOne{
        return $this->hasOne(Contract::class);
    }
}
