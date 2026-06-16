<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Reservation;
use App\Http\Requests\Admin\ReservationRequest;

class ReservationController extends Controller
{
    use AuthorizesRequests;
    public function store(ReservationRequest $request){
        try {
            $validated = $request->validated();
            $this->authorize('create', Reservation::class);

            $reservations = Reservation::create($validated);

            return response()->json([
                'status' => 1,
                'message' => 'Reservation created successfully.',
                'data' => $reservations,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Failed to fetch trainers.',
            ], 500);
        }
    }
}
