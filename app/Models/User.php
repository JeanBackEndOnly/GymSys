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
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\MembershipFee;
use App\Models\Contract;
use App\Models\Report;

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
        'profile', 
        'icon',])]
        
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
    public function isAdmin(): bool { return $this->role === 'admin'; }
    public function isCashier(): bool { return $this->role === 'cashier'; }
    public function hasRole(string $role): bool { return $this->role === $role; }

    public function membership_fee(): HasOne
    {
        return $this->hasOne(MembershipFee::class);
    }
    public function contract(): HasOne{
        return $this->hasOne(Contract::class);
    }
    public function product_paychecks(): HasMany{
        return $this->hasMany(ProductPaycheck::class);
    }
    public function reports(): HasMany{
        return $this->hasMany(Report::class);
    }
}
