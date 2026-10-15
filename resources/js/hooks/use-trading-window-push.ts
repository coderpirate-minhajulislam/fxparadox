import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

type PushSettings = {
    enabled: boolean;
    vapidPublicKey: string;
};

type TradingWindowProps = {
    enabled: boolean;
    start: string | null;
    end: string | null;
};

function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

function arrayBufferToBase64url(buffer: ArrayBuffer | null): string {
    if (!buffer) {
        return '';
    }

    const bytes = new Uint8Array(buffer);
    let binary = '';

    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Synthesized 5-note ascending chime (same style as the reference project).
 * Plays when a push arrives while a tab is open; when the browser is closed
 * the OS notification sound is used instead.
 */
export function playNotificationSound() {
    try {
        const ctx = new AudioContext();

        const playNote = (freq: number, startTime: number, duration: number, vol: number, type: OscillatorType = 'sine') => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
            gain.gain.setValueAtTime(vol, startTime + duration * 0.5);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        const t = ctx.currentTime;
        // Loud 5-note ascending chime: C5 → E5 → G5 with harmonics
        playNote(523.25, t, 0.18, 0.7);
        playNote(1046.5, t, 0.18, 0.2, 'triangle');
        playNote(659.25, t + 0.18, 0.18, 0.8);
        playNote(1318.5, t + 0.18, 0.18, 0.25, 'triangle');
        playNote(783.99, t + 0.36, 0.5, 0.7);
        playNote(1567.98, t + 0.36, 0.5, 0.2, 'triangle');

        // Close the context shortly after so it doesn't linger
        setTimeout(() => {
            ctx.close().catch(() => {});
        }, 2000);
    } catch {
        // Audio not available
    }
}

async function syncPushSubscription(vapidPublicKey: string): Promise<void> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return;
    }

    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
            return;
        }

        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey).buffer as ArrayBuffer,
        });
    }

    const csrfToken =
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';

    await fetch('/push-subscriptions/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            Accept: 'application/json',
        },
        body: JSON.stringify({
            endpoint: subscription.endpoint,
            keys: {
                p256dh: arrayBufferToBase64url(subscription.getKey('p256dh')),
                auth: arrayBufferToBase64url(subscription.getKey('auth')),
            },
        }),
    });
}

/**
 * Registers the service worker and subscribes the browser to web push
 * while the user has a trading window enabled — so window start/end
 * notifications arrive even when the browser is closed.
 */
export function useTradingWindowPush() {
    const pageProps = usePage().props;
    const pushSettings = pageProps.pushSettings as PushSettings | undefined;
    const tradingWindow = pageProps.tradingWindow as TradingWindowProps | null | undefined;

    const vapidPublicKey = pushSettings?.vapidPublicKey ?? '';
    const settingsEnabled = pushSettings?.enabled ?? false;
    const windowEnabled = tradingWindow?.enabled ?? false;
    const swRegisteredRef = useRef(false);

    useEffect(() => {
        if (!settingsEnabled || !windowEnabled || !vapidPublicKey || swRegisteredRef.current) {
            return;
        }

        if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
            return;
        }

        swRegisteredRef.current = true;
        syncPushSubscription(vapidPublicKey).catch(() => {
            swRegisteredRef.current = false;
        });
    }, [settingsEnabled, windowEnabled, vapidPublicKey]);

    // Play the custom chime when the service worker delivers a push
    // while a tab is open (browser-closed delivery uses the OS sound).
    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return;
        }

        function handleMessage(event: MessageEvent) {
            if (event.data?.type === 'PLAY_NOTIFICATION_SOUND') {
                playNotificationSound();
            }
        }

        navigator.serviceWorker.addEventListener('message', handleMessage);

        return () => {
            navigator.serviceWorker.removeEventListener('message', handleMessage);
        };
    }, []);

    // Ask the server to check the trading window and fire start/end pushes.
    // Runs on load + every 15s so notifications fire even without the
    // scheduler cron, as long as a tab is open.
    useEffect(() => {
        if (!settingsEnabled || !windowEnabled) {
            return;
        }

        let cancelled = false;

        async function checkWindow() {
            try {
                const csrfToken =
                    (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';

                await fetch('/push-subscriptions/check-window', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        Accept: 'application/json',
                    },
                });
            } catch {
                // Silent — next tick will retry
            }
        }

        if (!cancelled) {
            checkWindow();
        }

        const intervalId = setInterval(() => {
            if (!cancelled) {
                checkWindow();
            }
        }, 15_000);

        return () => {
            cancelled = true;
            clearInterval(intervalId);
        };
    }, [settingsEnabled, windowEnabled]);
}
