<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        $contents = [
            // Hero Section
            ['section' => 'hero', 'key' => 'title', 'type' => 'text', 'value' => 'Smart Investing in Indices & Stocks', 'order' => 1],
            ['section' => 'hero', 'key' => 'subtitle', 'type' => 'text', 'value' => 'Trusted by 10,000+ Investors Worldwide', 'order' => 2],
            ['section' => 'hero', 'key' => 'description', 'type' => 'textarea', 'value' => 'FX Paradox delivers professional-grade analytics, real-time market intelligence, and advanced portfolio management tools to help you build wealth through strategic index and stock investments.', 'order' => 3],
            ['section' => 'hero', 'key' => 'button_text', 'type' => 'text', 'value' => 'Start Investing Today', 'order' => 4],
            ['section' => 'hero', 'key' => 'button_link', 'type' => 'text', 'value' => '/register', 'order' => 5],
            ['section' => 'hero', 'key' => 'image', 'type' => 'image', 'value' => null, 'order' => 6],

            // Stats Section
            ['section' => 'stats', 'key' => 'stat_1_value', 'type' => 'text', 'value' => '$2.5B+', 'order' => 1],
            ['section' => 'stats', 'key' => 'stat_1_label', 'type' => 'text', 'value' => 'Assets Under Management', 'order' => 2],
            ['section' => 'stats', 'key' => 'stat_2_value', 'type' => 'text', 'value' => '12+', 'order' => 3],
            ['section' => 'stats', 'key' => 'stat_2_label', 'type' => 'text', 'value' => 'Years of Excellence', 'order' => 4],
            ['section' => 'stats', 'key' => 'stat_3_value', 'type' => 'text', 'value' => '10,000+', 'order' => 5],
            ['section' => 'stats', 'key' => 'stat_3_label', 'type' => 'text', 'value' => 'Active Investors', 'order' => 6],
            ['section' => 'stats', 'key' => 'stat_4_value', 'type' => 'text', 'value' => '94%', 'order' => 7],
            ['section' => 'stats', 'key' => 'stat_4_label', 'type' => 'text', 'value' => 'Client Satisfaction', 'order' => 8],

            // Services Section
            ['section' => 'services', 'key' => 'title', 'type' => 'text', 'value' => 'Comprehensive Investment Solutions', 'order' => 1],
            ['section' => 'services', 'key' => 'description', 'type' => 'textarea', 'value' => 'From real-time market analysis to advanced portfolio management, we provide the tools and insights you need to succeed in indices and stock investing.', 'order' => 2],
            ['section' => 'services', 'key' => 'service_1_icon', 'type' => 'text', 'value' => 'BarChart3', 'order' => 3],
            ['section' => 'services', 'key' => 'service_1_title', 'type' => 'text', 'value' => 'Index Tracking', 'order' => 4],
            ['section' => 'services', 'key' => 'service_1_description', 'type' => 'textarea', 'value' => 'Monitor major indices like S&P 500, NASDAQ, Dow Jones, and global markets in real-time. Track performance and identify trends across global equity markets.', 'order' => 5],
            ['section' => 'services', 'key' => 'service_2_icon', 'type' => 'text', 'value' => 'Target', 'order' => 6],
            ['section' => 'services', 'key' => 'service_2_title', 'type' => 'text', 'value' => 'Stock Portfolio', 'order' => 7],
            ['section' => 'services', 'key' => 'service_2_description', 'type' => 'textarea', 'value' => 'Build and manage your stock portfolio with detailed analytics, dividend tracking, and comprehensive performance reports across all your holdings.', 'order' => 8],
            ['section' => 'services', 'key' => 'service_3_icon', 'type' => 'text', 'value' => 'TrendingUp', 'order' => 9],
            ['section' => 'services', 'key' => 'service_3_title', 'type' => 'text', 'value' => 'Growth Analytics', 'order' => 10],
            ['section' => 'services', 'key' => 'service_3_description', 'type' => 'textarea', 'value' => 'Gain deep insights into your investment patterns with advanced analytics, sector allocation, risk-reward analysis, and customizable reporting.', 'order' => 11],
            ['section' => 'services', 'key' => 'service_4_icon', 'type' => 'text', 'value' => 'Shield', 'order' => 12],
            ['section' => 'services', 'key' => 'service_4_title', 'type' => 'text', 'value' => 'Risk Management', 'order' => 13],
            ['section' => 'services', 'key' => 'service_4_description', 'type' => 'textarea', 'value' => 'Protect your capital with built-in risk management tools including position sizing calculators, diversification analysis, and exposure monitoring.', 'order' => 14],

            // About Section
            ['section' => 'about', 'key' => 'title', 'type' => 'text', 'value' => 'Why Smart Investors Choose FX Paradox', 'order' => 1],
            ['section' => 'about', 'key' => 'description', 'type' => 'textarea', 'value' => 'Founded by professional investors, FX Paradox was built to bridge the gap between retail and institutional investing. Our platform combines cutting-edge technology with decades of market expertise to help you build lasting wealth.', 'order' => 2],
            ['section' => 'about', 'key' => 'image', 'type' => 'image', 'value' => null, 'order' => 3],
            ['section' => 'about', 'key' => 'mission', 'type' => 'textarea', 'value' => 'To empower every investor with institutional-grade tools and analytics, making professional portfolio management accessible to everyone.', 'order' => 4],
            ['section' => 'about', 'key' => 'vision', 'type' => 'textarea', 'value' => 'To become the world\'s most trusted platform for index and stock investment analytics and portfolio management.', 'order' => 5],

            // Testimonials Section
            ['section' => 'testimonials', 'key' => 'title', 'type' => 'text', 'value' => 'Trusted by Professional Investors', 'order' => 1],
            ['section' => 'testimonials', 'key' => 'description', 'type' => 'textarea', 'value' => 'See what our community of investors has to say about their experience with FX Paradox.', 'order' => 2],
            ['section' => 'testimonials', 'key' => 'testimonial_1_name', 'type' => 'text', 'value' => 'Marcus Chen', 'order' => 3],
            ['section' => 'testimonials', 'key' => 'testimonial_1_role', 'type' => 'text', 'value' => 'Portfolio Manager', 'order' => 4],
            ['section' => 'testimonials', 'key' => 'testimonial_1_quote', 'type' => 'textarea', 'value' => 'FX Paradox transformed how I manage my index and stock investments. The analytics helped me optimize my portfolio allocation and improve returns by 18% in just three months.', 'order' => 5],
            ['section' => 'testimonials', 'key' => 'testimonial_2_name', 'type' => 'text', 'value' => 'Sarah Williams', 'order' => 6],
            ['section' => 'testimonials', 'key' => 'testimonial_2_role', 'type' => 'text', 'value' => 'Fund Manager', 'order' => 7],
            ['section' => 'testimonials', 'key' => 'testimonial_2_quote', 'type' => 'textarea', 'value' => 'The risk management features are second to none. I can monitor my entire equity portfolio in real-time and make informed decisions based on data, not emotions.', 'order' => 8],
            ['section' => 'testimonials', 'key' => 'testimonial_3_name', 'type' => 'text', 'value' => 'James Rodriguez', 'order' => 9],
            ['section' => 'testimonials', 'key' => 'testimonial_3_role', 'type' => 'text', 'value' => 'Independent Investor', 'order' => 10],
            ['section' => 'testimonials', 'key' => 'testimonial_3_quote', 'type' => 'textarea', 'value' => 'As a long-term investor, I need tools that are efficient and powerful. FX Paradox gives me everything I need to stay disciplined and grow my wealth consistently.', 'order' => 11],

            // CTA Section
            ['section' => 'cta', 'key' => 'title', 'type' => 'text', 'value' => 'Ready to Grow Your Wealth?', 'order' => 1],
            ['section' => 'cta', 'key' => 'description', 'type' => 'textarea', 'value' => 'Join thousands of investors already using FX Paradox to build wealth through strategic index and stock investing.', 'order' => 2],
            ['section' => 'cta', 'key' => 'button_text', 'type' => 'text', 'value' => 'Create Free Account', 'order' => 3],
            ['section' => 'cta', 'key' => 'button_link', 'type' => 'text', 'value' => '/register', 'order' => 4],

            // Contact Section
            ['section' => 'contact', 'key' => 'email', 'type' => 'text', 'value' => 'support@fxparadox.com', 'order' => 1],
            ['section' => 'contact', 'key' => 'phone', 'type' => 'text', 'value' => '+1 (555) 123-4567', 'order' => 2],
            ['section' => 'contact', 'key' => 'address', 'type' => 'text', 'value' => 'New York, NY 10001', 'order' => 3],

            // Footer Section
            ['section' => 'footer', 'key' => 'copyright', 'type' => 'text', 'value' => null, 'order' => 1],
            ['section' => 'footer', 'key' => 'description', 'type' => 'textarea', 'value' => 'FX Paradox is a leading investment platform providing institutional-grade analytics and portfolio management tools for index and stock investors worldwide.', 'order' => 2],
        ];

        foreach ($contents as $item) {
            SiteContent::updateOrCreate(
                ['section' => $item['section'], 'key' => $item['key']],
                $item
            );
        }
    }
}
