<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'role', 'is_approved', 'is_active', 'daily_journal_limit', 'default_risk_pct', 'pip_values', 'trading_window_enabled', 'trading_window_start', 'trading_window_end', 'discipline_message', 'timezone'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    public const ROLE_ADMIN = 'admin';

    public const ROLE_MANAGER = 'manager';

    public const ROLE_USER = 'user';

    public const ROLES = [
        self::ROLE_ADMIN,
        self::ROLE_MANAGER,
        self::ROLE_USER,
    ];

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isManager(): bool
    {
        return $this->role === self::ROLE_MANAGER;
    }

    public function isUser(): bool
    {
        return $this->role === self::ROLE_USER;
    }

    public function hasRole(string ...$roles): bool
    {
        return in_array($this->role, $roles, true);
    }

    public function isApproved(): bool
    {
        return (bool) $this->is_approved;
    }

    public function isActive(): bool
    {
        return (bool) $this->is_active;
    }

    public function tradeJournals(): HasMany
    {
        return $this->hasMany(TradeJournal::class);
    }

    public function tradingPairs(): HasMany
    {
        return $this->hasMany(TradingPair::class);
    }

    public function tradingSessions(): HasMany
    {
        return $this->hasMany(TradingSession::class);
    }

    public function accountBalances(): HasMany
    {
        return $this->hasMany(AccountBalance::class);
    }

    public function templers(): HasMany
    {
        return $this->hasMany(Templer::class);
    }

    public function checklistRules(): HasMany
    {
        return $this->hasMany(ChecklistRule::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_approved' => 'boolean',
            'is_active' => 'boolean',
            'daily_journal_limit' => 'integer',
            'pip_values' => 'array',
            'trading_window_enabled' => 'boolean',
            'trading_window_start' => 'string',
            'trading_window_end' => 'string',
        ];
    }
}
