<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trade_journals', function (Blueprint $table) {
            $table->renameColumn('mft_market_trend', 'lft_market_trend');
        });

        Schema::table('trade_journals', function (Blueprint $table) {
            $table->enum('result', ['profit', 'loss', 'break_even'])->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('trade_journals', function (Blueprint $table) {
            $table->enum('result', ['profit', 'loss'])->nullable()->change();
        });

        Schema::table('trade_journals', function (Blueprint $table) {
            $table->renameColumn('lft_market_trend', 'mft_market_trend');
        });
    }
};
