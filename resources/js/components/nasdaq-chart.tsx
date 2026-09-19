import { useEffect, useRef } from 'react';

const WIDGET_URL = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';

function getConfig(theme: 'light' | 'dark') {
    return {
        autosize: false,
        symbol: 'US100',
        interval: 'D',
        timezone: 'Etc/UTC',
        theme,
        style: '1',
        locale: 'en',
        width: '100%',
        height: '580',
        backgroundColor: theme === 'dark' ? 'rgba(19, 23, 34, 1)' : 'rgba(255, 255, 255, 1)',
        gridColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
        hide_top_toolbar: false,
        hide_legend: true,
        save_image: false,
        hide_volume: true,
        allow_symbol_change: true,
        support_host: 'https://www.tradingview.com',
    };
}

type Props = {
    theme: 'light' | 'dark';
};

export default function NasdaqChart({ theme }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        container.innerHTML = '<div class="tradingview-widget-container__widget" style="height:580px;width:100%"></div>';

        const script = document.createElement('script');

        script.textContent = JSON.stringify(getConfig(theme));
        script.src = WIDGET_URL;
        script.async = true;
        script.type = 'text/javascript';

        container.appendChild(script);
    }, [theme]);

    return (
        <div
            ref={containerRef}
            className="tradingview-widget-container w-full overflow-hidden rounded-2xl border border-border/50"
            style={{ height: '600px' }}
        />
    );
}
