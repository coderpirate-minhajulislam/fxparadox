import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { TradingWindowTimer } from '@/components/trading-window-timer';
import { useTradingWindowPush } from '@/hooks/use-trading-window-push';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    useTradingWindowPush();

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="px-4 pt-4">
                    <TradingWindowTimer />
                </div>
                {children}
            </AppContent>
        </AppShell>
    );
}
