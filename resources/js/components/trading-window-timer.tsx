import { useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Clock, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type TradingWindow = {
    enabled: boolean;
    start: string | null;
    end: string | null;
    disciplineMessage: string | null;
    timezone: string;
};

function parseTime(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    return (h ?? 0) * 3600 + (m ?? 0) * 60;
}

function getTimezoneOffsetMs(tz: string): number {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const get = (type: string) => parseInt(parts.find((p) => p.type === type)?.value ?? '0', 10);

    const tzDate = new Date(Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second')));
    const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
    return tzDate.getTime() - utcDate.getTime();
}

function getSecondsLeft(startSec: number, endSec: number, tzOffsetMs: number): { active: boolean; seconds: number } {
    const now = Date.now() + tzOffsetMs;
    const d = new Date(now);
    const nowSec = d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds();

    if (startSec <= endSec) {
        if (nowSec >= startSec && nowSec < endSec) {
            return { active: true, seconds: endSec - nowSec };
        }
        if (nowSec < startSec) {
            return { active: false, seconds: startSec - nowSec };
        }
        return { active: false, seconds: 86400 - nowSec + startSec };
    }

    if (nowSec >= startSec) {
        return { active: true, seconds: 86400 - nowSec + endSec };
    }
    if (nowSec < endSec) {
        return { active: true, seconds: endSec - nowSec };
    }
    return { active: false, seconds: startSec - nowSec };
}

function pad(n: number): string {
    return String(n).padStart(2, '0');
}

function formatTime12(timeStr: string): string {
    const [h, m] = timeStr.split(':').map(Number);
    const period = (h ?? 0) >= 12 ? 'PM' : 'AM';
    const hour = (h ?? 0) % 12 || 12;
    return `${hour}:${pad(m ?? 0)} ${period}`;
}

function isInWindow(startSec: number, endSec: number, tzOffsetMs: number): boolean {
    const now = Date.now() + tzOffsetMs;
    const d = new Date(now);
    const nowSec = d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds();
    if (startSec <= endSec) {
        return nowSec >= startSec && nowSec < endSec;
    }
    return nowSec >= startSec || nowSec < endSec;
}

export function TradingWindowTimer() {
    const { tradingWindow } = usePage().props as unknown as { tradingWindow: TradingWindow | null };
    const clockRef = useRef<HTMLSpanElement>(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!tradingWindow?.enabled || !tradingWindow.start || !tradingWindow.end) {
            return;
        }

        const startSec = parseTime(tradingWindow.start);
        const endSec = parseTime(tradingWindow.end);
        const tz = tradingWindow.timezone;

        let tzOffsetMs: number;
        try {
            tzOffsetMs = getTimezoneOffsetMs(tz);
        } catch {
            tzOffsetMs = 0;
        }

        function update() {
            const { active, seconds } = getSecondsLeft(startSec, endSec, tzOffsetMs);
            if (active) {
                setShow(false);
                return;
            }
            setShow(true);
            if (clockRef.current) {
                const h = Math.floor(seconds / 3600);
                const m = Math.floor((seconds % 3600) / 60);
                const s = seconds % 60;
                clockRef.current.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
            }
        }

        update();
        const id = window.setInterval(update, 1000);
        return () => window.clearInterval(id);
    }, [tradingWindow?.enabled, tradingWindow?.start, tradingWindow?.end, tradingWindow?.timezone]);

    if (!show) {
        return null;
    }

    const startTime = tradingWindow?.start ? formatTime12(tradingWindow.start) : '';

    return (
        <Card className="border-2 border-red-500/50 bg-red-50/50 dark:bg-red-950/20">
            <CardContent className="flex items-center gap-3 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                    <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-400">
                            Trading Window Closed
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            Opens at {startTime}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span
                                ref={clockRef}
                                className="font-mono text-lg font-bold tabular-nums tracking-wider"
                            >
                                00:00:00
                            </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">opens in</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function useTradingWindowCheck(): { allowed: boolean; message: string | null } {
    const { tradingWindow } = usePage().props as unknown as { tradingWindow: TradingWindow | null };

    if (!tradingWindow?.enabled || !tradingWindow.start || !tradingWindow.end) {
        return { allowed: true, message: null };
    }
    const startSec = parseTime(tradingWindow.start);
    const endSec = parseTime(tradingWindow.end);
    const tzOffsetMs = getTimezoneOffsetMs(tradingWindow.timezone);
    const active = isInWindow(startSec, endSec, tzOffsetMs);
    return {
        allowed: active,
        message: tradingWindow.disciplineMessage || 'Trading is only allowed during your configured trading window. Stay disciplined!',
    };
}

export { formatTime12 };
