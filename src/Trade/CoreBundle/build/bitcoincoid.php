<?php
/**
 * Created by PhpStorm.
 * User: Ardi
 * Date: 08/09/2017
 * Time: 17.26
 */
namespace build\ccxt;

use build\ccxt\Exchange;


//------------------------------------------------------------------------------

class bitcoincoid extends Exchange {

    public function __construct ($options = array ()) {
        parent::__construct (array_merge(array (
            'id' => 'bitcoincoid',
            'name' => 'Bitcoin.co.id',
            'countries' => 'ID', // Indonesia
            'urls' => array (
                'logo' => 'https://user-images.githubusercontent.com/1294454/27766138-043c7786-5ecf-11e7-882b-809c14f38b53.jpg',
                'api' => array (
                    'public' => 'https://vip.bitcoin.co.id/api',
                    'private' => 'https://vip.bitcoin.co.id/tapi',
                ),
                'www' => 'https://www.bitcoin.co.id',
                'doc' => array (
                    'https://vip.bitcoin.co.id/downloads/BITCOINCOID-API-DOCUMENTATION.pdf',
                    'https://vip.bitcoin.co.id/trade_api',
                ),
            ),
            'api' => array (
                'public' => array (
                    'get' => array (
                        '{pair}/ticker',
                        '{pair}/trades',
                        '{pair}/depth',
                    ),
                ),
                'private' => array (
                    'post' => array (
                        'getInfo',
                        'transHistory',
                        'trade',
                        'tradeHistory',
                        'openOrders',
                        'cancelOrder',
                    ),
                ),
            ),
            'markets' => array (
                'BTC/IDR' =>  array ( 'id' => 'btc_idr', 'symbol' => 'BTC/IDR', 'base' => 'BTC', 'quote' => 'IDR', 'baseId' => 'btc', 'quoteId' => 'idr' ),
                'BTS/BTC' =>  array ( 'id' => 'bts_btc', 'symbol' => 'BTS/BTC', 'base' => 'BTS', 'quote' => 'BTC', 'baseId' => 'bts', 'quoteId' => 'btc' ),
                'DASH/BTC' => array ( 'id' => 'drk_btc', 'symbol' => 'DASH/BTC', 'base' => 'DASH', 'quote' => 'BTC', 'baseId' => 'drk', 'quoteId' => 'btc' ),
                'DOGE/BTC' => array ( 'id' => 'doge_btc', 'symbol' => 'DOGE/BTC', 'base' => 'DOGE', 'quote' => 'BTC', 'baseId' => 'doge', 'quoteId' => 'btc' ),
                'ETH/BTC' =>  array ( 'id' => 'eth_btc', 'symbol' => 'ETH/BTC', 'base' => 'ETH', 'quote' => 'BTC', 'baseId' => 'eth', 'quoteId' => 'btc' ),
                'LTC/BTC' =>  array ( 'id' => 'ltc_btc', 'symbol' => 'LTC/BTC', 'base' => 'LTC', 'quote' => 'BTC', 'baseId' => 'ltc', 'quoteId' => 'btc' ),
                'NXT/BTC' =>  array ( 'id' => 'nxt_btc', 'symbol' => 'NXT/BTC', 'base' => 'NXT', 'quote' => 'BTC', 'baseId' => 'nxt', 'quoteId' => 'btc' ),
                'STR/BTC' =>  array ( 'id' => 'str_btc', 'symbol' => 'STR/BTC', 'base' => 'STR', 'quote' => 'BTC', 'baseId' => 'str', 'quoteId' => 'btc' ),
                'NEM/BTC' =>  array ( 'id' => 'nem_btc', 'symbol' => 'NEM/BTC', 'base' => 'NEM', 'quote' => 'BTC', 'baseId' => 'nem', 'quoteId' => 'btc' ),
                'XRP/BTC' =>  array ( 'id' => 'xrp_btc', 'symbol' => 'XRP/BTC', 'base' => 'XRP', 'quote' => 'BTC', 'baseId' => 'xrp', 'quoteId' => 'btc' ),
            ),
        ), $options));
    }

