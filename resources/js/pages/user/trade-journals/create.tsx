import { Head, Link, router } from '@inertiajs/react';
import TradeJournalForm from '@/components/trade-journal-form';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

type Props = {
    pairs: string[];
    sessions: string[];
    accounts: { id: number; account_name: string; balance: number }[];
    checklistRules: string[];
    dailyLimit: number;
    todayCount: number;
    withinTradingWindow: boolean;
    disciplineMessage: string | null;
};

const DEFAULT_DISCIPLINE_MSG = 'Discipline is the foundation of consistent trading. Respect your trading hours, review your plan, and wait for your next window. Patience pays!';

export default function CreateTradeJournal({ pairs, sessions, accounts, checklistRules, dailyLimit, todayCount, withinTradingWindow, disciplineMessage }: Props) {
    const limitReached = todayCount >= dailyLimit;
    const windowBlocked = !withinTradingWindow;
    const message = disciplineMessage || DEFAULT_DISCIPLINE_MSG;

    function handleClose() {
        router.visit('/user/trade-journals');
    }

    if (windowBlocked) {
        return (
            <>
                <Head title="Outside Trading Window" />
                <div className="flex h-full flex-1 items-center justify-center p-4">
                    <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <ShieldAlert className="h-5 w-5" />
                                    Trading Window Closed
                                </DialogTitle>
                                <DialogDescription className="pt-1 text-base">
                                    You are currently outside your configured trading window.
                                    <br /><br />
                                    <span className="font-medium text-foreground">
                                        {message}
                                    </span>
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button asChild>
                                    <Link href="/user/trade-journals">Back to Journals</Link>
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </>
        );
    }

    if (limitReached) {
        return (
            <>
                <Head title="Daily Limit Reached" />
                <div className="flex h-full flex-1 items-center justify-center p-4">
                    <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    Daily Limit Reached
                                </DialogTitle>
                                <DialogDescription className="pt-1 text-base">
                                    Great discipline! You've completed your {dailyLimit} {dailyLimit === 1 ? 'trade' : 'trades'} for today.
                                    <br /><br />
                                    <span className="font-medium text-foreground">
                                        Quality over quantity — a focused trader is a profitable trader. Rest, review your trades, and come back stronger tomorrow!
                                    </span>
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button asChild>
                                    <Link href="/user/trade-journals">Back to Journals</Link>
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="New Trade Entry" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <TradeJournalForm submitUrl="/user/trade-journals" pairs={pairs} sessions={sessions} accounts={accounts} checklistRules={checklistRules} />
            </div>
        </>
    );
}

CreateTradeJournal.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/user/dashboard' },
        { title: 'Trade Journal', href: '/user/trade-journals' },
        { title: 'New Trade', href: '/user/trade-journals/create' },
    ],
};
