import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Pencil, Trash2, Plus, Settings2, DollarSign, BarChart3, ClipboardCheck, CalendarClock, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { TradingPair, TradingSession, AccountBalance, ChecklistRule } from '@/types/trading-settings';

type TradingWindowData = {
    enabled: boolean;
    start: string | null;
    end: string | null;
    disciplineMessage: string | null;
    timezone: string;
};

type Props = {
    pairs: TradingPair[];
    sessions: TradingSession[];
    accounts: AccountBalance[];
    checklistRules: ChecklistRule[];
    dailyJournalLimit: number;
    defaultRiskPct: number;
    pipValues: Record<string, number>;
    tradingWindow: TradingWindowData;
};

export default function TradingSettings({ pairs, sessions, accounts, checklistRules, dailyJournalLimit, defaultRiskPct, pipValues, tradingWindow }: Props) {
    return (
        <>
            <Head title="Trading Settings" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <TradingWindowSection tradingWindow={tradingWindow} />
                <PairsSection pairs={pairs} />
                <SessionsSection sessions={sessions} />
                <AccountsSection accounts={accounts} />
                <ChecklistRulesSection rules={checklistRules} />
                <DailyLimitSection dailyJournalLimit={dailyJournalLimit} />
                <DefaultRiskSection defaultRiskPct={defaultRiskPct} />
                <PipValuesSection pairs={pairs} pipValues={pipValues} />
            </div>
        </>
    );
}

