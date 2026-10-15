<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('push_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->text('endpoint');
            $table->string('p256dh', 500);
            $table->string('auth', 500);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dateTime('trading_window_start_notified_at')->nullable()->after('timezone');
            $table->dateTime('trading_window_end_notified_at')->nullable()->after('trading_window_start_notified_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['trading_window_start_notified_at', 'trading_window_end_notified_at']);
        });

        Schema::dropIfExists('settings');
        Schema::dropIfExists('push_subscriptions');
    }
};
