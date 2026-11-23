<?php
declare(strict_types=1);
namespace Prophecy;

function loadConfig(string $directory): array
{
    $file = $directory . '/config.local.php';
    $local = is_file($file) ? require $file : [];
    if (!is_array($local)) throw new \RuntimeException('Invalid private configuration.');
    $config = array_replace([
        'origin' => 'https://bobsome1.com', 'base_path' => '/prophecy',
        'development' => false, 'registration_open' => true,
        'paypal_enabled' => false, 'paypal_mode' => 'sandbox',
        'paypal_client_id' => '', 'paypal_client_secret' => '', 'paypal_merchant_id' => '',
        'pass_price_usd' => '', 'ai_enabled' => false, 'openai_api_key' => '', 'openai_model' => '',
        'ai_daily_limit' => 50, 'registration_daily_limit' => 100,
    ], $local);
    foreach (['paypal_client_id','paypal_client_secret','paypal_merchant_id','openai_api_key','openai_model'] as $key) {
        $value = getenv('PROPHECY_' . strtoupper($key));
        if ($value !== false && $value !== '') $config[$key] = $value;
    }
    $config['directory'] = $directory;
    if (!is_string($config['base_path']) || !preg_match('~^(/[A-Za-z0-9_-]+)*$~D', $config['base_path'])) throw new \RuntimeException('Invalid application path.');
    $url = parse_url((string)$config['origin']);
    $development = $config['development'] === true && in_array($url['host'] ?? '', ['localhost','127.0.0.1','::1'], true);
    if (!$url || isset($url['user']) || isset($url['pass']) || isset($url['query']) || isset($url['fragment']) || !empty($url['path']) || (($url['scheme'] ?? '') !== 'https' && !$development)) throw new \RuntimeException('A fixed HTTPS origin is required.');
    if ($config['development'] && !$development) throw new \RuntimeException('Development is restricted to loopback origins.');
    foreach (['paypal_client_id','paypal_client_secret','paypal_merchant_id','openai_api_key','openai_model'] as $key) {
        if (!is_string($config[$key]) || strlen($config[$key]) > 512 || preg_match('/[\x00-\x20\x7f]/', $config[$key])) throw new \RuntimeException('Invalid provider configuration.');
    }
    return $config;
}