    public function fetch_balance ($params = array ()) {
        $response = $this->privatePostGetInfo ();
        $balance = $response['return']['balance'];
        $frozen = $response['return']['balance_hold'];
        $result = array ( 'info' => $balance );
        for ($c = 0; $c < count ($this->currencies); $c++) {
            $currency = $this->currencies[$c];
            $lowercase = strtolower ($currency);
            $account = $this->account ();
            if (array_key_exists ($lowercase, $balance)) {
                $account['free'] = floatval ($balance[$lowercase]);
            }
            if (array_key_exists ($lowercase, $frozen)) {
                $account['used'] = floatval ($frozen[$lowercase]);
            }
            $account['total'] = $this->sum ($account['free'], $account['used']);
            $result[$currency] = $account;
        }
        return $result;
    }

    public function fetch_order_book ($market, $params = array ()) {
        $orderbook = $this->publicGetPairDepth (array_merge (array (
            'pair' => $this->market_id ($market),
        ), $params));
        $timestamp = $this->milliseconds ();
        $result = array (
            'bids' => array (),
            'asks' => array (),
            'timestamp' => $timestamp,
            'datetime' => $this->iso8601 ($timestamp),
        );
        $sides = array ( 'bids' => 'buy', 'asks' => 'sell' );
        $keys = array_keys ($sides);
        for ($k = 0; $k < count ($keys); $k++) {
            $key = $keys[$k];
            $side = $sides[$key];
            $orders = $orderbook[$side];
            for ($i = 0; $i < count ($orders); $i++) {
                $order = $orders[$i];
                $price = floatval ($order[0]);
                $amount = floatval ($order[1]);
                $result[$key][] = array ($price, $amount);
            }
        }
        return $result;
    }

    public function fetch_ticker ($market) {
        $pair = $this->market ($market);
        $response = $this->publicGetPairTicker (array (
            'pair' => $pair['id'],
        ));
        $ticker = $response['ticker'];
        $timestamp = floatval ($ticker['server_time']) * 1000;
        $baseVolume = 'vol_' . strtolower ($pair['baseId']);
        $quoteVolume = 'vol_' . strtolower ($pair['quoteId']);
        return array (
            'timestamp' => $timestamp,
            'datetime' => $this->iso8601 ($timestamp),
            'high' => floatval ($ticker['high']),
            'low' => floatval ($ticker['low']),
            'bid' => floatval ($ticker['buy']),
            'ask' => floatval ($ticker['sell']),
            'vwap' => null,
            'open' => null,
            'close' => null,
            'first' => null,
            'last' => floatval ($ticker['last']),
            'change' => null,
            'percentage' => null,
            'average' => null,
            'baseVolume' => floatval ($ticker[$baseVolume]),
            'quoteVolume' => floatval ($ticker[$quoteVolume]),
            'info' => $ticker,
        );
    }

    public function fetch_trades ($market, $params = array ()) {
        return $this->publicGetPairTrades (array_merge (array (
            'pair' => $this->market_id ($market),
        ), $params));
    }

    public function create_order ($market, $type, $side, $amount, $price = null, $params = array ()) {
        $p = $this->market ($market);
        $order = array (
            'pair' => $p['id'],
            'type' => $side,
            'price' => $price,
        );
        $base = strtolower ($p['base']);
        $order[$base] = $amount;
        $result = $this->privatePostTrade (array_merge ($order, $params));
        return array (
            'info' => $result,
            'id' => (string) $result['return']['order_id'],
        );
    }

    public function cancel_order ($id, $params = array ()) {
        return $this->privatePostCancelOrder (array_merge (array (
            'id' => $id,
        ), $params));
    }

    public function request ($path, $api = 'public', $method = 'GET', $params = array (), $headers = null, $body = null) {
        $url = $this->urls['api'][$api];
        if ($api == 'public') {
            $url .= '/' . $this->implode_params ($path, $params);
        } else {
            $body = $this->urlencode (array_merge (array (
                'method' => $path,
                'nonce' => $this->nonce (),
            ), $params));
            $headers = array (
                'Content-Type' => 'application/x-www-form-urlencoded',
                'Content-Length' => strlen ($body),
                'Key' => $this->apiKey,
                'Sign' => $this->hmac ($this->encode ($body), $this->encode ($this->secret), 'sha512'),
            );
        }
        $response = $this->fetch ($url, $method, $headers, $body);
        if (array_key_exists ('error', $response))
            throw new ExchangeError ($this->id . ' ' . $response['error']);
        return $response;
    }
}
