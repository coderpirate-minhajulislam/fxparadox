<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TradeJournalsExport implements FromCollection, ShouldAutoSize, WithHeadings, WithMapping, WithStyles
{
    use Exportable;

    public function __construct(protected Collection $journals) {}

    public function collection(): Collection
    {
        return $this->journals;
    }

    public function headings(): array
    {
        return [
            'Date', 'Day', 'Pair', 'Session',
            'Direction', 'HFT Trend', 'LFT Trend',
            'Risk:Reward', 'Lot Size', 'Result', 'P/L Amount',
            'Red News Time', 'Tags', 'Trade Comment',
        ];
    }

    public function map($journal): array
    {
        $plAmount = '';
        if ($journal->profit_loss_amount !== null) {
            $plAmount = match ($journal->result) {
                'profit' => '+'.number_format(abs($journal->profit_loss_amount), 2),
                'loss' => '-'.number_format(abs($journal->profit_loss_amount), 2),
                default => number_format(abs($journal->profit_loss_amount), 2),
            };
        }

        return [
            $journal->trade_date,
            $journal->day,
            $journal->pair,
            $journal->session,
            strtoupper($journal->direction),
            $journal->hft_market_trend,
            $journal->lft_market_trend,
            $journal->risk_reward ?? '',
            $journal->lot_size ?? '',
            $journal->result ? strtoupper(str_replace('_', ' ', $journal->result)) : '',
            $plAmount,
            $journal->red_news_time ?? '',
            is_array($journal->tags) ? implode(', ', $journal->tags) : '',
            $journal->trade_comment ?? '',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
