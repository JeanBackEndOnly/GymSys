<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ContractUpdateRequest extends FormRequest
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
            // Contract fields
            'contract_type' => ['sometimes', 'string', 'in:1_month,3_months,6_months,1_year'],
            'start_date'    => ['sometimes', 'date'],
            'end_date'      => ['sometimes', 'date', 'after:start_date'],
            'status'        => ['sometimes', 'string', 'in:active,inactive,expired'],
            
            // Payment fields
            'payment_status'  => ['sometimes', 'string', 'in:pending,paid,failed'],
            'payment_amount'  => ['sometimes', 'numeric', 'min:0'],
            'payment_type'    => ['sometimes', 'string', 'in:cash,gcash'],
            'or_number'       => ['nullable', 'string', 'max:255'],
            'transaction_id'  => ['nullable', 'string', 'max:255'],
        ];
    }
}
