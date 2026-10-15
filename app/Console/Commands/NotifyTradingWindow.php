<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\TradingWindowNotifier;
use Illuminate\Console\Command;

class NotifyTradingWindow extends Command
{
    protected $signature = 'trading-window:notify {--user= : Only check a single user ID}';

    protected $description = 'Send web push notifications when a user\'s trading window starts or ends';

    public function handle(TradingWindowNotifier $notifier): int
    {
        $query = User::query()
            ->where('trading_window_enabled', true)
            ->whereNotNull('trading_window_start')
            ->whereNotNull('trading_window_end');

        if ($userId = $this->option('user')) {
            $query->whereKey($userId);
        }

        foreach ($query->get() as $user) {
            try {
                $result = $notifier->notifyUser($user);
            } catch (\Throwable $e) {
                $this->error("User #{$user->id}: {$e->getMessage()}");

                continue;
            }

            if ($result['start_sent']) {
                $this->info("Window-open push sent to user #{$user->id} ({$user->email}).");
            }

            if ($result['end_sent']) {
                $this->info("Window-close push sent to user #{$user->id} ({$user->email}).");
            }
        }

        return self::SUCCESS;
    }
}
