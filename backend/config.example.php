<?php
// Copy to the PRIVATE release directory as config.local.php. Never upload it into public_html.
return [
    'origin' => 'https://bobsome1.com',
    'base_path' => '/prophecy',
    'registration_open' => true,
    'paypal_enabled' => false,
    'paypal_mode' => 'sandbox',
    'paypal_client_id' => '',
    'paypal_client_secret' => '',
    'paypal_merchant_id' => '',
    'pass_price_usd' => '', // Owner sets the exact positive USD price before checkout activation.
    'ai_enabled' => false,
    'openai_api_key' => '',
    'openai_model' => '', // Choose an available model supporting Chat Completions structured outputs.
    'ai_daily_limit' => 50, // Site-wide request-attempt cap, in addition to per-account limits.
];
