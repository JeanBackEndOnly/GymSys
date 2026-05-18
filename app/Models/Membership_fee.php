<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MembershipFee extends Model
{
    protected $table = 'membership_fee';
    
    protected $fillable = [
        'user_id',
        'payment_amount',
        'or_number',
        'payment_status',
        'paid_at'
    ];
    
    protected $casts = [
        'payment_amount' => 'decimal:2',
        'paid_at' => 'datetime',
        'created_at' => 'datetime'
    ];
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
