<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Products;
use App\Models\User;

class ProductPaycheck extends Model
{
    protected $table = 'product_paycheck';
    protected $fillable = [
        'product_id ',
        'sold_by ',
        'paid_by',
        'paid_by_name',
        'quantity',
        'unit_price',
        'total_price',
        'payment_type',
        'or_number',
        'transaction_id',
        'payment_status'
    ];
    public function product(): BelongsTo{
        return $this->belongsTo(Products::class);
    }
    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }
}
