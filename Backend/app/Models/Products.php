<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Products extends Model
{
    protected $table = 'products';
    protected $fillable = [
        'name', 'description', 'price', 'quantity', 'sold', 'profile'
    ];

    // Many-to-many with product_paycheck through product_sold
    public function productPaychecks(): BelongsToMany
    {
        return $this->belongsToMany(ProductPaycheck::class, 'product_sold')
                    ->withPivot('quantity', 'price_at_sale')
                    ->withTimestamps();
    }
}