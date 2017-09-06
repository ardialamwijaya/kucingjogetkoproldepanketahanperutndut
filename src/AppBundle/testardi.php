<?php
include 'build/ccxt.php';

$poloniex = new \ccxt\poloniex(array (
    'apiKey' => '4I1PGX20-BTL7WCLN-EP4ZL75X-91UUW0GQ',
    'secret' => '1b881e02af1be24adc9dc888d6a5b3ce2a632887673bbe7b5382cfd64d2fc4bd84ed0d17999356a0c5a659d915ece5df8c1ac95a320f66337502a663b8a128f2',
));

$poloniex = new \ccxt\poloniex();

$btcmarkets = new \ccxt\btcmarkets(array (
    'apiKey' => '237f7821-9a63-4151-8327-660af17543e6',
    'secret' => 'uuQeLXxF1l9mrs9on40apV3LOB+NdxyxMtwO7wOM1v32n88+ifPagmIYj699oWBHJCGY586H48UGiCtJ2jQByA',
));

$gdax = new \ccxt\gdax();

$kraken = new \ccxt\kraken();

$bitcoincoid = new \ccxt\bitcoincoid(array(
    'apiKey' => 'MPPN8XTQ-I359RDXX-TAGXOVOF-OWO7LWBB-DKGJCI24',
    'secret' => 'e61d4e71ab603c92c4274e1190acdec14200857566ab6fbd362c402aa2476eb7e9349e6a84758f9b'
));

$btcmarkets_tickers = $bitcoincoid->fetch_ticker("BTC/IDR");


var_dump($btcmarkets_tickers);
exit;
