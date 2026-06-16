<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AttendanceRequest;
use App\Models\Attendance;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class AttendanceController extends Controller
{
    use AuthorizesRequests;  
    
    public function index()
    {
        try {
            $this->authorize('viewAny', Attendance::class);
            
            $attendances = Attendance::with('user')->get();

            return response()->json([
                'status' => 1,
                'message' => 'Attendances fetched successfully.',
                'data' => $attendances,
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Failed to fetch attendances.',
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $attendance = Attendance::with('user')->findOrFail($id);
            $this->authorize('view', $attendance);

            return response()->json([
                'status' => 1,
            'message' => 'Attendance fetched successfully.',
            'data' => $attendance,
        ], 200);

    } catch (\Throwable $e) {
        return response()->json([
            'status' => 0,
            'message' => 'Attendance not found.',
        ], 404);
    }
}
    public function store(AttendanceRequest $request)
    {
        try {
            $this->authorize('create', Attendance::class);  

            $attendance = Attendance::create([
                'user_id' => $request->user_id,
                'time_in' => $request->time_in,
                'time_out' => $request->time_out ?? null,
            ]);

            return response()->json([
                'status' => 1,
                'message' => 'Attendance recorded successfully.',
                'data' => $attendance,
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Failed to record attendance.',
            ], 500);
        }
    }

    public function update(AttendanceRequest $request, $id)
    {
        try {
            $attendance = Attendance::findOrFail($id);
            $this->authorize('update', $attendance); 

            $attendance->update([
                'time_out' => $request->time_out,
            ]);

            return response()->json([
                'status' => 1,
                'message' => 'Time out recorded successfully.',
                'data' => $attendance,
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Failed to update attendance.',
            ], 500);
        }
    }
}