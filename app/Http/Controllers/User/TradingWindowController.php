<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TradingWindowController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'trading_window_enabled' => ['required', 'boolean'],
            'trading_window_start' => ['nullable', 'regex:/^([01]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/'],
            'trading_window_end' => ['nullable', 'regex:/^([01]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/'],
            'discipline_message' => ['nullable', 'string', 'max:500'],
            'timezone' => ['nullable', 'string', 'max:50'],
        ]);

        if ($validated['trading_window_enabled'] && (empty($validated['trading_window_start']) || empty($validated['trading_window_end']))) {
            return back()->withErrors(['trading_window_start' => 'Both start and end times are required when trading window is enabled.']);
        }

        // Normalize times to HH:MM format (strip seconds if present)
        if (isset($validated['trading_window_start']) && preg_match('/^\d{1,2}:\d{2}:\d{2}$/', $validated['trading_window_start'])) {
            $validated['trading_window_start'] = substr($validated['trading_window_start'], 0, 5);
        }
        if (isset($validated['trading_window_end']) && preg_match('/^\d{1,2}:\d{2}:\d{2}$/', $validated['trading_window_end'])) {
            $validated['trading_window_end'] = substr($validated['trading_window_end'], 0, 5);
        }

        $request->user()->update($validated);

        return back()->with('success', 'Trading window settings updated.');
    }
}
