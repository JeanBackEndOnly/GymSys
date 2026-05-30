<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\ProductPaycheck;

class Products extends Model
{
    protected $table = 'products';
    protected $fillable = [
        'name',
        'description',
        'price',
        'quantity',
        'sold'
    ];
    public function product_paychecks(): HasMany{
        return $this->hasMany(ProductPaycheck::class);
    }
}
