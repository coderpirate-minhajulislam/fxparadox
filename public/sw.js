// Service Worker for Trading Window Push Notifications
// This runs in the background even when the browser is closed.
const SW_VERSION = '1.1';

self.addEventListener('push', function (event) {
    let data = {
        title: 'Trading Window',
        body: 'Your trading window has changed.',
        url: '/user/dashboard',
    };

    if (event.data) {
        try {
            const raw = event.data.text();
            data = Object.assign(data, JSON.parse(raw));
        } catch (e) {
            console.error('[SW] Failed to parse push data:', e);
        }
    }

    const options = {
        body: data.body,
        icon: data.icon || '/icon-192.png',
        badge: data.badge || data.icon || '/icon-192.png',
        tag: data.tag || 'trading-window-notification',
        requireInteraction: true,
        data: { url: data.url || '/user/dashboard' },
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options).then(function () {
            // Play the custom chime in any open app tab
            return clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
                clientList.forEach(function (client) {
                    client.postMessage({
                        type: 'PLAY_NOTIFICATION_SOUND',
                        payload: { tag: data.tag },
                    });
                });
            });
        }),
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const url = event.notification.data?.url || '/user/dashboard';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            for (const client of clientList) {
                if ('focus' in client) {
                    return client.focus().then(function (c) {
                        if (c && 'navigate' in c) {
                            c.navigate(url);
                        }
                    });
                }
            }
            return clients.openWindow(url);
        }),
    );
});

self.addEventListener('install', function () {
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim());
});

// Minimal fetch handler — required for PWA install eligibility
self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET') return;
    event.respondWith(fetch(event.request));
});
