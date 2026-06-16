<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Contract;
use App\Models\User;

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
            'time_in' => ['required', 'date_format:H:i:s'],
            'time_out' => ['nullable', 'date_format:H:i:s', 'after:time_in'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'Member is required.',
            'user_id.exists' => 'Member not found.',
            'qr_code.required' => 'QR code is required.',
            'time_in.required' => 'Time in is required.',
            'time_in.date_format' => 'Invalid time format. Use HH:MM:SS.',
            'time_out.date_format' => 'Invalid time format. Use HH:MM:SS.',
            'time_out.after' => 'Time out must be after time in.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Get user
            $user = User::find($this->user_id);

            if (!$user) {
                $validator->errors()->add('user_id', 'Member not found.');
                return;
            }

            // Check if user is active
            if ($user->status !== 'active') {
                $validator->errors()->add('user_id', 'Member account is not active.');
                return;
            }

            // Check QR code matches
            if ($user->qr_code !== $this->qr_code) {
                $validator->errors()->add('qr_code', 'Invalid QR code. This QR code does not belong to the selected member.');
                return;
            }

            // Check active contract
            $hasActiveContract = Contract::where('user_id', $user->id)
                ->where('status', 'active')
                ->where('end_date', '>=', now()->toDateString())
                ->exists();

            if (!$hasActiveContract) {
                $validator->errors()->add('user_id', 'No active contract. Please renew membership.');
                return;
            }

            // Check if already checked in (no time_out)
            $activeAttendance = \App\Models\Attendance::where('user_id', $user->id)
                ->whereNull('time_out')
                ->whereDate('created_at', now()->toDateString()) // Only check today
                ->exists();

            // If already checked in and this is a check-in (no time_out)
            if ($activeAttendance && !$this->time_out) {
                $validator->errors()->add('user_id', 'Member already checked in today.');
                return;
            }

            // Check if already checked out for today
            if ($this->time_out) {
                $attendance = \App\Models\Attendance::where('user_id', $user->id)
                    ->whereDate('created_at', now()->toDateString())
                    ->whereNull('time_out')
                    ->first();

                if (!$attendance) {
                    $validator->errors()->add('user_id', 'Member has not checked in today.');
                    return;
                }
            }
        });
    }
}