/* ─── Trading Window ─── */
const TIMEZONES = [
    { value: 'Pacific/Auckland', label: 'Auckland (GMT+12/+13)' },
    { value: 'Australia/Sydney', label: 'Sydney (GMT+10/+11)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' },
    { value: 'Asia/Seoul', label: 'Seoul (GMT+9)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (GMT+8)' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong (GMT+8)' },
    { value: 'Asia/Singapore', label: 'Singapore (GMT+8)' },
    { value: 'Asia/Kolkata', label: 'Mumbai / Kolkata (GMT+5:30)' },
    { value: 'Asia/Dhaka', label: 'Dhaka (GMT+6)' },
    { value: 'Asia/Kathmandu', label: 'Kathmandu (GMT+5:45)' },
    { value: 'Asia/Dubai', label: 'Dubai (GMT+4)' },
    { value: 'Europe/Moscow', label: 'Moscow (GMT+3)' },
    { value: 'Europe/Istanbul', label: 'Istanbul (GMT+3)' },
    { value: 'Europe/Berlin', label: 'Berlin (GMT+1/+2)' },
    { value: 'Europe/Paris', label: 'Paris (GMT+1/+2)' },
    { value: 'Europe/London', label: 'London (GMT+0/+1)' },
    { value: 'Africa/Lagos', label: 'Lagos (GMT+1)' },
    { value: 'Africa/Nairobi', label: 'Nairobi (GMT+3)' },
    { value: 'America/New_York', label: 'New York (GMT-5/-4)' },
    { value: 'America/Chicago', label: 'Chicago (GMT-6/-5)' },
    { value: 'America/Denver', label: 'Denver (GMT-7/-6)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8/-7)' },
    { value: 'Pacific/Honolulu', label: 'Honolulu (GMT-10)' },
];

function TradingWindowSection({ tradingWindow }: { tradingWindow: TradingWindowData }) {
    const form = useForm({
        trading_window_enabled: tradingWindow.enabled,
        trading_window_start: tradingWindow.start ?? '13:45',
        trading_window_end: tradingWindow.end ?? '02:15',
        discipline_message: tradingWindow.disciplineMessage ?? '',
        timezone: tradingWindow.timezone ?? 'Asia/Dhaka',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        form.patch('/user/settings/trading-window', { preserveScroll: true });
    }

    const selectedTzLabel = TIMEZONES.find((t) => t.value === form.data.timezone)?.label ?? form.data.timezone;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" /> Trading Window (Discipline Timer)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Set your allowed trading hours. Outside this window, you won't be able to add trade journals. A countdown timer will appear on your dashboard.
                    </p>

                    {/* Enable/Disable Toggle */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => form.setData('trading_window_enabled', !form.data.trading_window_enabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                form.data.trading_window_enabled ? 'bg-green-600' : 'bg-muted'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    form.data.trading_window_enabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                        <Label className="text-sm font-medium">
                            {form.data.trading_window_enabled ? 'Enabled' : 'Disabled'}
                        </Label>
                    </div>

                    {/* Timezone Selector */}
                    <div className="space-y-1">
                        <Label htmlFor="tw-timezone" className="flex items-center gap-1.5">
                            Your Timezone
                        </Label>
                        <select
                            id="tw-timezone"
                            value={form.data.timezone}
                            onChange={(e) => form.setData('timezone', e.target.value)}
                            className="flex h-9 w-full max-w-md rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            {TIMEZONES.map((tz) => (
                                <option key={tz.value} value={tz.value}>{tz.label}</option>
                            ))}
                        </select>
                        <p className="text-xs text-muted-foreground">
                            All times below are in your selected timezone.
                        </p>
                        <InputError message={form.errors.timezone} />
                    </div>

                    {/* Time Inputs */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Label htmlFor="tw-start" className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" /> Start Time
                            </Label>
                            <Input
                                id="tw-start"
                                type="time"
                                value={form.data.trading_window_start}
                                onChange={(e) => form.setData('trading_window_start', e.target.value)}
                                className="w-40"
                            />
                            <InputError message={form.errors.trading_window_start} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="tw-end" className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" /> End Time
                            </Label>
                            <Input
                                id="tw-end"
                                type="time"
                                value={form.data.trading_window_end}
                                onChange={(e) => form.setData('trading_window_end', e.target.value)}
                                className="w-40"
                            />
                            <InputError message={form.errors.trading_window_end} />
                        </div>
                    </div>

                    {/* Discipline Message */}
                    <div className="space-y-1">
                        <Label htmlFor="discipline-msg">Custom Discipline Message</Label>
                        <Textarea
                            id="discipline-msg"
                            rows={3}
                            placeholder="e.g. Stay disciplined! Trading outside your window leads to emotional decisions. Trust your plan."
                            value={form.data.discipline_message}
                            onChange={(e) => form.setData('discipline_message', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            This message will be shown when you try to trade outside your allowed window.
                        </p>
                        <InputError message={form.errors.discipline_message} />
                    </div>

                    {/* Preview */}
                    {form.data.trading_window_enabled && form.data.trading_window_start && form.data.trading_window_end && (
                        <div className="rounded-lg border bg-muted/30 p-3">
                            <p className="text-xs font-medium text-muted-foreground">Preview:</p>
                            <p className="mt-1 text-sm">
                                Your trading window is{' '}
                                <span className="font-semibold">
                                    {formatTime(form.data.trading_window_start)} – {formatTime(form.data.trading_window_end)}
                                </span>{' '}
                                ({selectedTzLabel}). A countdown timer will show on your dashboard.
                            </p>
                        </div>
                    )}

                    <Button type="submit" disabled={form.processing} size="sm">
                        Save Trading Window
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

function formatTime(timeStr: string): string {
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

/* ─── Trading Pairs ─── */
function PairsSection({ pairs }: { pairs: TradingPair[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const form = useForm({ name: '' });

    function handleAdd(e: FormEvent) {
        e.preventDefault();
        form.post('/user/trading-pairs', { preserveScroll: true, onSuccess: () => form.reset() });
    }

    function startEdit(pair: TradingPair) {
        setEditingId(pair.id);
        setEditName(pair.name);
    }

    function handleUpdate(id: number) {
        router.put(`/user/trading-pairs/${id}`, { name: editName }, { preserveScroll: true, onSuccess: () => setEditingId(null) });
    }

    function confirmDelete() {
        if (deleteId) {
            router.delete(`/user/trading-pairs/${deleteId}`, {
                preserveScroll: true,
                onFinish: () => setDeleteId(null),
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" /> Trading Pairs
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleAdd} className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                        <Label htmlFor="new-pair">Add Pair</Label>
                        <Input
                            id="new-pair"
                            placeholder="e.g. EUR/USD"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                        />
                        <InputError message={form.errors.name} />
                    </div>
                    <Button type="submit" disabled={form.processing} size="sm">
                        <Plus className="mr-1 h-4 w-4" /> Add
                    </Button>
                </form>

                {pairs.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pair</TableHead>
                                <TableHead className="w-32 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pairs.map((pair) => (
                                <TableRow key={pair.id}>
                                    <TableCell>
                                        {editingId === pair.id ? (
                                            <Input
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleUpdate(pair.id)}
                                                className="h-8"
                                            />
                                        ) : (
                                            pair.name
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {editingId === pair.id ? (
                                            <div className="flex justify-end gap-1">
                                                <Button size="sm" variant="default" onClick={() => handleUpdate(pair.id)}>Save</Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => startEdit(pair)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(pair.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogTitle>Are you sure you want to delete this trading pair?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Once deleted, this trading pair will be permanently removed. This action cannot be undone.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

/* ─── Trading Sessions ─── */
function SessionsSection({ sessions }: { sessions: TradingSession[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const form = useForm({ name: '' });

    function handleAdd(e: FormEvent) {
        e.preventDefault();
        form.post('/user/trading-sessions', { preserveScroll: true, onSuccess: () => form.reset() });
    }

    function startEdit(session: TradingSession) {
        setEditingId(session.id);
        setEditName(session.name);
    }

    function handleUpdate(id: number) {
        router.put(`/user/trading-sessions/${id}`, { name: editName }, { preserveScroll: true, onSuccess: () => setEditingId(null) });
    }

    function confirmDelete() {
        if (deleteId) {
            router.delete(`/user/trading-sessions/${deleteId}`, {
                preserveScroll: true,
                onFinish: () => setDeleteId(null),
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5" /> Trading Sessions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleAdd} className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                        <Label htmlFor="new-session">Add Session</Label>
                        <Input
                            id="new-session"
                            placeholder="e.g. London"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                        />
                        <InputError message={form.errors.name} />
                    </div>
                    <Button type="submit" disabled={form.processing} size="sm">
                        <Plus className="mr-1 h-4 w-4" /> Add
                    </Button>
                </form>

                {sessions.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Session</TableHead>
                                <TableHead className="w-32 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessions.map((session) => (
                                <TableRow key={session.id}>
                                    <TableCell>
                                        {editingId === session.id ? (
                                            <Input
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleUpdate(session.id)}
                                                className="h-8"
                                            />
                                        ) : (
                                            session.name
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {editingId === session.id ? (
                                            <div className="flex justify-end gap-1">
                                                <Button size="sm" variant="default" onClick={() => handleUpdate(session.id)}>Save</Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => startEdit(session)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(session.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogTitle>Are you sure you want to delete this trading session?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Once deleted, this trading session will be permanently removed. This action cannot be undone.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

/* ─── Account Balances ─── */
function AccountsSection({ accounts }: { accounts: AccountBalance[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editAccountName, setEditAccountName] = useState('');
    const [editBalance, setEditBalance] = useState('');
    const [editStartingBalance, setEditStartingBalance] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const form = useForm({ account_name: '', balance: '', starting_balance: '' });

    function handleAdd(e: FormEvent) {
        e.preventDefault();
        form.post('/user/account-balances', { preserveScroll: true, onSuccess: () => form.reset() });
    }

    function startEdit(account: AccountBalance) {
        setEditingId(account.id);
        setEditAccountName(account.account_name);
        setEditBalance(account.balance.toString());
        setEditStartingBalance(account.starting_balance.toString());
    }

    function handleUpdate(id: number) {
        router.put(`/user/account-balances/${id}`, { account_name: editAccountName, balance: editBalance, starting_balance: editStartingBalance }, { preserveScroll: true, onSuccess: () => setEditingId(null) });
    }

    function confirmDelete() {
        if (deleteId) {
            router.delete(`/user/account-balances/${deleteId}`, {
                preserveScroll: true,
                onFinish: () => setDeleteId(null),
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" /> Account Balances
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleAdd} className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                        <Label htmlFor="new-account-name">Account Name</Label>
                        <Input
                            id="new-account-name"
                            placeholder="e.g. Main Account"
                            value={form.data.account_name}
                            onChange={(e) => form.setData('account_name', e.target.value)}
                        />
                        <InputError message={form.errors.account_name} />
                    </div>
                    <div className="w-40 space-y-1">
                        <Label htmlFor="new-starting-balance">Starting ($)</Label>
                        <Input
                            id="new-starting-balance"
                            type="number"
                            step="0.01"
                            placeholder="e.g. 10000"
                            value={form.data.starting_balance}
                            onChange={(e) => form.setData('starting_balance', e.target.value)}
                        />
                        <InputError message={form.errors.starting_balance} />
                    </div>
                    <div className="w-40 space-y-1">
                        <Label htmlFor="new-balance">Balance ($)</Label>
                        <Input
                            id="new-balance"
                            type="number"
                            step="0.01"
                            placeholder="e.g. 10000"
                            value={form.data.balance}
                            onChange={(e) => form.setData('balance', e.target.value)}
                        />
                        <InputError message={form.errors.balance} />
                    </div>
                    <Button type="submit" disabled={form.processing} size="sm">
                        <Plus className="mr-1 h-4 w-4" /> Add
                    </Button>
                </form>

                {accounts.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Account</TableHead>
                                <TableHead>Starting Balance</TableHead>
                                <TableHead>Balance</TableHead>
                                <TableHead className="w-32 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accounts.map((account) => (
                                <TableRow key={account.id}>
                                    <TableCell>
                                        {editingId === account.id ? (
                                            <Input
                                                value={editAccountName}
                                                onChange={(e) => setEditAccountName(e.target.value)}
                                                className="h-8"
                                            />
                                        ) : (
                                            account.account_name
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === account.id ? (
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={editStartingBalance}
                                                onChange={(e) => setEditStartingBalance(e.target.value)}
                                                className="h-8 w-32"
                                            />
                                        ) : (
                                            `$${Number(account.starting_balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === account.id ? (
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={editBalance}
                                                onChange={(e) => setEditBalance(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleUpdate(account.id)}
                                                className="h-8 w-32"
                                            />
                                        ) : (
                                            `$${Number(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {editingId === account.id ? (
                                            <div className="flex justify-end gap-1">
                                                <Button size="sm" variant="default" onClick={() => handleUpdate(account.id)}>Save</Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => startEdit(account)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(account.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogTitle>Are you sure you want to delete this account?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Once deleted, this account balance will be permanently removed. This action cannot be undone.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

/* ─── Checklist Rules ─── */
function ChecklistRulesSection({ rules }: { rules: ChecklistRule[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const form = useForm({ name: '' });

    function handleAdd(e: FormEvent) {
        e.preventDefault();
        form.post('/user/checklist-rules', { preserveScroll: true, onSuccess: () => form.reset() });
    }

    function startEdit(rule: ChecklistRule) {
        setEditingId(rule.id);
        setEditName(rule.name);
    }

    function handleUpdate(id: number) {
        router.put(`/user/checklist-rules/${id}`, { name: editName }, { preserveScroll: true, onSuccess: () => setEditingId(null) });
    }

    function confirmDelete() {
        if (deleteId) {
            router.delete(`/user/checklist-rules/${deleteId}`, {
                preserveScroll: true,
                onFinish: () => setDeleteId(null),
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" /> Checklist Rules
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleAdd} className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                        <Label htmlFor="new-rule">Add Rule</Label>
                        <Input
                            id="new-rule"
                            placeholder="e.g. Price in Supply/Demand Zone"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                        />
                        <InputError message={form.errors.name} />
                    </div>
                    <Button type="submit" disabled={form.processing} size="sm">
                        <Plus className="mr-1 h-4 w-4" /> Add
                    </Button>
                </form>

                {rules.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rule</TableHead>
                                <TableHead className="w-32 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rules.map((rule) => (
                                <TableRow key={rule.id}>
                                    <TableCell>
                                        {editingId === rule.id ? (
                                            <Input
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleUpdate(rule.id)}
                                                className="h-8"
                                            />
                                        ) : (
                                            rule.name
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {editingId === rule.id ? (
                                            <div className="flex justify-end gap-1">
                                                <Button size="sm" variant="default" onClick={() => handleUpdate(rule.id)}>Save</Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => startEdit(rule)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(rule.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogTitle>Are you sure you want to delete this checklist rule?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Once deleted, this checklist rule will be permanently removed. This action cannot be undone.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

/* ─── Daily Journal Limit ─── */
function DailyLimitSection({ dailyJournalLimit }: { dailyJournalLimit: number }) {
    const form = useForm({ daily_journal_limit: dailyJournalLimit });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        form.patch('/user/settings/daily-journal-limit', { preserveScroll: true });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarClock className="h-5 w-5" /> Daily Journal Limit
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex items-end gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="daily-limit">Max entries per day</Label>
                        <p className="text-muted-foreground text-sm">Set how many journal entries you can create each day (1–50).</p>
                        <Input
                            id="daily-limit"
                            type="number"
                            min={1}
                            max={50}
                            className="w-32"
                            value={form.data.daily_journal_limit}
                            onChange={(e) => form.setData('daily_journal_limit', Number(e.target.value))}
                        />
                        <InputError message={form.errors.daily_journal_limit} />
                    </div>
                    <Button type="submit" disabled={form.processing} size="sm">
                        Save Limit
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

/* ─── Default Risk Per Trade ─── */
function DefaultRiskSection({ defaultRiskPct }: { defaultRiskPct: number }) {
    const form = useForm({ default_risk_pct: Number(defaultRiskPct) });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        form.patch('/user/settings/default-risk', { preserveScroll: true });
    }

    const PRESETS = [0.5, 1, 1.5, 2, 2.5, 3, 5];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" /> Default Risk Per Trade
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            This will be pre-selected on the Position Size Calculator when you open it.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {PRESETS.map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => form.setData('default_risk_pct', r)}
                                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                                        form.data.default_risk_pct === r
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border bg-background hover:bg-muted'
                                    }`}
                                >
                                    {r}%
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <Label htmlFor="default-risk" className="shrink-0 text-sm text-muted-foreground">Custom:</Label>
                            <Input
                                id="default-risk"
                                type="number"
                                step="0.1"
                                min={0.1}
                                max={100}
                                className="w-28"
                                value={form.data.default_risk_pct}
                                onChange={(e) => form.setData('default_risk_pct', parseFloat(e.target.value) || 0)}
                            />
                            <span className="text-sm text-muted-foreground">%</span>
                        </div>
                        <InputError message={form.errors.default_risk_pct} />
                    </div>
                    <Button type="submit" disabled={form.processing} size="sm">
                        Save Default Risk
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

/* ─── Pip Values ─── */
const DEFAULT_PIP_VALUES: Record<string, number> = {
    'EUR/USD': 10, 'GBP/USD': 10, 'AUD/USD': 10, 'NZD/USD': 10,
    'USD/JPY': 10, 'USD/CHF': 10, 'USD/CAD': 10, 'USD/SGD': 10,
    'EUR/GBP': 10, 'EUR/JPY': 10, 'EUR/AUD': 10, 'EUR/CAD': 10,
    'GBP/JPY': 10, 'GBP/AUD': 10, 'GBP/CAD': 10,
    'AUD/JPY': 10, 'AUD/CAD': 10, 'CAD/JPY': 10,
    'XAU/USD': 10,
    'US30': 1, 'NAS100': 1, 'NDX100': 0.1,
    'GER40': 1, 'UK100': 1,
};

function PipValuesSection({ pairs, pipValues }: { pairs: TradingPair[]; pipValues: Record<string, number> }) {
    const [values, setValues] = useState<Record<string, string>>(() =>
        Object.fromEntries(
            pairs.map((p) => [p.name, String(pipValues[p.name] ?? DEFAULT_PIP_VALUES[p.name] ?? 10)])
        )
    );
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numeric = Object.fromEntries(
            Object.entries(values).map(([k, v]) => [k, parseFloat(v) || 10])
        );
        setProcessing(true);
        router.patch('/user/settings/pip-values', { pip_values: numeric }, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" /> Pip Values ($ per pip per standard lot)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {pairs.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Add trading pairs first to configure pip values.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                            {pairs.map((p) => (
                                <div key={p.name} className="flex items-center gap-2">
                                    <label className="w-24 shrink-0 text-sm font-medium">{p.name}</label>
                                    <span className="text-sm text-muted-foreground">$</span>
                                    <Input
                                        type="number"
                                        min="0.01"
                                        max="10000"
                                        step="0.01"
                                        className="w-24"
                                        value={values[p.name] ?? ''}
                                        onChange={(e) =>
                                            setValues((prev) => ({ ...prev, [p.name]: e.target.value }))
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <Button type="submit" disabled={processing || pairs.length === 0} size="sm">
                        Save Pip Values
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

TradingSettings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/user/dashboard' },
        { title: 'Trading Settings', href: '/user/trading-settings' },
    ],
};
