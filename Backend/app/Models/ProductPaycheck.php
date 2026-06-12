<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductPaycheck extends Model
{
    protected $table = 'product_paycheck';
    
    protected $fillable = [
        'sold_by', 'paid_by', 'paid_by_name', 'payment_type',
        'or_number', 'transaction_id', 'payment_status'
    ];

    public function soldBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sold_by');
    }

    public function paidBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'paid_by');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(
            Products::class,           // Related model
            'product_sold',            // Pivot table name
            'paycheck_id',             // ← Foreign key on pivot (matches your column)
            'product_id'               // ← Related key on pivot (change if yours is 'products_id')
        )->withPivot('quantity', 'price_at_sale')
         ->withTimestamps();
    }
}