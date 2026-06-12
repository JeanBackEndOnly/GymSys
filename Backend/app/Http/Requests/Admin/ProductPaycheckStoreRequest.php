<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ProductPaycheckStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array(auth()->user()->role, ['admin', 'cashier']);
    }

    public function rules(): array
    {
        return [
            // Receipt/Header data
            "sold_by" => ["required", "exists:users,id"],
            "paid_by" => ["nullable", "exists:users,id"],
            "paid_by_name" => ["nullable", "string", "max:255"],
            "payment_type" => ["required", "string", "in:cash,gcash"],
            "or_number" => ["required", "string", "unique:product_paycheck,or_number"],
            "transaction_id" => ["nullable", "string", "max:255"],
            "payment_status" => ["nullable", "string", "in:pending,paid,failed"],
            
            // EITHER single product OR products array (both use pivot)
            "product_id" => ["required_without:products", "exists:products,id"],
            "quantity" => ["required_without:products", "integer", "min:1"],
            "unit_price" => ["required_without:products", "numeric", "min:0"],
            
            // OR multiple products
            "products" => ["required_without:product_id", "array", "min:1"],
            "products.*.product_id" => ["required_with:products", "exists:products,id"],
            "products.*.quantity" => ["required_with:products", "integer", "min:1"],
            "products.*.price_at_sale" => ["required_with:products", "numeric", "min:0"],
        ];
    }

    public function messages(): array
    {
        return [
            'or_number.unique' => 'This OR number already exists.',
            'product_id.required_without' => 'Either product_id or products array is required.',
            'products.required_without' => 'Either product_id or products array is required.',
            'products.*.product_id.required_with' => 'Each product must have a product_id.',
            'products.*.quantity.min' => 'Quantity must be at least 1.',
            'products.*.price_at_sale.min' => 'Price must be at least 0.',
        ];
    }
}