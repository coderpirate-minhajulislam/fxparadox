<?php

namespace App\Http\Controllers;

use App\Models\PushSubscription;
use App\Services\TradingWindowNotifier;
use App\Services\WebPushService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $request->validate([
            'endpoint' => ['required', 'string', 'max:500'],
            'keys.p256dh' => ['required', 'string', 'max:500'],
            'keys.auth' => ['required', 'string', 'max:500'],
        ]);

        PushSubscription::updateOrCreate(
            ['endpoint' => $request->input('endpoint')],
            [
                'user_id' => $request->user()->id,
                'p256dh' => $request->input('keys.p256dh'),
                'auth' => $request->input('keys.auth'),
            ]
        );

        return response()->json(['success' => true]);
    }

    public function unsubscribe(Request $request): JsonResponse
    {
        $request->validate([
            'endpoint' => ['required', 'string'],
        ]);

        if ($request->input('endpoint') === 'all') {
            PushSubscription::where('user_id', $request->user()->id)->delete();
        } else {
            PushSubscription::where('user_id', $request->user()->id)
                ->where('endpoint', $request->input('endpoint'))
                ->delete();
        }

        return response()->json(['success' => true]);
    }

    /**
     * Send a test push notification to the current user's devices
     * so they can verify the full pipeline works.
     */
    public function test(Request $request): JsonResponse
    {
        $subscriptions = PushSubscription::where('user_id', $request->user()->id)->get();

        if ($subscriptions->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No push subscription found on this device. Click "Enable Push Notifications" first.',
            ], 422);
        }

        $service = new WebPushService;
        $sent = 0;

        foreach ($subscriptions as $sub) {
            try {
                if ($service->sendNotification($sub->endpoint, $sub->p256dh, $sub->auth, [
                    'title' => 'Test Push Notification',
                    'body' => 'If you see and hear this, trading window push notifications are working!',
                    'tag' => 'push-test-'.time(),
                    'url' => '/user/trading-settings',
                    'icon' => '/icon-192.png',
                ])) {
                    $sent++;
                } else {
                    $sub->delete();
                }
            } catch (\Throwable) {
                // Continue with next subscription
            }
        }

        if ($sent === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Push could not be delivered. Your subscription may be expired — try "Reset & Resubscribe".',
            ], 502);
        }

        return response()->json([
            'success' => true,
            'message' => "Test push sent to {$sent} device(s). Check for the notification (and sound) in a few seconds.",
        ]);
    }

    /**
     * Check the current user's trading window and fire start/end pushes
     * if a boundary was just crossed. Called by the frontend every few
     * seconds so notifications work even when the scheduler cron is not
     * running (as long as at least one tab is open).
     */
    public function checkWindow(Request $request, TradingWindowNotifier $notifier): JsonResponse
    {
        try {
            $result = $notifier->notifyUser($request->user());
        } catch (\Throwable) {
            return response()->json(['success' => false, 'start_sent' => false, 'end_sent' => false]);
        }

        return response()->json([
            'success' => true,
            'start_sent' => $result['start_sent'],
            'end_sent' => $result['end_sent'],
        ]);
    }
}
