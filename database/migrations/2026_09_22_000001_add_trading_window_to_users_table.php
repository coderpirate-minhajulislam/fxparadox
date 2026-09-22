<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('trading_window_enabled')->default(false)->after('pip_values');
            $table->time('trading_window_start')->nullable()->after('trading_window_enabled');
            $table->time('trading_window_end')->nullable()->after('trading_window_start');
            $table->text('discipline_message')->nullable()->after('trading_window_end');
            $table->string('timezone', 50)->default('Asia/Dhaka')->after('discipline_message');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['trading_window_enabled', 'trading_window_start', 'trading_window_end', 'discipline_message', 'timezone']);
        });
    }
};
