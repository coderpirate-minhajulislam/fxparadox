<?php

namespace App\Services;

use App\Models\PushSubscription;
use App\Models\User;
use Illuminate\Support\Carbon;

class TradingWindowNotifier
{
    private ?WebPushService $service = null;

    /**
     * Check the user's trading window and send start/end push
     * notifications if a boundary was crossed and not yet notified.
     *
     * @return array{start_sent: bool, end_sent: bool}
     */
    public function notifyUser(User $user): array
    {
        $result = ['start_sent' => false, 'end_sent' => false];

        if (! $user->trading_window_enabled
            || ! $user->trading_window_start
            || ! $user->trading_window_end
            || ! $user->is_active
            || ! $user->is_approved
            || ! PushSubscription::where('user_id', $user->id)->exists()) {
            return $result;
        }

        try {
            $timezone = $user->timezone ?: 'Asia/Dhaka';
            $now = Carbon::now($timezone);
            [$start, $end] = $this->currentWindowFor($user, $now);
        } catch (\Throwable) {
            return $result;
        }

        $lastStart = $user->trading_window_start_notified_at
            ? Carbon::parse($user->trading_window_start_notified_at)
            : null;
        $lastEnd = $user->trading_window_end_notified_at
            ? Carbon::parse($user->trading_window_end_notified_at)
            : null;

        $shouldNotifyStart = $now->gte($start)
            && $now->lt($end)
            && ($lastStart === null || $lastStart->lt($start));

        $shouldNotifyEnd = $now->gte($end)
            && ($lastEnd === null || $lastEnd->lt($end));

        if (! $shouldNotifyStart && ! $shouldNotifyEnd) {
            return $result;
        }

        try {
            $this->service ??= new WebPushService;
        } catch (\Throwable) {
            return $result;
        }

        if ($shouldNotifyStart) {
            $sent = $this->service->sendToUser($user, [
                'title' => 'Trading Window Open',
                'body' => 'Your trading window ('.$this->formatTime($user->trading_window_start).' – '.$this->formatTime($user->trading_window_end).') is now open. Stay disciplined!',
                'tag' => 'trading-window-open-'.$user->id.'-'.$start->format('Ymd'),
                'url' => '/user/trade-journals/create',
            ]);

            if ($sent > 0) {
                $user->trading_window_start_notified_at = $start->copy()->setTimezone(config('app.timezone', 'UTC'));
                $user->save();
                $result['start_sent'] = true;
            }
        }

        if ($shouldNotifyEnd) {
            $sent = $this->service->sendToUser($user, [
                'title' => 'Trading Window Closed',
                'body' => $user->discipline_message ?: 'Your trading window has ended. No more trades today — stick to your plan.',
                'tag' => 'trading-window-close-'.$user->id.'-'.$end->format('Ymd'),
                'url' => '/user/trading-settings',
            ]);

            if ($sent > 0) {
                $user->trading_window_end_notified_at = $end->copy()->setTimezone(config('app.timezone', 'UTC'));
                $user->save();
                $result['end_sent'] = true;
            }
        }

        return $result;
    }

    /**
     * Resolve the active window occurrence for the given moment
     * (handles overnight windows where end <= start).
     *
     * @return array{0: Carbon, 1: Carbon}
     */
    public function currentWindowFor(User $user, Carbon $now): array
    {
        $startStr = substr($user->trading_window_start, 0, 5);
        $endStr = substr($user->trading_window_end, 0, 5);

        $start = $now->copy()->setTimeFromTimeString($startStr);

        // Before today's start time the active window is yesterday's occurrence
        if ($now->lt($start)) {
            $start->subDay();
        }

        $end = $start->copy()->setTimeFromTimeString($endStr);

        // Overnight window (e.g. 19:04 → 02:15): end falls on the next day
        if ($end->lte($start)) {
            $end->addDay();
        }

        return [$start, $end];
    }

    private function formatTime(string $time): string
    {
        $time = substr($time, 0, 5);
        [$h, $m] = explode(':', $time);
        $h = (int) $h;
        $period = $h >= 12 ? 'PM' : 'AM';
        $hour = $h % 12 ?: 12;

        return $hour.':'.$m.' '.$period;
    }
}
