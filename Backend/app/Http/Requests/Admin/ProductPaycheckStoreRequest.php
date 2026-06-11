<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProductPaycheckStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return in_array(auth()->user()->role, ['admin', 'cashier']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "product_id" => ["required", "exists:products,id"],
            "sold_by" => ["required", "exists:users,id"],
            "paid_by" => ["nullable", "exists:users,id"],
            "paid_by_name" => ["nullable", "string", "max:255"],
            "quantity" => ["required", "integer", "min:1"],
            "unit_price" => ["required", "numeric", "min:0"],
            "total_price" => ["required", "numeric", "min:0"],
            "payment_type" => ["required", "string", "in:cash,gcash"],
            "or_number" => ["required", "string", "unique:product_paycheck,or_number"],
            "transaction_id" => ["nullable", "string", "max:255"],
            "payment_status" => ["nullable", "string", "in:pending,paid,failed"],
        ];
    }
}
