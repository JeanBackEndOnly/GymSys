<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Contract;

class AttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && in_array(auth()->user()->role, ['admin', 'cashier']);
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'qr_code' => ['required', 'string'],
            'time_in' => ['required', 'date_format:Y-m-d H:i:s'],
            'time_out' => ['nullable', 'date_format:Y-m-d H:i:s', 'after:time_in'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'Member is required.',
            'user_id.exists' => 'Member not found.',
            'qr_code.required' => 'QR code is required.',
            'time_in.required' => 'Time in is required.',
            'time_out.after' => 'Time out must be after time in.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $user = \App\Models\User::find($this->user_id);

            if (!$user) {
                $validator->errors()->add('user_id', 'Member not found.');
                return;
            }

            // Check QR code
            if ($user->qr_code !== $this->qr_code) {
                $validator->errors()->add('qr_code', 'Invalid QR code.');
                return;
            }

            // Check active contract
            $hasActiveContract = Contract::where('user_id', $user->id)
                ->where('status', 'active')
                ->where('end_date', '>=', now())
                ->exists();

            if (!$hasActiveContract) {
                $validator->errors()->add('user_id', 'No active contract. Please renew membership.');
                return;
            }

            // Check if already checked in
            $activeAttendance = \App\Models\MemberAttendance::where('user_id', $user->id)
                ->whereNull('time_out')
                ->exists();

            if ($activeAttendance && !$this->time_out) {
                $validator->errors()->add('user_id', 'Member already checked in.');
                return;
            }
        });
    }
}