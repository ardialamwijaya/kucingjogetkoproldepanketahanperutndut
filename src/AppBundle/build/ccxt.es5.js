"use strict";

/*

MIT License

Copyright (c) 2017 Igor Kroitor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _objectValues(obj) {
    var values = [];
    var keys = Object.keys(obj);

    for (var k = 0; k < keys.length; ++k) values.push(obj[keys[k]]);

    return values;
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {

    //-----------------------------------------------------------------------------
    // dependencies

    var CryptoJS = require('crypto-js'),
        qs = require('qs'); // querystring
    // , ws       = require ('ws') // websocket

    //-----------------------------------------------------------------------------
    // this is updated by vss.js when building

    var version = '1.5.60';

    //-----------------------------------------------------------------------------
    // platform detection

    var isNode = typeof window === 'undefined',
        isCommonJS = typeof module !== 'undefined' && typeof require !== 'undefined';

    //-----------------------------------------------------------------------------

    var CCXTError = function (_Error) {
        _inherits(CCXTError, _Error);

        function CCXTError(message) {
            _classCallCheck(this, CCXTError);

            // a workaround to make `instanceof CCXTError` work in ES5
            var _this = _possibleConstructorReturn(this, (CCXTError.__proto__ || Object.getPrototypeOf(CCXTError)).call(this, message));

            _this.constructor = CCXTError;
            _this.__proto__ = CCXTError.prototype;
            _this.message = message;
            return _this;
        }

        return CCXTError;
    }(Error);

    var ExchangeError = function (_CCXTError) {
        _inherits(ExchangeError, _CCXTError);

        function ExchangeError(message) {
            _classCallCheck(this, ExchangeError);

            var _this2 = _possibleConstructorReturn(this, (ExchangeError.__proto__ || Object.getPrototypeOf(ExchangeError)).call(this, message));

            _this2.constructor = ExchangeError;
            _this2.__proto__ = ExchangeError.prototype;
            _this2.message = message;
            return _this2;
        }

        return ExchangeError;
    }(CCXTError);

    var NotSupported = function (_ExchangeError) {
        _inherits(NotSupported, _ExchangeError);

        function NotSupported(message) {
            _classCallCheck(this, NotSupported);

            var _this3 = _possibleConstructorReturn(this, (NotSupported.__proto__ || Object.getPrototypeOf(NotSupported)).call(this, message));

            _this3.constructor = NotSupported;
            _this3.__proto__ = NotSupported.prototype;
            _this3.message = message;
            return _this3;
        }

        return NotSupported;
    }(ExchangeError);

    var AuthenticationError = function (_ExchangeError2) {
        _inherits(AuthenticationError, _ExchangeError2);

        function AuthenticationError(message) {
            _classCallCheck(this, AuthenticationError);

            var _this4 = _possibleConstructorReturn(this, (AuthenticationError.__proto__ || Object.getPrototypeOf(AuthenticationError)).call(this, message));

            _this4.constructor = AuthenticationError;
            _this4.__proto__ = AuthenticationError.prototype;
            _this4.message = message;
            return _this4;
        }

        return AuthenticationError;
    }(ExchangeError);

    var InsufficientFunds = function (_ExchangeError3) {
        _inherits(InsufficientFunds, _ExchangeError3);

        function InsufficientFunds(message) {
            _classCallCheck(this, InsufficientFunds);

            var _this5 = _possibleConstructorReturn(this, (InsufficientFunds.__proto__ || Object.getPrototypeOf(InsufficientFunds)).call(this, message));

            _this5.constructor = InsufficientFunds;
            _this5.__proto__ = InsufficientFunds.prototype;
            _this5.message = message;
            return _this5;
        }

        return InsufficientFunds;
    }(ExchangeError);

    var NetworkError = function (_CCXTError2) {
        _inherits(NetworkError, _CCXTError2);

        function NetworkError(message) {
            _classCallCheck(this, NetworkError);

            var _this6 = _possibleConstructorReturn(this, (NetworkError.__proto__ || Object.getPrototypeOf(NetworkError)).call(this, message));

            _this6.constructor = NetworkError;
            _this6.__proto__ = NetworkError.prototype;
            _this6.message = message;
            return _this6;
        }

        return NetworkError;
    }(CCXTError);

    var DDoSProtection = function (_NetworkError) {
        _inherits(DDoSProtection, _NetworkError);

        function DDoSProtection(message) {
            _classCallCheck(this, DDoSProtection);

            var _this7 = _possibleConstructorReturn(this, (DDoSProtection.__proto__ || Object.getPrototypeOf(DDoSProtection)).call(this, message));

            _this7.constructor = DDoSProtection;
            _this7.__proto__ = DDoSProtection.prototype;
            _this7.message = message;
            return _this7;
        }

        return DDoSProtection;
    }(NetworkError);

    var RequestTimeout = function (_NetworkError2) {
        _inherits(RequestTimeout, _NetworkError2);

        function RequestTimeout(message) {
            _classCallCheck(this, RequestTimeout);

            var _this8 = _possibleConstructorReturn(this, (RequestTimeout.__proto__ || Object.getPrototypeOf(RequestTimeout)).call(this, message));

            _this8.constructor = RequestTimeout;
            _this8.__proto__ = RequestTimeout.prototype;
            _this8.message = message;
            return _this8;
        }

        return RequestTimeout;
    }(NetworkError);

    var ExchangeNotAvailable = function (_NetworkError3) {
        _inherits(ExchangeNotAvailable, _NetworkError3);

        function ExchangeNotAvailable(message) {
            _classCallCheck(this, ExchangeNotAvailable);

            var _this9 = _possibleConstructorReturn(this, (ExchangeNotAvailable.__proto__ || Object.getPrototypeOf(ExchangeNotAvailable)).call(this, message));

            _this9.constructor = ExchangeNotAvailable;
            _this9.__proto__ = ExchangeNotAvailable.prototype;
            _this9.message = message;
            return _this9;
        }

        return ExchangeNotAvailable;
    }(NetworkError);

    //-----------------------------------------------------------------------------
    // utility helpers

    var sleep = function sleep(ms) {
        return new Promise(function (resolve) {
            return setTimeout(resolve, ms);
        });
    };

    var decimal = function decimal(float) {
        return parseFloat(float).toString();
    };

    var timeout = function timeout(ms, promise) {
        return Promise.race([promise, sleep(ms).then(function () {
            throw new RequestTimeout('request timed out');
        })]);
    };

    var capitalize = function capitalize(string) {
        return string.length ? string.charAt(0).toUpperCase() + string.slice(1) : string;
    };

    var keysort = function keysort(object) {
        var result = {};
        Object.keys(object).sort().forEach(function (key) {
            return result[key] = object[key];
        });
        return result;
    };

    var extend = function extend() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var result = {};

        var _loop = function _loop(i) {
            if (_typeof(args[i]) === 'object') Object.keys(args[i]).forEach(function (key) {
                return result[key] = args[i][key];
            });
        };

        for (var i = 0; i < args.length; i++) {
            _loop(i);
        }return result;
    };

    var omit = function omit(object) {
        var result = extend(object);
        for (var i = 1; i < arguments.length; i++) {
            if (typeof arguments[i] === 'string') delete result[arguments[i]];else if (Array.isArray(arguments[i])) for (var k = 0; k < arguments[i].length; k++) {
                delete result[arguments[i][k]];
            }
        }return result;
    };

    var indexBy = function indexBy(array, key) {
        var result = {};
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (typeof element[key] != 'undefined') {
                result[element[key]] = element;
            }
        }
        return result;
    };

    var sortBy = function sortBy(array, key) {
        var descending = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        descending = descending ? -1 : 1;
        return array.sort(function (a, b) {
            return a[key] < b[key] ? -descending : a[key] > b[key] ? descending : 0;
        });
    };

    var flatten = function flatten(array) {
        var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        for (var i = 0, length = array.length; i < length; i++) {
            var value = array[i];
            if (Array.isArray(value)) {
                flatten(value, result);
            } else {
                result.push(value);
            }
        }
        return result;
    };

    var unique = function unique(array) {
        return array.filter(function (value, index, self) {
            return self.indexOf(value) == index;
        });
    };

    var pluck = function pluck(array, key) {
        return array.filter(function (element) {
            return typeof element[key] != 'undefined';
        }).map(function (element) {
            return element[key];
        });
    };

    var urlencode = function urlencode(object) {
        return qs.stringify(object);
    };

    var sum = function sum() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        var result = args.filter(function (arg) {
            return typeof arg != 'undefined';
        });
        return result.length > 0 ? result.reduce(function (sum, value) {
            return sum + value;
        }, 0) : undefined;
    };

    var ordered = function ordered(x) {
        return x;
    }; // a stub to keep assoc keys in order, in JS it does nothing, it's mostly for Python

    //-----------------------------------------------------------------------------
    // a cross-platform Fetch API

    var nodeFetch = isNode && module.require('node-fetch') // using module.require to prevent Webpack / React Native from trying to include it
    ,
        windowFetch = typeof window !== 'undefined' && window.fetch // native Fetch API (in newer browsers)
    ,
        xhrFetch = function xhrFetch(url, options) {
        var verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        return (// a quick ad-hoc polyfill (for older browsers)
            new Promise(function (resolve, reject) {

                if (verbose) console.log(url, options);

                var xhr = new XMLHttpRequest();
                var method = options.method || 'GET';

                xhr.open(method, url, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) resolve(xhr.responseText);else {
                            // [403, 404, ...].indexOf (xhr.status) >= 0
                            throw new Error(method, url, xhr.status, xhr.responseText);
                        }
                    }
                };

                if (typeof options.headers != 'undefined') for (var header in options.headers) {
                    xhr.setRequestHeader(header, options.headers[header]);
                }xhr.send(options.body);
            })
        );
    };

    var fetch = nodeFetch || windowFetch || xhrFetch;

    //-----------------------------------------------------------------------------
    // string ←→ binary ←→ base64 conversion routines

    var stringToBinary = function stringToBinary(str) {
        var arr = new Uint8Array(str.length);
        for (var i = 0; i < str.length; i++) {
            arr[i] = str.charCodeAt(i);
        }
        return CryptoJS.lib.WordArray.create(arr);
    };

    var stringToBase64 = function stringToBase64(string) {
        return CryptoJS.enc.Latin1.parse(string).toString(CryptoJS.enc.Base64);
    },
        utf16ToBase64 = function utf16ToBase64(string) {
        return CryptoJS.enc.Utf16.parse(string).toString(CryptoJS.enc.Base64);
    },
        base64ToBinary = function base64ToBinary(string) {
        return CryptoJS.enc.Base64.parse(string);
    },
        base64ToString = function base64ToString(string) {
        return CryptoJS.enc.Base64.parse(string).toString(CryptoJS.enc.Utf8);
    },
        binaryToString = function binaryToString(string) {
        return string;
    };

    var binaryConcat = function binaryConcat() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        return args.reduce(function (a, b) {
            return a.concat(b);
        });
    };

    // url-safe-base64 without equals signs, with + replaced by - and slashes replaced by underscores
    var urlencodeBase64 = function urlencodeBase64(base64string) {
        return base64string.replace(/[=]+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    };

    //-----------------------------------------------------------------------------
    // cryptography

    var hash = function hash(request) {
        var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'md5';
        var digest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'hex';

        var result = CryptoJS[hash.toUpperCase()](request);
        return digest == 'binary' ? result : result.toString(CryptoJS.enc[capitalize(digest)]);
    };

    var hmac = function hmac(request, secret) {
        var hash = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'sha256';
        var digest = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'hex';

        var encoding = digest == 'binary' ? 'Latin1' : capitalize(digest);
        return CryptoJS['Hmac' + hash.toUpperCase()](request, secret).toString(CryptoJS.enc[capitalize(encoding)]);
    };

    //-----------------------------------------------------------------------------
    // a JSON Web Token authentication method

    var jwt = function jwt(request, secret) {
        var alg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'HS256';
        var hash = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'sha256';

        var encodedHeader = urlencodeBase64(stringToBase64(JSON.stringify({ 'alg': alg, 'typ': 'JWT' }))),
            encodedData = urlencodeBase64(stringToBase64(JSON.stringify(request))),
            token = [encodedHeader, encodedData].join('.'),
            signature = urlencodeBase64(utf16ToBase64(hmac(token, secret, hash, 'utf16')));
        return [token, signature].join('.');
    };

    //-----------------------------------------------------------------------------
    // const WebSocket = require('ws')
    // const ws = new WebSocket (this.urls['websocket'])
    // ws.on ('open', function open () {
    //     console.log ('connected')
    //     // ws.send (Date.now ())
    // })
    // ws.on ('close', function close () {
    //     console.log ('disconnected')
    // });
    // ws.on ('message', function incoming (data) {
    //     // console.log (`Roundtrip time: ${Date.now() - data} ms`);
    //     setTimeout (function timeout () {
    //         ws.send (Date.now ())
    //     }, 500)
    // })
    //-----------------------------------------------------------------------------

    //-----------------------------------------------------------------------------
    // the base class

    var Exchange = function Exchange(config) {
        var _this15 = this;

        this.hash = hash;
        this.hmac = hmac;
        this.jwt = jwt; // JSON Web Token
        this.binaryConcat = binaryConcat;
        this.stringToBinary = stringToBinary;
        this.stringToBase64 = stringToBase64;
        this.base64ToBinary = base64ToBinary;
        this.base64ToString = base64ToString;
        this.binaryToString = binaryToString;
        this.utf16ToBase64 = utf16ToBase64;
        this.urlencode = urlencode;
        this.encodeURIComponent = encodeURIComponent;
        this.omit = omit;
        this.pluck = pluck;
        this.unique = unique;
        this.extend = extend;
        this.flatten = flatten;
        this.indexBy = indexBy;
        this.sortBy = sortBy;
        this.keysort = keysort;
        this.decimal = decimal;
        this.capitalize = capitalize;
        this.json = JSON.stringify;
        this.sum = sum;
        this.ordered = ordered;

        this.encode = function (string) {
            return string;
        };
        this.decode = function (string) {
            return string;
        };

        if (isNode) this.nodeVersion = process.version.match(/\d+\.\d+.\d+/)[0];

        this.init = function () {
            this.orders = {};
            this.trades = {};
            if (this.api) this.defineRESTAPI(this.api, 'request');
            if (this.markets) this.setMarkets(this.markets);
        };

        this.defineRESTAPI = function (api, methodName) {
            var _this10 = this;

            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            Object.keys(api).forEach(function (type) {
                Object.keys(api[type]).forEach(function (httpMethod) {
                    var urls = api[type][httpMethod];

                    var _loop2 = function _loop2(i) {
                        var url = urls[i].trim();
                        var splitPath = url.split(/[^a-zA-Z0-9]/);

                        var uppercaseMethod = httpMethod.toUpperCase();
                        var lowercaseMethod = httpMethod.toLowerCase();
                        var camelcaseMethod = capitalize(lowercaseMethod);
                        var camelcaseSuffix = splitPath.map(capitalize).join('');
                        var underscoreSuffix = splitPath.map(function (x) {
                            return x.trim().toLowerCase();
                        }).filter(function (x) {
                            return x.length > 0;
                        }).join('_');

                        if (camelcaseSuffix.indexOf(camelcaseMethod) === 0) camelcaseSuffix = camelcaseSuffix.slice(camelcaseMethod.length);

                        if (underscoreSuffix.indexOf(lowercaseMethod) === 0) underscoreSuffix = underscoreSuffix.slice(lowercaseMethod.length);

                        var camelcase = type + camelcaseMethod + capitalize(camelcaseSuffix);
                        var underscore = type + '_' + lowercaseMethod + '_' + underscoreSuffix;

                        if ('suffixes' in options) {
                            if ('camelcase' in options['suffixes']) camelcase += options['suffixes']['camelcase'];
                            if ('underscore' in options.suffixes) underscore += options['suffixes']['underscore'];
                        }

                        if ('underscore_suffix' in options) underscore += options.underscoreSuffix;
                        if ('camelcase_suffix' in options) camelcase += options.camelcaseSuffix;

                        var partial = function partial(params) {
                            return _this10[methodName](url, type, uppercaseMethod, params);
                        };

                        _this10[camelcase] = partial;
                        _this10[underscore] = partial;
                    };

                    for (var i = 0; i < urls.length; i++) {
                        _loop2(i);
                    }
                });
            });
        },

        // this.initializeStreamingAPI = function () {
        //     this.ws = new WebSocket (this.urls['websocket'])
        //     ws.on ('open', function open () {
        //         console.log ('connected')
        //         // ws.send (Date.now ())
        //     })
        //     ws.on ('close', function close () {
        //         console.log ('disconnected')
        //     })
        //     ws.on ('message', function incoming (data) {
        //         // console.log (`Roundtrip time: ${Date.now() - data} ms`);
        //         setTimeout (function timeout () {
        //             ws.send (Date.now ())
        //         }, 500)
        //     })
        // },

        this.fetch = function (url) {
            var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';

            var _this11 = this;

            var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var body = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;


            if (isNode && this.userAgent) if (typeof this.userAgent == 'string') headers = extend({ 'User-Agent': this.userAgent }, headers);else if (_typeof(this.userAgent) == 'object' && 'User-Agent' in this.userAgent) headers = extend(this.userAgent, headers);

            if (this.proxy.length) headers = extend({ 'Origin': '*' }, headers);

            var options = { 'method': method, 'headers': headers, 'body': body };

            url = this.proxy + url;

            if (this.verbose) console.log(this.id, method, url, "\nRequest:\n", options);

            return timeout(this.timeout, fetch(url, options).catch(function (e) {
                if (isNode) {
                    throw new ExchangeNotAvailable([_this11.id, method, url, e.type, e.message].join(' '));
                }
                throw e; // rethrow all unknown errors
            }).then(function (response) {

                if (typeof response == 'string') return response;

                return response.text().then(function (text) {
                    if (_this11.verbose) console.log(_this11.id, method, url, text ? "\nResponse:\n" + text : '');
                    if (response.status >= 200 && response.status <= 300) return text;
                    var error = undefined;
                    var details = text;
                    if ([429].indexOf(response.status) >= 0) {
                        error = DDoSProtection;
                    } else if ([404, 409, 422, 500, 501, 502, 520, 521, 522, 525].indexOf(response.status) >= 0) {
                        error = ExchangeNotAvailable;
                    } else if ([400, 403, 405, 503].indexOf(response.status) >= 0) {
                        var ddosProtection = text.match(/cloudflare|incapsula/i);
                        if (ddosProtection) {
                            error = DDoSProtection;
                        } else {
                            error = ExchangeNotAvailable;
                            details = text + ' (possible reasons: ' + ['invalid API keys', 'bad or old nonce', 'exchange is down or offline', 'on maintenance', 'DDoS protection', 'rate-limiting'].join(', ') + ')';
                        }
                    } else if ([408, 504].indexOf(response.status) >= 0) {
                        error = RequestTimeout;
                    } else if ([401, 511].indexOf(response.status) >= 0) {
                        error = AuthenticationError;
                    } else {
                        error = ExchangeError;
                    }
                    throw new error([_this11.id, method, url, response.status, response.statusText, details].join(' '));
                });
            }).then(function (response) {
                return _this11.handleResponse(url, method, headers, response);
            }));
        };

        this.handleResponse = function (url) {
            var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';
            var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var body = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;


            try {

                if (typeof body != 'string' || body.length < 2) throw new ExchangeError([this.id, method, url, 'returned empty response'].join(' '));
                return JSON.parse(body);
            } catch (e) {

                var maintenance = body.match(/offline|busy|retry|wait|unavailable|maintain|maintenance|maintenancing/i);
                var ddosProtection = body.match(/cloudflare|incapsula|overload/i);

                if (e instanceof SyntaxError) {

                    var error = ExchangeNotAvailable;
                    var details = 'not accessible from this location at the moment';
                    if (maintenance) details = 'offline, on maintenance or unreachable from this location at the moment';
                    if (ddosProtection) error = DDoSProtection;
                    throw new error([this.id, method, url, details].join(' '));
                }

                if (this.verbose) console.log(this.id, method, url, 'error', e, "response body:\n'" + body + "'");

                throw e;
            }
        };

        this.set_markets = this.setMarkets = function (markets) {
            var values = _objectValues(markets);
            this.markets = indexBy(values, 'symbol');
            this.marketsById = indexBy(markets, 'id');
            this.markets_by_id = this.marketsById;
            this.symbols = Object.keys(this.markets).sort();
            this.ids = Object.keys(this.markets_by_id).sort();
            var base = this.pluck(values.filter(function (market) {
                return 'base' in market;
            }), 'base');
            var quote = this.pluck(values.filter(function (market) {
                return 'quote' in market;
            }), 'quote');
            this.currencies = this.unique(base.concat(quote));
            return this.markets;
        };

        this.load_markets = this.loadMarkets = function () {
            var _this12 = this;

            var reload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!reload && this.markets) {
                if (!this.marketsById) {
                    return new Promise(function (resolve, reject) {
                        return resolve(_this12.setMarkets(_this12.markets));
                    });
                }
                return new Promise(function (resolve, reject) {
                    return resolve(_this12.markets);
                });
            }
            return this.fetchMarkets().then(function (markets) {
                return _this12.setMarkets(markets);
            });
        };

        this.fetch_tickers = function () {
            var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

            return this.fetchTickers(symbols);
        };

        this.fetchTickers = function () {
            var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

            throw new NotSupported(this.id + ' API does not allow to fetch all tickers at once with a single call to fetch_tickers () for now');
        };

        this.fetch_markets = function () {
            return this.fetchMarkets();
        };

        this.fetchMarkets = function () {
            var _this13 = this;

            return new Promise(function (resolve, reject) {
                return resolve(_this13.markets);
            });
        };

        this.fetchOrderStatus = function (id) {
            var market,
                order,
                _arguments = arguments;
            return Promise.resolve().then(function () {
                market = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : undefined;
                return fetchOrder(id);
            }).then(function (_resp) {
                order = _resp;

                return order['status'];
            });
        };

        this.account = function () {
            return {
                'free': 0.0,
                'used': 0.0,
                'total': 0.0
            };
        };

        this.commonCurrencyCode = function (currency) {
            if (!this.substituteCommonCurrencyCodes) return currency;
            if (currency == 'XBT') return 'BTC';
            if (currency == 'BCC') return 'BCH';
            if (currency == 'DRK') return 'DASH';
            return currency;
        };

        this.market = function (symbol) {
            return typeof symbol === 'string' && typeof this.markets != 'undefined' && typeof this.markets[symbol] != 'undefined' ? this.markets[symbol] : symbol;
        };

        this.market_id = this.marketId = function (symbol) {
            return this.market(symbol).id || symbol;
        };

        this.market_ids = this.marketIds = function (symbols) {
            var _this14 = this;

            return symbols.map(function (symbol) {
                return _this14.marketId(symbol);
            });
        };

        this.symbol = function (symbol) {
            return this.market(symbol).symbol || symbol;
        };

        this.extract_params = this.extractParams = function (string) {
            var re = /{([a-zA-Z0-9_]+?)}/g;
            var matches = [];
            var match = void 0;
            while (match = re.exec(string)) {
                matches.push(match[1]);
            }return matches;
        };

        this.implode_params = this.implodeParams = function (string, params) {
            for (var property in params) {
                string = string.replace('{' + property + '}', params[property]);
            }return string;
        };

        this.url = function (path) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var result = this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (Object.keys(query).length) result += '?' + this.urlencode(query);
            return result;
        };

        this.parseTrades = function (trades) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var result = [];
            for (var t = 0; t < trades.length; t++) {
                result.push(this.parseTrade(trades[t], market));
            }
            return result;
        };

        this.parseOrders = function (orders) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var result = [];
            for (var t = 0; t < orders.length; t++) {
                result.push(this.parseOrder(orders[t], market));
            }
            return result;
        };

        this.parseOHLCV = function (ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            return ohlcv;
        };

        this.parseOHLCVs = function (ohlcvs) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            var result = [];
            for (var t = 0; t < ohlcvs.length; t++) {
                result.push(this.parseOHLCV(ohlcvs[t], market, timeframe, since, limit));
            }
            return result;
        };

        this.createLimitBuyOrder = function (market, amount, price) {
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            return this.createOrder(market, 'limit', 'buy', amount, price, params);
        };

        this.createLimitSellOrder = function (market, amount, price) {
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            return this.createOrder(market, 'limit', 'sell', amount, price, params);
        };

        this.createMarketBuyOrder = function (market, amount) {
            var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            return this.createOrder(market, 'market', 'buy', amount, undefined, params);
        };

        this.createMarketSellOrder = function (market, amount) {
            var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            return this.createOrder(market, 'market', 'sell', amount, undefined, params);
        };

        this.iso8601 = function (timestamp) {
            return new Date(timestamp).toISOString();
        };
        this.parse8601 = Date.parse;
        this.seconds = function () {
            return Math.floor(_this15.milliseconds() / 1000);
        };
        this.microseconds = function () {
            return Math.floor(_this15.milliseconds() * 1000);
        };
        this.milliseconds = Date.now;
        this.nonce = this.seconds;
        this.id = undefined;
        this.rateLimit = 2000; // milliseconds = seconds * 1000
        this.timeout = 10000; // milliseconds = seconds * 1000
        this.verbose = false;
        this.userAgent = false;
        this.twofa = false; // two-factor authentication
        this.substituteCommonCurrencyCodes = true;
        this.yyyymmddhhmmss = function (timestamp) {
            var date = new Date(timestamp);
            var yyyy = date.getUTCFullYear();
            var MM = date.getUTCMonth();
            var dd = date.getUTCDay();
            var hh = date.getUTCHours();
            var mm = date.getUTCMinutes();
            var ss = date.getUTCSeconds();
            MM = MM < 10 ? '0' + MM : MM;
            dd = dd < 10 ? '0' + dd : dd;
            hh = hh < 10 ? '0' + hh : hh;
            mm = mm < 10 ? '0' + mm : mm;
            ss = ss < 10 ? '0' + ss : ss;
            return yyyy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss;
        };

        if (isNode) this.userAgent = {
            'User-Agent': 'ccxt/' + version + ' (+https://github.com/kroitor/ccxt)' + ' Node.js/' + this.nodeVersion + ' (JavaScript)'

            // prepended to URL, like https://proxy.com/https://exchange.com/api...
        };this.proxy = '';

        this.hasFetchTickers = false;
        this.hasFetchOHLCV = false;

        for (var property in config) {
            this[property] = config[property];
        }this.account = this.account;
        this.fetch_balance = this.fetchBalance;
        this.fetch_order_book = this.fetchOrderBook;
        this.fetch_ticker = this.fetchTicker;
        this.fetch_trades = this.fetchTrades;
        this.fetch_order = this.fetchOrder;
        this.fetch_order_status = this.fetchOrderStatus;
        this.parse_order_book = this.parseOrderBook;
        this.parse_trades = this.parseTrades;
        this.parse_orders = this.parseOrders;
        this.parse_ohlcv = this.parseOHLCV;
        this.parse_ohlcvs = this.parseOHLCVs;
        this.create_limit_buy_order = this.createLimitBuyOrder;
        this.create_limit_sell_order = this.createLimitBuyOrder;
        this.create_market_buy_order = this.createLimitBuyOrder;
        this.create_market_sell_order = this.createLimitBuyOrder;
        this.create_order = this.createOrder;

        this.init();
    };

    //=============================================================================

    var _1broker = {

        'id': '_1broker',
        'name': '1Broker',
        'countries': 'US',
        'rateLimit': 1500,
        'version': 'v2',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766021-420bd9fc-5ecb-11e7-8ed6-56d0081efed2.jpg',
            'api': 'https://1broker.com/api',
            'www': 'https://1broker.com',
            'doc': 'https://1broker.com/?c=en/content/api-documentation'
        },
        'api': {
            'private': {
                'get': ['market/bars', 'market/categories', 'market/details', 'market/list', 'market/quotes', 'market/ticks', 'order/cancel', 'order/create', 'order/open', 'position/close', 'position/close_cancel', 'position/edit', 'position/history', 'position/open', 'position/shared/get', 'social/profile_statistics', 'social/profile_trades', 'user/bitcoin_deposit_address', 'user/details', 'user/overview', 'user/quota_status', 'user/transaction_log']
            }
        },

        fetchCategories: function fetchCategories() {
            var categories,
                _this17 = this;

            return Promise.resolve().then(function () {
                return _this17.privateGetMarketCategories();
            }).then(function (_resp) {
                categories = _resp;

                return categories['response'];
            });
        },
        fetchMarkets: function fetchMarkets() {
            function _recursive() {
                if (c < categories.length) {
                    return Promise.resolve().then(function () {
                        category = categories[c];
                        return this_.privateGetMarketList({
                            'category': category.toLowerCase()
                        });
                    }).then(function (_resp) {
                        markets = _resp;

                        for (p = 0; p < markets['response'].length; p++) {
                            market = markets['response'][p];
                            id = market['symbol'];
                            symbol = undefined;
                            base = undefined;
                            quote = undefined;

                            if (category == 'FOREX' || category == 'CRYPTO') {
                                symbol = market['name'];
                                parts = symbol.split('/');

                                base = parts[0];
                                quote = parts[1];
                            } else {
                                base = id;
                                quote = 'USD';
                                symbol = base + '/' + quote;
                            }
                            base = this_.commonCurrencyCode(base);
                            quote = this_.commonCurrencyCode(quote);
                            result.push({
                                'id': id,
                                'symbol': symbol,
                                'base': base,
                                'quote': quote,
                                'info': market
                            });
                        }
                        c++;
                        return _recursive();
                    });
                }
            }

            var this_,
                categories,
                result,
                c,
                category,
                markets,
                p,
                market,
                id,
                symbol,
                base,
                quote,
                parts,
                _this18 = this;

            return Promise.resolve().then(function () {
                this_ = _this18; // workaround for Babel bug (not passing `this` to _recursive() call)

                return _this18.fetchCategories();
            }).then(function (_resp) {
                categories = _resp;
                result = [];
                c = 0;
                return _recursive();
            }).then(function () {
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                balance,
                response,
                result,
                c,
                currency,
                total,
                _this22 = this,
                _arguments7 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments7.length > 0 && _arguments7[0] !== undefined ? _arguments7[0] : {};
                return _this22.loadMarkets();
            }).then(function () {
                return _this22.privateGetUserOverview();
            }).then(function (_resp) {
                balance = _resp;
                response = balance['response'];
                result = {
                    'info': response
                };

                for (c = 0; c < _this22.currencies.length; c++) {
                    currency = _this22.currencies[c];

                    result[currency] = _this22.account();
                }
                total = parseFloat(response['balance']);

                result['BTC']['free'] = total;
                result['BTC']['total'] = total;
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                bidPrice,
                askPrice,
                bid,
                ask,
                _this23 = this,
                _arguments8 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments8.length > 1 && _arguments8[1] !== undefined ? _arguments8[1] : {};
                return _this23.loadMarkets();
            }).then(function () {
                return _this23.privateGetMarketQuotes(_this23.extend({
                    'symbols': _this23.marketId(market)
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['response'][0];
                timestamp = _this23.parse8601(orderbook['updated']);
                bidPrice = parseFloat(orderbook['bid']);
                askPrice = parseFloat(orderbook['ask']);
                bid = [bidPrice, undefined];
                ask = [askPrice, undefined];

                return {
                    'timestamp': timestamp,
                    'datetime': _this23.iso8601(timestamp),
                    'bids': [bid],
                    'asks': [ask]
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this24 = this;

            throw new ExchangeError(_this24.id + ' fetchTrades () method not implemented yet');
        },
        fetchTicker: function fetchTicker(market) {
            var result,
                orderbook,
                ticker,
                timestamp,
                _this25 = this;

            return Promise.resolve().then(function () {
                return _this25.loadMarkets();
            }).then(function () {
                return _this25.privateGetMarketBars({
                    'symbol': _this25.marketId(market),
                    'resolution': 60,
                    'limit': 1
                });
            }).then(function (_resp) {
                result = _resp;
                return _this25.fetchOrderBook(market);
            }).then(function (_resp) {
                orderbook = _resp;
                ticker = result['response'][0];
                timestamp = _this25.parse8601(ticker['date']);

                return {
                    'timestamp': timestamp,
                    'datetime': _this25.iso8601(timestamp),
                    'high': parseFloat(ticker['h']),
                    'low': parseFloat(ticker['l']),
                    'bid': orderbook['bids'][0][0],
                    'ask': orderbook['asks'][0][0],
                    'vwap': undefined,
                    'open': parseFloat(ticker['o']),
                    'close': parseFloat(ticker['c']),
                    'first': undefined,
                    'last': undefined,
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': undefined
                };
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                result,
                _this26 = this,
                _arguments11 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments11.length > 4 && _arguments11[4] !== undefined ? _arguments11[4] : undefined;
                params = _arguments11.length > 5 && _arguments11[5] !== undefined ? _arguments11[5] : {};
                return _this26.loadMarkets();
            }).then(function () {
                order = {
                    'symbol': _this26.marketId(market),
                    'margin': amount,
                    'direction': side == 'sell' ? 'short' : 'long',
                    'leverage': 1,
                    'type': side
                };

                if (type == 'limit') {
                    order['price'] = price;
                } else {
                    order['type'] += '_market';
                }return _this26.privateGetOrderCreate(_this26.extend(order, params));
            }).then(function (_resp) {
                result = _resp;

                return {
                    'info': result,
                    'id': result['response']['order_id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this27 = this;

            return Promise.resolve().then(function () {
                return _this27.loadMarkets();
            }).then(function () {
                return _this27.privatePostOrderCancel({ 'order_id': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                response,
                _this28 = this,
                _arguments13 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments13.length > 1 && _arguments13[1] !== undefined ? _arguments13[1] : 'public';
                method = _arguments13.length > 2 && _arguments13[2] !== undefined ? _arguments13[2] : 'GET';
                params = _arguments13.length > 3 && _arguments13[3] !== undefined ? _arguments13[3] : {};
                headers = _arguments13.length > 4 && _arguments13[4] !== undefined ? _arguments13[4] : undefined;
                body = _arguments13.length > 5 && _arguments13[5] !== undefined ? _arguments13[5] : undefined;

                if (!_this28.apiKey) {
                    throw new AuthenticationError(_this28.id + ' requires apiKey for all requests');
                }url = _this28.urls['api'] + '/' + _this28.version + '/' + path + '.php';
                query = _this28.extend({ 'token': _this28.apiKey }, params);

                url += '?' + _this28.urlencode(query);
                return _this28.fetch(url, method);
            }).then(function (_resp) {
                response = _resp;

                if ('warning' in response) {
                    if (response['warning']) {
                        throw new ExchangeError(_this28.id + ' Warning: ' + response['warning_message']);
                    }
                }if ('error' in response) {
                    if (response['error']) {
                        throw new ExchangeError(_this28.id + ' Error: ' + response['error_code'] + response['error_message']);
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var cryptocapital = {

        'id': 'cryptocapital',
        'name': 'Crypto Capital',
        'comment': 'Crypto Capital API',
        'countries': 'PA', // Panama
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27993158-7a13f140-64ac-11e7-89cc-a3b441f0b0f8.jpg',
            'www': 'https://cryptocapital.co',
            'doc': 'https://github.com/cryptocap'
        },
        'api': {
            'public': {
                'get': ['stats', 'historical-prices', 'order-book', 'transactions']
            },
            'private': {
                'post': ['balances-and-info', 'open-orders', 'user-transactions', 'btc-deposit-address/get', 'btc-deposit-address/new', 'deposits/get', 'withdrawals/get', 'orders/new', 'orders/edit', 'orders/cancel', 'orders/status', 'withdrawals/new']
            }
        },

        fetchBalance: function fetchBalance() {
            var params,
                response,
                balance,
                result,
                c,
                currency,
                account,
                _this29 = this,
                _arguments14 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments14.length > 0 && _arguments14[0] !== undefined ? _arguments14[0] : {};
                return _this29.privatePostBalancesAndInfo();
            }).then(function (_resp) {
                response = _resp;
                balance = response['balances-and-info'];
                result = { 'info': balance };

                for (c = 0; c < _this29.currencies.length; c++) {
                    currency = _this29.currencies[c];
                    account = _this29.account();

                    if (currency in balance['available']) {
                        account['free'] = parseFloat(balance['available'][currency]);
                    }if (currency in balance['on_hold']) {
                        account['used'] = parseFloat(balance['on_hold'][currency]);
                    }account['total'] = _this29.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                _timestamp,
                price,
                amount,
                _this30 = this,
                _arguments15 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments15.length > 1 && _arguments15[1] !== undefined ? _arguments15[1] : {};
                return _this30.publicGetOrderBook(_this30.extend({
                    'currency': _this30.marketId(market)
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['order-book'];
                timestamp = _this30.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this30.iso8601(timestamp)
                };
                sides = { 'bids': 'bid', 'asks': 'ask' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        _timestamp = parseInt(order['timestamp']) * 1000;
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['order_amount']);

                        result[key].push([price, amount, _timestamp]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                timestamp,
                _this31 = this;

            return Promise.resolve().then(function () {
                return _this31.publicGetStats({
                    'currency': _this31.marketId(market)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['stats'];
                timestamp = _this31.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this31.iso8601(timestamp),
                    'high': parseFloat(ticker['max']),
                    'low': parseFloat(ticker['min']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last_price']),
                    'change': parseFloat(ticker['daily_change']),
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['total_btc_traded'])
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this32 = this,
                _arguments17 = arguments;

            params = _arguments17.length > 1 && _arguments17[1] !== undefined ? _arguments17[1] : {};

            return _this32.publicGetTransactions(_this32.extend({
                'currency': _this32.marketId(market)
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                result,
                _this33 = this,
                _arguments18 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments18.length > 4 && _arguments18[4] !== undefined ? _arguments18[4] : undefined;
                params = _arguments18.length > 5 && _arguments18[5] !== undefined ? _arguments18[5] : {};
                order = {
                    'side': side,
                    'type': type,
                    'currency': _this33.marketId(market),
                    'amount': amount
                };

                if (type == 'limit') {
                    order['limit_price'] = price;
                }return _this33.privatePostOrdersNew(_this33.extend(order, params));
            }).then(function (_resp) {
                result = _resp;

                return {
                    'info': result,
                    'id': result
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this34 = this;

            return _this34.privatePostOrdersCancel({ 'id': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                request,
                response,
                errors,
                e,
                error,
                _this35 = this,
                _arguments20 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments20.length > 1 && _arguments20[1] !== undefined ? _arguments20[1] : 'public';
                method = _arguments20.length > 2 && _arguments20[2] !== undefined ? _arguments20[2] : 'GET';
                params = _arguments20.length > 3 && _arguments20[3] !== undefined ? _arguments20[3] : {};
                headers = _arguments20.length > 4 && _arguments20[4] !== undefined ? _arguments20[4] : undefined;
                body = _arguments20.length > 5 && _arguments20[5] !== undefined ? _arguments20[5] : undefined;

                if (_this35.id == 'cryptocapital') {
                    throw new ExchangeError(_this35.id + ' is an abstract base API for _1btcxe');
                }url = _this35.urls['api'] + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this35.urlencode(params);
                    }
                } else {
                    query = _this35.extend({
                        'api_key': _this35.apiKey,
                        'nonce': _this35.nonce()
                    }, params);
                    request = _this35.json(query);

                    query['signature'] = _this35.hmac(_this35.encode(request), _this35.encode(_this35.secret));
                    body = _this35.json(query);
                    headers = { 'Content-Type': 'application/json' };
                }
                return _this35.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('errors' in response) {
                    errors = [];

                    for (e = 0; e < response['errors'].length; e++) {
                        error = response['errors'][e];

                        errors.push(error['code'] + ': ' + error['message']);
                    }
                    errors = errors.join(' ');
                    throw new ExchangeError(_this35.id + ' ' + errors);
                }
                return _this35.fetch(url, method, headers, body);
            });
        }
    };

    //-----------------------------------------------------------------------------

    var _1btcxe = extend(cryptocapital, {

        'id': '_1btcxe',
        'name': '1BTCXE',
        'countries': 'PA', // Panama
        'comment': 'Crypto Capital API',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766049-2b294408-5ecc-11e7-85cc-adaff013dc1a.jpg',
            'api': 'https://1btcxe.com/api',
            'www': 'https://1btcxe.com',
            'doc': 'https://1btcxe.com/api-docs.php'
        },
        'markets': {
            'BTC/USD': { 'id': 'USD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/EUR': { 'id': 'EUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'BTC/CNY': { 'id': 'CNY', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY' },
            'BTC/RUB': { 'id': 'RUB', 'symbol': 'BTC/RUB', 'base': 'BTC', 'quote': 'RUB' },
            'BTC/CHF': { 'id': 'CHF', 'symbol': 'BTC/CHF', 'base': 'BTC', 'quote': 'CHF' },
            'BTC/JPY': { 'id': 'JPY', 'symbol': 'BTC/JPY', 'base': 'BTC', 'quote': 'JPY' },
            'BTC/GBP': { 'id': 'GBP', 'symbol': 'BTC/GBP', 'base': 'BTC', 'quote': 'GBP' },
            'BTC/CAD': { 'id': 'CAD', 'symbol': 'BTC/CAD', 'base': 'BTC', 'quote': 'CAD' },
            'BTC/AUD': { 'id': 'AUD', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD' },
            'BTC/AED': { 'id': 'AED', 'symbol': 'BTC/AED', 'base': 'BTC', 'quote': 'AED' },
            'BTC/BGN': { 'id': 'BGN', 'symbol': 'BTC/BGN', 'base': 'BTC', 'quote': 'BGN' },
            'BTC/CZK': { 'id': 'CZK', 'symbol': 'BTC/CZK', 'base': 'BTC', 'quote': 'CZK' },
            'BTC/DKK': { 'id': 'DKK', 'symbol': 'BTC/DKK', 'base': 'BTC', 'quote': 'DKK' },
            'BTC/HKD': { 'id': 'HKD', 'symbol': 'BTC/HKD', 'base': 'BTC', 'quote': 'HKD' },
            'BTC/HRK': { 'id': 'HRK', 'symbol': 'BTC/HRK', 'base': 'BTC', 'quote': 'HRK' },
            'BTC/HUF': { 'id': 'HUF', 'symbol': 'BTC/HUF', 'base': 'BTC', 'quote': 'HUF' },
            'BTC/ILS': { 'id': 'ILS', 'symbol': 'BTC/ILS', 'base': 'BTC', 'quote': 'ILS' },
            'BTC/INR': { 'id': 'INR', 'symbol': 'BTC/INR', 'base': 'BTC', 'quote': 'INR' },
            'BTC/MUR': { 'id': 'MUR', 'symbol': 'BTC/MUR', 'base': 'BTC', 'quote': 'MUR' },
            'BTC/MXN': { 'id': 'MXN', 'symbol': 'BTC/MXN', 'base': 'BTC', 'quote': 'MXN' },
            'BTC/NOK': { 'id': 'NOK', 'symbol': 'BTC/NOK', 'base': 'BTC', 'quote': 'NOK' },
            'BTC/NZD': { 'id': 'NZD', 'symbol': 'BTC/NZD', 'base': 'BTC', 'quote': 'NZD' },
            'BTC/PLN': { 'id': 'PLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN' },
            'BTC/RON': { 'id': 'RON', 'symbol': 'BTC/RON', 'base': 'BTC', 'quote': 'RON' },
            'BTC/SEK': { 'id': 'SEK', 'symbol': 'BTC/SEK', 'base': 'BTC', 'quote': 'SEK' },
            'BTC/SGD': { 'id': 'SGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD' },
            'BTC/THB': { 'id': 'THB', 'symbol': 'BTC/THB', 'base': 'BTC', 'quote': 'THB' },
            'BTC/TRY': { 'id': 'TRY', 'symbol': 'BTC/TRY', 'base': 'BTC', 'quote': 'TRY' },
            'BTC/ZAR': { 'id': 'ZAR', 'symbol': 'BTC/ZAR', 'base': 'BTC', 'quote': 'ZAR' }
        }
    });

    //-----------------------------------------------------------------------------

    var anxpro = {

        'id': 'anxpro',
        'name': 'ANXPro',
        'countries': ['JP', 'SG', 'HK', 'NZ'],
        'version': '2',
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27765983-fd8595da-5ec9-11e7-82e3-adb3ab8c2612.jpg',
            'api': 'https://anxpro.com/api',
            'www': 'https://anxpro.com',
            'doc': ['http://docs.anxv2.apiary.io', 'https://anxpro.com/pages/api']
        },
        'api': {
            'public': {
                'get': ['{currency_pair}/money/ticker', '{currency_pair}/money/depth/full', '{currency_pair}/money/trade/fetch']
            },
            'private': {
                'post': ['{currency_pair}/money/order/add', '{currency_pair}/money/order/cancel', '{currency_pair}/money/order/quote', '{currency_pair}/money/order/result', '{currency_pair}/money/orders', 'money/{currency}/address', 'money/{currency}/send_simple', 'money/info', 'money/trade/list', 'money/wallet/history']
            }
        },
        'markets': {
            'BTC/USD': { 'id': 'BTCUSD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/HKD': { 'id': 'BTCHKD', 'symbol': 'BTC/HKD', 'base': 'BTC', 'quote': 'HKD' },
            'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'BTC/CAD': { 'id': 'BTCCAD', 'symbol': 'BTC/CAD', 'base': 'BTC', 'quote': 'CAD' },
            'BTC/AUD': { 'id': 'BTCAUD', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD' },
            'BTC/SGD': { 'id': 'BTCSGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD' },
            'BTC/JPY': { 'id': 'BTCJPY', 'symbol': 'BTC/JPY', 'base': 'BTC', 'quote': 'JPY' },
            'BTC/GBP': { 'id': 'BTCGBP', 'symbol': 'BTC/GBP', 'base': 'BTC', 'quote': 'GBP' },
            'BTC/NZD': { 'id': 'BTCNZD', 'symbol': 'BTC/NZD', 'base': 'BTC', 'quote': 'NZD' },
            'LTC/BTC': { 'id': 'LTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'DOGE/BTC': { 'id': 'DOGEBTC', 'symbol': 'DOGE/BTC', 'base': 'DOGE', 'quote': 'BTC' },
            'STR/BTC': { 'id': 'STRBTC', 'symbol': 'STR/BTC', 'base': 'STR', 'quote': 'BTC' },
            'XRP/BTC': { 'id': 'XRPBTC', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                response,
                balance,
                currencies,
                result,
                c,
                currency,
                account,
                wallet,
                _this36 = this,
                _arguments21 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments21.length > 0 && _arguments21[0] !== undefined ? _arguments21[0] : {};
                return _this36.privatePostMoneyInfo();
            }).then(function (_resp) {
                response = _resp;
                balance = response['data'];
                currencies = Object.keys(balance['Wallets']);
                result = { 'info': balance };

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    account = _this36.account();

                    if (currency in balance['Wallets']) {
                        wallet = balance['Wallets'][currency];

                        account['free'] = parseFloat(wallet['Available_Balance']['value']);
                        account['total'] = parseFloat(wallet['Balance']['value']);
                        account['used'] = account['total'] - account['free'];
                    }
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                t,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this37 = this,
                _arguments22 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments22.length > 1 && _arguments22[1] !== undefined ? _arguments22[1] : {};
                return _this37.publicGetCurrencyPairMoneyDepthFull(_this37.extend({
                    'currency_pair': _this37.marketId(market)
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['data'];
                t = parseInt(orderbook['dataUpdateTime']);
                timestamp = parseInt(t / 1000);
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this37.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['amount']);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                t,
                timestamp,
                bid,
                ask,
                _this38 = this;

            return Promise.resolve().then(function () {
                return _this38.publicGetCurrencyPairMoneyTicker({
                    'currency_pair': _this38.marketId(market)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['data'];
                t = parseInt(ticker['dataUpdateTime']);
                timestamp = parseInt(t / 1000);
                bid = undefined;
                ask = undefined;

                if (ticker['buy']['value']) {
                    bid = parseFloat(ticker['buy']['value']);
                }if (ticker['sell']['value']) {
                    ask = parseFloat(ticker['sell']['value']);
                }return {
                    'timestamp': timestamp,
                    'datetime': _this38.iso8601(timestamp),
                    'high': parseFloat(ticker['high']['value']),
                    'low': parseFloat(ticker['low']['value']),
                    'bid': bid,
                    'ask': ask,
                    'vwap': parseFloat(ticker['vwap']['value']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']['value']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['avg']['value']),
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']['value'])
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                error,
                _this39 = this,
                _arguments24 = arguments;

            params = _arguments24.length > 1 && _arguments24[1] !== undefined ? _arguments24[1] : {};
            error = _this39.id + ' switched off the trades endpoint, see their docs at http://docs.anxv2.apiary.io/reference/market-data/currencypairmoneytradefetch-disabled';

            throw new ExchangeError(error);
            return _this39.publicGetCurrencyPairMoneyTradeFetch(_this39.extend({
                'currency_pair': _this39.marketId(market)
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                result,
                _this40 = this,
                _arguments25 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments25.length > 4 && _arguments25[4] !== undefined ? _arguments25[4] : undefined;
                params = _arguments25.length > 5 && _arguments25[5] !== undefined ? _arguments25[5] : {};
                order = {
                    'currency_pair': _this40.marketId(market),
                    'amount_int': amount,
                    'type': side
                };

                if (type == 'limit') {
                    order['price_int'] = price;
                }return _this40.privatePostCurrencyPairOrderAdd(_this40.extend(order, params));
            }).then(function (_resp) {
                result = _resp;

                return {
                    'info': result,
                    'id': result['data']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this41 = this;

            return _this41.privatePostCurrencyPairOrderCancel({ 'oid': id });
        },
        nonce: function nonce() {
            return this.milliseconds();
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                request,
                query,
                url,
                nonce,
                secret,
                auth,
                response,
                _test,
                _this42 = this,
                _arguments27 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments27.length > 1 && _arguments27[1] !== undefined ? _arguments27[1] : 'public';
                method = _arguments27.length > 2 && _arguments27[2] !== undefined ? _arguments27[2] : 'GET';
                params = _arguments27.length > 3 && _arguments27[3] !== undefined ? _arguments27[3] : {};
                headers = _arguments27.length > 4 && _arguments27[4] !== undefined ? _arguments27[4] : undefined;
                body = _arguments27.length > 5 && _arguments27[5] !== undefined ? _arguments27[5] : undefined;
                request = _this42.implodeParams(path, params);
                query = _this42.omit(params, _this42.extractParams(path));
                url = _this42.urls['api'] + '/' + _this42.version + '/' + request;

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this42.urlencode(query);
                    }
                } else {
                    nonce = _this42.nonce();

                    body = _this42.urlencode(_this42.extend({ 'nonce': nonce }, query));
                    secret = _this42.base64ToBinary(_this42.secret);
                    auth = request + "\0" + body;

                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Rest-Key': _this42.apiKey,
                        'Rest-Sign': _this42.hmac(_this42.encode(auth), secret, 'sha512', 'base64')
                    };
                }
                return _this42.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test = 'result' in response;

                if (_test && response['result'] == 'success') {
                    return response;
                } else {
                    throw new ExchangeError(_this42.id + ' ' + _this42.json(response));
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var binance = {

        'id': 'binance',
        'name': 'Binance',
        'countries': 'CN', // China
        'rateLimit': 1000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/29604020-d5483cdc-87ee-11e7-94c7-d1a8d9169293.jpg',
            'api': 'https://www.binance.com/api',
            'www': 'https://www.binance.com',
            'doc': 'https://www.binance.com/restapipub.html'
        },
        'api': {
            'public': {
                'get': ['ping', 'time', 'depth', 'aggTrades', 'klines', 'ticker/24hr']
            },
            'private': {
                'get': ['order', 'openOrders', 'allOrders', 'account', 'myTrades'],
                'post': ['order', 'order/test', 'userDataStream'],
                'put': ['userDataStream'],
                'delete': ['order', 'userDataStream']
            }
        },
        'markets': {
            'BNB/BTC': { 'id': 'BNBBTC', 'symbol': 'BNB/BTC', 'base': 'BNB', 'quote': 'BTC' },
            'NEO/BTC': { 'id': 'NEOBTC', 'symbol': 'NEO/BTC', 'base': 'NEO', 'quote': 'BTC' },
            'ETH/BTC': { 'id': 'ETHBTC', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' },
            'HSR/BTC': { 'id': 'HSRBTC', 'symbol': 'HSR/BTC', 'base': 'HSR', 'quote': 'BTC' },
            'LTC/BTC': { 'id': 'LTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'GAS/BTC': { 'id': 'GASBTC', 'symbol': 'GAS/BTC', 'base': 'GAS', 'quote': 'BTC' },
            'HCC/BTC': { 'id': 'HCCBTC', 'symbol': 'HCC/BTC', 'base': 'HCC', 'quote': 'BTC' },
            'BCH/BTC': { 'id': 'BCCBTC', 'symbol': 'BCH/BTC', 'base': 'BCH', 'quote': 'BTC' },
            'BNB/ETH': { 'id': 'BNBETH', 'symbol': 'BNB/ETH', 'base': 'BNB', 'quote': 'ETH' },
            'DNT/ETH': { 'id': 'DNTETH', 'symbol': 'DNT/ETH', 'base': 'DNT', 'quote': 'ETH' },
            'OAX/ETH': { 'id': 'OAXETH', 'symbol': 'OAX/ETH', 'base': 'OAX', 'quote': 'ETH' },
            'MCO/ETH': { 'id': 'MCOETH', 'symbol': 'MCO/ETH', 'base': 'MCO', 'quote': 'ETH' },
            'BTM/ETH': { 'id': 'BTMETH', 'symbol': 'BTM/ETH', 'base': 'BTM', 'quote': 'ETH' },
            'SNT/ETH': { 'id': 'SNTETH', 'symbol': 'SNT/ETH', 'base': 'SNT', 'quote': 'ETH' },
            'EOS/ETH': { 'id': 'EOSETH', 'symbol': 'EOS/ETH', 'base': 'EOS', 'quote': 'ETH' },
            'BNT/ETH': { 'id': 'BNTETH', 'symbol': 'BNT/ETH', 'base': 'BNT', 'quote': 'ETH' },
            'ICN/ETH': { 'id': 'ICNETH', 'symbol': 'ICN/ETH', 'base': 'ICN', 'quote': 'ETH' },
            'BTC/USDT': { 'id': 'BTCUSDT', 'symbol': 'BTC/USDT', 'base': 'BTC', 'quote': 'USDT' },
            'ETH/USDT': { 'id': 'ETHUSDT', 'symbol': 'ETH/USDT', 'base': 'ETH', 'quote': 'USDT' },
            'QTUM/ETH': { 'id': 'QTUMETH', 'symbol': 'QTUM/ETH', 'base': 'QTUM', 'quote': 'ETH' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                response,
                result,
                balances,
                i,
                balance,
                asset,
                currency,
                account,
                _this43 = this,
                _arguments28 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments28.length > 0 && _arguments28[0] !== undefined ? _arguments28[0] : {};
                return _this43.privateGetAccount();
            }).then(function (_resp) {
                response = _resp;
                result = { 'info': response };
                balances = response['balances'];

                for (i = 0; i < balances.length; i++) {
                    balance = balances[i];
                    asset = balance['asset'];
                    currency = _this43.commonCurrencyCode(asset);
                    account = {
                        'free': parseFloat(balance['free']),
                        'used': parseFloat(balance['locked']),
                        'total': 0.0
                    };

                    account['total'] = _this43.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                m,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this44 = this,
                _arguments29 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments29.length > 1 && _arguments29[1] !== undefined ? _arguments29[1] : {};
                m = _this44.market(market);
                return _this44.publicGetDepth(_this44.extend({
                    'symbol': m['id'],
                    'limit': 100 // default = maximum = 100
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this44.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this44.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = ticker['closeTime'];
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['highPrice']),
                'low': parseFloat(ticker['lowPrice']),
                'bid': parseFloat(ticker['bidPrice']),
                'ask': parseFloat(ticker['askPrice']),
                'vwap': parseFloat(ticker['weightedAvgPrice']),
                'open': parseFloat(ticker['openPrice']),
                'close': parseFloat(ticker['prevClosePrice']),
                'first': undefined,
                'last': parseFloat(ticker['lastPrice']),
                'change': parseFloat(ticker['priceChangePercent']),
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['volume']),
                'info': ticker
            };
        },
        fetchTicker: function fetchTicker(market) {
            var m,
                response,
                _this45 = this;

            return Promise.resolve().then(function () {
                m = _this45.market(market);
                return _this45.publicGetTicker24hr({
                    'symbol': m['id']
                });
            }).then(function (_resp) {
                response = _resp;

                return _this45.parseTicker(response, m);
            });
        },
        fetchOHLCV: function fetchOHLCV(market) {
            var timeframe,
                since,
                limit,
                _this46 = this,
                _arguments31 = arguments;

            timeframe = _arguments31.length > 1 && _arguments31[1] !== undefined ? _arguments31[1] : 60;
            since = _arguments31.length > 2 && _arguments31[2] !== undefined ? _arguments31[2] : undefined;
            limit = _arguments31.length > 3 && _arguments31[3] !== undefined ? _arguments31[3] : undefined;

            // Kline/candlestick bars for a symbol. Klines are uniquely identified by their open time.
            // Parameters:
            // Name    Type    Mandatory   Description
            // symbol  STRING  YES
            // interval    ENUM    YES
            // limit   INT NO  Default 500; max 500.
            // startTime   LONG    NO
            // endTime LONG    NO
            // If startTime and endTime are not sent, the most recent klines are returned.
            // Response:
            // [
            //   [
            //     1499040000000,      // Open time
            //     "0.01634790",       // Open
            //     "0.80000000",       // High
            //     "0.01575800",       // Low
            //     "0.01577100",       // Close
            //     "148976.11427815",  // Volume
            //     1499644799999,      // Close time
            //     "2434.19055334",    // Quote asset volume
            //     308,                // Number of trades
            //     "1756.87402397",    // Taker buy base asset volume
            //     "28.46694368",      // Taker buy quote asset volume
            //     "17928899.62484339" // Can be ignored
            //   ]
            // ]
            throw new NotImplemented(_this46.id + ' fetchOHLCV is not implemented yet');
        },
        parseTrade: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestampField = 'T' in trade ? 'T' : 'time';
            var timestamp = trade[timestampField];
            var priceField = 'p' in trade ? 'p' : 'price';
            var price = parseFloat(trade[priceField]);
            var amountField = 'q' in trade ? 'q' : 'qty';
            var amount = parseFloat(trade[amountField]);
            var idField = 'a' in trade ? 'a' : 'id';
            var id = trade[idField].toString();
            var side = undefined;
            if ('m' in trade) {
                side = 'sell';
                if (trade['m']) side = 'buy';
            } else {
                var isBuyer = trade['isBuyer'];
                var isMaker = trade['isMaker'];
                if (isBuyer) {
                    side = isMaker ? 'sell' : 'buy';
                } else {
                    side = isMaker ? 'buy' : 'sell';
                }
            }
            return {
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'id': id,
                'type': undefined,
                'side': side,
                'price': price,
                'amount': amount
            };
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                m,
                response,
                _this47 = this,
                _arguments32 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments32.length > 1 && _arguments32[1] !== undefined ? _arguments32[1] : {};
                m = _this47.market(market);
                return _this47.publicGetAggTrades(_this47.extend({
                    'symbol': m['id'],
                    // 'fromId': 123,    // ID to get aggregate trades from INCLUSIVE.
                    // 'startTime': 456, // Timestamp in ms to get aggregate trades from INCLUSIVE.
                    // 'endTime': 789,   // Timestamp in ms to get aggregate trades until INCLUSIVE.
                    'limit': 500 // default = maximum = 500
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return _this47.parseTrades(response, m);
            });
        },
        parseOrder: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            // {
            //   "symbol": "LTCBTC",
            //   "orderId": 1,
            //   "clientOrderId": "myOrder1",
            //   "price": "0.1",
            //   "origQty": "1.0",
            //   "executedQty": "0.0",
            //   "status": "NEW",
            //   "timeInForce": "GTC",
            //   "type": "LIMIT",
            //   "side": "BUY",
            //   "stopPrice": "0.0",
            //   "icebergQty": "0.0",
            //   "time": 1499827319559
            // }
            throw new NotImplemented(this.id + ' parseOrder is not implemented yet');
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this48 = this,
                _arguments33 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments33.length > 4 && _arguments33[4] !== undefined ? _arguments33[4] : undefined;
                params = _arguments33.length > 5 && _arguments33[5] !== undefined ? _arguments33[5] : {};
                order = {
                    'symbol': _this48.marketId(market),
                    'quantity': '%f'.sprintf(amount),
                    'price': '%f'.sprintf(price),
                    'type': type.toUpperCase(),
                    'side': side.toUpperCase(),
                    'timeInForce': 'GTC' // Good To Cancel
                    // 'timeInForce': 'IOC', // Immediate Or Cancel
                };
                return _this48.privatePostOrder(_this48.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['orderId'].toString()
                };
            });
        },
        fetchOrder: function fetchOrder(id) {
            var params,
                symbol,
                market,
                response,
                _this49 = this,
                _arguments34 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments34.length > 1 && _arguments34[1] !== undefined ? _arguments34[1] : {};
                symbol = 'symbol' in params;

                if (!symbol) {
                    throw new ExchangeError(_this49.id + ' fetchOrder requires a symbol param');
                }market = _this49.market(symbol);
                return _this49.privateGetOrder(_this49.extend(params, {
                    'symbol': market['id'],
                    'orderId': id.toString()
                }));
            }).then(function (_resp) {
                response = _resp;

                return _this49.parseOrder(response, market);
            });
        },
        fetchOrders: function fetchOrders() {
            var _this50 = this;

            // symbol  STRING  YES
            // orderId LONG    NO
            // limit   INT NO  Default 500; max 500.
            // recvWindow  LONG    NO
            // timestamp   LONG    YES
            // If orderId is set, it will get orders >= that orderId. Otherwise most recent orders are returned.
            throw new NotImplemented(_this50.id + ' fetchOrders not implemented yet');
        },
        fetchOpenOrders: function fetchOpenOrders() {
            var symbol,
                params,
                market,
                response,
                _this51 = this,
                _arguments36 = arguments;

            return Promise.resolve().then(function () {
                symbol = _arguments36.length > 0 && _arguments36[0] !== undefined ? _arguments36[0] : undefined;
                params = _arguments36.length > 1 && _arguments36[1] !== undefined ? _arguments36[1] : {};

                if (!symbol) {
                    throw new ExchangeError(_this51.id + ' fetchOpenOrders requires a symbol param');
                }market = _this51.market(symbol);
                return _this51.privateGetOpenOrders({
                    'symbol': market['id']
                });
            }).then(function (_resp) {
                response = _resp;

                return _this51.parseOrders(response, market);
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this52 = this,
                _arguments37 = arguments;

            params = _arguments37.length > 1 && _arguments37[1] !== undefined ? _arguments37[1] : {};

            return _this52.privatePostOrderCancel(_this52.extend({
                'orderId': parseInt(id)
                // 'origClientOrderId': id,
            }, params));
        },
        nonce: function nonce() {
            return this.milliseconds();
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                query,
                auth,
                signature,
                response,
                _this53 = this,
                _arguments38 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments38.length > 1 && _arguments38[1] !== undefined ? _arguments38[1] : 'public';
                method = _arguments38.length > 2 && _arguments38[2] !== undefined ? _arguments38[2] : 'GET';
                params = _arguments38.length > 3 && _arguments38[3] !== undefined ? _arguments38[3] : {};
                headers = _arguments38.length > 4 && _arguments38[4] !== undefined ? _arguments38[4] : undefined;
                body = _arguments38.length > 5 && _arguments38[5] !== undefined ? _arguments38[5] : undefined;
                url = _this53.urls['api'] + '/' + _this53.version + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this53.urlencode(params);
                    }
                } else {
                    nonce = _this53.nonce();
                    query = _this53.urlencode(_this53.extend({ 'timestamp': nonce }, params));
                    auth = _this53.secret + '|' + query;
                    signature = _this53.hash(_this53.encode(auth), 'sha256');

                    query += '&' + 'signature=' + signature;
                    headers = {
                        'X-MBX-APIKEY': _this53.apiKey
                    };
                    if (method == 'GET') {
                        url += '?' + query;
                    } else {
                        body = query;
                        headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    }
                }
                return _this53.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('code' in response) {
                    if (response['code'] < 0) {
                        throw new ExchangeError(_this53.id + ' ' + _this53.json(response));
                    }
                }
                return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var bit2c = {

        'id': 'bit2c',
        'name': 'Bit2C',
        'countries': 'IL', // Israel
        'rateLimit': 3000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766119-3593220e-5ece-11e7-8b3a-5a041f6bcc3f.jpg',
            'api': 'https://www.bit2c.co.il',
            'www': 'https://www.bit2c.co.il',
            'doc': ['https://www.bit2c.co.il/home/api', 'https://github.com/OferE/bit2c']
        },
        'api': {
            'public': {
                'get': ['Exchanges/{pair}/Ticker', 'Exchanges/{pair}/orderbook', 'Exchanges/{pair}/trades']
            },
            'private': {
                'post': ['Account/Balance', 'Account/Balance/v2', 'Merchant/CreateCheckout', 'Order/AccountHistory', 'Order/AddCoinFundsRequest', 'Order/AddFund', 'Order/AddOrder', 'Order/AddOrderMarketPriceBuy', 'Order/AddOrderMarketPriceSell', 'Order/CancelOrder', 'Order/MyOrders', 'Payment/GetMyId', 'Payment/Send']
            }
        },
        'markets': {
            'BTC/NIS': { 'id': 'BtcNis', 'symbol': 'BTC/NIS', 'base': 'BTC', 'quote': 'NIS' },
            'LTC/BTC': { 'id': 'LtcBtc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'LTC/NIS': { 'id': 'LtcNis', 'symbol': 'LTC/NIS', 'base': 'LTC', 'quote': 'NIS' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                balance,
                result,
                c,
                currency,
                account,
                available,
                _this54 = this,
                _arguments39 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments39.length > 0 && _arguments39[0] !== undefined ? _arguments39[0] : {};
                return _this54.privatePostAccountBalanceV2();
            }).then(function (_resp) {
                balance = _resp;
                result = { 'info': balance };

                for (c = 0; c < _this54.currencies.length; c++) {
                    currency = _this54.currencies[c];
                    account = _this54.account();

                    if (currency in balance) {
                        available = 'AVAILABLE_' + currency;

                        account['free'] = balance[available];
                        account['total'] = balance[currency];
                        account['used'] = account['total'] - account['free'];
                    }
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _timestamp2,
                _this55 = this,
                _arguments40 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments40.length > 1 && _arguments40[1] !== undefined ? _arguments40[1] : {};
                return _this55.publicGetExchangesPairOrderbook(_this55.extend({
                    'pair': _this55.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this55.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this55.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order[0];
                        amount = order[1];
                        _timestamp2 = order[2] * 1000;

                        result[side].push([price, amount, _timestamp2]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this56 = this;

            return Promise.resolve().then(function () {
                return _this56.publicGetExchangesPairTicker({
                    'pair': _this56.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this56.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this56.iso8601(timestamp),
                    'high': parseFloat(ticker['h']),
                    'low': parseFloat(ticker['l']),
                    'bid': undefined,
                    'ask': undefined,
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['ll']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['av']),
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['a'])
                };
            });
        },
        parseTrade: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = parseInt(trade['date']) * 1000;
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'id': trade['tid'].toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'order': undefined,
                'type': undefined,
                'side': undefined,
                'price': trade['price'],
                'amount': trade['amount']
            };
        },
        fetchTrades: function fetchTrades(symbol) {
            var params,
                market,
                response,
                _this57 = this,
                _arguments42 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments42.length > 1 && _arguments42[1] !== undefined ? _arguments42[1] : {};
                market = _this57.market(symbol);
                return _this57.publicGetExchangesPairTrades(_this57.extend({
                    'pair': market['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return _this57.parseTrades(response, market);
            });
        },
        createOrder: function createOrder(symbol, type, side, amount) {
            var price,
                params,
                method,
                order,
                result,
                _this58 = this,
                _arguments43 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments43.length > 4 && _arguments43[4] !== undefined ? _arguments43[4] : undefined;
                params = _arguments43.length > 5 && _arguments43[5] !== undefined ? _arguments43[5] : {};
                method = 'privatePostOrderAddOrder';
                order = {
                    'Amount': amount,
                    'Pair': _this58.marketId(symbol)
                };

                if (type == 'market') {
                    method += 'MarketPrice' + _this58.capitalize(side);
                } else {
                    order['Price'] = price;
                    order['Total'] = amount * price;
                    order['IsBid'] = side == 'buy';
                }
                return _this58[method](_this58.extend(order, params));
            }).then(function (_resp) {
                result = _resp;

                return {
                    'info': result,
                    'id': result['NewOrder']['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this59 = this;

            return _this59.privatePostOrderCancelOrder({ 'id': id });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.implodeParams(path, params);
            if (api == 'public') {
                url += '.json';
            } else {
                var nonce = this.nonce();
                var query = this.extend({ 'nonce': nonce }, params);
                body = this.urlencode(query);
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length,
                    'key': this.apiKey,
                    'sign': this.hmac(this.encode(body), this.encode(this.secret), 'sha512', 'base64')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitbay = {

        'id': 'bitbay',
        'name': 'BitBay',
        'countries': ['PL', 'EU'], // Poland
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766132-978a7bd8-5ece-11e7-9540-bc96d1e9bbb8.jpg',
            'www': 'https://bitbay.net',
            'api': {
                'public': 'https://bitbay.net/API/Public',
                'private': 'https://bitbay.net/API/Trading/tradingApi.php'
            },
            'doc': ['https://bitbay.net/public-api', 'https://bitbay.net/account/tab-api', 'https://github.com/BitBayNet/API']
        },
        'api': {
            'public': {
                'get': ['{id}/all', '{id}/market', '{id}/orderbook', '{id}/ticker', '{id}/trades']
            },
            'private': {
                'post': ['info', 'trade', 'cancel', 'orderbook', 'orders', 'transfer', 'withdraw', 'history', 'transactions']
            }
        },
        'markets': {
            'BTC/USD': { 'id': 'BTCUSD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'BTC/PLN': { 'id': 'BTCPLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN' },
            'LTC/USD': { 'id': 'LTCUSD', 'symbol': 'LTC/USD', 'base': 'LTC', 'quote': 'USD' },
            'LTC/EUR': { 'id': 'LTCEUR', 'symbol': 'LTC/EUR', 'base': 'LTC', 'quote': 'EUR' },
            'LTC/PLN': { 'id': 'LTCPLN', 'symbol': 'LTC/PLN', 'base': 'LTC', 'quote': 'PLN' },
            'LTC/BTC': { 'id': 'LTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'ETH/USD': { 'id': 'ETHUSD', 'symbol': 'ETH/USD', 'base': 'ETH', 'quote': 'USD' },
            'ETH/EUR': { 'id': 'ETHEUR', 'symbol': 'ETH/EUR', 'base': 'ETH', 'quote': 'EUR' },
            'ETH/PLN': { 'id': 'ETHPLN', 'symbol': 'ETH/PLN', 'base': 'ETH', 'quote': 'PLN' },
            'ETH/BTC': { 'id': 'ETHBTC', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' },
            'LSK/USD': { 'id': 'LSKUSD', 'symbol': 'LSK/USD', 'base': 'LSK', 'quote': 'USD' },
            'LSK/EUR': { 'id': 'LSKEUR', 'symbol': 'LSK/EUR', 'base': 'LSK', 'quote': 'EUR' },
            'LSK/PLN': { 'id': 'LSKPLN', 'symbol': 'LSK/PLN', 'base': 'LSK', 'quote': 'PLN' },
            'LSK/BTC': { 'id': 'LSKBTC', 'symbol': 'LSK/BTC', 'base': 'LSK', 'quote': 'BTC' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                response,
                balance,
                result,
                c,
                currency,
                account,
                _this60 = this,
                _arguments45 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments45.length > 0 && _arguments45[0] !== undefined ? _arguments45[0] : {};
                return _this60.privatePostInfo();
            }).then(function (_resp) {
                response = _resp;
                balance = response['balances'];
                result = { 'info': balance };

                for (c = 0; c < _this60.currencies.length; c++) {
                    currency = _this60.currencies[c];
                    account = _this60.account();

                    if (currency in balance) {
                        account['free'] = parseFloat(balance[currency]['available']);
                        account['used'] = parseFloat(balance[currency]['locked']);
                        account['total'] = _this60.sum(account['free'], account['used']);
                    }
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                _this61 = this,
                _arguments46 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments46.length > 1 && _arguments46[1] !== undefined ? _arguments46[1] : {};
                return _this61.publicGetIdOrderbook(_this61.extend({
                    'id': _this61.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this61.milliseconds();
                result = {
                    'bids': orderbook['bids'],
                    'asks': orderbook['asks'],
                    'timestamp': timestamp,
                    'datetime': _this61.iso8601(timestamp)
                };

                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this62 = this;

            return Promise.resolve().then(function () {
                return _this62.publicGetIdTicker({
                    'id': _this62.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this62.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this62.iso8601(timestamp),
                    'high': parseFloat(ticker['max']),
                    'low': parseFloat(ticker['min']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['average']),
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this63 = this,
                _arguments48 = arguments;

            params = _arguments48.length > 1 && _arguments48[1] !== undefined ? _arguments48[1] : {};

            return _this63.publicGetIdTrades(_this63.extend({
                'id': _this63.marketId(market)
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                _this64 = this,
                _arguments49 = arguments;

            price = _arguments49.length > 4 && _arguments49[4] !== undefined ? _arguments49[4] : undefined;
            params = _arguments49.length > 5 && _arguments49[5] !== undefined ? _arguments49[5] : {};
            p = _this64.market(market);

            return _this64.privatePostTrade(_this64.extend({
                'type': side,
                'currency': p['base'],
                'amount': amount,
                'payment_currency': p['quote'],
                'rate': price
            }, params));
        },
        cancelOrder: function cancelOrder(id) {
            var _this65 = this;

            return _this65.privatePostCancel({ 'id': id });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][api];
            if (api == 'public') {
                url += '/' + this.implodeParams(path, params) + '.json';
            } else {
                body = this.urlencode(this.extend({
                    'method': path,
                    'moment': this.nonce()
                }, params));
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length,
                    'API-Key': this.apiKey,
                    'API-Hash': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitbays = {

        'id': 'bitbays',
        'name': 'BitBays',
        'countries': ['CN', 'GB', 'HK', 'AU', 'CA'],
        'rateLimit': 1500,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27808599-983687d2-6051-11e7-8d95-80dfcbe5cbb4.jpg',
            'api': 'https://bitbays.com/api',
            'www': 'https://bitbays.com',
            'doc': 'https://bitbays.com/help/api/'
        },
        'api': {
            'public': {
                'get': ['ticker', 'trades', 'depth']
            },
            'private': {
                'post': ['cancel', 'info', 'orders', 'order', 'transactions', 'trade']
            }
        },
        'markets': {
            'BTC/USD': { 'id': 'btc_usd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/CNY': { 'id': 'btc_cny', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY' },
            'ODS/BTC': { 'id': 'ods_btc', 'symbol': 'ODS/BTC', 'base': 'ODS', 'quote': 'BTC' },
            'LSK/BTC': { 'id': 'lsk_btc', 'symbol': 'LSK/BTC', 'base': 'LSK', 'quote': 'BTC' },
            'LSK/CNY': { 'id': 'lsk_cny', 'symbol': 'LSK/CNY', 'base': 'LSK', 'quote': 'CNY' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                response,
                balance,
                result,
                c,
                currency,
                lowercase,
                account,
                _this66 = this,
                _arguments51 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments51.length > 0 && _arguments51[0] !== undefined ? _arguments51[0] : {};
                return _this66.privatePostInfo();
            }).then(function (_resp) {
                response = _resp;
                balance = response['result']['wallet'];
                result = { 'info': balance };

                for (c = 0; c < _this66.currencies.length; c++) {
                    currency = _this66.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = _this66.account();

                    if (lowercase in balance) {
                        account['free'] = parseFloat(balance[lowercase]['avail']);
                        account['used'] = parseFloat(balance[lowercase]['lock']);
                        account['total'] = _this66.sum(account['free'], account['used']);
                    }
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this67 = this,
                _arguments52 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments52.length > 1 && _arguments52[1] !== undefined ? _arguments52[1] : {};
                return _this67.publicGetDepth(_this67.extend({
                    'market': _this67.marketId(market)
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['result'];
                timestamp = _this67.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this67.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                timestamp,
                _this68 = this;

            return Promise.resolve().then(function () {
                return _this68.publicGetTicker({
                    'market': _this68.marketId(market)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['result'];
                timestamp = _this68.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this68.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this69 = this,
                _arguments54 = arguments;

            params = _arguments54.length > 1 && _arguments54[1] !== undefined ? _arguments54[1] : {};

            return _this69.publicGetTrades(_this69.extend({
                'market': _this69.marketId(market)
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this70 = this,
                _arguments55 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments55.length > 4 && _arguments55[4] !== undefined ? _arguments55[4] : undefined;
                params = _arguments55.length > 5 && _arguments55[5] !== undefined ? _arguments55[5] : {};
                order = {
                    'market': _this70.marketId(market),
                    'op': side,
                    'amount': amount
                };

                if (type == 'market') {
                    order['order_type'] = 1;
                    order['price'] = price;
                } else {
                    order['order_type'] = 0;
                }
                return _this70.privatePostTrade(_this70.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['result']['id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this71 = this;

            return _this71.privatePostCancel({ 'id': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                response,
                _test2,
                _this72 = this,
                _arguments57 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments57.length > 1 && _arguments57[1] !== undefined ? _arguments57[1] : 'public';
                method = _arguments57.length > 2 && _arguments57[2] !== undefined ? _arguments57[2] : 'GET';
                params = _arguments57.length > 3 && _arguments57[3] !== undefined ? _arguments57[3] : {};
                headers = _arguments57.length > 4 && _arguments57[4] !== undefined ? _arguments57[4] : undefined;
                body = _arguments57.length > 5 && _arguments57[5] !== undefined ? _arguments57[5] : undefined;
                url = _this72.urls['api'] + '/' + _this72.version + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this72.urlencode(params);
                    }
                } else {
                    nonce = _this72.nonce();

                    body = _this72.urlencode(_this72.extend({
                        'nonce': nonce
                    }, params));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length,
                        'Key': _this72.apiKey,
                        'Sign': _this72.hmac(_this72.encode(body), _this72.secret, 'sha512')
                    };
                }
                return _this72.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test2 = 'status' in response;

                if (_test2 && response['status'] == 200) {
                    return response;
                } else {
                    throw new ExchangeError(_this72.id + ' ' + _this72.json(response));
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var bitcoincoid = {

        'id': 'bitcoincoid',
        'name': 'Bitcoin.co.id',
        'countries': 'ID', // Indonesia
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766138-043c7786-5ecf-11e7-882b-809c14f38b53.jpg',
            'api': {
                'public': 'https://vip.bitcoin.co.id/api',
                'private': 'https://vip.bitcoin.co.id/tapi'
            },
            'www': 'https://www.bitcoin.co.id',
            'doc': ['https://vip.bitcoin.co.id/downloads/BITCOINCOID-API-DOCUMENTATION.pdf', 'https://vip.bitcoin.co.id/trade_api']
        },
        'api': {
            'public': {
                'get': ['{pair}/ticker', '{pair}/trades', '{pair}/depth']
            },
            'private': {
                'post': ['getInfo', 'transHistory', 'trade', 'tradeHistory', 'openOrders', 'cancelOrder']
            }
        },
        'markets': {
            'BTC/IDR': { 'id': 'btc_idr', 'symbol': 'BTC/IDR', 'base': 'BTC', 'quote': 'IDR', 'baseId': 'btc', 'quoteId': 'idr' },
            'BTS/BTC': { 'id': 'bts_btc', 'symbol': 'BTS/BTC', 'base': 'BTS', 'quote': 'BTC', 'baseId': 'bts', 'quoteId': 'btc' },
            'DASH/BTC': { 'id': 'drk_btc', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC', 'baseId': 'drk', 'quoteId': 'btc' },
            'DOGE/BTC': { 'id': 'doge_btc', 'symbol': 'DOGE/BTC', 'base': 'DOGE', 'quote': 'BTC', 'baseId': 'doge', 'quoteId': 'btc' },
            'ETH/BTC': { 'id': 'eth_btc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC', 'baseId': 'eth', 'quoteId': 'btc' },
            'LTC/BTC': { 'id': 'ltc_btc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'baseId': 'ltc', 'quoteId': 'btc' },
            'NXT/BTC': { 'id': 'nxt_btc', 'symbol': 'NXT/BTC', 'base': 'NXT', 'quote': 'BTC', 'baseId': 'nxt', 'quoteId': 'btc' },
            'STR/BTC': { 'id': 'str_btc', 'symbol': 'STR/BTC', 'base': 'STR', 'quote': 'BTC', 'baseId': 'str', 'quoteId': 'btc' },
            'NEM/BTC': { 'id': 'nem_btc', 'symbol': 'NEM/BTC', 'base': 'NEM', 'quote': 'BTC', 'baseId': 'nem', 'quoteId': 'btc' },
            'XRP/BTC': { 'id': 'xrp_btc', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC', 'baseId': 'xrp', 'quoteId': 'btc' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                response,
                balance,
                frozen,
                result,
                c,
                currency,
                lowercase,
                account,
                _this73 = this,
                _arguments58 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments58.length > 0 && _arguments58[0] !== undefined ? _arguments58[0] : {};
                return _this73.privatePostGetInfo();
            }).then(function (_resp) {
                response = _resp;
                balance = response['return']['balance'];
                frozen = response['return']['balance_hold'];
                result = { 'info': balance };

                for (c = 0; c < _this73.currencies.length; c++) {
                    currency = _this73.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = _this73.account();

                    if (lowercase in balance) {
                        account['free'] = parseFloat(balance[lowercase]);
                    }
                    if (lowercase in frozen) {
                        account['used'] = parseFloat(frozen[lowercase]);
                    }
                    account['total'] = _this73.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this74 = this,
                _arguments59 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments59.length > 1 && _arguments59[1] !== undefined ? _arguments59[1] : {};
                return _this74.publicGetPairDepth(_this74.extend({
                    'pair': _this74.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this74.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this74.iso8601(timestamp)
                };
                sides = { 'bids': 'buy', 'asks': 'sell' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[key].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var pair,
                response,
                ticker,
                timestamp,
                baseVolume,
                quoteVolume,
                _this75 = this;

            return Promise.resolve().then(function () {
                pair = _this75.market(market);
                return _this75.publicGetPairTicker({
                    'pair': pair['id']
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];
                timestamp = parseFloat(ticker['server_time']) * 1000;
                baseVolume = 'vol_' + pair['baseId'].toLowerCase();
                quoteVolume = 'vol_' + pair['quoteId'].toLowerCase();

                return {
                    'timestamp': timestamp,
                    'datetime': _this75.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker[baseVolume]),
                    'quoteVolume': parseFloat(ticker[quoteVolume]),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this76 = this,
                _arguments61 = arguments;

            params = _arguments61.length > 1 && _arguments61[1] !== undefined ? _arguments61[1] : {};

            return _this76.publicGetPairTrades(_this76.extend({
                'pair': _this76.marketId(market)
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                order,
                base,
                result,
                _this77 = this,
                _arguments62 = arguments;

            price = _arguments62.length > 4 && _arguments62[4] !== undefined ? _arguments62[4] : undefined;
            params = _arguments62.length > 5 && _arguments62[5] !== undefined ? _arguments62[5] : {};
            p = _this77.market(market);
            order = {
                'pair': p['id'],
                'type': side,
                'price': price
            };
            base = p['base'].toLowerCase();

            order[base] = amount;
            result = _this77.privatePostTrade(_this77.extend(order, params));

            return {
                'info': result,
                'id': result['return']['order_id'].toString()
            };
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this78 = this,
                _arguments63 = arguments;

            params = _arguments63.length > 1 && _arguments63[1] !== undefined ? _arguments63[1] : {};

            return _this78.privatePostCancelOrder(_this78.extend({
                'id': id
            }, params));
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                response,
                _this79 = this,
                _arguments64 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments64.length > 1 && _arguments64[1] !== undefined ? _arguments64[1] : 'public';
                method = _arguments64.length > 2 && _arguments64[2] !== undefined ? _arguments64[2] : 'GET';
                params = _arguments64.length > 3 && _arguments64[3] !== undefined ? _arguments64[3] : {};
                headers = _arguments64.length > 4 && _arguments64[4] !== undefined ? _arguments64[4] : undefined;
                body = _arguments64.length > 5 && _arguments64[5] !== undefined ? _arguments64[5] : undefined;
                url = _this79.urls['api'][api];

                if (api == 'public') {
                    url += '/' + _this79.implodeParams(path, params);
                } else {
                    body = _this79.urlencode(_this79.extend({
                        'method': path,
                        'nonce': _this79.nonce()
                    }, params));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length,
                        'Key': _this79.apiKey,
                        'Sign': _this79.hmac(_this79.encode(body), _this79.encode(_this79.secret), 'sha512')
                    };
                }
                return _this79.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    throw new ExchangeError(_this79.id + ' ' + response['error']);
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var bitfinex = {

        'id': 'bitfinex',
        'name': 'Bitfinex',
        'countries': 'US',
        'version': 'v1',
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766244-e328a50c-5ed2-11e7-947b-041416579bb3.jpg',
            'api': 'https://api.bitfinex.com',
            'www': 'https://www.bitfinex.com',
            'doc': ['https://bitfinex.readme.io/v1/docs', 'https://bitfinex.readme.io/v2/docs', 'https://github.com/bitfinexcom/bitfinex-api-node']
        },
        'api': {
            'public': {
                'get': ['book/{symbol}', 'candles/{symbol}', 'lendbook/{currency}', 'lends/{currency}', 'pubticker/{symbol}', 'stats/{symbol}', 'symbols', 'symbols_details', 'today', 'trades/{symbol}']
            },
            'private': {
                'post': ['account_infos', 'balances', 'basket_manage', 'credits', 'deposit/new', 'funding/close', 'history', 'history/movements', 'key_info', 'margin_infos', 'mytrades', 'mytrades_funding', 'offer/cancel', 'offer/new', 'offer/status', 'offers', 'offers/hist', 'order/cancel', 'order/cancel/all', 'order/cancel/multi', 'order/cancel/replace', 'order/new', 'order/new/multi', 'order/status', 'orders', 'orders/hist', 'position/claim', 'positions', 'summary', 'taken_funds', 'total_taken_funds', 'transfer', 'unused_taken_funds', 'withdraw']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                baseId,
                quoteId,
                base,
                quote,
                symbol,
                _this80 = this;

            return Promise.resolve().then(function () {
                return _this80.publicGetSymbolsDetails();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['pair'].toUpperCase();
                    baseId = id.slice(0, 3);
                    quoteId = id.slice(3, 6);
                    base = baseId;
                    quote = quoteId;
                    // issue #4 Bitfinex names Dash as DSH, instead of DASH

                    if (base == 'DSH') {
                        base = 'DASH';
                    }symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'baseId': baseId,
                        'quoteId': quoteId,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                b,
                account,
                currency,
                uppercase,
                result,
                c,
                _currency,
                _account,
                _this81 = this,
                _arguments66 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments66.length > 0 && _arguments66[0] !== undefined ? _arguments66[0] : {};
                return _this81.loadMarkets();
            }).then(function () {
                return _this81.privatePostBalances();
            }).then(function (_resp) {
                response = _resp;
                balances = {};

                for (b = 0; b < response.length; b++) {
                    account = response[b];

                    if (account['type'] == 'exchange') {
                        currency = account['currency'];
                        // issue #4 Bitfinex names Dash as DSH, instead of DASH

                        if (currency == 'DSH') {
                            currency = 'DASH';
                        }uppercase = currency.toUpperCase();

                        balances[uppercase] = account;
                    }
                }
                result = { 'info': response };

                for (c = 0; c < _this81.currencies.length; c++) {
                    _currency = _this81.currencies[c];
                    _account = _this81.account();

                    if (_currency in balances) {
                        _account['free'] = parseFloat(balances[_currency]['available']);
                        _account['total'] = parseFloat(balances[_currency]['amount']);
                        _account['used'] = _account['total'] - _account['free'];
                    }
                    result[_currency] = _account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _timestamp3,
                _this82 = this,
                _arguments67 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments67.length > 1 && _arguments67[1] !== undefined ? _arguments67[1] : {};
                return _this82.loadMarkets();
            }).then(function () {
                return _this82.publicGetBookSymbol(_this82.extend({
                    'symbol': _this82.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this82.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this82.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['amount']);
                        _timestamp3 = parseInt(parseFloat(order['timestamp']));

                        result[side].push([price, amount, _timestamp3]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this83 = this;

            return Promise.resolve().then(function () {
                return _this83.loadMarkets();
            }).then(function () {
                return _this83.publicGetPubtickerSymbol({
                    'symbol': _this83.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = parseFloat(ticker['timestamp']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this83.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last_price']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['mid']),
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        parseTrade: function parseTrade(trade, market) {
            var timestamp = trade['timestamp'] * 1000;
            return {
                'id': trade['tid'].toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['type'],
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['amount'])
            };
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                m,
                trades,
                _this84 = this,
                _arguments69 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments69.length > 1 && _arguments69[1] !== undefined ? _arguments69[1] : {};
                return _this84.loadMarkets();
            }).then(function () {
                m = _this84.market(market);
                return _this84.publicGetTradesSymbol(_this84.extend({
                    'symbol': m['id']
                }, params));
            }).then(function (_resp) {
                trades = _resp;

                return _this84.parseTrades(trades, m);
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                orderType,
                order,
                result,
                _this85 = this,
                _arguments70 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments70.length > 4 && _arguments70[4] !== undefined ? _arguments70[4] : undefined;
                params = _arguments70.length > 5 && _arguments70[5] !== undefined ? _arguments70[5] : {};
                return _this85.loadMarkets();
            }).then(function () {
                orderType = type;

                if (type == 'limit' || type == 'market') {
                    orderType = 'exchange ' + type;
                }order = {
                    'symbol': _this85.marketId(market),
                    'amount': amount.toString(),
                    'side': side,
                    'type': orderType,
                    'ocoorder': false,
                    'buy_price_oco': 0,
                    'sell_price_oco': 0
                };

                if (type == 'market') {
                    order['price'] = _this85.nonce().toString();
                } else {
                    order['price'] = price.toString();
                }
                return _this85.privatePostOrderNew(_this85.extend(order, params));
            }).then(function (_resp) {
                result = _resp;

                return {
                    'info': result,
                    'id': result['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this86 = this;

            return Promise.resolve().then(function () {
                return _this86.loadMarkets();
            }).then(function () {
                return _this86.privatePostOrderCancel({ 'order_id': id });
            });
        },
        parseOrder: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var side = order['side'];
            var open = order['is_live'];
            var canceled = order['is_cancelled'];
            var status = undefined;
            if (open) {
                status = 'open';
            } else if (canceled) {
                status = 'canceled';
            } else {
                status = 'closed';
            }
            var symbol = undefined;
            if (market) {
                symbol = market['symbol'];
            } else {
                var _exchange = order['symbol'].toUpperCase();
                if (_exchange in this.markets_by_id) {
                    market = this.markets_by_id[_exchange];
                    symbol = market['symbol'];
                }
            }
            var orderType = order['type'];
            var exchange = orderType.indexOf('exchange ') >= 0;
            if (exchange) {
                var _order$type$split = order['type'].split(' '),
                    _order$type$split2 = _slicedToArray(_order$type$split, 2),
                    prefix = _order$type$split2[0],
                    _orderType = _order$type$split2[1];
            }
            var timestamp = order['timestamp'] * 1000;
            var result = {
                'info': order,
                'id': order['id'],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'type': orderType,
                'side': side,
                'price': parseFloat(order['price']),
                'amount': parseFloat(order['original_amount']),
                'remaining': parseFloat(order['remaining_amount']),
                'status': status
            };
            return result;
        },
        fetchOrder: function fetchOrder(id) {
            var params,
                response,
                _this87 = this,
                _arguments72 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments72.length > 1 && _arguments72[1] !== undefined ? _arguments72[1] : {};
                return _this87.loadMarkets();
            }).then(function () {
                return _this87.privatePostOrderStatus(_this87.extend({
                    'order_id': parseInt(id)
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return _this87.parseOrder(response);
            });
        },
        nonce: function nonce() {
            return this.milliseconds();
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                request,
                query,
                url,
                nonce,
                payload,
                secret,
                signature,
                response,
                _this88 = this,
                _arguments73 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments73.length > 1 && _arguments73[1] !== undefined ? _arguments73[1] : 'public';
                method = _arguments73.length > 2 && _arguments73[2] !== undefined ? _arguments73[2] : 'GET';
                params = _arguments73.length > 3 && _arguments73[3] !== undefined ? _arguments73[3] : {};
                headers = _arguments73.length > 4 && _arguments73[4] !== undefined ? _arguments73[4] : undefined;
                body = _arguments73.length > 5 && _arguments73[5] !== undefined ? _arguments73[5] : undefined;
                request = '/' + _this88.version + '/' + _this88.implodeParams(path, params);
                query = _this88.omit(params, _this88.extractParams(path));
                url = _this88.urls['api'] + request;

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this88.urlencode(query);
                    }
                } else {
                    nonce = _this88.nonce();

                    query = _this88.extend({
                        'nonce': nonce.toString(),
                        'request': request
                    }, query);
                    query = _this88.json(query);
                    query = _this88.encode(query);
                    payload = _this88.stringToBase64(query);
                    secret = _this88.encode(_this88.secret);
                    signature = _this88.hmac(payload, secret, 'sha384');

                    headers = {
                        'X-BFX-APIKEY': _this88.apiKey,
                        'X-BFX-PAYLOAD': _this88.decode(payload),
                        'X-BFX-SIGNATURE': signature
                    };
                }
                return _this88.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('message' in response) {
                    throw new ExchangeError(_this88.id + ' ' + _this88.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var bitflyer = {

        'id': 'bitflyer',
        'name': 'bitFlyer',
        'countries': 'JP',
        'version': 'v1',
        'rateLimit': 500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28051642-56154182-660e-11e7-9b0d-6042d1e6edd8.jpg',
            'api': 'https://api.bitflyer.jp',
            'www': 'https://bitflyer.jp',
            'doc': 'https://bitflyer.jp/API'
        },
        'api': {
            'public': {
                'get': ['getmarkets', // or 'markets'
                'getboard', // or 'board'
                'getticker', // or 'ticker'
                'getexecutions', // or 'executions'
                'gethealth', 'getchats']
            },
            'private': {
                'get': ['getpermissions', 'getbalance', 'getcollateral', 'getcollateralaccounts', 'getaddresses', 'getcoinins', 'getcoinouts', 'getbankaccounts', 'getdeposits', 'getwithdrawals', 'getchildorders', 'getparentorders', 'getparentorder', 'getexecutions', 'getpositions', 'gettradingcommission'],
                'post': ['sendcoin', 'withdraw', 'sendchildorder', 'cancelchildorder', 'sendparentorder', 'cancelparentorder', 'cancelallchildorders']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                currencies,
                base,
                quote,
                symbol,
                numCurrencies,
                _this89 = this;

            return Promise.resolve().then(function () {
                return _this89.publicGetMarkets();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['product_code'];
                    currencies = id.split('_');
                    base = undefined;
                    quote = undefined;
                    symbol = id;
                    numCurrencies = currencies.length;

                    if (numCurrencies == 2) {
                        base = currencies[0];
                        quote = currencies[1];
                        symbol = base + '/' + quote;
                    }
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                b,
                account,
                currency,
                result,
                c,
                _currency2,
                _account2,
                _this90 = this,
                _arguments75 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments75.length > 0 && _arguments75[0] !== undefined ? _arguments75[0] : {};
                return _this90.loadMarkets();
            }).then(function () {
                return _this90.privateGetBalance();
            }).then(function (_resp) {
                response = _resp;
                balances = {};

                for (b = 0; b < response.length; b++) {
                    account = response[b];
                    currency = account['currency_code'];

                    balances[currency] = account;
                }
                result = { 'info': response };

                for (c = 0; c < _this90.currencies.length; c++) {
                    _currency2 = _this90.currencies[c];
                    _account2 = _this90.account();

                    if (_currency2 in balances) {
                        _account2['total'] = balances[_currency2]['amount'];
                        _account2['free'] = balances[_currency2]['available'];
                        _account2['used'] = _account2['total'] - _account2['free'];
                    }
                    result[_currency2] = _account2;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this91 = this,
                _arguments76 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments76.length > 1 && _arguments76[1] !== undefined ? _arguments76[1] : {};
                return _this91.loadMarkets();
            }).then(function () {
                return _this91.publicGetBoard(_this91.extend({
                    'product_code': _this91.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this91.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this91.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['size']);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this92 = this;

            return Promise.resolve().then(function () {
                return _this92.loadMarkets();
            }).then(function () {
                return _this92.publicGetTicker({
                    'product_code': _this92.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this92.parse8601(ticker['timestamp']);

                return {
                    'timestamp': timestamp,
                    'datetime': _this92.iso8601(timestamp),
                    'high': undefined,
                    'low': undefined,
                    'bid': parseFloat(ticker['best_bid']),
                    'ask': parseFloat(ticker['best_ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['ltp']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['volume_by_product']),
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this93 = this,
                _arguments78 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments78.length > 1 && _arguments78[1] !== undefined ? _arguments78[1] : {};
                return _this93.loadMarkets();
            }).then(function () {
                return _this93.publicGetExecutions(_this93.extend({
                    'product_code': _this93.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                result,
                _this94 = this,
                _arguments79 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments79.length > 4 && _arguments79[4] !== undefined ? _arguments79[4] : undefined;
                params = _arguments79.length > 5 && _arguments79[5] !== undefined ? _arguments79[5] : {};
                return _this94.loadMarkets();
            }).then(function () {
                order = {
                    'product_code': _this94.marketId(market),
                    'child_order_type': type.toUpperCase(),
                    'side': side.toUpperCase(),
                    'price': price,
                    'size': amount
                };
                return _this94.privatePostSendchildorder(_this94.extend(order, params));
            }).then(function (_resp) {
                result = _resp;

                return {
                    'info': result,
                    'id': result['child_order_acceptance_id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this95 = this,
                _arguments80 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments80.length > 1 && _arguments80[1] !== undefined ? _arguments80[1] : {};
                return _this95.loadMarkets();
            }).then(function () {
                return _this95.privatePostCancelchildorder(_this95.extend({
                    'parent_order_id': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                request,
                url,
                nonce,
                auth,
                _this96 = this,
                _arguments81 = arguments;

            api = _arguments81.length > 1 && _arguments81[1] !== undefined ? _arguments81[1] : 'public';
            method = _arguments81.length > 2 && _arguments81[2] !== undefined ? _arguments81[2] : 'GET';
            params = _arguments81.length > 3 && _arguments81[3] !== undefined ? _arguments81[3] : {};
            headers = _arguments81.length > 4 && _arguments81[4] !== undefined ? _arguments81[4] : undefined;
            body = _arguments81.length > 5 && _arguments81[5] !== undefined ? _arguments81[5] : undefined;
            request = '/' + _this96.version + '/';

            if (api == 'private') {
                request += 'me/';
            }request += path;
            url = _this96.urls['api'] + request;

            if (api == 'public') {
                if (Object.keys(params).length) {
                    url += '?' + _this96.urlencode(params);
                }
            } else {
                nonce = _this96.nonce().toString();

                body = _this96.json(params);
                auth = [nonce, method, request, body].join('');

                headers = {
                    'ACCESS-KEY': _this96.apiKey,
                    'ACCESS-TIMESTAMP': nonce,
                    'ACCESS-SIGN': _this96.hmac(_this96.encode(auth), _this96.secret),
                    'Content-Type': 'application/json'
                };
            }
            return _this96.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitlish = {

        'id': 'bitlish',
        'name': 'bitlish',
        'countries': ['GB', 'EU', 'RU'],
        'rateLimit': 1500,
        'version': 'v1',
        'hasFetchTickers': true,
        'hasFetchOHLCV': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766275-dcfc6c30-5ed3-11e7-839d-00a846385d0b.jpg',
            'api': 'https://bitlish.com/api',
            'www': 'https://bitlish.com',
            'doc': 'https://bitlish.com/api'
        },
        'api': {
            'public': {
                'get': ['instruments', 'ohlcv', 'pairs', 'tickers', 'trades_depth', 'trades_history'],
                'post': ['instruments', 'ohlcv', 'pairs', 'tickers', 'trades_depth', 'trades_history']
            },
            'private': {
                'post': ['accounts_operations', 'balance', 'cancel_trade', 'cancel_trades_by_ids', 'cancel_all_trades', 'create_bcode', 'create_template_wallet', 'create_trade', 'deposit', 'list_accounts_operations_from_ts', 'list_active_trades', 'list_bcodes', 'list_my_matches_from_ts', 'list_my_trades', 'list_my_trads_from_ts', 'list_payment_methods', 'list_payments', 'redeem_code', 'resign', 'signin', 'signout', 'trade_details', 'trade_options', 'withdraw', 'withdraw_by_id']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                keys,
                p,
                market,
                id,
                symbol,
                _symbol$split,
                _symbol$split2,
                base,
                quote,
                _this97 = this;

            return Promise.resolve().then(function () {
                return _this97.publicGetPairs();
            }).then(function (_resp) {
                markets = _resp;
                result = [];
                keys = Object.keys(markets);

                for (p = 0; p < keys.length; p++) {
                    market = markets[keys[p]];
                    id = market['id'];
                    symbol = market['name'];
                    _symbol$split = symbol.split('/');
                    _symbol$split2 = _slicedToArray(_symbol$split, 2);
                    base = _symbol$split2[0];
                    quote = _symbol$split2[1];
                    // issue #4 bitlish names Dash as DSH, instead of DASH

                    if (base == 'DSH') {
                        base = 'DASH';
                    }symbol = base + '/' + quote;
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['max']),
                'low': parseFloat(ticker['min']),
                'bid': undefined,
                'ask': undefined,
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': parseFloat(ticker['first']),
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': undefined,
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                ticker,
                _this98 = this;

            return Promise.resolve().then(function () {
                return _this98.loadMarkets();
            }).then(function () {
                return _this98.publicGetTickers();
            }).then(function (_resp) {
                tickers = _resp;
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this98.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = tickers[id];

                    result[symbol] = _this98.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(symbol) {
            var market,
                tickers,
                ticker,
                _this99 = this;

            return Promise.resolve().then(function () {
                return _this99.loadMarkets();
            }).then(function () {
                market = _this99.market(symbol);
                return _this99.publicGetTickers();
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers[market['id']];

                return _this99.parseTicker(ticker, market);
            });
        },
        fetchOHLCV: function fetchOHLCV(symbol) {
            var timeframe,
                since,
                limit,
                market,
                now,
                start,
                interval,
                _this100 = this,
                _arguments85 = arguments;

            return Promise.resolve().then(function () {
                timeframe = _arguments85.length > 1 && _arguments85[1] !== undefined ? _arguments85[1] : 60;
                since = _arguments85.length > 2 && _arguments85[2] !== undefined ? _arguments85[2] : undefined;
                limit = _arguments85.length > 3 && _arguments85[3] !== undefined ? _arguments85[3] : undefined;
                return _this100.loadMarkets();
            }).then(function () {
                market = _this100.market(symbol);
                now = _this100.seconds();
                start = now - 86400 * 30; // last 30 days

                interval = [start.toString(), undefined];

                return _this100.publicPostOhlcv({
                    'time_range': interval
                });
            });
        },
        fetchOrderBook: function fetchOrderBook(symbol) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this101 = this,
                _arguments86 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments86.length > 1 && _arguments86[1] !== undefined ? _arguments86[1] : {};
                return _this101.loadMarkets();
            }).then(function () {
                return _this101.publicGetTradesDepth(_this101.extend({
                    'pair_id': _this101.marketId(symbol)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = parseInt(parseInt(orderbook['last']) / 1000);
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this101.iso8601(timestamp)
                };
                sides = { 'bids': 'bid', 'asks': 'ask' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['volume']);

                        result[key].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTrade: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var side = trade['dir'] == 'bid' ? 'buy' : 'sell';
            var symbol = undefined;
            var timestamp = parseInt(trade['created'] / 1000);
            return {
                'id': undefined,
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'order': undefined,
                'type': undefined,
                'side': side,
                'price': trade['price'],
                'amount': trade['amount']
            };
        },
        fetchTrades: function fetchTrades(symbol) {
            var params,
                market,
                response,
                _this102 = this,
                _arguments87 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments87.length > 1 && _arguments87[1] !== undefined ? _arguments87[1] : {};
                return _this102.loadMarkets();
            }).then(function () {
                market = _this102.market(symbol);
                return _this102.publicGetTradesHistory(_this102.extend({
                    'pair_id': market['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return _this102.parseTrades(response['list'], market);
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                result,
                currencies,
                balance,
                c,
                currency,
                account,
                _c,
                _currency3,
                _account3,
                _this103 = this,
                _arguments88 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments88.length > 0 && _arguments88[0] !== undefined ? _arguments88[0] : {};
                return _this103.loadMarkets();
            }).then(function () {
                return _this103.privatePostBalance();
            }).then(function (_resp) {
                response = _resp;
                result = { 'info': response };
                currencies = Object.keys(response);
                balance = {};

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    account = response[currency];

                    currency = currency.toUpperCase();
                    // issue #4 bitlish names Dash as DSH, instead of DASH
                    if (currency == 'DSH') {
                        currency = 'DASH';
                    }balance[currency] = account;
                }
                for (_c = 0; _c < _this103.currencies.length; _c++) {
                    _currency3 = _this103.currencies[_c];
                    _account3 = _this103.account();

                    if (_currency3 in balance) {
                        _account3['free'] = parseFloat(balance[_currency3]['funds']);
                        _account3['used'] = parseFloat(balance[_currency3]['holded']);
                        _account3['total'] = _this103.sum(_account3['free'], _account3['used']);
                    }
                    result[_currency3] = _account3;
                }
                return result;
            });
        },
        signIn: function signIn() {
            return this.privatePostSignin({
                'login': this.login,
                'passwd': this.password
            });
        },
        createOrder: function createOrder(symbol, type, side, amount) {
            var price,
                params,
                order,
                result,
                _this104 = this,
                _arguments89 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments89.length > 4 && _arguments89[4] !== undefined ? _arguments89[4] : undefined;
                params = _arguments89.length > 5 && _arguments89[5] !== undefined ? _arguments89[5] : {};
                return _this104.loadMarkets();
            }).then(function () {
                order = {
                    'pair_id': _this104.marketId(symbol),
                    'dir': side == 'buy' ? 'bid' : 'ask',
                    'amount': amount
                };

                if (type == 'limit') {
                    order['price'] = price;
                }return _this104.privatePostCreateTrade(_this104.extend(order, params));
            }).then(function (_resp) {
                result = _resp;

                return {
                    'info': result,
                    'id': result['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this105 = this;

            return Promise.resolve().then(function () {
                return _this105.loadMarkets();
            }).then(function () {
                return _this105.privatePostCancelTrade({ 'id': id });
            });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/' + path;
            if (api == 'public') {
                if (method == 'GET') {
                    if (Object.keys(params).length) url += '?' + this.urlencode(params);
                } else {
                    body = this.json(params);
                    headers = { 'Content-Type': 'application/json' };
                }
            } else {
                body = this.json(this.extend({ 'token': this.apiKey }, params));
                headers = { 'Content-Type': 'application/json' };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitmarket = {

        'id': 'bitmarket',
        'name': 'BitMarket',
        'countries': ['PL', 'EU'],
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27767256-a8555200-5ef9-11e7-96fd-469a65e2b0bd.jpg',
            'api': {
                'public': 'https://www.bitmarket.net',
                'private': 'https://www.bitmarket.pl/api2/' // last slash is critical
            },
            'www': ['https://www.bitmarket.pl', 'https://www.bitmarket.net'],
            'doc': ['https://www.bitmarket.net/docs.php?file=api_public.html', 'https://www.bitmarket.net/docs.php?file=api_private.html', 'https://github.com/bitmarket-net/api']
        },
        'api': {
            'public': {
                'get': ['json/{market}/ticker', 'json/{market}/orderbook', 'json/{market}/trades', 'json/ctransfer', 'graphs/{market}/90m', 'graphs/{market}/6h', 'graphs/{market}/1d', 'graphs/{market}/7d', 'graphs/{market}/1m', 'graphs/{market}/3m', 'graphs/{market}/6m', 'graphs/{market}/1y']
            },
            'private': {
                'post': ['info', 'trade', 'cancel', 'orders', 'trades', 'history', 'withdrawals', 'tradingdesk', 'tradingdeskStatus', 'tradingdeskConfirm', 'cryptotradingdesk', 'cryptotradingdeskStatus', 'cryptotradingdeskConfirm', 'withdraw', 'withdrawFiat', 'withdrawPLNPP', 'withdrawFiatFast', 'deposit', 'transfer', 'transfers', 'marginList', 'marginOpen', 'marginClose', 'marginCancel', 'marginModify', 'marginBalanceAdd', 'marginBalanceRemove', 'swapList', 'swapOpen', 'swapClose']
            }
        },
        'markets': {
            'BTC/PLN': { 'id': 'BTCPLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN' },
            'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'LTC/PLN': { 'id': 'LTCPLN', 'symbol': 'LTC/PLN', 'base': 'LTC', 'quote': 'PLN' },
            'LTC/BTC': { 'id': 'LTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'LiteMineX/BTC': { 'id': 'LiteMineXBTC', 'symbol': 'LiteMineX/BTC', 'base': 'LiteMineX', 'quote': 'BTC' },
            'PlnX/BTC': { 'id': 'PlnxBTC', 'symbol': 'PlnX/BTC', 'base': 'PlnX', 'quote': 'BTC' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                response,
                data,
                balance,
                result,
                c,
                currency,
                account,
                _this106 = this,
                _arguments91 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments91.length > 0 && _arguments91[0] !== undefined ? _arguments91[0] : {};
                return _this106.loadMarkets();
            }).then(function () {
                return _this106.privatePostInfo();
            }).then(function (_resp) {
                response = _resp;
                data = response['data'];
                balance = data['balances'];
                result = { 'info': data };

                for (c = 0; c < _this106.currencies.length; c++) {
                    currency = _this106.currencies[c];
                    account = _this106.account();

                    if (currency in balance['available']) {
                        account['free'] = balance['available'][currency];
                    }if (currency in balance['blocked']) {
                        account['used'] = balance['blocked'][currency];
                    }account['total'] = _this106.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                _this107 = this,
                _arguments92 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments92.length > 1 && _arguments92[1] !== undefined ? _arguments92[1] : {};
                return _this107.publicGetJsonMarketOrderbook(_this107.extend({
                    'market': _this107.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this107.milliseconds();
                result = {
                    'bids': orderbook['bids'],
                    'asks': orderbook['asks'],
                    'timestamp': timestamp,
                    'datetime': _this107.iso8601(timestamp)
                };

                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this108 = this;

            return Promise.resolve().then(function () {
                return _this108.publicGetJsonMarketTicker({
                    'market': _this108.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this108.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this108.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this109 = this,
                _arguments94 = arguments;

            params = _arguments94.length > 1 && _arguments94[1] !== undefined ? _arguments94[1] : {};

            return _this109.publicGetJsonMarketTrades(_this109.extend({
                'market': _this109.marketId(market)
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                response,
                result,
                _this110 = this,
                _arguments95 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments95.length > 4 && _arguments95[4] !== undefined ? _arguments95[4] : undefined;
                params = _arguments95.length > 5 && _arguments95[5] !== undefined ? _arguments95[5] : {};
                return _this110.privatePostTrade(_this110.extend({
                    'market': _this110.marketId(market),
                    'type': side,
                    'amount': amount,
                    'rate': price
                }, params));
            }).then(function (_resp) {
                response = _resp;
                result = {
                    'info': response
                };

                if ('id' in response['order']) {
                    result['id'] = response['id'];
                }return result;
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this111 = this;

            return _this111.privatePostCancel({ 'id': id });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][api];
            if (api == 'public') {
                url += '/' + this.implodeParams(path + '.json', params);
            } else {
                var nonce = this.nonce();
                var query = this.extend({
                    'tonce': nonce,
                    'method': path
                }, params);
                body = this.urlencode(query);
                headers = {
                    'API-Key': this.apiKey,
                    'API-Hash': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitmex = {

        'id': 'bitmex',
        'name': 'BitMEX',
        'countries': 'SC', // Seychelles
        'version': 'v1',
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766319-f653c6e6-5ed4-11e7-933d-f0bc3699ae8f.jpg',
            'api': 'https://www.bitmex.com',
            'www': 'https://www.bitmex.com',
            'doc': ['https://www.bitmex.com/app/apiOverview', 'https://github.com/BitMEX/api-connectors/tree/master/official-http']
        },
        'api': {
            'public': {
                'get': ['announcement', 'announcement/urgent', 'funding', 'instrument', 'instrument/active', 'instrument/activeAndIndices', 'instrument/activeIntervals', 'instrument/compositeIndex', 'instrument/indices', 'insurance', 'leaderboard', 'liquidation', 'orderBook', 'orderBook/L2', 'quote', 'quote/bucketed', 'schema', 'schema/websocketHelp', 'settlement', 'stats', 'stats/history', 'trade', 'trade/bucketed']
            },
            'private': {
                'get': ['apiKey', 'chat', 'chat/channels', 'chat/connected', 'execution', 'execution/tradeHistory', 'notification', 'order', 'position', 'user', 'user/affiliateStatus', 'user/checkReferralCode', 'user/commission', 'user/depositAddress', 'user/margin', 'user/minWithdrawalFee', 'user/wallet', 'user/walletHistory', 'user/walletSummary'],
                'post': ['apiKey', 'apiKey/disable', 'apiKey/enable', 'chat', 'order', 'order/bulk', 'order/cancelAllAfter', 'order/closePosition', 'position/isolate', 'position/leverage', 'position/riskLimit', 'position/transferMargin', 'user/cancelWithdrawal', 'user/confirmEmail', 'user/confirmEnableTFA', 'user/confirmWithdrawal', 'user/disableTFA', 'user/logout', 'user/logoutAll', 'user/preferences', 'user/requestEnableTFA', 'user/requestWithdrawal'],
                'put': ['order', 'order/bulk', 'user'],
                'delete': ['apiKey', 'order', 'order/all']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                isFuturesContract,
                symbol,
                _this112 = this;

            return Promise.resolve().then(function () {
                return _this112.publicGetInstrumentActive();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['symbol'];
                    base = market['underlying'];
                    quote = market['quoteCurrency'];
                    isFuturesContract = id != base + quote;

                    base = _this112.commonCurrencyCode(base);
                    quote = _this112.commonCurrencyCode(quote);
                    symbol = isFuturesContract ? id : base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                result,
                b,
                balance,
                currency,
                account,
                _this113 = this,
                _arguments98 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments98.length > 0 && _arguments98[0] !== undefined ? _arguments98[0] : {};
                return _this113.loadMarkets();
            }).then(function () {
                return _this113.privateGetUserMargin({ 'currency': 'all' });
            }).then(function (_resp) {
                response = _resp;
                result = { 'info': response };

                for (b = 0; b < response.length; b++) {
                    balance = response[b];
                    currency = balance['currency'].toUpperCase();

                    currency = _this113.commonCurrencyCode(currency);
                    account = {
                        'free': balance['availableMargin'],
                        'used': 0.0,
                        'total': balance['amount']
                    };

                    if (currency == 'BTC') {
                        account['free'] = account['free'] * 0.00000001;
                        account['total'] = account['total'] * 0.00000001;
                    }
                    account['used'] = account['total'] - account['free'];
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                o,
                order,
                side,
                amount,
                price,
                _this114 = this,
                _arguments99 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments99.length > 1 && _arguments99[1] !== undefined ? _arguments99[1] : {};
                return _this114.loadMarkets();
            }).then(function () {
                return _this114.publicGetOrderBookL2(_this114.extend({
                    'symbol': _this114.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this114.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this114.iso8601(timestamp)
                };

                for (o = 0; o < orderbook.length; o++) {
                    order = orderbook[o];
                    side = order['side'] == 'Sell' ? 'asks' : 'bids';
                    amount = order['size'];
                    price = order['price'];

                    result[side].push([price, amount]);
                }
                result['bids'] = _this114.sortBy(result['bids'], 0, true);
                result['asks'] = _this114.sortBy(result['asks'], 0);
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var request,
                quotes,
                quotesLength,
                quote,
                tickers,
                ticker,
                timestamp,
                _this115 = this;

            return Promise.resolve().then(function () {
                return _this115.loadMarkets();
            }).then(function () {
                request = {
                    'symbol': _this115.marketId(market),
                    'binSize': '1d',
                    'partial': true,
                    'count': 1,
                    'reverse': true
                };
                return _this115.publicGetQuoteBucketed(request);
            }).then(function (_resp) {
                quotes = _resp;
                quotesLength = quotes.length;
                quote = quotes[quotesLength - 1];
                return _this115.publicGetTradeBucketed(request);
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers[0];
                timestamp = _this115.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this115.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(quote['bidPrice']),
                    'ask': parseFloat(quote['askPrice']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': parseFloat(ticker['close']),
                    'first': undefined,
                    'last': undefined,
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['homeNotional']),
                    'quoteVolume': parseFloat(ticker['foreignNotional']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this116 = this,
                _arguments101 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments101.length > 1 && _arguments101[1] !== undefined ? _arguments101[1] : {};
                return _this116.loadMarkets();
            }).then(function () {
                return _this116.publicGetTrade(_this116.extend({
                    'symbol': _this116.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this117 = this,
                _arguments102 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments102.length > 4 && _arguments102[4] !== undefined ? _arguments102[4] : undefined;
                params = _arguments102.length > 5 && _arguments102[5] !== undefined ? _arguments102[5] : {};
                return _this117.loadMarkets();
            }).then(function () {
                order = {
                    'symbol': _this117.marketId(market),
                    'side': _this117.capitalize(side),
                    'orderQty': amount,
                    'ordType': _this117.capitalize(type)
                };

                if (type == 'limit') {
                    order['rate'] = price;
                }return _this117.privatePostOrder(_this117.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['orderID']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this118 = this;

            return Promise.resolve().then(function () {
                return _this118.loadMarkets();
            }).then(function () {
                return _this118.privateDeleteOrder({ 'orderID': id });
            });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var query = '/api/' + this.version + '/' + path;
            if (Object.keys(params).length) query += '?' + this.urlencode(params);
            var url = this.urls['api'] + query;
            if (api == 'private') {
                var nonce = this.nonce().toString();
                if (method == 'POST') if (Object.keys(params).length) body = this.json(params);
                var request = [method, query, nonce, body || ''].join('');
                headers = {
                    'Content-Type': 'application/json',
                    'api-nonce': nonce,
                    'api-key': this.apiKey,
                    'api-signature': this.hmac(this.encode(request), this.encode(this.secret))
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitso = {

        'id': 'bitso',
        'name': 'Bitso',
        'countries': 'MX', // Mexico
        'rateLimit': 2000, // 30 requests per minute
        'version': 'v3',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766335-715ce7aa-5ed5-11e7-88a8-173a27bb30fe.jpg',
            'api': 'https://api.bitso.com',
            'www': 'https://bitso.com',
            'doc': 'https://bitso.com/api_info'
        },
        'api': {
            'public': {
                'get': ['available_books', 'ticker', 'order_book', 'trades']
            },
            'private': {
                'get': ['account_status', 'balance', 'fees', 'fundings', 'fundings/{fid}', 'funding_destination', 'kyc_documents', 'ledger', 'ledger/trades', 'ledger/fees', 'ledger/fundings', 'ledger/withdrawals', 'mx_bank_codes', 'open_orders', 'order_trades/{oid}', 'orders/{oid}', 'user_trades', 'user_trades/{tid}', 'withdrawals/', 'withdrawals/{wid}'],
                'post': ['bitcoin_withdrawal', 'debit_card_withdrawal', 'ether_withdrawal', 'orders', 'phone_number', 'phone_verification', 'phone_withdrawal', 'spei_withdrawal'],
                'delete': ['orders/{oid}', 'orders/all']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                symbol,
                _symbol$split3,
                _symbol$split4,
                base,
                quote,
                _this119 = this;

            return Promise.resolve().then(function () {
                return _this119.publicGetAvailableBooks();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets['payload'].length; p++) {
                    market = markets['payload'][p];
                    id = market['book'];
                    symbol = id.toUpperCase().replace('_', '/');
                    _symbol$split3 = symbol.split('/');
                    _symbol$split4 = _slicedToArray(_symbol$split3, 2);
                    base = _symbol$split4[0];
                    quote = _symbol$split4[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                b,
                balance,
                currency,
                account,
                _this120 = this,
                _arguments105 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments105.length > 0 && _arguments105[0] !== undefined ? _arguments105[0] : {};
                return _this120.loadMarkets();
            }).then(function () {
                return _this120.privateGetBalance();
            }).then(function (_resp) {
                response = _resp;
                balances = response['payload']['balances'];
                result = { 'info': response };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'].toUpperCase();
                    account = {
                        'free': parseFloat(balance['available']),
                        'used': parseFloat(balance['locked']),
                        'total': parseFloat(balance['total'])
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this121 = this,
                _arguments106 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments106.length > 1 && _arguments106[1] !== undefined ? _arguments106[1] : {};
                return _this121.loadMarkets();
            }).then(function () {
                return _this121.publicGetOrderBook(_this121.extend({
                    'book': _this121.marketId(market)
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['payload'];
                timestamp = _this121.parse8601(orderbook['updated_at']);
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this121.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['amount']);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                timestamp,
                _this122 = this;

            return Promise.resolve().then(function () {
                return _this122.loadMarkets();
            }).then(function () {
                return _this122.publicGetTicker({
                    'book': _this122.marketId(market)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['payload'];
                timestamp = _this122.parse8601(ticker['created_at']);

                return {
                    'timestamp': timestamp,
                    'datetime': _this122.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': undefined,
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this123 = this,
                _arguments108 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments108.length > 1 && _arguments108[1] !== undefined ? _arguments108[1] : {};
                return _this123.loadMarkets();
            }).then(function () {
                return _this123.publicGetTrades(_this123.extend({
                    'book': _this123.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this124 = this,
                _arguments109 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments109.length > 4 && _arguments109[4] !== undefined ? _arguments109[4] : undefined;
                params = _arguments109.length > 5 && _arguments109[5] !== undefined ? _arguments109[5] : {};
                return _this124.loadMarkets();
            }).then(function () {
                order = {
                    'book': _this124.marketId(market),
                    'side': side,
                    'type': type,
                    'major': amount
                };

                if (type == 'limit') {
                    order['price'] = price;
                }return _this124.privatePostOrders(_this124.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['payload']['oid']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this125 = this;

            return Promise.resolve().then(function () {
                return _this125.loadMarkets();
            }).then(function () {
                return _this125.privateDeleteOrders({ 'oid': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                query,
                url,
                nonce,
                request,
                signature,
                auth,
                response,
                _test3,
                _this126 = this,
                _arguments111 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments111.length > 1 && _arguments111[1] !== undefined ? _arguments111[1] : 'public';
                method = _arguments111.length > 2 && _arguments111[2] !== undefined ? _arguments111[2] : 'GET';
                params = _arguments111.length > 3 && _arguments111[3] !== undefined ? _arguments111[3] : {};
                headers = _arguments111.length > 4 && _arguments111[4] !== undefined ? _arguments111[4] : undefined;
                body = _arguments111.length > 5 && _arguments111[5] !== undefined ? _arguments111[5] : undefined;
                query = '/' + _this126.version + '/' + _this126.implodeParams(path, params);
                url = _this126.urls['api'] + query;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this126.urlencode(params);
                    }
                } else {
                    if (Object.keys(params).length) {
                        body = _this126.json(params);
                    }nonce = _this126.nonce().toString();
                    request = [nonce, method, query, body || ''].join('');
                    signature = _this126.hmac(_this126.encode(request), _this126.encode(_this126.secret));
                    auth = _this126.apiKey + ':' + nonce + ':' + signature;

                    headers = { 'Authorization': "Bitso " + auth };
                }
                return _this126.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test3 = 'success' in response;

                if (_test3 && response['success']) {
                    return response;
                } else {
                    throw new ExchangeError(_this126.id + ' ' + _this126.json(response));
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var bitstamp = {

        'id': 'bitstamp',
        'name': 'Bitstamp',
        'countries': 'GB',
        'rateLimit': 1000,
        'version': 'v2',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27786377-8c8ab57e-5fe9-11e7-8ea4-2b05b6bcceec.jpg',
            'api': 'https://www.bitstamp.net/api',
            'www': 'https://www.bitstamp.net',
            'doc': 'https://www.bitstamp.net/api'
        },
        'api': {
            'public': {
                'get': ['order_book/{id}/', 'ticker_hour/{id}/', 'ticker/{id}/', 'transactions/{id}/']
            },
            'private': {
                'post': ['balance/', 'balance/{id}/', 'buy/{id}/', 'buy/market/{id}/', 'cancel_order/', 'liquidation_address/info/', 'liquidation_address/new/', 'open_orders/all/', 'open_orders/{id}/', 'order_status/', 'sell/{id}/', 'sell/market/{id}/', 'transfer-from-main/', 'transfer-to-main/', 'user_transactions/', 'user_transactions/{id}/', 'withdrawal/cancel/', 'withdrawal/open/', 'withdrawal/status/', 'xrp_address/', 'xrp_withdrawal/']
            }
        },
        'markets': {
            'BTC/USD': { 'id': 'btcusd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/EUR': { 'id': 'btceur', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'EUR/USD': { 'id': 'eurusd', 'symbol': 'EUR/USD', 'base': 'EUR', 'quote': 'USD' },
            'XRP/USD': { 'id': 'xrpusd', 'symbol': 'XRP/USD', 'base': 'XRP', 'quote': 'USD' },
            'XRP/EUR': { 'id': 'xrpeur', 'symbol': 'XRP/EUR', 'base': 'XRP', 'quote': 'EUR' },
            'XRP/BTC': { 'id': 'xrpbtc', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC' },
            'LTC/USD': { 'id': 'ltcusd', 'symbol': 'LTC/USD', 'base': 'LTC', 'quote': 'USD' },
            'LTC/EUR': { 'id': 'ltceur', 'symbol': 'LTC/EUR', 'base': 'LTC', 'quote': 'EUR' },
            'LTC/BTC': { 'id': 'ltcbtc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'ETH/USD': { 'id': 'ethusd', 'symbol': 'ETH/USD', 'base': 'ETH', 'quote': 'USD' },
            'ETH/EUR': { 'id': 'etheur', 'symbol': 'ETH/EUR', 'base': 'ETH', 'quote': 'EUR' },
            'ETH/BTC': { 'id': 'ethbtc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' }
        },

        fetchOrderBook: function fetchOrderBook(symbol) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this127 = this,
                _arguments112 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments112.length > 1 && _arguments112[1] !== undefined ? _arguments112[1] : {};
                return _this127.publicGetOrderBookId(_this127.extend({
                    'id': _this127.marketId(symbol)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = parseInt(orderbook['timestamp']) * 1000;
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this127.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(symbol) {
            var ticker,
                timestamp,
                _this128 = this;

            return Promise.resolve().then(function () {
                return _this128.publicGetTickerId({
                    'id': _this128.marketId(symbol)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = parseInt(ticker['timestamp']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this128.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        parseTrade: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = undefined;
            if ('date' in trade) {
                timestamp = parseInt(trade['date']);
            } else if ('datetime' in trade) {
                // timestamp = this.parse8601 (trade['datetime']);
                timestamp = parseInt(trade['datetime']);
            }
            var side = trade['type'] == 0 ? 'buy' : 'sell';
            var order = undefined;
            if ('order_id' in trade) order = trade['order_id'].toString();
            if ('currency_pair' in trade) {
                if (trade['currency_pair'] in this.markets_by_id) market = this.markets_by_id[trade['currency_pair']];
            }
            return {
                'id': trade['tid'].toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'order': order,
                'type': undefined,
                'side': side,
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['amount'])
            };
        },
        fetchTrades: function fetchTrades(symbol) {
            var params,
                market,
                response,
                _this129 = this,
                _arguments114 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments114.length > 1 && _arguments114[1] !== undefined ? _arguments114[1] : {};
                market = _this129.market(symbol);
                return _this129.publicGetTransactionsId(_this129.extend({
                    'id': market['id'],
                    'time': 'minute'
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return _this129.parseTrades(response, market);
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                balance,
                result,
                c,
                currency,
                lowercase,
                total,
                free,
                used,
                account,
                _this130 = this,
                _arguments115 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments115.length > 0 && _arguments115[0] !== undefined ? _arguments115[0] : {};
                return _this130.privatePostBalance();
            }).then(function (_resp) {
                balance = _resp;
                result = { 'info': balance };

                for (c = 0; c < _this130.currencies.length; c++) {
                    currency = _this130.currencies[c];
                    lowercase = currency.toLowerCase();
                    total = lowercase + '_balance';
                    free = lowercase + '_available';
                    used = lowercase + '_reserved';
                    account = _this130.account();

                    if (free in balance) {
                        account['free'] = parseFloat(balance[free]);
                    }if (used in balance) {
                        account['used'] = parseFloat(balance[used]);
                    }if (total in balance) {
                        account['total'] = parseFloat(balance[total]);
                    }result[currency] = account;
                }
                return result;
            });
        },
        createOrder: function createOrder(symbol, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                _this131 = this,
                _arguments116 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments116.length > 4 && _arguments116[4] !== undefined ? _arguments116[4] : undefined;
                params = _arguments116.length > 5 && _arguments116[5] !== undefined ? _arguments116[5] : {};
                method = 'privatePost' + _this131.capitalize(side);
                order = {
                    'id': _this131.marketId(symbol),
                    'amount': amount
                };

                if (type == 'market') {
                    method += 'Market';
                } else {
                    order['price'] = price;
                }method += 'Id';
                return _this131[method](_this131.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this132 = this;

            return _this132.privatePostCancelOrder({ 'id': id });
        },
        parseOrderStatus: function parseOrderStatus(order) {
            if (order['status'] == 'Queue' || order['status'] == 'Open') return 'open';
            if (order['status'] == 'Finished') return 'closed';
            return order['status'];
        },
        fetchOrderStatus: function fetchOrderStatus(id) {
            var symbol,
                response,
                _this133 = this,
                _arguments118 = arguments;

            return Promise.resolve().then(function () {
                symbol = _arguments118.length > 1 && _arguments118[1] !== undefined ? _arguments118[1] : undefined;
                return _this133.loadMarkets();
            }).then(function () {
                return _this133.privatePostOrderStatus({ 'id': id });
            }).then(function (_resp) {
                response = _resp;

                return _this133.parseOrderStatus(response);
            });
        },
        fetchMyTrades: function fetchMyTrades() {
            var symbol,
                params,
                market,
                pair,
                request,
                response,
                result,
                _this134 = this,
                _arguments119 = arguments;

            return Promise.resolve().then(function () {
                symbol = _arguments119.length > 0 && _arguments119[0] !== undefined ? _arguments119[0] : undefined;
                params = _arguments119.length > 1 && _arguments119[1] !== undefined ? _arguments119[1] : {};
                return _this134.loadMarkets();
            }).then(function () {
                market = undefined;

                if (symbol) {
                    market = _this134.market(symbol);
                }pair = market ? market['id'] : 'all';
                request = _this134.extend({ 'id': pair }, params);
                return _this134.privatePostOpenOrdersId(request);
            }).then(function (_resp) {
                response = _resp;
                result = _this134.parseTrades(response, market);
            });
        },
        fetchOrder: function fetchOrder(id) {
            var _this135 = this;

            return Promise.resolve().then(function () {
                throw new NotImplemented(_this135.id + ' fetchOrder is not implemented yet');
                return _this135.loadMarkets();
            }).then(function () {});
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                auth,
                signature,
                response,
                _this136 = this,
                _arguments121 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments121.length > 1 && _arguments121[1] !== undefined ? _arguments121[1] : 'public';
                method = _arguments121.length > 2 && _arguments121[2] !== undefined ? _arguments121[2] : 'GET';
                params = _arguments121.length > 3 && _arguments121[3] !== undefined ? _arguments121[3] : {};
                headers = _arguments121.length > 4 && _arguments121[4] !== undefined ? _arguments121[4] : undefined;
                body = _arguments121.length > 5 && _arguments121[5] !== undefined ? _arguments121[5] : undefined;
                url = _this136.urls['api'] + '/' + _this136.version + '/' + _this136.implodeParams(path, params);
                query = _this136.omit(params, _this136.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this136.urlencode(query);
                    }
                } else {
                    if (!_this136.uid) {
                        throw new AuthenticationError(_this136.id + ' requires `' + _this136.id + '.uid` property for authentication');
                    }nonce = _this136.nonce().toString();
                    auth = nonce + _this136.uid + _this136.apiKey;
                    signature = _this136.encode(_this136.hmac(_this136.encode(auth), _this136.encode(_this136.secret)));

                    query = _this136.extend({
                        'key': _this136.apiKey,
                        'signature': signature.toUpperCase(),
                        'nonce': nonce
                    }, query);
                    body = _this136.urlencode(query);
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length.toString()
                    };
                }
                return _this136.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('status' in response) {
                    if (response['status'] == 'error') {
                        throw new ExchangeError(_this136.id + ' ' + _this136.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var bittrex = {

        'id': 'bittrex',
        'name': 'Bittrex',
        'countries': 'US',
        'version': 'v1.1',
        'rateLimit': 1500,
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766352-cf0b3c26-5ed5-11e7-82b7-f3826b7a97d8.jpg',
            'api': 'https://bittrex.com/api',
            'www': 'https://bittrex.com',
            'doc': ['https://bittrex.com/Home/Api', 'https://www.npmjs.org/package/node.bittrex.api']
        },
        'api': {
            'public': {
                'get': ['currencies', 'markethistory', 'markets', 'marketsummaries', 'marketsummary', 'orderbook', 'ticker']
            },
            'account': {
                'get': ['balance', 'balances', 'depositaddress', 'deposithistory', 'order', 'orderhistory', 'withdrawalhistory', 'withdraw']
            },
            'market': {
                'get': ['buylimit', 'buymarket', 'cancel', 'openorders', 'selllimit', 'sellmarket']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this137 = this;

            return Promise.resolve().then(function () {
                return _this137.publicGetMarkets();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets['result'].length; p++) {
                    market = markets['result'][p];
                    id = market['MarketName'];
                    base = market['MarketCurrency'];
                    quote = market['BaseCurrency'];

                    base = _this137.commonCurrencyCode(base);
                    quote = _this137.commonCurrencyCode(quote);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                indexed,
                c,
                currency,
                account,
                balance,
                _this138 = this,
                _arguments123 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments123.length > 0 && _arguments123[0] !== undefined ? _arguments123[0] : {};
                return _this138.loadMarkets();
            }).then(function () {
                return _this138.accountGetBalances();
            }).then(function (_resp) {
                response = _resp;
                balances = response['result'];
                result = { 'info': balances };
                indexed = _this138.indexBy(balances, 'Currency');

                for (c = 0; c < _this138.currencies.length; c++) {
                    currency = _this138.currencies[c];
                    account = _this138.account();

                    if (currency in indexed) {
                        balance = indexed[currency];

                        account['free'] = balance['Available'];
                        account['used'] = balance['Balance'] - balance['Available'];
                        account['total'] = balance['Balance'];
                    }
                    result[currency] = account;
                }
                return result;
            });
        },
        parseBidAsk: function parseBidAsk(bidask) {
            var price = parseFloat(bidask['Rate']);
            var amount = parseFloat(bidask['Quantity']);
            return [price, amount];
        },
        parseBidAsks: function parseBidAsks(bidasks) {
            var result = [];
            for (var i = 0; i < bidasks.length; i++) {
                result.push(this.parseBidAsk(bidasks[i]));
            }
            return result;
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                _this139 = this,
                _arguments124 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments124.length > 1 && _arguments124[1] !== undefined ? _arguments124[1] : {};
                return _this139.loadMarkets();
            }).then(function () {
                return _this139.publicGetOrderbook(_this139.extend({
                    'market': _this139.marketId(market),
                    'type': 'both',
                    'depth': 50
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['result'];
                timestamp = _this139.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this139.iso8601(timestamp)
                };
                sides = { 'bids': 'buy', 'asks': 'sell' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];

                    result[key] = _this139.parseBidAsks(orderbook[side]);
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.parse8601(ticker['TimeStamp']);
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['High']),
                'low': parseFloat(ticker['Low']),
                'bid': parseFloat(ticker['Bid']),
                'ask': parseFloat(ticker['Ask']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['Last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['BaseVolume']),
                'quoteVolume': parseFloat(ticker['Volume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var response,
                tickers,
                result,
                t,
                ticker,
                id,
                market,
                symbol,
                _id$split,
                _id$split2,
                quote,
                base,
                _this140 = this;

            return Promise.resolve().then(function () {
                return _this140.loadMarkets();
            }).then(function () {
                return _this140.publicGetMarketsummaries();
            }).then(function (_resp) {
                response = _resp;
                tickers = response['result'];
                result = {};

                for (t = 0; t < tickers.length; t++) {
                    ticker = tickers[t];
                    id = ticker['MarketName'];
                    market = undefined;
                    symbol = id;

                    if (id in _this140.markets_by_id) {
                        market = _this140.markets_by_id[id];
                        symbol = market['symbol'];
                    } else {
                        _id$split = id.split('-');
                        _id$split2 = _slicedToArray(_id$split, 2);
                        quote = _id$split2[0];
                        base = _id$split2[1];

                        base = _this140.commonCurrencyCode(base);
                        quote = _this140.commonCurrencyCode(quote);
                        symbol = base + '/' + quote;
                    }
                    result[symbol] = _this140.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var m,
                response,
                ticker,
                _this141 = this;

            return Promise.resolve().then(function () {
                return _this141.loadMarkets();
            }).then(function () {
                m = _this141.market(market);
                return _this141.publicGetMarketsummary({
                    'market': m['id']
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['result'][0];

                return _this141.parseTicker(ticker, m);
            });
        },
        parseTrade: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.parse8601(trade['TimeStamp']);
            var side = undefined;
            if (trade['OrderType'] == 'BUY') {
                side = 'buy';
            } else if (trade['OrderType'] == 'SELL') {
                side = 'sell';
            }
            var type = undefined;
            return {
                'id': trade['Id'].toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': side,
                'price': trade['Price'],
                'amount': trade['Quantity']
            };
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                m,
                response,
                _this142 = this,
                _arguments127 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments127.length > 1 && _arguments127[1] !== undefined ? _arguments127[1] : {};
                return _this142.loadMarkets();
            }).then(function () {
                m = _this142.market(market);
                return _this142.publicGetMarkethistory(_this142.extend({
                    'market': m['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return _this142.parseTrades(response['result'], m);
            });
        },
        fetchOpenOrders: function fetchOpenOrders() {
            var symbol,
                params,
                request,
                market,
                response,
                _this143 = this,
                _arguments128 = arguments;

            return Promise.resolve().then(function () {
                symbol = _arguments128.length > 0 && _arguments128[0] !== undefined ? _arguments128[0] : undefined;
                params = _arguments128.length > 1 && _arguments128[1] !== undefined ? _arguments128[1] : {};
                return _this143.loadMarkets();
            }).then(function () {
                request = {};
                market = undefined;

                if (symbol) {
                    market = _this143.market(symbol);
                    request['market'] = market['id'];
                }
                return _this143.marketGetOpenorders(_this143.extend(request, params));
            }).then(function (_resp) {
                response = _resp;

                return _this143.parseOrders(response['result'], market);
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                result,
                _this144 = this,
                _arguments129 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments129.length > 4 && _arguments129[4] !== undefined ? _arguments129[4] : undefined;
                params = _arguments129.length > 5 && _arguments129[5] !== undefined ? _arguments129[5] : {};
                return _this144.loadMarkets();
            }).then(function () {
                method = 'marketGet' + _this144.capitalize(side) + type;
                order = {
                    'market': _this144.marketId(market),
                    'quantity': amount
                };

                if (type == 'limit') {
                    order['rate'] = price;
                }return _this144[method](_this144.extend(order, params));
            }).then(function (_resp) {
                response = _resp;
                result = {
                    'info': response,
                    'id': response['result']['uuid']
                };

                return result;
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this145 = this;

            return Promise.resolve().then(function () {
                return _this145.loadMarkets();
            }).then(function () {
                return _this145.marketGetCancel({ 'uuid': id });
            });
        },
        parseOrder: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var side = undefined;
            if ('OrderType' in order) side = order['OrderType'] == 'LIMIT_BUY' ? 'buy' : 'sell';
            if ('Type' in order) side = order['Type'] == 'LIMIT_BUY' ? 'buy' : 'sell';
            var status = 'open';
            if (order['Closed']) {
                status = 'closed';
            } else if (order['CancelInitiated']) {
                status = 'canceled';
            }
            var symbol = undefined;
            if (market) {
                symbol = market['symbol'];
            } else {
                var exchange = order['Exchange'];
                if (exchange in this.markets_by_id) {
                    market = this.markets_by_id[exchange];
                    symbol = ['symbol'];
                }
            }
            var timestamp = this.parse8601(order['Opened']);
            var result = {
                'info': order,
                'id': order['OrderUuid'],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'type': 'limit',
                'side': side,
                'price': order['Price'],
                'amount': order['Quantity'],
                'remaining': order['QuantityRemaining'],
                'status': status
            };
            return result;
        },
        fetchOrder: function fetchOrder(id) {
            var response,
                _this146 = this;

            return Promise.resolve().then(function () {
                return _this146.loadMarkets();
            }).then(function () {
                return _this146.accountGetOrder({ 'uuid': id });
            }).then(function (_resp) {
                response = _resp;

                return _this146.parseOrder(response['result']);
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                signature,
                response,
                _test4,
                _this147 = this,
                _arguments132 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments132.length > 1 && _arguments132[1] !== undefined ? _arguments132[1] : 'public';
                method = _arguments132.length > 2 && _arguments132[2] !== undefined ? _arguments132[2] : 'GET';
                params = _arguments132.length > 3 && _arguments132[3] !== undefined ? _arguments132[3] : {};
                headers = _arguments132.length > 4 && _arguments132[4] !== undefined ? _arguments132[4] : undefined;
                body = _arguments132.length > 5 && _arguments132[5] !== undefined ? _arguments132[5] : undefined;
                url = _this147.urls['api'] + '/' + _this147.version + '/';

                if (api == 'public') {
                    url += api + '/' + method.toLowerCase() + path;
                    if (Object.keys(params).length) {
                        url += '?' + _this147.urlencode(params);
                    }
                } else {
                    nonce = _this147.nonce();

                    url += api + '/';
                    if (api == 'account' && path != 'withdraw' || path == 'openorders') {
                        url += method.toLowerCase();
                    }url += path + '?' + _this147.urlencode(_this147.extend({
                        'nonce': nonce,
                        'apikey': _this147.apiKey
                    }, params));
                    signature = _this147.hmac(_this147.encode(url), _this147.encode(_this147.secret), 'sha512');

                    headers = { 'apisign': signature };
                }
                return _this147.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test4 = 'success' in response;

                if (_test4 && response['success']) {
                    return response;
                } else {
                    if ('message' in response) {
                        if (response['message'] == "INSUFFICIENT_FUNDS") {
                            throw new InsufficientFunds(_this147.id + ' ' + _this147.json(response));
                        }
                    }throw new ExchangeError(_this147.id + ' ' + _this147.json(response));
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var blinktrade = {

        'id': 'blinktrade',
        'name': 'BlinkTrade',
        'countries': ['US', 'VE', 'VN', 'BR', 'PK', 'CL'],
        'rateLimit': 1000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27990968-75d9c884-6470-11e7-9073-46756c8e7e8c.jpg',
            'api': {
                'public': 'https://api.blinktrade.com/api',
                'private': 'https://api.blinktrade.com/tapi'
            },
            'www': 'https://blinktrade.com',
            'doc': 'https://blinktrade.com/docs'
        },
        'api': {
            'public': {
                'get': ['{currency}/ticker', // ?crypto_currency=BTC
                '{currency}/orderbook', // ?crypto_currency=BTC
                '{currency}/trades']
            },
            'private': {
                'post': ['D', // order
                'F', // cancel order
                'U2', // balance
                'U4', // my orders
                'U6', // withdraw
                'U18', // deposit
                'U24', // confirm withdrawal
                'U26', // list withdrawals
                'U30', // list deposits
                'U34', // ledger
                'U70']
            }
        },
        'markets': {
            'BTC/VEF': { 'id': 'BTCVEF', 'symbol': 'BTC/VEF', 'base': 'BTC', 'quote': 'VEF', 'brokerId': 1, 'broker': 'SurBitcoin' },
            'BTC/VND': { 'id': 'BTCVND', 'symbol': 'BTC/VND', 'base': 'BTC', 'quote': 'VND', 'brokerId': 3, 'broker': 'VBTC' },
            'BTC/BRL': { 'id': 'BTCBRL', 'symbol': 'BTC/BRL', 'base': 'BTC', 'quote': 'BRL', 'brokerId': 4, 'broker': 'FoxBit' },
            'BTC/PKR': { 'id': 'BTCPKR', 'symbol': 'BTC/PKR', 'base': 'BTC', 'quote': 'PKR', 'brokerId': 8, 'broker': 'UrduBit' },
            'BTC/CLP': { 'id': 'BTCCLP', 'symbol': 'BTC/CLP', 'base': 'BTC', 'quote': 'CLP', 'brokerId': 9, 'broker': 'ChileBit' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                _this148 = this,
                _arguments133 = arguments;

            params = _arguments133.length > 0 && _arguments133[0] !== undefined ? _arguments133[0] : {};

            return _this148.privatePostU2({
                'BalanceReqID': _this148.nonce()
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this149 = this,
                _arguments134 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments134.length > 1 && _arguments134[1] !== undefined ? _arguments134[1] : {};
                p = _this149.market(market);
                return _this149.publicGetCurrencyOrderbook(_this149.extend({
                    'currency': p['quote'],
                    'crypto_currency': p['base']
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this149.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this149.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                timestamp,
                lowercaseQuote,
                quoteVolume,
                _this150 = this;

            return Promise.resolve().then(function () {
                p = _this150.market(market);
                return _this150.publicGetCurrencyTicker({
                    'currency': p['quote'],
                    'crypto_currency': p['base']
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this150.milliseconds();
                lowercaseQuote = p['quote'].toLowerCase();
                quoteVolume = 'vol_' + lowercaseQuote;

                return {
                    'timestamp': timestamp,
                    'datetime': _this150.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['vol']),
                    'quoteVolume': parseFloat(ticker[quoteVolume]),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                p,
                _this151 = this,
                _arguments136 = arguments;

            params = _arguments136.length > 1 && _arguments136[1] !== undefined ? _arguments136[1] : {};
            p = _this151.market(market);

            return _this151.publicGetCurrencyTrades(_this151.extend({
                'currency': p['quote'],
                'crypto_currency': p['base']
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                order,
                response,
                indexed,
                execution,
                _this152 = this,
                _arguments137 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments137.length > 4 && _arguments137[4] !== undefined ? _arguments137[4] : undefined;
                params = _arguments137.length > 5 && _arguments137[5] !== undefined ? _arguments137[5] : {};

                if (type == 'market') {
                    throw new ExchangeError(_this152.id + ' allows limit orders only');
                }p = _this152.market(market);
                order = {
                    'ClOrdID': _this152.nonce(),
                    'Symbol': p['id'],
                    'Side': _this152.capitalize(side),
                    'OrdType': '2',
                    'Price': price,
                    'OrderQty': amount,
                    'BrokerID': p['brokerId']
                };
                return _this152.privatePostD(_this152.extend(order, params));
            }).then(function (_resp) {
                response = _resp;
                indexed = _this152.indexBy(response['Responses'], 'MsgType');
                execution = indexed['8'];

                return {
                    'info': response,
                    'id': execution['OrderID']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this153 = this,
                _arguments138 = arguments;

            params = _arguments138.length > 1 && _arguments138[1] !== undefined ? _arguments138[1] : {};

            return _this153.privatePostF(_this153.extend({
                'ClOrdID': id
            }, params));
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                request,
                response,
                _this154 = this,
                _arguments139 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments139.length > 1 && _arguments139[1] !== undefined ? _arguments139[1] : 'public';
                method = _arguments139.length > 2 && _arguments139[2] !== undefined ? _arguments139[2] : 'GET';
                params = _arguments139.length > 3 && _arguments139[3] !== undefined ? _arguments139[3] : {};
                headers = _arguments139.length > 4 && _arguments139[4] !== undefined ? _arguments139[4] : undefined;
                body = _arguments139.length > 5 && _arguments139[5] !== undefined ? _arguments139[5] : undefined;
                url = _this154.urls['api'][api] + '/' + _this154.version + '/' + _this154.implodeParams(path, params);
                query = _this154.omit(params, _this154.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this154.urlencode(query);
                    }
                } else {
                    nonce = _this154.nonce().toString();
                    request = _this154.extend({ 'MsgType': path }, query);

                    body = _this154.json(request);
                    headers = {
                        'APIKey': _this154.apiKey,
                        'Nonce': nonce,
                        'Signature': _this154.hmac(_this154.encode(nonce), _this154.encode(_this154.secret)),
                        'Content-Type': 'application/json'
                    };
                }
                return _this154.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('Status' in response) {
                    if (response['Status'] != 200) {
                        throw new ExchangeError(_this154.id + ' ' + _this154.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var bl3p = {

        'id': 'bl3p',
        'name': 'BL3P',
        'countries': ['NL', 'EU'], // Netherlands, EU
        'rateLimit': 1000,
        'version': '1',
        'comment': 'An exchange market by BitonicNL',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28501752-60c21b82-6feb-11e7-818b-055ee6d0e754.jpg',
            'api': 'https://api.bl3p.eu',
            'www': ['https://bl3p.eu', 'https://bitonic.nl'],
            'doc': ['https://github.com/BitonicNL/bl3p-api/tree/master/docs', 'https://bl3p.eu/api', 'https://bitonic.nl/en/api']
        },
        'api': {
            'public': {
                'get': ['{market}/ticker', '{market}/orderbook', '{market}/trades']
            },
            'private': {
                'post': ['{market}/money/depth/full', '{market}/money/order/add', '{market}/money/order/cancel', '{market}/money/order/result', '{market}/money/orders', '{market}/money/orders/history', '{market}/money/trades/fetch', 'GENMKT/money/info', 'GENMKT/money/deposit_address', 'GENMKT/money/new_deposit_address', 'GENMKT/money/wallet/history', 'GENMKT/money/withdraw']
            }
        },
        'markets': {
            'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'LTC/EUR': { 'id': 'LTCEUR', 'symbol': 'LTC/EUR', 'base': 'LTC', 'quote': 'EUR' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                response,
                data,
                balance,
                result,
                c,
                currency,
                account,
                _this155 = this,
                _arguments140 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments140.length > 0 && _arguments140[0] !== undefined ? _arguments140[0] : {};
                return _this155.privatePostGENMKTMoneyInfo();
            }).then(function (_resp) {
                response = _resp;
                data = response['data'];
                balance = data['wallets'];
                result = { 'info': data };

                for (c = 0; c < _this155.currencies.length; c++) {
                    currency = _this155.currencies[c];
                    account = _this155.account();

                    if (currency in balance) {
                        if ('available' in balance[currency]) {
                            account['free'] = parseFloat(balance[currency]['available']['value']);
                        }
                    }
                    if (currency in balance) {
                        if ('balance' in balance[currency]) {
                            account['total'] = parseFloat(balance[currency]['balance']['value']);
                        }
                    }
                    if (account['total']) {
                        if (account['free']) {
                            account['used'] = account['total'] - account['free'];
                        }
                    }
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this156 = this,
                _arguments141 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments141.length > 1 && _arguments141[1] !== undefined ? _arguments141[1] : {};
                p = _this156.market(market);
                return _this156.publicGetMarketOrderbook(_this156.extend({
                    'market': p['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['data'];
                timestamp = _this156.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this156.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order['price_int'] / 100000;
                        amount = order['amount_int'] / 100000000;

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this157 = this;

            return Promise.resolve().then(function () {
                return _this157.publicGetMarketTicker({
                    'market': _this157.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = ticker['timestamp'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this157.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']['24h']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this158 = this,
                _arguments143 = arguments;

            params = _arguments143.length > 1 && _arguments143[1] !== undefined ? _arguments143[1] : {};

            return _this158.publicGetMarketTrades(_this158.extend({
                'market': _this158.marketId(market)
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                order,
                response,
                _this159 = this,
                _arguments144 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments144.length > 4 && _arguments144[4] !== undefined ? _arguments144[4] : undefined;
                params = _arguments144.length > 5 && _arguments144[5] !== undefined ? _arguments144[5] : {};
                p = _this159.market(market);
                order = {
                    'market': p['id'],
                    'amount_int': amount,
                    'fee_currency': p['quote'],
                    'type': side == 'buy' ? 'bid' : 'ask'
                };

                if (type == 'limit') {
                    order['price_int'] = price;
                }return _this159.privatePostMarketMoneyOrderAdd(_this159.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this160 = this;

            return _this160.privatePostMarketMoneyOrderCancel({ 'order_id': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                request,
                url,
                query,
                nonce,
                secret,
                auth,
                signature,
                _this161 = this,
                _arguments146 = arguments;

            api = _arguments146.length > 1 && _arguments146[1] !== undefined ? _arguments146[1] : 'public';
            method = _arguments146.length > 2 && _arguments146[2] !== undefined ? _arguments146[2] : 'GET';
            params = _arguments146.length > 3 && _arguments146[3] !== undefined ? _arguments146[3] : {};
            headers = _arguments146.length > 4 && _arguments146[4] !== undefined ? _arguments146[4] : undefined;
            body = _arguments146.length > 5 && _arguments146[5] !== undefined ? _arguments146[5] : undefined;
            request = _this161.implodeParams(path, params);
            url = _this161.urls['api'] + '/' + _this161.version + '/' + request;
            query = _this161.omit(params, _this161.extractParams(path));

            if (api == 'public') {
                if (Object.keys(query).length) {
                    url += '?' + _this161.urlencode(query);
                }
            } else {
                nonce = _this161.nonce();

                body = _this161.urlencode(_this161.extend({ 'nonce': nonce }, query));
                secret = _this161.base64ToBinary(_this161.secret);
                auth = request + "\0" + body;
                signature = _this161.hmac(_this161.encode(auth), secret, 'sha512', 'base64');

                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length,
                    'Rest-Key': _this161.apiKey,
                    'Rest-Sign': signature
                };
            }
            return _this161.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var btcchina = {

        'id': 'btcchina',
        'name': 'BTCChina',
        'countries': 'CN',
        'rateLimit': 1500,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766368-465b3286-5ed6-11e7-9a11-0f6467e1d82b.jpg',
            'api': {
                'public': 'https://data.btcchina.com/data',
                'private': 'https://api.btcchina.com/api_trade_v1.php'
            },
            'www': 'https://www.btcchina.com',
            'doc': 'https://www.btcchina.com/apidocs'
        },
        'api': {
            'public': {
                'get': ['historydata', 'orderbook', 'ticker', 'trades']
            },
            'private': {
                'post': ['BuyIcebergOrder', 'BuyOrder', 'BuyOrder2', 'BuyStopOrder', 'CancelIcebergOrder', 'CancelOrder', 'CancelStopOrder', 'GetAccountInfo', 'getArchivedOrder', 'getArchivedOrders', 'GetDeposits', 'GetIcebergOrder', 'GetIcebergOrders', 'GetMarketDepth', 'GetMarketDepth2', 'GetOrder', 'GetOrders', 'GetStopOrder', 'GetStopOrders', 'GetTransactions', 'GetWithdrawal', 'GetWithdrawals', 'RequestWithdrawal', 'SellIcebergOrder', 'SellOrder', 'SellOrder2', 'SellStopOrder']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                keys,
                p,
                key,
                market,
                parts,
                id,
                base,
                quote,
                symbol,
                _this162 = this;

            return Promise.resolve().then(function () {
                return _this162.publicGetTicker({
                    'market': 'all'
                });
            }).then(function (_resp) {
                markets = _resp;
                result = [];
                keys = Object.keys(markets);

                for (p = 0; p < keys.length; p++) {
                    key = keys[p];
                    market = markets[key];
                    parts = key.split('_');
                    id = parts[1];
                    base = id.slice(0, 3);
                    quote = id.slice(3, 6);

                    base = base.toUpperCase();
                    quote = quote.toUpperCase();
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                c,
                currency,
                lowercase,
                account,
                _this163 = this,
                _arguments148 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments148.length > 0 && _arguments148[0] !== undefined ? _arguments148[0] : {};
                return _this163.loadMarkets();
            }).then(function () {
                return _this163.privatePostGetAccountInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['result'];
                result = { 'info': balances };


                for (c = 0; c < _this163.currencies.length; c++) {
                    currency = _this163.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = _this163.account();

                    if (lowercase in balances['balance']) {
                        account['total'] = parseFloat(balances['balance'][lowercase]['amount']);
                    }if (lowercase in balances['frozen']) {
                        account['used'] = parseFloat(balances['frozen'][lowercase]['amount']);
                    }account['free'] = account['total'] - account['used'];
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                _this164 = this,
                _arguments149 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments149.length > 1 && _arguments149[1] !== undefined ? _arguments149[1] : {};
                return _this164.loadMarkets();
            }).then(function () {
                return _this164.publicGetOrderbook(_this164.extend({
                    'market': _this164.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = orderbook['date'] * 1000;
                ;
                result = {
                    'bids': orderbook['bids'],
                    'asks': orderbook['asks'],
                    'timestamp': timestamp,
                    'datetime': _this164.iso8601(timestamp)
                };

                result['asks'] = _this164.sortBy(result['asks'], 0);
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                tickers,
                ticker,
                timestamp,
                _this165 = this;

            return Promise.resolve().then(function () {
                return _this165.loadMarkets();
            }).then(function () {
                p = _this165.market(market);
                return _this165.publicGetTicker({
                    'market': p['id']
                });
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers['ticker'];
                timestamp = ticker['date'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this165.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': parseFloat(ticker['open']),
                    'close': parseFloat(ticker['prev_close']),
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this166 = this,
                _arguments151 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments151.length > 1 && _arguments151[1] !== undefined ? _arguments151[1] : {};
                return _this166.loadMarkets();
            }).then(function () {
                return _this166.publicGetTrades(_this166.extend({
                    'market': _this166.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                method,
                order,
                id,
                response,
                _this167 = this,
                _arguments152 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments152.length > 4 && _arguments152[4] !== undefined ? _arguments152[4] : undefined;
                params = _arguments152.length > 5 && _arguments152[5] !== undefined ? _arguments152[5] : {};
                return _this167.loadMarkets();
            }).then(function () {
                p = _this167.market(market);
                method = 'privatePost' + _this167.capitalize(side) + 'Order2';
                order = {};
                id = p['id'].toUpperCase();

                if (type == 'market') {
                    order['params'] = [undefined, amount, id];
                } else {
                    order['params'] = [price, amount, id];
                }
                return _this167[method](_this167.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                market,
                _this168 = this,
                _arguments153 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments153.length > 1 && _arguments153[1] !== undefined ? _arguments153[1] : {};
                return _this168.loadMarkets();
            }).then(function () {
                market = params['market']; // TODO fixme

                return _this168.privatePostCancelOrder(_this168.extend({
                    'params': [id, market]
                }, params));
            });
        },
        nonce: function nonce() {
            return this.microseconds();
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][api] + '/' + path;
            if (api == 'public') {
                if (Object.keys(params).length) url += '?' + this.urlencode(params);
            } else {
                if (!this.apiKey) throw new AuthenticationError(this.id + ' requires `' + this.id + '.apiKey` property for authentication');
                if (!this.secret) throw new AuthenticationError(this.id + ' requires `' + this.id + '.secret` property for authentication');
                var p = [];
                if ('params' in params) p = params['params'];
                var nonce = this.nonce();
                var request = {
                    'method': path,
                    'id': nonce,
                    'params': p
                };
                p = p.join(',');
                body = this.json(request);
                var query = 'tonce=' + nonce + '&accesskey=' + this.apiKey + '&requestmethod=' + method.toLowerCase() + '&id=' + nonce + '&method=' + path + '&params=' + p;
                var signature = this.hmac(this.encode(query), this.encode(this.secret), 'sha1');
                var auth = this.apiKey + ':' + signature;
                headers = {
                    'Content-Length': body.length,
                    'Authorization': 'Basic ' + this.stringToBase64(auth),
                    'Json-Rpc-Tonce': nonce
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------

    var btce = {

        'id': 'btce',
        'name': 'BTC-e',
        'countries': ['BG', 'RU'], // Bulgaria, Russia
        'version': '3',
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27843225-1b571514-611a-11e7-9208-2641a560b561.jpg',
            'api': {
                'public': 'https://btc-e.com/api',
                'private': 'https://btc-e.com/tapi'
            },
            'www': 'https://btc-e.com',
            'doc': ['https://btc-e.com/api/3/docs', 'https://btc-e.com/tapi/docs']
        },
        'api': {
            'public': {
                'get': ['info', 'ticker/{pair}', 'depth/{pair}', 'trades/{pair}']
            },
            'private': {
                'post': ['getInfo', 'Trade', 'ActiveOrders', 'OrderInfo', 'CancelOrder', 'TradeHistory', 'TransHistory', 'CoinDepositAddress', 'WithdrawCoin', 'CreateCoupon', 'RedeemCoupon']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var response,
                markets,
                keys,
                result,
                p,
                id,
                market,
                _id$split3,
                _id$split4,
                base,
                quote,
                symbol,
                _this169 = this;

            return Promise.resolve().then(function () {
                return _this169.publicGetInfo();
            }).then(function (_resp) {
                response = _resp;
                markets = response['pairs'];
                keys = Object.keys(markets);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    market = markets[id];
                    _id$split3 = id.split('_');
                    _id$split4 = _slicedToArray(_id$split3, 2);
                    base = _id$split4[0];
                    quote = _id$split4[1];

                    base = base.toUpperCase();
                    quote = quote.toUpperCase();
                    if (base == 'DSH') {
                        base = 'DASH';
                    }base = _this169.commonCurrencyCode(base);
                    quote = _this169.commonCurrencyCode(quote);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                funds,
                currencies,
                c,
                currency,
                uppercase,
                account,
                _this170 = this,
                _arguments155 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments155.length > 0 && _arguments155[0] !== undefined ? _arguments155[0] : {};
                return _this170.loadMarkets();
            }).then(function () {
                return _this170.privatePostGetInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['return'];
                result = { 'info': balances };
                funds = balances['funds'];
                currencies = Object.keys(funds);

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    uppercase = currency.toUpperCase();
                    // they misspell DASH as dsh :/

                    if (uppercase == 'DSH') {
                        uppercase = 'DASH';
                    }account = {
                        'free': funds[currency],
                        'used': 0.0,
                        'total': funds[currency]
                    };

                    result[uppercase] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                response,
                orderbook,
                timestamp,
                result,
                _this171 = this,
                _arguments156 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments156.length > 1 && _arguments156[1] !== undefined ? _arguments156[1] : {};
                return _this171.loadMarkets();
            }).then(function () {
                p = _this171.market(market);
                return _this171.publicGetDepthPair(_this171.extend({
                    'pair': p['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;

                if (p['id'] in response) {
                    orderbook = response[p['id']];
                    timestamp = _this171.milliseconds();
                    result = {
                        'bids': orderbook['bids'],
                        'asks': orderbook['asks'],
                        'timestamp': timestamp,
                        'datetime': _this171.iso8601(timestamp)
                    };

                    result['bids'] = _this171.sortBy(result['bids'], 0, true);
                    result['asks'] = _this171.sortBy(result['asks'], 0);
                    return result;
                } else {
                    throw new ExchangeError(_this171.id + ' ' + p['symbol'] + ' order book is empty or not available');
                }
            });
        },
        parseTicker: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = ticker['updated'] * 1000;
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': ticker['high'] ? ticker['high'] : undefined,
                'low': ticker['low'] ? ticker['low'] : undefined,
                'bid': ticker['sell'] ? ticker['buy'] : undefined,
                'ask': ticker['buy'] ? ticker['sell'] : undefined,
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': ticker['last'] ? ticker['last'] : undefined,
                'change': undefined,
                'percentage': undefined,
                'average': ticker['avg'] ? ticker['avg'] : undefined,
                'baseVolume': ticker['vol_cur'] ? ticker['vol_cur'] : undefined,
                'quoteVolume': ticker['vol'] ? ticker['vol'] : undefined,
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var symbols,
                ids,
                tickers,
                result,
                keys,
                k,
                id,
                ticker,
                market,
                symbol,
                _this172 = this,
                _arguments157 = arguments;

            return Promise.resolve().then(function () {
                symbols = _arguments157.length > 0 && _arguments157[0] !== undefined ? _arguments157[0] : undefined;
                return _this172.loadMarkets();
            }).then(function () {
                ids = symbols ? _this172.marketIds(symbols) : _this172.ids;
                return _this172.publicGetTickerPair({
                    'pair': ids.join('-')
                });
            }).then(function (_resp) {
                tickers = _resp;
                result = {};
                keys = Object.keys(tickers);

                for (k = 0; k < keys.length; k++) {
                    id = keys[k];
                    ticker = tickers[id];
                    market = _this172.markets_by_id[id];
                    symbol = market['symbol'];

                    result[symbol] = _this172.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(symbol) {
            var market,
                id,
                tickers,
                _this173 = this;

            return Promise.resolve().then(function () {
                return _this173.loadMarkets();
            }).then(function () {
                market = _this173.market(symbol);
                id = market['id'];
                return _this173.fetchTickers([id]);
            }).then(function (_resp) {
                tickers = _resp;

                return tickers[symbol];
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this174 = this,
                _arguments159 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments159.length > 1 && _arguments159[1] !== undefined ? _arguments159[1] : {};
                return _this174.loadMarkets();
            }).then(function () {
                return _this174.publicGetTradesPair(_this174.extend({
                    'pair': _this174.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this175 = this,
                _arguments160 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments160.length > 4 && _arguments160[4] !== undefined ? _arguments160[4] : undefined;
                params = _arguments160.length > 5 && _arguments160[5] !== undefined ? _arguments160[5] : {};
                return _this175.loadMarkets();
            }).then(function () {
                order = {
                    'pair': _this175.marketId(market),
                    'type': side,
                    'amount': amount,
                    'rate': price
                };
                return _this175.privatePostTrade(_this175.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['return']['order_id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this176 = this;

            return Promise.resolve().then(function () {
                return _this176.loadMarkets();
            }).then(function () {
                return _this176.privatePostCancelOrder({ 'order_id': id });
            });
        },
        parseOrder: function parseOrder(order) {
            var statusCode = order['status'];
            var status = undefined;
            if (statusCode == 0) {
                status = 'open';
            } else if (statusCode == 2 || statusCode == 3) {
                status = 'canceled';
            } else {
                status = 'closed';
            }
            var timestamp = order['timestamp_created'] * 1000;
            var market = this.markets_by_id[order['pair']];
            var result = {
                'info': order,
                'id': order['id'],
                'symbol': market['symbol'],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'type': 'limit',
                'side': order['type'],
                'price': order['rate'],
                'amount': order['start_amount'],
                'remaining': order['amount'],
                'status': status
            };
            return result;
        },
        fetchOrder: function fetchOrder(id) {
            var response,
                order,
                _this177 = this;

            return Promise.resolve().then(function () {
                return _this177.loadMarkets();
            }).then(function () {
                return _this177.privatePostOrderInfo({ 'order_id': id });
            }).then(function (_resp) {
                response = _resp;
                order = response['return'][id];

                return _this177.parseOrder(_this177.extend({ 'id': id }, order));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                response,
                _this178 = this,
                _arguments163 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments163.length > 1 && _arguments163[1] !== undefined ? _arguments163[1] : 'public';
                method = _arguments163.length > 2 && _arguments163[2] !== undefined ? _arguments163[2] : 'GET';
                params = _arguments163.length > 3 && _arguments163[3] !== undefined ? _arguments163[3] : {};
                headers = _arguments163.length > 4 && _arguments163[4] !== undefined ? _arguments163[4] : undefined;
                body = _arguments163.length > 5 && _arguments163[5] !== undefined ? _arguments163[5] : undefined;

                throw new ExchangeNotAvailable(_this178.id + ' operation was shut down in July 2017');
                url = _this178.urls['api'][api] + '/' + _this178.version + '/' + _this178.implodeParams(path, params);
                query = _this178.omit(params, _this178.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this178.urlencode(query);
                    }
                } else {
                    nonce = _this178.nonce();

                    body = _this178.urlencode(_this178.extend({
                        'nonce': nonce,
                        'method': path
                    }, query));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length,
                        'Key': _this178.apiKey,
                        'Sign': _this178.hmac(_this178.encode(body), _this178.encode(_this178.secret), 'sha512')
                    };
                }
                return _this178.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('success' in response) {
                    if (!response['success']) {
                        throw new ExchangeError(_this178.id + ' ' + _this178.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var btcmarkets = {

        'id': 'btcmarkets',
        'name': 'BTC Markets',
        'countries': 'AU', // Australia
        'rateLimit': 1000, // market data cached for 1 second (trades cached for 2 seconds)
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/29142911-0e1acfc2-7d5c-11e7-98c4-07d9532b29d7.jpg',
            'api': 'https://api.btcmarkets.net',
            'www': 'https://btcmarkets.net/',
            'doc': 'https://github.com/BTCMarkets/API'
        },
        'api': {
            'public': {
                'get': ['market/{id}/tick', 'market/{id}/orderbook', 'market/{id}/trades']
            },
            'private': {
                'get': ['account/balance', 'account/{id}/tradingfee'],
                'post': ['fundtransfer/withdrawCrypto', 'fundtransfer/withdrawEFT', 'order/create', 'order/cancel', 'order/history', 'order/open', 'order/trade/history', 'order/createBatch', // they promise it's coming soon...
                'order/detail']
            }
        },
        'markets': {
            'BTC/AUD': { 'id': 'BTC/AUD', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD' },
            'LTC/AUD': { 'id': 'LTC/AUD', 'symbol': 'LTC/AUD', 'base': 'LTC', 'quote': 'AUD' },
            'ETH/AUD': { 'id': 'ETH/AUD', 'symbol': 'ETH/AUD', 'base': 'ETH', 'quote': 'AUD' },
            'ETC/AUD': { 'id': 'ETC/AUD', 'symbol': 'ETC/AUD', 'base': 'ETC', 'quote': 'AUD' },
            'XRP/AUD': { 'id': 'XRP/AUD', 'symbol': 'XRP/AUD', 'base': 'XRP', 'quote': 'AUD' },
            'BCH/AUD': { 'id': 'BCH/AUD', 'symbol': 'BCH/AUD', 'base': 'BCH', 'quote': 'AUD' },
            'LTC/BTC': { 'id': 'LTC/BTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'ETH/BTC': { 'id': 'ETH/BTC', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' },
            'ETC/BTC': { 'id': 'ETC/BTC', 'symbol': 'ETC/BTC', 'base': 'ETC', 'quote': 'BTC' },
            'XRP/BTC': { 'id': 'XRP/BTC', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC' },
            'BCH/BTC': { 'id': 'BCH/BTC', 'symbol': 'BCH/BTC', 'base': 'BCH', 'quote': 'BTC' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                balances,
                result,
                b,
                balance,
                currency,
                multiplier,
                free,
                used,
                account,
                _this179 = this,
                _arguments164 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments164.length > 0 && _arguments164[0] !== undefined ? _arguments164[0] : {};
                return _this179.loadMarkets();
            }).then(function () {
                return _this179.privateGetAccountBalance();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    multiplier = 100000000;
                    free = parseFloat(balance['balance'] / multiplier);
                    used = parseFloat(balance['pendingFunds'] / multiplier);
                    account = {
                        'free': free,
                        'used': used,
                        'total': _this179.sum(free, used)
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        parseBidAsk: function parseBidAsk(bidask) {
            var price = bidask[0];
            var amount = bidask[1];
            return [price, amount];
        },
        parseBidAsks: function parseBidAsks(bidasks) {
            var result = [];
            for (var i = 0; i < bidasks.length; i++) {
                result.push(this.parseBidAsk(bidasks[i]));
            }
            return result;
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                m,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                _this180 = this,
                _arguments165 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments165.length > 1 && _arguments165[1] !== undefined ? _arguments165[1] : {};
                return _this180.loadMarkets();
            }).then(function () {
                m = _this180.market(market);
                return _this180.publicGetMarketIdOrderbook(_this180.extend({
                    'id': m['id']
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = orderbook['timestamp'] * 1000;
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this180.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];

                    result[side] = _this180.parseBidAsks(orderbook[side]);
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = ticker['timestamp'] * 1000;
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': parseFloat(ticker['bestBid']),
                'ask': parseFloat(ticker['bestAsk']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['lastPrice']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['volume24h']),
                'info': ticker
            };
        },
        fetchTicker: function fetchTicker(market) {
            var m,
                ticker,
                _this181 = this;

            return Promise.resolve().then(function () {
                return _this181.loadMarkets();
            }).then(function () {
                m = _this181.market(market);
                return _this181.publicGetMarketIdTick({
                    'id': m['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this181.parseTicker(ticker, m);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this182 = this,
                _arguments167 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments167.length > 1 && _arguments167[1] !== undefined ? _arguments167[1] : {};
                return _this182.loadMarkets();
            }).then(function () {
                return _this182.publicGetMarketIdTrades(_this182.extend({
                    // 'since': 59868345231,
                    'id': _this182.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                m,
                multiplier,
                orderSide,
                order,
                response,
                _this183 = this,
                _arguments168 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments168.length > 4 && _arguments168[4] !== undefined ? _arguments168[4] : undefined;
                params = _arguments168.length > 5 && _arguments168[5] !== undefined ? _arguments168[5] : {};
                return _this183.loadMarkets();
            }).then(function () {
                m = _this183.market(market);
                multiplier = 100000000; // for price and volume
                // does BTC Markets support market orders at all?

                orderSide = side == 'buy' ? 'Bid' : 'Ask';
                order = _this183.ordered({
                    'currency': m['quote'],
                    'instrument': m['base'],
                    'price': price * multiplier,
                    'volume': amount * multiplier,
                    'orderSide': orderSide,
                    'ordertype': _this183.capitalize(type),
                    'clientRequestId': _this183.nonce().toString()
                });
                return _this183.privatePostOrderCreate(_this183.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id'].toString()
                };
            });
        },
        cancelOrders: function cancelOrders(ids) {
            var _this184 = this;

            return Promise.resolve().then(function () {
                return _this184.loadMarkets();
            }).then(function () {
                return _this184.privatePostOrderCancel({ 'order_ids': ids });
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this185 = this;

            return Promise.resolve().then(function () {
                return _this185.loadMarkets();
            }).then(function () {
                return _this185.cancelOrders([id]);
            });
        },
        nonce: function nonce() {
            return this.milliseconds();
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                uri,
                url,
                query,
                nonce,
                auth,
                secret,
                signature,
                response,
                _test5,
                _this186 = this,
                _arguments171 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments171.length > 1 && _arguments171[1] !== undefined ? _arguments171[1] : 'public';
                method = _arguments171.length > 2 && _arguments171[2] !== undefined ? _arguments171[2] : 'GET';
                params = _arguments171.length > 3 && _arguments171[3] !== undefined ? _arguments171[3] : {};
                headers = _arguments171.length > 4 && _arguments171[4] !== undefined ? _arguments171[4] : undefined;
                body = _arguments171.length > 5 && _arguments171[5] !== undefined ? _arguments171[5] : undefined;
                uri = '/' + _this186.implodeParams(path, params);
                url = _this186.urls['api'] + uri;
                query = _this186.omit(params, _this186.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this186.urlencode(params);
                    }
                } else {
                    nonce = _this186.nonce().toString();
                    auth = uri + "\n" + nonce + "\n";

                    headers = {
                        'Content-Type': 'application/json',
                        'apikey': _this186.apiKey,
                        'timestamp': nonce
                    };
                    if (method == 'POST') {
                        body = _this186.urlencode(query);
                        headers['Content-Length'] = body.length;
                        auth += body;
                    }
                    secret = _this186.base64ToBinary(_this186.secret);
                    signature = _this186.hmac(_this186.encode(auth), secret, 'sha512', 'base64');

                    headers['signature'] = signature;
                }
                return _this186.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test5 = api == 'private';

                if (_test5 && 'success' in response) {
                    if (!response['success']) {
                        throw new ExchangeError(_this186.id + ' ' + _this186.json(response));
                    }
                }
                if (_test5) {
                    return response;
                } else {
                    return response;
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var btctrader = {

        'id': 'btctrader',
        'name': 'BTCTrader',
        'countries': ['TR', 'GR', 'PH'], // Turkey, Greece, Philippines
        'rateLimit': 1000,
        'comment': 'base API for BTCExchange, BTCTurk',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27992404-cda1e386-649c-11e7-8dc1-40bbd2897768.jpg',
            'api': 'https://www.btctrader.com/api',
            'www': 'https://www.btctrader.com',
            'doc': 'https://github.com/BTCTrader/broker-api-docs'
        },
        'api': {
            'public': {
                'get': ['ohlcdata', // ?last=COUNT
                'orderbook', 'ticker', 'trades']
            },
            'private': {
                'get': ['balance', 'openOrders', 'userTransactions'],
                'post': ['buy', 'cancelOrder', 'sell']
            }
        },

        fetchBalance: function fetchBalance() {
            var params,
                response,
                result,
                base,
                quote,
                symbol,
                market,
                _this187 = this,
                _arguments172 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments172.length > 0 && _arguments172[0] !== undefined ? _arguments172[0] : {};
                return _this187.privateGetBalance();
            }).then(function (_resp) {
                response = _resp;
                result = { 'info': response };
                base = {
                    'free': response['bitcoin_available'],
                    'used': response['bitcoin_reserved'],
                    'total': response['bitcoin_balance']
                };
                quote = {
                    'free': response['money_available'],
                    'used': response['money_reserved'],
                    'total': response['money_balance']
                };
                symbol = _this187.symbols[0];
                market = _this187.markets[symbol];

                result[market['base']] = base;
                result[market['quote']] = quote;
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this188 = this,
                _arguments173 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments173.length > 1 && _arguments173[1] !== undefined ? _arguments173[1] : {};
                return _this188.publicGetOrderbook(params);
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = parseInt(orderbook['timestamp'] * 1000);
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this188.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this189 = this;

            return Promise.resolve().then(function () {
                return _this189.publicGetTicker();
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = parseInt(ticker['timestamp'] * 1000);

                return {
                    'timestamp': timestamp,
                    'datetime': _this189.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['average']),
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                maxCount,
                _this190 = this,
                _arguments175 = arguments;

            params = _arguments175.length > 1 && _arguments175[1] !== undefined ? _arguments175[1] : {};
            maxCount = 50;

            return _this190.publicGetTrades(params);
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                _this191 = this,
                _arguments176 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments176.length > 4 && _arguments176[4] !== undefined ? _arguments176[4] : undefined;
                params = _arguments176.length > 5 && _arguments176[5] !== undefined ? _arguments176[5] : {};
                method = 'privatePost' + _this191.capitalize(side);
                order = {
                    'Type': side == 'buy' ? 'BuyBtc' : 'SelBtc',
                    'IsMarketOrder': type == 'market' ? 1 : 0
                };

                if (type == 'market') {
                    if (side == 'buy') {
                        order['Total'] = amount;
                    } else {
                        order['Amount'] = amount;
                    }
                } else {
                    order['Price'] = price;
                    order['Amount'] = amount;
                }
                return _this191[method](_this191.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this192 = this;

            return _this192.privatePostCancelOrder({ 'id': id });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            if (this.id == 'btctrader') throw new ExchangeError(this.id + ' is an abstract base API for BTCExchange, BTCTurk');
            var url = this.urls['api'] + '/' + path;
            if (api == 'public') {
                if (Object.keys(params).length) url += '?' + this.urlencode(params);
            } else {
                var nonce = this.nonce().toString;
                body = this.urlencode(params);
                var secret = this.base64ToString(this.secret);
                var auth = this.apiKey + nonce;
                headers = {
                    'X-PCK': this.apiKey,
                    'X-Stamp': nonce.toString(),
                    'X-Signature': this.hmac(this.encode(auth), secret, 'sha256', 'base64'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var btcexchange = extend(btctrader, {

        'id': 'btcexchange',
        'name': 'BTCExchange',
        'countries': 'PH', // Philippines
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27993052-4c92911a-64aa-11e7-96d8-ec6ac3435757.jpg',
            'api': 'https://www.btcexchange.ph/api',
            'www': 'https://www.btcexchange.ph',
            'doc': 'https://github.com/BTCTrader/broker-api-docs'
        },
        'markets': {
            'BTC/PHP': { 'id': 'BTC/PHP', 'symbol': 'BTC/PHP', 'base': 'BTC', 'quote': 'PHP' }
        }
    });

    //-----------------------------------------------------------------------------

    var btctradeua = {

        'id': 'btctradeua',
        'name': 'BTC Trade UA',
        'countries': 'UA', // Ukraine,
        'rateLimit': 3000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27941483-79fc7350-62d9-11e7-9f61-ac47f28fcd96.jpg',
            'api': 'https://btc-trade.com.ua/api',
            'www': 'https://btc-trade.com.ua',
            'doc': 'https://docs.google.com/document/d/1ocYA0yMy_RXd561sfG3qEPZ80kyll36HUxvCRe5GbhE/edit'
        },
        'api': {
            'public': {
                'get': ['deals/{symbol}', 'trades/sell/{symbol}', 'trades/buy/{symbol}', 'japan_stat/high/{symbol}']
            },
            'private': {
                'post': ['auth', 'ask/{symbol}', 'balance', 'bid/{symbol}', 'buy/{symbol}', 'my_orders/{symbol}', 'order/status/{id}', 'remove/order/{id}', 'sell/{symbol}']
            }
        },
        'markets': {
            'BTC/UAH': { 'id': 'btc_uah', 'symbol': 'BTC/UAH', 'base': 'BTC', 'quote': 'UAH' },
            'ETH/UAH': { 'id': 'eth_uah', 'symbol': 'ETH/UAH', 'base': 'ETH', 'quote': 'UAH' },
            'LTC/UAH': { 'id': 'ltc_uah', 'symbol': 'LTC/UAH', 'base': 'LTC', 'quote': 'UAH' },
            'DOGE/UAH': { 'id': 'doge_uah', 'symbol': 'DOGE/UAH', 'base': 'DOGE', 'quote': 'UAH' },
            'DASH/UAH': { 'id': 'dash_uah', 'symbol': 'DASH/UAH', 'base': 'DASH', 'quote': 'UAH' },
            'SIB/UAH': { 'id': 'sib_uah', 'symbol': 'SIB/UAH', 'base': 'SIB', 'quote': 'UAH' },
            'KRB/UAH': { 'id': 'krb_uah', 'symbol': 'KRB/UAH', 'base': 'KRB', 'quote': 'UAH' },
            'NVC/UAH': { 'id': 'nvc_uah', 'symbol': 'NVC/UAH', 'base': 'NVC', 'quote': 'UAH' },
            'LTC/BTC': { 'id': 'ltc_btc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'NVC/BTC': { 'id': 'nvc_btc', 'symbol': 'NVC/BTC', 'base': 'NVC', 'quote': 'BTC' },
            'ITI/UAH': { 'id': 'iti_uah', 'symbol': 'ITI/UAH', 'base': 'ITI', 'quote': 'UAH' },
            'DOGE/BTC': { 'id': 'doge_btc', 'symbol': 'DOGE/BTC', 'base': 'DOGE', 'quote': 'BTC' },
            'DASH/BTC': { 'id': 'dash_btc', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC' }
        },

        signIn: function signIn() {
            return this.privatePostAuth();
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                result,
                accounts,
                b,
                account,
                currency,
                balance,
                _this193 = this,
                _arguments178 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments178.length > 0 && _arguments178[0] !== undefined ? _arguments178[0] : {};
                return _this193.privatePostBalance();
            }).then(function (_resp) {
                response = _resp;
                result = { 'info': response };

                if ('accounts' in result) {
                    accounts = response['accounts'];

                    for (b = 0; b < accounts.length; b++) {
                        account = accounts[b];
                        currency = account['currency'];
                        balance = parseFloat(account['balance']);

                        result[currency] = {
                            'free': balance,
                            'used': 0.0,
                            'total': balance
                        };
                    }
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                bids,
                asks,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this194 = this,
                _arguments179 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments179.length > 1 && _arguments179[1] !== undefined ? _arguments179[1] : {};
                p = _this194.market(market);
                return _this194.publicGetTradesBuySymbol(_this194.extend({
                    'symbol': p['id']
                }, params));
            }).then(function (_resp) {
                bids = _resp;
                return _this194.publicGetTradesSellSymbol(_this194.extend({
                    'symbol': p['id']
                }, params));
            }).then(function (_resp) {
                asks = _resp;
                orderbook = {
                    'bids': [],
                    'asks': []
                };

                if (bids) {
                    if ('list' in bids) {
                        orderbook['bids'] = bids['list'];
                    }
                }
                if (asks) {
                    if ('list' in asks) {
                        orderbook['asks'] = asks['list'];
                    }
                }
                timestamp = _this194.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this194.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['currency_trade']);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                timestamp,
                result,
                tickerLength,
                start,
                t,
                candle,
                last,
                _this195 = this;

            return Promise.resolve().then(function () {
                return _this195.publicGetJapanStatHighSymbol({
                    'symbol': _this195.marketId(market)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['trades'];
                timestamp = _this195.milliseconds();
                result = {
                    'timestamp': timestamp,
                    'datetime': _this195.iso8601(timestamp),
                    'high': undefined,
                    'low': undefined,
                    'bid': undefined,
                    'ask': undefined,
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': undefined,
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': undefined,
                    'info': ticker
                };
                tickerLength = ticker.length;

                if (tickerLength > 0) {
                    start = Math.max(tickerLength - 48, 0);

                    for (t = start; t < ticker.length; t++) {
                        candle = ticker[t];

                        if (typeof result['open'] == 'undefined') {
                            result['open'] = candle[1];
                        }if (typeof result['high'] == 'undefined' || result['high'] < candle[2]) {
                            result['high'] = candle[2];
                        }if (typeof result['low'] == 'undefined' || result['low'] > candle[3]) {
                            result['low'] = candle[3];
                        }if (typeof result['quoteVolume'] == 'undefined') {
                            result['quoteVolume'] = -candle[5];
                        } else {
                            result['quoteVolume'] -= candle[5];
                        }
                    }
                    last = tickerLength - 1;

                    result['close'] = ticker[last][4];
                    result['quoteVolume'] = -1 * result['quoteVolume'];
                }
                return result;
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this196 = this,
                _arguments181 = arguments;

            params = _arguments181.length > 1 && _arguments181[1] !== undefined ? _arguments181[1] : {};

            return _this196.publicGetDealsSymbol(_this196.extend({
                'symbol': _this196.marketId(market)
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                method,
                order,
                _this197 = this,
                _arguments182 = arguments;

            price = _arguments182.length > 4 && _arguments182[4] !== undefined ? _arguments182[4] : undefined;
            params = _arguments182.length > 5 && _arguments182[5] !== undefined ? _arguments182[5] : {};

            if (type == 'market') {
                throw new ExchangeError(_this197.id + ' allows limit orders only');
            }p = _this197.market(market);
            method = 'privatePost' + _this197.capitalize(side) + 'Id';
            order = {
                'count': amount,
                'currency1': p['quote'],
                'currency': p['base'],
                'price': price
            };

            return _this197[method](_this197.extend(order, params));
        },
        cancelOrder: function cancelOrder(id) {
            var _this198 = this;

            return _this198.privatePostRemoveOrderId({ 'id': id });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if (Object.keys(query).length) url += this.implodeParams(path, query);
            } else {
                var nonce = this.nonce();
                body = this.urlencode(this.extend({
                    'out_order_id': nonce,
                    'nonce': nonce
                }, query));
                var auth = body + this.secret;
                headers = {
                    'public-key': this.apiKey,
                    'api-sign': this.hash(this.encode(auth), 'sha256'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var btcturk = extend(btctrader, {

        'id': 'btcturk',
        'name': 'BTCTurk',
        'countries': 'TR', // Turkey
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27992709-18e15646-64a3-11e7-9fa2-b0950ec7712f.jpg',
            'api': 'https://www.btcturk.com/api',
            'www': 'https://www.btcturk.com',
            'doc': 'https://github.com/BTCTrader/broker-api-docs'
        },
        'markets': {
            'BTC/TRY': { 'id': 'BTC/TRY', 'symbol': 'BTC/TRY', 'base': 'BTC', 'quote': 'TRY' }
        }
    });

    //-----------------------------------------------------------------------------

    var btcx = {

        'id': 'btcx',
        'name': 'BTCX',
        'countries': ['IS', 'US', 'EU'],
        'rateLimit': 1500, // support in english is very poor, unable to tell rate limits
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766385-9fdcc98c-5ed6-11e7-8f14-66d5e5cd47e6.jpg',
            'api': 'https://btc-x.is/api',
            'www': 'https://btc-x.is',
            'doc': 'https://btc-x.is/custom/api-document.html'
        },
        'api': {
            'public': {
                'get': ['depth/{id}/{limit}', 'ticker/{id}', 'trade/{id}/{limit}']
            },
            'private': {
                'post': ['balance', 'cancel', 'history', 'order', 'redeem', 'trade', 'withdraw']
            }
        },
        'markets': {
            'BTC/USD': { 'id': 'btc/usd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/EUR': { 'id': 'btc/eur', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                balances,
                result,
                currencies,
                c,
                currency,
                uppercase,
                account,
                _this199 = this,
                _arguments184 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments184.length > 0 && _arguments184[0] !== undefined ? _arguments184[0] : {};
                return _this199.privatePostBalance();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };
                currencies = Object.keys(balances);

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    uppercase = currency.toUpperCase();
                    account = {
                        'free': balances[currency],
                        'used': 0.0,
                        'total': balances[currency]
                    };

                    result[uppercase] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this200 = this,
                _arguments185 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments185.length > 1 && _arguments185[1] !== undefined ? _arguments185[1] : {};
                return _this200.publicGetDepthIdLimit(_this200.extend({
                    'id': _this200.marketId(market),
                    'limit': 1000
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this200.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this200.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order['price'];
                        amount = order['amount'];

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this201 = this;

            return Promise.resolve().then(function () {
                return _this201.publicGetTickerId({
                    'id': _this201.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = ticker['time'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this201.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['sell']),
                    'ask': parseFloat(ticker['buy']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this202 = this,
                _arguments187 = arguments;

            params = _arguments187.length > 1 && _arguments187[1] !== undefined ? _arguments187[1] : {};

            return _this202.publicGetTradeIdLimit(_this202.extend({
                'id': _this202.marketId(market),
                'limit': 1000
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                response,
                _this203 = this,
                _arguments188 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments188.length > 4 && _arguments188[4] !== undefined ? _arguments188[4] : undefined;
                params = _arguments188.length > 5 && _arguments188[5] !== undefined ? _arguments188[5] : {};
                return _this203.privatePostTrade(_this203.extend({
                    'type': side.toUpperCase(),
                    'market': _this203.marketId(market),
                    'amount': amount,
                    'price': price
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['order']['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this204 = this;

            return _this204.privatePostCancel({ 'order': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                response,
                _this205 = this,
                _arguments190 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments190.length > 1 && _arguments190[1] !== undefined ? _arguments190[1] : 'public';
                method = _arguments190.length > 2 && _arguments190[2] !== undefined ? _arguments190[2] : 'GET';
                params = _arguments190.length > 3 && _arguments190[3] !== undefined ? _arguments190[3] : {};
                headers = _arguments190.length > 4 && _arguments190[4] !== undefined ? _arguments190[4] : undefined;
                body = _arguments190.length > 5 && _arguments190[5] !== undefined ? _arguments190[5] : undefined;
                url = _this205.urls['api'] + '/' + _this205.version + '/';

                if (api == 'public') {
                    url += _this205.implodeParams(path, params);
                } else {
                    nonce = _this205.nonce();

                    url += api;
                    body = _this205.urlencode(_this205.extend({
                        'Method': path.toUpperCase(),
                        'Nonce': nonce
                    }, params));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Key': _this205.apiKey,
                        'Signature': _this205.hmac(_this205.encode(body), _this205.encode(_this205.secret), 'sha512')
                    };
                }
                return _this205.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    throw new ExchangeError(_this205.id + ' ' + _this205.json(response['error']));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var bter = {
        'id': 'bter',
        'name': 'Bter',
        'countries': ['VG', 'CN'], // British Virgin Islands, China
        'version': '2',
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27980479-cfa3188c-6387-11e7-8191-93fc4184ba5c.jpg',
            'api': {
                'public': 'https://data.bter.com/api',
                'private': 'https://api.bter.com/api'
            },
            'www': 'https://bter.com',
            'doc': 'https://bter.com/api2'
        },
        'api': {
            'public': {
                'get': ['pairs', 'marketinfo', 'marketlist', 'tickers', 'ticker/{id}', 'orderBook/{id}', 'trade/{id}', 'tradeHistory/{id}', 'tradeHistory/{id}/{tid}']
            },
            'private': {
                'post': ['balances', 'depositAddress', 'newAddress', 'depositsWithdrawals', 'buy', 'sell', 'cancelOrder', 'cancelAllOrders', 'getOrder', 'openOrders', 'tradeHistory', 'withdraw']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var response,
                markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this206 = this;

            return Promise.resolve().then(function () {
                return _this206.publicGetMarketlist();
            }).then(function (_resp) {
                response = _resp;
                markets = response['data'];
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['pair'];
                    base = market['curr_a'];
                    quote = market['curr_b'];

                    base = _this206.commonCurrencyCode(base);
                    quote = _this206.commonCurrencyCode(quote);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                balance,
                result,
                c,
                currency,
                code,
                account,
                _this207 = this,
                _arguments192 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments192.length > 0 && _arguments192[0] !== undefined ? _arguments192[0] : {};
                return _this207.loadMarkets();
            }).then(function () {
                return _this207.privatePostBalances();
            }).then(function (_resp) {
                balance = _resp;
                result = { 'info': balance };

                for (c = 0; c < _this207.currencies.length; c++) {
                    currency = _this207.currencies[c];
                    code = _this207.commonCurrencyCode(currency);
                    account = _this207.account();

                    if ('available' in balance) {
                        if (currency in balance['available']) {
                            account['free'] = parseFloat(balance['available'][currency]);
                        }
                    }
                    if ('locked' in balance) {
                        if (currency in balance['locked']) {
                            account['used'] = parseFloat(balance['locked'][currency]);
                        }
                    }
                    account['total'] = _this207.sum(account['free'], account['used']);
                    result[code] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this208 = this,
                _arguments193 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments193.length > 1 && _arguments193[1] !== undefined ? _arguments193[1] : {};
                return _this208.loadMarkets();
            }).then(function () {
                return _this208.publicGetOrderBookId(_this208.extend({
                    'id': _this208.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this208.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this208.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                result['asks'] = _this208.sortBy(result['asks'], 0);
                return result;
            });
        },
        parseTicker: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high24hr']),
                'low': parseFloat(ticker['low24hr']),
                'bid': parseFloat(ticker['highestBid']),
                'ask': parseFloat(ticker['lowestAsk']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': parseFloat(ticker['percentChange']),
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['baseVolume']),
                'quoteVolume': parseFloat(ticker['quoteVolume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                result,
                ids,
                i,
                id,
                _id$split5,
                _id$split6,
                baseId,
                quoteId,
                base,
                quote,
                symbol,
                ticker,
                market,
                _this209 = this;

            return Promise.resolve().then(function () {
                return _this209.loadMarkets();
            }).then(function () {
                return _this209.publicGetTickers();
            }).then(function (_resp) {
                tickers = _resp;
                result = {};
                ids = Object.keys(tickers);

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    _id$split5 = id.split('_');
                    _id$split6 = _slicedToArray(_id$split5, 2);
                    baseId = _id$split6[0];
                    quoteId = _id$split6[1];
                    base = baseId.toUpperCase();
                    quote = quoteId.toUpperCase();

                    base = _this209.commonCurrencyCode(base);
                    quote = _this209.commonCurrencyCode(quote);
                    symbol = base + '/' + quote;
                    ticker = tickers[id];
                    market = undefined;

                    if (symbol in _this209.markets) {
                        market = _this209.markets[symbol];
                    }if (id in _this209.markets_by_id) {
                        market = _this209.markets_by_id[id];
                    }result[symbol] = _this209.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this210 = this;

            return Promise.resolve().then(function () {
                return _this210.loadMarkets();
            }).then(function () {
                p = _this210.market(market);
                return _this210.publicGetTickerId({
                    'id': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this210.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this211 = this,
                _arguments196 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments196.length > 1 && _arguments196[1] !== undefined ? _arguments196[1] : {};
                return _this211.loadMarkets();
            }).then(function () {
                return _this211.publicGetTradeHistoryId(_this211.extend({
                    'id': _this211.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                _this212 = this,
                _arguments197 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments197.length > 4 && _arguments197[4] !== undefined ? _arguments197[4] : undefined;
                params = _arguments197.length > 5 && _arguments197[5] !== undefined ? _arguments197[5] : {};

                if (type == 'market') {
                    throw new ExchangeError(_this212.id + ' allows limit orders only');
                }return _this212.loadMarkets();
            }).then(function () {
                method = 'privatePost' + _this212.capitalize(side);
                order = {
                    'currencyPair': _this212.marketId(market),
                    'rate': price,
                    'amount': amount
                };
                return _this212[method](_this212.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['orderNumber']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this213 = this;

            return Promise.resolve().then(function () {
                return _this213.loadMarkets();
            }).then(function () {
                return _this213.privatePostCancelOrder({ 'orderNumber': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                prefix,
                url,
                query,
                nonce,
                request,
                signature,
                response,
                _this214 = this,
                _arguments199 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments199.length > 1 && _arguments199[1] !== undefined ? _arguments199[1] : 'public';
                method = _arguments199.length > 2 && _arguments199[2] !== undefined ? _arguments199[2] : 'GET';
                params = _arguments199.length > 3 && _arguments199[3] !== undefined ? _arguments199[3] : {};
                headers = _arguments199.length > 4 && _arguments199[4] !== undefined ? _arguments199[4] : undefined;
                body = _arguments199.length > 5 && _arguments199[5] !== undefined ? _arguments199[5] : undefined;
                prefix = api == 'private' ? api + '/' : '';
                url = _this214.urls['api'][api] + _this214.version + '/1/' + prefix + _this214.implodeParams(path, params);
                query = _this214.omit(params, _this214.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this214.urlencode(query);
                    }
                } else {
                    nonce = _this214.nonce();
                    request = { 'nonce': nonce };

                    body = _this214.urlencode(_this214.extend(request, query));
                    signature = _this214.hmac(_this214.encode(body), _this214.encode(_this214.secret), 'sha512');

                    headers = {
                        'Key': _this214.apiKey,
                        'Sign': signature,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length.toString()
                    };
                }
                return _this214.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('result' in response) {
                    if (response['result'] != 'true') {
                        throw new ExchangeError(_this214.id + ' ' + _this214.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var bxinth = {

        'id': 'bxinth',
        'name': 'BX.in.th',
        'countries': 'TH', // Thailand
        'rateLimit': 1500,
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766412-567b1eb4-5ed7-11e7-94a8-ff6a3884f6c5.jpg',
            'api': 'https://bx.in.th/api',
            'www': 'https://bx.in.th',
            'doc': 'https://bx.in.th/info/api'
        },
        'api': {
            'public': {
                'get': ['', // ticker
                'options', 'optionbook', 'orderbook', 'pairing', 'trade', 'tradehistory']
            },
            'private': {
                'post': ['balance', 'biller', 'billgroup', 'billpay', 'cancel', 'deposit', 'getorders', 'history', 'option-issue', 'option-bid', 'option-sell', 'option-myissue', 'option-mybid', 'option-myoptions', 'option-exercise', 'option-cancel', 'option-history', 'order', 'withdrawal', 'withdrawal-history']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                keys,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this215 = this;

            return Promise.resolve().then(function () {
                return _this215.publicGetPairing();
            }).then(function (_resp) {
                markets = _resp;
                keys = Object.keys(markets);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    market = markets[keys[p]];
                    id = market['pairing_id'].toString();
                    base = market['primary_currency'];
                    quote = market['secondary_currency'];

                    base = _this215.commonCurrencyCode(base);
                    quote = _this215.commonCurrencyCode(quote);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        commonCurrencyCode: function commonCurrencyCode(currency) {
            // why would they use three letters instead of four for currency codes
            if (currency == 'DAS') return 'DASH';
            if (currency == 'DOG') return 'DOGE';
            return currency;
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balance,
                result,
                currencies,
                c,
                currency,
                code,
                account,
                _this216 = this,
                _arguments201 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments201.length > 0 && _arguments201[0] !== undefined ? _arguments201[0] : {};
                return _this216.loadMarkets();
            }).then(function () {
                return _this216.privatePostBalance();
            }).then(function (_resp) {
                response = _resp;
                balance = response['balance'];
                result = { 'info': balance };
                currencies = Object.keys(balance);

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    code = _this216.commonCurrencyCode(currency);
                    account = {
                        'free': parseFloat(balance[currency]['available']),
                        'used': 0.0,
                        'total': parseFloat(balance[currency]['total'])
                    };

                    account['used'] = account['total'] - account['free'];
                    result[code] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this217 = this,
                _arguments202 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments202.length > 1 && _arguments202[1] !== undefined ? _arguments202[1] : {};
                return _this217.loadMarkets();
            }).then(function () {
                return _this217.publicGetOrderbook(_this217.extend({
                    'pairing': _this217.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this217.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this217.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': parseFloat(ticker['orderbook']['bids']['highbid']),
                'ask': parseFloat(ticker['orderbook']['asks']['highbid']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last_price']),
                'change': parseFloat(ticker['change']),
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['volume_24hours']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                result,
                ids,
                i,
                id,
                ticker,
                market,
                symbol,
                _this218 = this;

            return Promise.resolve().then(function () {
                return _this218.loadMarkets();
            }).then(function () {
                return _this218.publicGet();
            }).then(function (_resp) {
                tickers = _resp;
                result = {};
                ids = Object.keys(tickers);

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    ticker = tickers[id];
                    market = _this218.markets_by_id[id];
                    symbol = market['symbol'];

                    result[symbol] = _this218.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                tickers,
                id,
                ticker,
                _this219 = this;

            return Promise.resolve().then(function () {
                return _this219.loadMarkets();
            }).then(function () {
                p = _this219.market(market);
                return _this219.publicGet({ 'pairing': p['id'] });
            }).then(function (_resp) {
                tickers = _resp;
                id = p['id'].toString();
                ticker = tickers[id];

                return _this219.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this220 = this,
                _arguments205 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments205.length > 1 && _arguments205[1] !== undefined ? _arguments205[1] : {};
                return _this220.loadMarkets();
            }).then(function () {
                return _this220.publicGetTrade(_this220.extend({
                    'pairing': _this220.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                response,
                _this221 = this,
                _arguments206 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments206.length > 4 && _arguments206[4] !== undefined ? _arguments206[4] : undefined;
                params = _arguments206.length > 5 && _arguments206[5] !== undefined ? _arguments206[5] : {};
                return _this221.loadMarkets();
            }).then(function () {
                return _this221.privatePostOrder(_this221.extend({
                    'pairing': _this221.marketId(market),
                    'type': side,
                    'amount': amount,
                    'rate': price
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var pairing,
                _this222 = this;

            return Promise.resolve().then(function () {
                return _this222.loadMarkets();
            }).then(function () {
                pairing = undefined; // TODO fixme

                return _this222.privatePostCancel({
                    'order_id': id,
                    'pairing': pairing
                });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                auth,
                signature,
                response,
                _test6,
                _this223 = this,
                _arguments208 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments208.length > 1 && _arguments208[1] !== undefined ? _arguments208[1] : 'public';
                method = _arguments208.length > 2 && _arguments208[2] !== undefined ? _arguments208[2] : 'GET';
                params = _arguments208.length > 3 && _arguments208[3] !== undefined ? _arguments208[3] : {};
                headers = _arguments208.length > 4 && _arguments208[4] !== undefined ? _arguments208[4] : undefined;
                body = _arguments208.length > 5 && _arguments208[5] !== undefined ? _arguments208[5] : undefined;
                url = _this223.urls['api'] + '/';

                if (path) {
                    url += path + '/';
                }if (Object.keys(params).length) {
                    url += '?' + _this223.urlencode(params);
                }if (api == 'private') {
                    nonce = _this223.nonce();
                    auth = _this223.apiKey + nonce.toString() + _this223.secret;
                    signature = _this223.hash(_this223.encode(auth), 'sha256');

                    body = _this223.urlencode(_this223.extend({
                        'key': _this223.apiKey,
                        'nonce': nonce,
                        'signature': signature
                        // twofa: this.twofa,
                    }, params));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length
                    };
                }
                return _this223.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if (api == 'public') {
                    return response;
                } else {
                    _test6 = 'success' in response;

                    if (_test6 && response['success']) {
                        return response;
                    } else {
                        throw new ExchangeError(_this223.id + ' ' + _this223.json(response));
                    }
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var ccex = {

        'id': 'ccex',
        'name': 'C-CEX',
        'countries': ['DE', 'EU'],
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766433-16881f90-5ed8-11e7-92f8-3d92cc747a6c.jpg',
            'api': {
                'tickers': 'https://c-cex.com/t',
                'public': 'https://c-cex.com/t/api_pub.html',
                'private': 'https://c-cex.com/t/api.html'
            },
            'www': 'https://c-cex.com',
            'doc': 'https://c-cex.com/?id=api'
        },
        'api': {
            'tickers': {
                'get': ['coinnames', '{market}', 'pairs', 'prices', 'volume_{coin}']
            },
            'public': {
                'get': ['balancedistribution', 'markethistory', 'markets', 'marketsummaries', 'orderbook']
            },
            'private': {
                'get': ['buylimit', 'cancel', 'getbalance', 'getbalances', 'getopenorders', 'getorder', 'getorderhistory', 'mytrades', 'selllimit']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this224 = this;

            return Promise.resolve().then(function () {
                return _this224.publicGetMarkets();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets['result'].length; p++) {
                    market = markets['result'][p];
                    id = market['MarketName'];
                    base = market['MarketCurrency'];
                    quote = market['BaseCurrency'];
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                b,
                balance,
                currency,
                account,
                _this225 = this,
                _arguments210 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments210.length > 0 && _arguments210[0] !== undefined ? _arguments210[0] : {};
                return _this225.loadMarkets();
            }).then(function () {
                return _this225.privateGetBalances();
            }).then(function (_resp) {
                response = _resp;
                balances = response['result'];
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['Currency'];
                    account = {
                        'free': balance['Available'],
                        'used': balance['Pending'],
                        'total': balance['Balance']
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this226 = this,
                _arguments211 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments211.length > 1 && _arguments211[1] !== undefined ? _arguments211[1] : {};
                return _this226.loadMarkets();
            }).then(function () {
                return _this226.publicGetOrderbook(_this226.extend({
                    'market': _this226.marketId(market),
                    'type': 'both',
                    'depth': 100
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['result'];
                timestamp = _this226.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this226.iso8601(timestamp)
                };
                sides = { 'bids': 'buy', 'asks': 'sell' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['Rate']);
                        amount = parseFloat(order['Quantity']);

                        result[key].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = ticker['updated'] * 1000;
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['buy']),
                'ask': parseFloat(ticker['sell']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['lastprice']),
                'change': undefined,
                'percentage': undefined,
                'average': parseFloat(ticker['avg']),
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['buysupport']),
                'info': ticker
            };
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                response,
                ticker,
                _this227 = this;

            return Promise.resolve().then(function () {
                return _this227.loadMarkets();
            }).then(function () {
                p = _this227.market(market);
                return _this227.tickersGetMarket({
                    'market': p['id'].toLowerCase()
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];

                return _this227.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this228 = this,
                _arguments213 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments213.length > 1 && _arguments213[1] !== undefined ? _arguments213[1] : {};
                return _this228.loadMarkets();
            }).then(function () {
                return _this228.publicGetMarkethistory(_this228.extend({
                    'market': _this228.marketId(market),
                    'type': 'both',
                    'depth': 100
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                response,
                _this229 = this,
                _arguments214 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments214.length > 4 && _arguments214[4] !== undefined ? _arguments214[4] : undefined;
                params = _arguments214.length > 5 && _arguments214[5] !== undefined ? _arguments214[5] : {};
                return _this229.loadMarkets();
            }).then(function () {
                method = 'privateGet' + _this229.capitalize(side) + type;
                return _this229[method](_this229.extend({
                    'market': _this229.marketId(market),
                    'quantity': amount,
                    'rate': price
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['result']['uuid']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this230 = this;

            return Promise.resolve().then(function () {
                return _this230.loadMarkets();
            }).then(function () {
                return _this230.privateGetCancel({ 'uuid': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                query,
                response,
                _test7,
                _this231 = this,
                _arguments216 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments216.length > 1 && _arguments216[1] !== undefined ? _arguments216[1] : 'public';
                method = _arguments216.length > 2 && _arguments216[2] !== undefined ? _arguments216[2] : 'GET';
                params = _arguments216.length > 3 && _arguments216[3] !== undefined ? _arguments216[3] : {};
                headers = _arguments216.length > 4 && _arguments216[4] !== undefined ? _arguments216[4] : undefined;
                body = _arguments216.length > 5 && _arguments216[5] !== undefined ? _arguments216[5] : undefined;
                url = _this231.urls['api'][api];

                if (api == 'private') {
                    nonce = _this231.nonce().toString();
                    query = _this231.keysort(_this231.extend({
                        'a': path,
                        'apikey': _this231.apiKey,
                        'nonce': nonce
                    }, params));

                    url += '?' + _this231.urlencode(query);
                    headers = { 'apisign': _this231.hmac(_this231.encode(url), _this231.encode(_this231.secret), 'sha512') };
                } else {
                    if (api == 'public') {
                        url += '?' + _this231.urlencode(_this231.extend({
                            'a': 'get' + path
                        }, params));
                    } else {
                        url += '/' + _this231.implodeParams(path, params) + '.json';
                    }
                }return _this231.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if (api == 'tickers') {
                    return response;
                } else {
                    _test7 = 'success' in response;

                    if (_test7 && response['success']) {
                        return response;
                    } else {
                        throw new ExchangeError(_this231.id + ' ' + _this231.json(response));
                    }
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var cex = {

        'id': 'cex',
        'name': 'CEX.IO',
        'countries': ['GB', 'EU', 'CY', 'RU'],
        'rateLimit': 1500,
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766442-8ddc33b0-5ed8-11e7-8b98-f786aef0f3c9.jpg',
            'api': 'https://cex.io/api',
            'www': 'https://cex.io',
            'doc': 'https://cex.io/cex-api'
        },
        'api': {
            'public': {
                'get': ['currency_limits', 'last_price/{pair}', 'last_prices/{currencies}', 'ohlcv/hd/{yyyymmdd}/{pair}', 'order_book/{pair}', 'ticker/{pair}', 'tickers/{currencies}', 'trade_history/{pair}'],
                'post': ['convert/{pair}', 'price_stats/{pair}']
            },
            'private': {
                'post': ['active_orders_status/', 'archived_orders/{pair}', 'balance/', 'cancel_order/', 'cancel_orders/{pair}', 'cancel_replace_order/{pair}', 'close_position/{pair}', 'get_address/', 'get_myfee/', 'get_order/', 'get_order_tx/', 'open_orders/{pair}', 'open_orders/', 'open_position/{pair}', 'open_positions/{pair}', 'place_order/{pair}', 'place_order/{pair}']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                symbol,
                _symbol$split5,
                _symbol$split6,
                base,
                quote,
                _this232 = this;

            return Promise.resolve().then(function () {
                return _this232.publicGetCurrencyLimits();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets['data']['pairs'].length; p++) {
                    market = markets['data']['pairs'][p];
                    id = market['symbol1'] + '/' + market['symbol2'];
                    symbol = id;
                    _symbol$split5 = symbol.split('/');
                    _symbol$split6 = _slicedToArray(_symbol$split5, 2);
                    base = _symbol$split6[0];
                    quote = _symbol$split6[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                balances,
                result,
                c,
                currency,
                account,
                _this233 = this,
                _arguments218 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments218.length > 0 && _arguments218[0] !== undefined ? _arguments218[0] : {};
                return _this233.loadMarkets();
            }).then(function () {
                return _this233.privatePostBalance();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (c = 0; c < _this233.currencies.length; c++) {
                    currency = _this233.currencies[c];
                    account = {
                        'free': parseFloat(balances[currency]['available']),
                        'used': parseFloat(balances[currency]['orders']),
                        'total': 0.0
                    };

                    account['total'] = _this233.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                _this234 = this,
                _arguments219 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments219.length > 1 && _arguments219[1] !== undefined ? _arguments219[1] : {};
                return _this234.loadMarkets();
            }).then(function () {
                return _this234.publicGetOrderBookPair(_this234.extend({
                    'pair': _this234.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = orderbook['timestamp'] * 1000;
                result = {
                    'bids': orderbook['bids'],
                    'asks': orderbook['asks'],
                    'timestamp': timestamp,
                    'datetime': _this234.iso8601(timestamp)
                };

                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = parseInt(ticker['timestamp']) * 1000;
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['volume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var currencies,
                response,
                tickers,
                result,
                t,
                ticker,
                symbol,
                market,
                _this235 = this;

            return Promise.resolve().then(function () {
                return _this235.loadMarkets();
            }).then(function () {
                currencies = _this235.currencies.join('/');
                return _this235.publicGetTickersCurrencies({
                    'currencies': currencies
                });
            }).then(function (_resp) {
                response = _resp;
                tickers = response['data'];
                result = {};

                for (t = 0; t < tickers.length; t++) {
                    ticker = tickers[t];
                    symbol = ticker['pair'].replace(':', '/');
                    market = _this235.markets[symbol];

                    result[symbol] = _this235.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this236 = this;

            return Promise.resolve().then(function () {
                return _this236.loadMarkets();
            }).then(function () {
                p = _this236.market(market);
                return _this236.publicGetTickerPair({
                    'pair': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this236.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this237 = this,
                _arguments222 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments222.length > 1 && _arguments222[1] !== undefined ? _arguments222[1] : {};
                return _this237.loadMarkets();
            }).then(function () {
                return _this237.publicGetTradeHistoryPair(_this237.extend({
                    'pair': _this237.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this238 = this,
                _arguments223 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments223.length > 4 && _arguments223[4] !== undefined ? _arguments223[4] : undefined;
                params = _arguments223.length > 5 && _arguments223[5] !== undefined ? _arguments223[5] : {};
                return _this238.loadMarkets();
            }).then(function () {
                order = {
                    'pair': _this238.marketId(market),
                    'type': side,
                    'amount': amount
                };

                if (type == 'limit') {
                    order['price'] = price;
                } else {
                    order['order_type'] = type;
                }return _this238.privatePostPlaceOrderPair(_this238.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this239 = this;

            return Promise.resolve().then(function () {
                return _this239.loadMarkets();
            }).then(function () {
                return _this239.privatePostCancelOrder({ 'id': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                auth,
                signature,
                response,
                _test8,
                _test9,
                _this240 = this,
                _arguments225 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments225.length > 1 && _arguments225[1] !== undefined ? _arguments225[1] : 'public';
                method = _arguments225.length > 2 && _arguments225[2] !== undefined ? _arguments225[2] : 'GET';
                params = _arguments225.length > 3 && _arguments225[3] !== undefined ? _arguments225[3] : {};
                headers = _arguments225.length > 4 && _arguments225[4] !== undefined ? _arguments225[4] : undefined;
                body = _arguments225.length > 5 && _arguments225[5] !== undefined ? _arguments225[5] : undefined;
                url = _this240.urls['api'] + '/' + _this240.implodeParams(path, params);
                query = _this240.omit(params, _this240.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this240.urlencode(query);
                    }
                } else {
                    if (!_this240.uid) {
                        throw new AuthenticationError(_this240.id + ' requires `' + _this240.id + '.uid` property for authentication');
                    }nonce = _this240.nonce().toString();
                    auth = nonce + _this240.uid + _this240.apiKey;
                    signature = _this240.hmac(_this240.encode(auth), _this240.encode(_this240.secret));

                    body = _this240.urlencode(_this240.extend({
                        'key': _this240.apiKey,
                        'signature': signature.toUpperCase(),
                        'nonce': nonce
                    }, query));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length
                    };
                }
                return _this240.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test8 = 'e' in response;
                _test9 = _test8 && 'ok' in response;

                if (_test9 && response['ok'] == 'ok') {
                    return response;
                } else {
                    if (_test8) {
                        throw new ExchangeError(_this240.id + ' ' + _this240.json(response));
                    }

                    return response;
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var chbtc = {
        'id': 'chbtc',
        'name': 'CHBTC',
        'countries': 'CN',
        'rateLimit': 1000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28555659-f0040dc2-7109-11e7-9d99-688a438bf9f4.jpg',
            'api': {
                'public': 'http://api.chbtc.com/data', // no https for public API
                'private': 'https://trade.chbtc.com/api'
            },
            'www': 'https://trade.chbtc.com/api',
            'doc': 'https://www.chbtc.com/i/developer'
        },
        'api': {
            'public': {
                'get': ['ticker', 'depth', 'trades', 'kline']
            },
            'private': {
                'post': ['order', 'cancelOrder', 'getOrder', 'getOrders', 'getOrdersNew', 'getOrdersIgnoreTradeType', 'getUnfinishedOrdersIgnoreTradeType', 'getAccountInfo', 'getUserAddress', 'getWithdrawAddress', 'getWithdrawRecord', 'getChargeRecord', 'getCnyWithdrawRecord', 'getCnyChargeRecord', 'withdraw']
            }
        },
        'markets': {
            'BTC/CNY': { 'id': 'btc_cny', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY' },
            'LTC/CNY': { 'id': 'ltc_cny', 'symbol': 'LTC/CNY', 'base': 'LTC', 'quote': 'CNY' },
            'ETH/CNY': { 'id': 'eth_cny', 'symbol': 'ETH/CNY', 'base': 'ETH', 'quote': 'CNY' },
            'ETC/CNY': { 'id': 'etc_cny', 'symbol': 'ETC/CNY', 'base': 'ETC', 'quote': 'CNY' },
            'BTS/CNY': { 'id': 'bts_cny', 'symbol': 'BTS/CNY', 'base': 'BTS', 'quote': 'CNY' },
            'EOS/CNY': { 'id': 'eos_cny', 'symbol': 'EOS/CNY', 'base': 'EOS', 'quote': 'CNY' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                c,
                currency,
                account,
                _this241 = this,
                _arguments226 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments226.length > 0 && _arguments226[0] !== undefined ? _arguments226[0] : {};
                return _this241.privatePostGetAccountInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['result'];
                result = { 'info': balances };

                for (c = 0; c < _this241.currencies.length; c++) {
                    currency = _this241.currencies[c];
                    account = _this241.account();

                    if (currency in balances['balance']) {
                        account['free'] = balances['balance'][currency]['amount'];
                    }if (currency in balances['frozen']) {
                        account['used'] = balances['frozen'][currency]['amount'];
                    }account['total'] = _this241.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                orderbook,
                timestamp,
                bids,
                asks,
                result,
                _this242 = this,
                _arguments227 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments227.length > 1 && _arguments227[1] !== undefined ? _arguments227[1] : {};
                p = _this242.market(market);
                return _this242.publicGetDepth(_this242.extend({
                    'currency': p['id']
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this242.milliseconds();
                bids = undefined;
                asks = undefined;

                if ('bids' in orderbook) {
                    bids = orderbook['bids'];
                }if ('asks' in orderbook) {
                    asks = orderbook['asks'];
                }result = {
                    'bids': bids,
                    'asks': asks,
                    'timestamp': timestamp,
                    'datetime': _this242.iso8601(timestamp)
                };

                if (result['bids']) {
                    result['bids'] = _this242.sortBy(result['bids'], 0, true);
                }if (result['asks']) {
                    result['asks'] = _this242.sortBy(result['asks'], 0);
                }return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                timestamp,
                _this243 = this;

            return Promise.resolve().then(function () {
                return _this243.publicGetTicker({
                    'currency': _this243.marketId(market)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];
                timestamp = _this243.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this243.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this244 = this,
                _arguments229 = arguments;

            params = _arguments229.length > 1 && _arguments229[1] !== undefined ? _arguments229[1] : {};

            return _this244.publicGetTrades(_this244.extend({
                'currency': _this244.marketId(market)
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                paramString,
                tradeType,
                response,
                _this245 = this,
                _arguments230 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments230.length > 4 && _arguments230[4] !== undefined ? _arguments230[4] : undefined;
                params = _arguments230.length > 5 && _arguments230[5] !== undefined ? _arguments230[5] : {};
                paramString = '&price=' + price.toString();

                paramString += '&amount=' + amount.toString();
                tradeType = side == 'buy' ? '1' : '0';

                paramString += '&tradeType=' + tradeType;
                paramString += '&currency=' + _this245.marketId(market);
                return _this245.privatePostOrder(paramString);
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                paramString,
                _this246 = this,
                _arguments231 = arguments;

            params = _arguments231.length > 1 && _arguments231[1] !== undefined ? _arguments231[1] : {};
            paramString = '&id=' + id.toString();

            if ('currency' in params) {
                paramString += '&currency=' + params['currency'];
            }return _this246.privatePostCancelOrder(paramString);
        },
        fetchOrder: function fetchOrder(id) {
            var params,
                paramString,
                _this247 = this,
                _arguments232 = arguments;

            params = _arguments232.length > 1 && _arguments232[1] !== undefined ? _arguments232[1] : {};
            paramString = '&id=' + id.toString();

            if ('currency' in params) {
                paramString += '&currency=' + params['currency'];
            }return _this247.privatePostGetOrder(paramString);
        },
        nonce: function nonce() {
            return this.milliseconds();
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                paramsLength,
                nonce,
                auth,
                secret,
                signature,
                suffix,
                response,
                _this248 = this,
                _arguments233 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments233.length > 1 && _arguments233[1] !== undefined ? _arguments233[1] : 'public';
                method = _arguments233.length > 2 && _arguments233[2] !== undefined ? _arguments233[2] : 'GET';
                params = _arguments233.length > 3 && _arguments233[3] !== undefined ? _arguments233[3] : {};
                headers = _arguments233.length > 4 && _arguments233[4] !== undefined ? _arguments233[4] : undefined;
                body = _arguments233.length > 5 && _arguments233[5] !== undefined ? _arguments233[5] : undefined;
                url = _this248.urls['api'][api];

                if (api == 'public') {
                    url += '/' + _this248.version + '/' + path;
                    if (Object.keys(params).length) {
                        url += '?' + _this248.urlencode(params);
                    }
                } else {
                    paramsLength = params.length; // params should be a string here

                    nonce = _this248.nonce();
                    auth = 'method=' + path;

                    auth += '&accesskey=' + _this248.apiKey;
                    auth += paramsLength ? params : '';
                    secret = _this248.hash(_this248.encode(_this248.secret), 'sha1');
                    signature = _this248.hmac(_this248.encode(auth), _this248.encode(secret), 'md5');
                    suffix = 'sign=' + signature + '&reqTime=' + nonce.toString();

                    url += '/' + path + '?' + auth + '&' + suffix;
                }
                return _this248.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if (api == 'private') {
                    if ('code' in response) {
                        throw new ExchangeError(_this248.id + ' ' + _this248.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var chilebit = extend(blinktrade, {
        'id': 'chilebit',
        'name': 'ChileBit',
        'countries': 'CL',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27991414-1298f0d8-647f-11e7-9c40-d56409266336.jpg',
            'api': {
                'public': 'https://api.blinktrade.com/api',
                'private': 'https://api.blinktrade.com/tapi'
            },
            'www': 'https://chilebit.net',
            'doc': 'https://blinktrade.com/docs'
        },
        'comment': 'Blinktrade API',
        'markets': {
            'BTC/CLP': { 'id': 'BTCCLP', 'symbol': 'BTC/CLP', 'base': 'BTC', 'quote': 'CLP', 'brokerId': 9, 'broker': 'ChileBit' }
        }
    });

    //-----------------------------------------------------------------------------

    var coincheck = {

        'id': 'coincheck',
        'name': 'coincheck',
        'countries': ['JP', 'ID'],
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766464-3b5c3c74-5ed9-11e7-840e-31b32968e1da.jpg',
            'api': 'https://coincheck.com/api',
            'www': 'https://coincheck.com',
            'doc': 'https://coincheck.com/documents/exchange/api'
        },
        'api': {
            'public': {
                'get': ['exchange/orders/rate', 'order_books', 'rate/{pair}', 'ticker', 'trades']
            },
            'private': {
                'get': ['accounts', 'accounts/balance', 'accounts/leverage_balance', 'bank_accounts', 'deposit_money', 'exchange/orders/opens', 'exchange/orders/transactions', 'exchange/orders/transactions_pagination', 'exchange/leverage/positions', 'lending/borrows/matches', 'send_money', 'withdraws'],
                'post': ['bank_accounts', 'deposit_money/{id}/fast', 'exchange/orders', 'exchange/transfers/to_leverage', 'exchange/transfers/from_leverage', 'lending/borrows', 'lending/borrows/{id}/repay', 'send_money', 'withdraws'],
                'delete': ['bank_accounts/{id}', 'exchange/orders/{id}', 'withdraws/{id}']
            }
        },
        'markets': {
            'BTC/JPY': { 'id': 'btc_jpy', 'symbol': 'BTC/JPY', 'base': 'BTC', 'quote': 'JPY' }, // the only real pair
            'ETH/JPY': { 'id': 'eth_jpy', 'symbol': 'ETH/JPY', 'base': 'ETH', 'quote': 'JPY' },
            'ETC/JPY': { 'id': 'etc_jpy', 'symbol': 'ETC/JPY', 'base': 'ETC', 'quote': 'JPY' },
            'DAO/JPY': { 'id': 'dao_jpy', 'symbol': 'DAO/JPY', 'base': 'DAO', 'quote': 'JPY' },
            'LSK/JPY': { 'id': 'lsk_jpy', 'symbol': 'LSK/JPY', 'base': 'LSK', 'quote': 'JPY' },
            'FCT/JPY': { 'id': 'fct_jpy', 'symbol': 'FCT/JPY', 'base': 'FCT', 'quote': 'JPY' },
            'XMR/JPY': { 'id': 'xmr_jpy', 'symbol': 'XMR/JPY', 'base': 'XMR', 'quote': 'JPY' },
            'REP/JPY': { 'id': 'rep_jpy', 'symbol': 'REP/JPY', 'base': 'REP', 'quote': 'JPY' },
            'XRP/JPY': { 'id': 'xrp_jpy', 'symbol': 'XRP/JPY', 'base': 'XRP', 'quote': 'JPY' },
            'ZEC/JPY': { 'id': 'zec_jpy', 'symbol': 'ZEC/JPY', 'base': 'ZEC', 'quote': 'JPY' },
            'XEM/JPY': { 'id': 'xem_jpy', 'symbol': 'XEM/JPY', 'base': 'XEM', 'quote': 'JPY' },
            'LTC/JPY': { 'id': 'ltc_jpy', 'symbol': 'LTC/JPY', 'base': 'LTC', 'quote': 'JPY' },
            'DASH/JPY': { 'id': 'dash_jpy', 'symbol': 'DASH/JPY', 'base': 'DASH', 'quote': 'JPY' },
            'ETH/BTC': { 'id': 'eth_btc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' },
            'ETC/BTC': { 'id': 'etc_btc', 'symbol': 'ETC/BTC', 'base': 'ETC', 'quote': 'BTC' },
            'LSK/BTC': { 'id': 'lsk_btc', 'symbol': 'LSK/BTC', 'base': 'LSK', 'quote': 'BTC' },
            'FCT/BTC': { 'id': 'fct_btc', 'symbol': 'FCT/BTC', 'base': 'FCT', 'quote': 'BTC' },
            'XMR/BTC': { 'id': 'xmr_btc', 'symbol': 'XMR/BTC', 'base': 'XMR', 'quote': 'BTC' },
            'REP/BTC': { 'id': 'rep_btc', 'symbol': 'REP/BTC', 'base': 'REP', 'quote': 'BTC' },
            'XRP/BTC': { 'id': 'xrp_btc', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC' },
            'ZEC/BTC': { 'id': 'zec_btc', 'symbol': 'ZEC/BTC', 'base': 'ZEC', 'quote': 'BTC' },
            'XEM/BTC': { 'id': 'xem_btc', 'symbol': 'XEM/BTC', 'base': 'XEM', 'quote': 'BTC' },
            'LTC/BTC': { 'id': 'ltc_btc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'DASH/BTC': { 'id': 'dash_btc', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                balances,
                result,
                c,
                currency,
                lowercase,
                account,
                reserved,
                _this249 = this,
                _arguments234 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments234.length > 0 && _arguments234[0] !== undefined ? _arguments234[0] : {};
                return _this249.privateGetAccountsBalance();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (c = 0; c < _this249.currencies.length; c++) {
                    currency = _this249.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = _this249.account();

                    if (lowercase in balances) {
                        account['free'] = parseFloat(balances[lowercase]);
                    }reserved = lowercase + '_reserved';

                    if (reserved in balances) {
                        account['used'] = parseFloat(balances[reserved]);
                    }account['total'] = _this249.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this250 = this,
                _arguments235 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments235.length > 1 && _arguments235[1] !== undefined ? _arguments235[1] : {};
                return _this250.publicGetOrderBooks(params);
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this250.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this250.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this251 = this;

            return Promise.resolve().then(function () {
                return _this251.publicGetTicker();
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = ticker['timestamp'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this251.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this252 = this,
                _arguments237 = arguments;

            params = _arguments237.length > 1 && _arguments237[1] !== undefined ? _arguments237[1] : {};

            return _this252.publicGetTrades(params);
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                prefix,
                order,
                order_type,
                _prefix,
                response,
                _this253 = this,
                _arguments238 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments238.length > 4 && _arguments238[4] !== undefined ? _arguments238[4] : undefined;
                params = _arguments238.length > 5 && _arguments238[5] !== undefined ? _arguments238[5] : {};
                prefix = '';
                order = {
                    'pair': _this253.marketId(market)
                };

                if (type == 'market') {
                    order_type = type + '_' + side;

                    order['order_type'] = order_type;
                    _prefix = side == 'buy' ? order_type + '_' : '';

                    order[_prefix + 'amount'] = amount;
                } else {
                    order['order_type'] = side;
                    order['rate'] = price;
                    order['amount'] = amount;
                }
                return _this253.privatePostExchangeOrders(_this253.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this254 = this;

            return _this254.privateDeleteExchangeOrdersId({ 'id': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                length,
                auth,
                response,
                _test10,
                _this255 = this,
                _arguments240 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments240.length > 1 && _arguments240[1] !== undefined ? _arguments240[1] : 'public';
                method = _arguments240.length > 2 && _arguments240[2] !== undefined ? _arguments240[2] : 'GET';
                params = _arguments240.length > 3 && _arguments240[3] !== undefined ? _arguments240[3] : {};
                headers = _arguments240.length > 4 && _arguments240[4] !== undefined ? _arguments240[4] : undefined;
                body = _arguments240.length > 5 && _arguments240[5] !== undefined ? _arguments240[5] : undefined;
                url = _this255.urls['api'] + '/' + _this255.implodeParams(path, params);
                query = _this255.omit(params, _this255.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this255.urlencode(query);
                    }
                } else {
                    nonce = _this255.nonce().toString();
                    length = 0;

                    if (Object.keys(query).length) {
                        body = _this255.urlencode(_this255.keysort(query));
                        length = body.length;
                    }
                    auth = nonce + url + (body || '');

                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': length,
                        'ACCESS-KEY': _this255.apiKey,
                        'ACCESS-NONCE': nonce,
                        'ACCESS-SIGNATURE': _this255.hmac(_this255.encode(auth), _this255.encode(_this255.secret))
                    };
                }
                return _this255.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if (api == 'public') {
                    return response;
                } else {
                    _test10 = 'success' in response;

                    if (_test10 && response['success']) {
                        return response;
                    } else {
                        throw new ExchangeError(_this255.id + ' ' + _this255.json(response));
                    }
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var coinfloor = {

        'id': 'coinfloor',
        'name': 'coinfloor',
        'rateLimit': 1000,
        'countries': 'UK',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28246081-623fc164-6a1c-11e7-913f-bac0d5576c90.jpg',
            'api': 'https://webapi.coinfloor.co.uk:8090/bist',
            'www': 'https://www.coinfloor.co.uk',
            'doc': ['https://github.com/coinfloor/api', 'https://www.coinfloor.co.uk/api']
        },
        'api': {
            'public': {
                'get': ['{id}/ticker/', '{id}/order_book/', '{id}/transactions/']
            },
            'private': {
                'post': ['{id}/balance/', '{id}/user_transactions/', '{id}/open_orders/', '{id}/cancel_order/', '{id}/buy/', '{id}/sell/', '{id}/buy_market/', '{id}/sell_market/', '{id}/estimate_sell_market/', '{id}/estimate_buy_market/']
            }
        },
        'markets': {
            'BTC/GBP': { 'id': 'XBT/GBP', 'symbol': 'BTC/GBP', 'base': 'BTC', 'quote': 'GBP' },
            'BTC/EUR': { 'id': 'XBT/EUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'BTC/USD': { 'id': 'XBT/USD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/PLN': { 'id': 'XBT/PLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN' },
            'BCH/GBP': { 'id': 'BCH/GBP', 'symbol': 'BCH/GBP', 'base': 'BCH', 'quote': 'GBP' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                symbol,
                _this256 = this,
                _arguments241 = arguments;

            params = _arguments241.length > 0 && _arguments241[0] !== undefined ? _arguments241[0] : {};
            symbol = undefined;

            if ('symbol' in params) {
                symbol = params['symbol'];
            }if ('id' in params) {
                symbol = params['id'];
            }if (!symbol) {
                throw new ExchangeError(_this256.id + ' fetchBalance requires a symbol param');
            }return _this256.privatePostIdBalance({
                'id': _this256.marketId(symbol)
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this257 = this;

            return Promise.resolve().then(function () {
                return _this257.publicGetIdOrderBook({
                    'id': _this257.marketId(market)
                });
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this257.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this257.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            // rewrite to get the timestamp from HTTP headers
            var timestamp = this.milliseconds();
            // they sometimes return null for vwap
            var vwap = undefined;
            if ('vwap' in ticker) if (ticker['vwap']) vwap = parseFloat(ticker['vwap']);
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': vwap,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['volume']),
                'info': ticker
            };
        },
        fetchTicker: function fetchTicker(market) {
            var m,
                ticker,
                _this258 = this;

            return Promise.resolve().then(function () {
                m = _this258.market(market);
                return _this258.publicGetIdTicker({
                    'id': m['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this258.parseTicker(ticker, m);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this259 = this,
                _arguments244 = arguments;

            params = _arguments244.length > 1 && _arguments244[1] !== undefined ? _arguments244[1] : {};

            return _this259.publicGetIdTransactions(_this259.extend({
                'id': _this259.marketId(market)
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                method,
                _this260 = this,
                _arguments245 = arguments;

            price = _arguments245.length > 4 && _arguments245[4] !== undefined ? _arguments245[4] : undefined;
            params = _arguments245.length > 5 && _arguments245[5] !== undefined ? _arguments245[5] : {};
            order = { 'id': _this260.marketId(market) };
            method = 'privatePostId' + _this260.capitalize(side);

            if (type == 'market') {
                order['quantity'] = amount;
                method += 'Market';
            } else {
                order['price'] = price;
                order['amount'] = amount;
            }
            return _this260[method](_this260.extend(order, params));
        },
        cancelOrder: function cancelOrder(id) {
            var _this261 = this;

            return _this261.privatePostIdCancelOrder({ 'id': id });
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            // curl -k -u '[User ID]/[API key]:[Passphrase]' https://webapi.coinfloor.co.uk:8090/bist/XBT/GBP/balance/
            var url = this.urls['api'] + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (type == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                var nonce = this.nonce();
                body = this.urlencode(this.extend({ 'nonce': nonce }, query));
                var auth = this.uid + '/' + this.apiKey + ':' + this.password;
                var signature = this.stringToBase64(auth);
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length,
                    'Authorization': 'Basic ' + signature
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var coingi = {

        'id': 'coingi',
        'name': 'Coingi',
        'rateLimit': 1000,
        'countries': ['PA', 'BG', 'CN', 'US'], // Panama, Bulgaria, China, US
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28619707-5c9232a8-7212-11e7-86d6-98fe5d15cc6e.jpg',
            'api': 'https://api.coingi.com',
            'www': 'https://coingi.com',
            'doc': 'http://docs.coingi.apiary.io/'
        },
        'api': {
            'current': {
                'get': ['order-book/{pair}/{askCount}/{bidCount}/{depth}', 'transactions/{pair}/{maxCount}', '24hour-rolling-aggregation']
            },
            'user': {
                'post': ['balance', 'add-order', 'cancel-order', 'orders', 'transactions', 'create-crypto-withdrawal']
            }
        },
        'markets': {
            'LTC/BTC': { 'id': 'ltc-btc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'PPC/BTC': { 'id': 'ppc-btc', 'symbol': 'PPC/BTC', 'base': 'PPC', 'quote': 'BTC' },
            'DOGE/BTC': { 'id': 'doge-btc', 'symbol': 'DOGE/BTC', 'base': 'DOGE', 'quote': 'BTC' },
            'VTC/BTC': { 'id': 'vtc-btc', 'symbol': 'VTC/BTC', 'base': 'VTC', 'quote': 'BTC' },
            'FTC/BTC': { 'id': 'ftc-btc', 'symbol': 'FTC/BTC', 'base': 'FTC', 'quote': 'BTC' },
            'NMC/BTC': { 'id': 'nmc-btc', 'symbol': 'NMC/BTC', 'base': 'NMC', 'quote': 'BTC' },
            'DASH/BTC': { 'id': 'dash-btc', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                currencies,
                c,
                currency,
                balances,
                result,
                b,
                balance,
                _currency4,
                account,
                _this262 = this,
                _arguments247 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments247.length > 0 && _arguments247[0] !== undefined ? _arguments247[0] : {};
                currencies = [];

                for (c = 0; c < _this262.currencies.length; c++) {
                    currency = _this262.currencies[c].toLowerCase();

                    currencies.push(currency);
                }
                return _this262.userPostBalance({
                    'currencies': currencies.join(',')
                });
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    _currency4 = balance['currency']['name'];

                    _currency4 = _currency4.toUpperCase();
                    account = {
                        'free': balance['available'],
                        'used': balance['blocked'] + balance['inOrders'] + balance['withdrawing'],
                        'total': 0.0
                    };

                    account['total'] = _this262.sum(account['free'], account['used']);
                    result[_currency4] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this263 = this,
                _arguments248 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments248.length > 1 && _arguments248[1] !== undefined ? _arguments248[1] : {};
                p = _this263.market(market);
                return _this263.currentGetOrderBookPairAskCountBidCountDepth(_this263.extend({
                    'pair': p['id'],
                    'askCount': 512, // maximum returned number of asks 1-512
                    'bidCount': 512, // maximum returned number of bids 1-512
                    'depth': 32 // maximum number of depth range steps 1-32
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this263.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this263.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order['price'];
                        amount = order['baseAmount'];

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': ticker['high'],
                'low': ticker['low'],
                'bid': ticker['highestBid'],
                'ask': ticker['lowestAsk'],
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': undefined,
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': ticker['baseVolume'],
                'quoteVolume': ticker['counterVolume'],
                'info': ticker
            };
            return ticker;
        },
        fetchTickers: function fetchTickers() {
            var response,
                result,
                t,
                ticker,
                base,
                quote,
                symbol,
                market,
                _this264 = this;

            return Promise.resolve().then(function () {
                return _this264.currentGet24hourRollingAggregation();
            }).then(function (_resp) {
                response = _resp;
                result = {};

                for (t = 0; t < response.length; t++) {
                    ticker = response[t];
                    base = ticker['currencyPair']['base'].toUpperCase();
                    quote = ticker['currencyPair']['counter'].toUpperCase();
                    symbol = base + '/' + quote;
                    market = _this264.markets[symbol];

                    result[symbol] = _this264.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                tickers,
                t,
                ticker,
                base,
                quote,
                _symbol,
                p,
                symbol,
                _ticker,
                _this265 = this;

            return Promise.resolve().then(function () {
                return _this265.currentGet24hourRollingAggregation();
            }).then(function (_resp) {
                response = _resp;
                tickers = {};

                for (t = 0; t < response.length; t++) {
                    ticker = response[t];
                    base = ticker['currencyPair']['base'].toUpperCase();
                    quote = ticker['currencyPair']['counter'].toUpperCase();
                    _symbol = base + '/' + quote;

                    tickers[_symbol] = ticker;
                }
                p = _this265.market(market);
                symbol = p['symbol'];

                if (symbol in tickers) {
                    _ticker = tickers[symbol];

                    return _this265.parseTicker(_ticker, p);
                } else {
                    throw new ExchangeError(_this265.id + ' ' + symbol + ' ticker not found');
                }
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this266 = this,
                _arguments251 = arguments;

            params = _arguments251.length > 1 && _arguments251[1] !== undefined ? _arguments251[1] : {};

            return _this266.currentGetTransactionsPairMaxCount(_this266.extend({
                'pair': _this266.marketId(market),
                'maxCount': 128
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this267 = this,
                _arguments252 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments252.length > 4 && _arguments252[4] !== undefined ? _arguments252[4] : undefined;
                params = _arguments252.length > 5 && _arguments252[5] !== undefined ? _arguments252[5] : {};
                order = {
                    'currencyPair': _this267.marketId(market),
                    'volume': amount,
                    'price': price,
                    'orderType': side == 'buy' ? 0 : 1
                };
                return _this267.userPostAddOrder(_this267.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['result']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this268 = this;

            return _this268.userPostCancelOrder({ 'orderId': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                request,
                auth,
                response,
                _this269 = this,
                _arguments254 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments254.length > 1 && _arguments254[1] !== undefined ? _arguments254[1] : 'public';
                method = _arguments254.length > 2 && _arguments254[2] !== undefined ? _arguments254[2] : 'GET';
                params = _arguments254.length > 3 && _arguments254[3] !== undefined ? _arguments254[3] : {};
                headers = _arguments254.length > 4 && _arguments254[4] !== undefined ? _arguments254[4] : undefined;
                body = _arguments254.length > 5 && _arguments254[5] !== undefined ? _arguments254[5] : undefined;
                url = _this269.urls['api'] + '/' + api + '/' + _this269.implodeParams(path, params);
                query = _this269.omit(params, _this269.extractParams(path));

                if (api == 'current') {
                    if (Object.keys(query).length) {
                        url += '?' + _this269.urlencode(query);
                    }
                } else {
                    nonce = _this269.nonce();
                    request = _this269.extend({
                        'token': _this269.apiKey,
                        'nonce': nonce
                    }, query);
                    auth = nonce.toString() + '$' + _this269.apiKey;

                    request['signature'] = _this269.hmac(_this269.encode(auth), _this269.encode(_this269.secret));
                    body = _this269.json(request);
                    headers = {
                        'Content-Type': 'application/json',
                        'Content-Length': body.length
                    };
                }
                return _this269.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('errors' in response) {
                    throw new ExchangeError(_this269.id + ' ' + _this269.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var coinmarketcap = {

        'id': 'coinmarketcap',
        'name': 'CoinMarketCap',
        'rateLimit': 10000,
        'version': 'v1',
        'countries': 'US',
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28244244-9be6312a-69ed-11e7-99c1-7c1797275265.jpg',
            'api': 'https://api.coinmarketcap.com',
            'www': 'https://coinmarketcap.com',
            'doc': 'https://coinmarketcap.com/api'
        },
        'api': {
            'public': {
                'get': ['ticker/', 'ticker/{id}/', 'global/']
            }
        },
        'currencies': ['AUD', 'BRL', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'HKD', 'IDR', 'INR', 'JPY', 'KRW', 'MXN', 'RUB', 'USD'],

        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                _this270 = this,
                _arguments255 = arguments;

            params = _arguments255.length > 1 && _arguments255[1] !== undefined ? _arguments255[1] : {};

            throw new ExchangeError('Fetching order books is not supported by the API of ' + _this270.id);
        },
        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                c,
                base,
                baseId,
                quote,
                quoteId,
                symbol,
                id,
                _this271 = this;

            return Promise.resolve().then(function () {
                return _this271.publicGetTicker();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];

                    for (c = 0; c < _this271.currencies.length; c++) {
                        base = market['symbol'];
                        baseId = market['id'];
                        quote = _this271.currencies[c];
                        quoteId = quote.toLowerCase();
                        symbol = base + '/' + quote;
                        id = baseId + '/' + quote;

                        result.push({
                            'id': id,
                            'symbol': symbol,
                            'base': base,
                            'quote': quote,
                            'baseId': baseId,
                            'quoteId': quoteId,
                            'info': market
                        });
                    }
                }
                return result;
            });
        },
        fetchGlobal: function fetchGlobal() {
            var currency,
                request,
                _this272 = this,
                _arguments257 = arguments;

            return Promise.resolve().then(function () {
                currency = _arguments257.length > 0 && _arguments257[0] !== undefined ? _arguments257[0] : 'USD';
                return _this272.loadMarkets();
            }).then(function () {
                request = {};

                if (currency) {
                    request['convert'] = currency;
                }return _this272.publicGetGlobal(request);
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            if ('last_updated' in ticker) if (ticker['last_updated']) timestamp = parseInt(ticker['last_updated']) * 1000;
            var volume = undefined;
            var volumeKey = '24h_volume_' + market['quoteId'];
            if (ticker[volumeKey]) volume = parseFloat(ticker[volumeKey]);
            var price = 'price_' + market['quoteId'];
            var change = undefined;
            var changeKey = 'percent_change_24h';
            if (ticker[changeKey]) change = parseFloat(ticker[changeKey]);
            var last = undefined;
            if (price in ticker) if (ticker[price]) last = parseFloat(ticker[price]);
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': undefined,
                'ask': undefined,
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': last,
                'change': change,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': volume,
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var currency,
                request,
                response,
                tickers,
                t,
                ticker,
                id,
                market,
                symbol,
                _this273 = this,
                _arguments258 = arguments;

            return Promise.resolve().then(function () {
                currency = _arguments258.length > 0 && _arguments258[0] !== undefined ? _arguments258[0] : 'USD';
                return _this273.loadMarkets();
            }).then(function () {
                request = {};

                if (currency) {
                    request['convert'] = currency;
                }return _this273.publicGetTicker(request);
            }).then(function (_resp) {
                response = _resp;
                tickers = {};

                for (t = 0; t < response.length; t++) {
                    ticker = response[t];
                    id = ticker['id'] + '/' + currency;
                    market = _this273.markets_by_id[id];
                    symbol = market['symbol'];

                    tickers[symbol] = _this273.parseTicker(ticker, market);
                }
                return tickers;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                request,
                response,
                ticker,
                _this274 = this;

            return Promise.resolve().then(function () {
                return _this274.loadMarkets();
            }).then(function () {
                p = _this274.market(market);
                request = {
                    'convert': p['quote'],
                    'id': p['baseId']
                };
                return _this274.publicGetTickerId(request);
            }).then(function (_resp) {
                response = _resp;
                ticker = response[0];

                return _this274.parseTicker(ticker, p);
            });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (Object.keys(query).length) url += '?' + this.urlencode(query);
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var coinmate = {

        'id': 'coinmate',
        'name': 'CoinMate',
        'countries': ['GB', 'CZ'], // UK, Czech Republic
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27811229-c1efb510-606c-11e7-9a36-84ba2ce412d8.jpg',
            'api': 'https://coinmate.io/api',
            'www': 'https://coinmate.io',
            'doc': ['http://docs.coinmate.apiary.io', 'https://coinmate.io/developers']
        },
        'api': {
            'public': {
                'get': ['orderBook', 'ticker', 'transactions']
            },
            'private': {
                'post': ['balances', 'bitcoinWithdrawal', 'bitcoinDepositAddresses', 'buyInstant', 'buyLimit', 'cancelOrder', 'cancelOrderWithInfo', 'createVoucher', 'openOrders', 'redeemVoucher', 'sellInstant', 'sellLimit', 'transactionHistory', 'unconfirmedBitcoinDeposits']
            }
        },
        'markets': {
            'BTC/EUR': { 'id': 'BTC_EUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'BTC/CZK': { 'id': 'BTC_CZK', 'symbol': 'BTC/CZK', 'base': 'BTC', 'quote': 'CZK' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                c,
                currency,
                account,
                _this275 = this,
                _arguments260 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments260.length > 0 && _arguments260[0] !== undefined ? _arguments260[0] : {};
                return _this275.privatePostBalances();
            }).then(function (_resp) {
                response = _resp;
                balances = response['data'];
                result = { 'info': balances };

                for (c = 0; c < _this275.currencies.length; c++) {
                    currency = _this275.currencies[c];
                    account = _this275.account();

                    if (currency in balances) {
                        account['free'] = balances[currency]['available'];
                        account['used'] = balances[currency]['reserved'];
                        account['total'] = balances[currency]['balance'];
                    }
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this276 = this,
                _arguments261 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments261.length > 1 && _arguments261[1] !== undefined ? _arguments261[1] : {};
                return _this276.publicGetOrderBook(_this276.extend({
                    'currencyPair': _this276.marketId(market),
                    'groupByPriceLimit': 'False'
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['data'];
                timestamp = orderbook['timestamp'] * 1000;
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this276.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order['price'];
                        amount = order['amount'];

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                timestamp,
                _this277 = this;

            return Promise.resolve().then(function () {
                return _this277.publicGetTicker({
                    'currencyPair': _this277.marketId(market)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['data'];
                timestamp = ticker['timestamp'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this277.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['amount']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this278 = this,
                _arguments263 = arguments;

            params = _arguments263.length > 1 && _arguments263[1] !== undefined ? _arguments263[1] : {};

            return _this278.publicGetTransactions(_this278.extend({
                'currencyPair': _this278.marketId(market),
                'minutesIntoHistory': 10
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                _this279 = this,
                _arguments264 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments264.length > 4 && _arguments264[4] !== undefined ? _arguments264[4] : undefined;
                params = _arguments264.length > 5 && _arguments264[5] !== undefined ? _arguments264[5] : {};
                method = 'privatePost' + _this279.capitalize(side);
                order = {
                    'currencyPair': _this279.marketId(market)
                };

                if (type == 'market') {
                    if (side == 'buy') {
                        order['total'] = amount; // amount in fiat
                    } else {
                        order['amount'] = amount;
                    } // amount in fiat
                    method += 'Instant';
                } else {
                    order['amount'] = amount; // amount in crypto
                    order['price'] = price;
                    method += _this279.capitalize(type);
                }
                return _this279[method](self.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['data'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this280 = this;

            return _this280.privatePostCancelOrder({ 'orderId': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                auth,
                signature,
                response,
                _this281 = this,
                _arguments266 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments266.length > 1 && _arguments266[1] !== undefined ? _arguments266[1] : 'public';
                method = _arguments266.length > 2 && _arguments266[2] !== undefined ? _arguments266[2] : 'GET';
                params = _arguments266.length > 3 && _arguments266[3] !== undefined ? _arguments266[3] : {};
                headers = _arguments266.length > 4 && _arguments266[4] !== undefined ? _arguments266[4] : undefined;
                body = _arguments266.length > 5 && _arguments266[5] !== undefined ? _arguments266[5] : undefined;
                url = _this281.urls['api'] + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this281.urlencode(params);
                    }
                } else {
                    if (!_this281.uid) {
                        throw new AuthenticationError(_this281.id + ' requires `' + _this281.id + '.uid` property for authentication');
                    }nonce = _this281.nonce().toString();
                    auth = nonce + _this281.uid + _this281.apiKey;
                    signature = _this281.hmac(_this281.encode(auth), _this281.encode(_this281.secret));

                    body = _this281.urlencode(_this281.extend({
                        'clientId': _this281.uid,
                        'nonce': nonce,
                        'publicKey': _this281.apiKey,
                        'signature': signature.toUpperCase()
                    }, params));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    };
                }
                return _this281.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    if (response['error']) {
                        throw new ExchangeError(_this281.id + ' ' + _this281.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var coinsecure = {

        'id': 'coinsecure',
        'name': 'Coinsecure',
        'countries': 'IN', // India
        'rateLimit': 1000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766472-9cbd200a-5ed9-11e7-9551-2267ad7bac08.jpg',
            'api': 'https://api.coinsecure.in',
            'www': 'https://coinsecure.in',
            'doc': ['https://api.coinsecure.in', 'https://github.com/coinsecure/plugins']
        },
        'api': {
            'public': {
                'get': ['bitcoin/search/confirmation/{txid}', 'exchange/ask/low', 'exchange/ask/orders', 'exchange/bid/high', 'exchange/bid/orders', 'exchange/lastTrade', 'exchange/max24Hr', 'exchange/min24Hr', 'exchange/ticker', 'exchange/trades']
            },
            'private': {
                'get': ['mfa/authy/call', 'mfa/authy/sms', 'netki/search/{netkiName}', 'user/bank/otp/{number}', 'user/kyc/otp/{number}', 'user/profile/phone/otp/{number}', 'user/wallet/coin/address/{id}', 'user/wallet/coin/deposit/confirmed/all', 'user/wallet/coin/deposit/confirmed/{id}', 'user/wallet/coin/deposit/unconfirmed/all', 'user/wallet/coin/deposit/unconfirmed/{id}', 'user/wallet/coin/wallets', 'user/exchange/bank/fiat/accounts', 'user/exchange/bank/fiat/balance/available', 'user/exchange/bank/fiat/balance/pending', 'user/exchange/bank/fiat/balance/total', 'user/exchange/bank/fiat/deposit/cancelled', 'user/exchange/bank/fiat/deposit/unverified', 'user/exchange/bank/fiat/deposit/verified', 'user/exchange/bank/fiat/withdraw/cancelled', 'user/exchange/bank/fiat/withdraw/completed', 'user/exchange/bank/fiat/withdraw/unverified', 'user/exchange/bank/fiat/withdraw/verified', 'user/exchange/ask/cancelled', 'user/exchange/ask/completed', 'user/exchange/ask/pending', 'user/exchange/bid/cancelled', 'user/exchange/bid/completed', 'user/exchange/bid/pending', 'user/exchange/bank/coin/addresses', 'user/exchange/bank/coin/balance/available', 'user/exchange/bank/coin/balance/pending', 'user/exchange/bank/coin/balance/total', 'user/exchange/bank/coin/deposit/cancelled', 'user/exchange/bank/coin/deposit/unverified', 'user/exchange/bank/coin/deposit/verified', 'user/exchange/bank/coin/withdraw/cancelled', 'user/exchange/bank/coin/withdraw/completed', 'user/exchange/bank/coin/withdraw/unverified', 'user/exchange/bank/coin/withdraw/verified', 'user/exchange/bank/summary', 'user/exchange/coin/fee', 'user/exchange/fiat/fee', 'user/exchange/kycs', 'user/exchange/referral/coin/paid', 'user/exchange/referral/coin/successful', 'user/exchange/referral/fiat/paid', 'user/exchange/referrals', 'user/exchange/trade/summary', 'user/login/token/{token}', 'user/summary', 'user/wallet/summary', 'wallet/coin/withdraw/cancelled', 'wallet/coin/withdraw/completed', 'wallet/coin/withdraw/unverified', 'wallet/coin/withdraw/verified'],
                'post': ['login', 'login/initiate', 'login/password/forgot', 'mfa/authy/initiate', 'mfa/ga/initiate', 'signup', 'user/netki/update', 'user/profile/image/update', 'user/exchange/bank/coin/withdraw/initiate', 'user/exchange/bank/coin/withdraw/newVerifycode', 'user/exchange/bank/fiat/withdraw/initiate', 'user/exchange/bank/fiat/withdraw/newVerifycode', 'user/password/change', 'user/password/reset', 'user/wallet/coin/withdraw/initiate', 'wallet/coin/withdraw/newVerifycode'],
                'put': ['signup/verify/{token}', 'user/exchange/kyc', 'user/exchange/bank/fiat/deposit/new', 'user/exchange/ask/new', 'user/exchange/bid/new', 'user/exchange/instant/buy', 'user/exchange/instant/sell', 'user/exchange/bank/coin/withdraw/verify', 'user/exchange/bank/fiat/account/new', 'user/exchange/bank/fiat/withdraw/verify', 'user/mfa/authy/initiate/enable', 'user/mfa/ga/initiate/enable', 'user/netki/create', 'user/profile/phone/new', 'user/wallet/coin/address/new', 'user/wallet/coin/new', 'user/wallet/coin/withdraw/sendToExchange', 'user/wallet/coin/withdraw/verify'],
                'delete': ['user/gcm/{code}', 'user/logout', 'user/exchange/bank/coin/withdraw/unverified/cancel/{withdrawID}', 'user/exchange/bank/fiat/deposit/cancel/{depositID}', 'user/exchange/ask/cancel/{orderID}', 'user/exchange/bid/cancel/{orderID}', 'user/exchange/bank/fiat/withdraw/unverified/cancel/{withdrawID}', 'user/mfa/authy/disable/{code}', 'user/mfa/ga/disable/{code}', 'user/profile/phone/delete', 'user/profile/image/delete/{netkiName}', 'user/wallet/coin/withdraw/unverified/cancel/{withdrawID}']
            }
        },
        'markets': {
            'BTC/INR': { 'id': 'BTC/INR', 'symbol': 'BTC/INR', 'base': 'BTC', 'quote': 'INR' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                response,
                balance,
                coin,
                fiat,
                result,
                _this282 = this,
                _arguments267 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments267.length > 0 && _arguments267[0] !== undefined ? _arguments267[0] : {};
                return _this282.privateGetUserExchangeBankSummary();
            }).then(function (_resp) {
                response = _resp;
                balance = response['message'];
                coin = {
                    'free': balance['availableCoinBalance'],
                    'used': balance['pendingCoinBalance'],
                    'total': balance['totalCoinBalance']
                };
                fiat = {
                    'free': balance['availableFiatBalance'],
                    'used': balance['pendingFiatBalance'],
                    'total': balance['totalFiatBalance']
                };
                result = {
                    'info': balance,
                    'BTC': coin,
                    'INR': fiat
                };

                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                bids,
                asks,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this283 = this,
                _arguments268 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments268.length > 1 && _arguments268[1] !== undefined ? _arguments268[1] : {};
                return _this283.publicGetExchangeBidOrders(params);
            }).then(function (_resp) {
                bids = _resp;
                return _this283.publicGetExchangeAskOrders(params);
            }).then(function (_resp) {
                asks = _resp;
                orderbook = {
                    'bids': bids['message'],
                    'asks': asks['message']
                };
                timestamp = _this283.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this283.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order['rate'];
                        amount = order['vol'];

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                timestamp,
                _this284 = this;

            return Promise.resolve().then(function () {
                return _this284.publicGetExchangeTicker();
            }).then(function (_resp) {
                response = _resp;
                ticker = response['message'];
                timestamp = ticker['timestamp'];

                return {
                    'timestamp': timestamp,
                    'datetime': _this284.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['lastPrice']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['coinvolume']),
                    'quoteVolume': parseFloat(ticker['fiatvolume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this285 = this,
                _arguments270 = arguments;

            params = _arguments270.length > 1 && _arguments270[1] !== undefined ? _arguments270[1] : {};

            return _this285.publicGetExchangeTrades(params);
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                direction,
                response,
                _this286 = this,
                _arguments271 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments271.length > 4 && _arguments271[4] !== undefined ? _arguments271[4] : undefined;
                params = _arguments271.length > 5 && _arguments271[5] !== undefined ? _arguments271[5] : {};
                method = 'privatePutUserExchange';
                order = {};

                if (type == 'market') {
                    method += 'Instant' + _this286.capitalize(side);
                    if (side == 'buy') {
                        order['maxFiat'] = amount;
                    } else {
                        order['maxVol'] = amount;
                    }
                } else {
                    direction = side == 'buy' ? 'Bid' : 'Ask';

                    method += direction + 'New';
                    order['rate'] = price;
                    order['vol'] = amount;
                }
                return _this286[method](self.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['message']['orderID']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var method,
                _this287 = this;

            throw new ExchangeError(_this287.id + ' cancelOrder () is not fully implemented yet');
            method = 'privateDeleteUserExchangeAskCancelOrderId'; // TODO fixme, have to specify order side here

            return _this287[method]({ 'orderID': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                response,
                _test11,
                _this288 = this,
                _arguments273 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments273.length > 1 && _arguments273[1] !== undefined ? _arguments273[1] : 'public';
                method = _arguments273.length > 2 && _arguments273[2] !== undefined ? _arguments273[2] : 'GET';
                params = _arguments273.length > 3 && _arguments273[3] !== undefined ? _arguments273[3] : {};
                headers = _arguments273.length > 4 && _arguments273[4] !== undefined ? _arguments273[4] : undefined;
                body = _arguments273.length > 5 && _arguments273[5] !== undefined ? _arguments273[5] : undefined;
                url = _this288.urls['api'] + '/' + _this288.version + '/' + _this288.implodeParams(path, params);
                query = _this288.omit(params, _this288.extractParams(path));

                if (api == 'private') {
                    headers = { 'Authorization': _this288.apiKey };
                    if (Object.keys(query).length) {
                        body = _this288.json(query);
                        headers['Content-Type'] = 'application/json';
                    }
                }
                return _this288.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test11 = 'success' in response;

                if (_test11 && response['success']) {
                    return response;
                } else {
                    throw new ExchangeError(_this288.id + ' ' + _this288.json(response));
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var coinspot = {

        'id': 'coinspot',
        'name': 'CoinSpot',
        'countries': 'AU', // Australia
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28208429-3cacdf9a-6896-11e7-854e-4c79a772a30f.jpg',
            'api': {
                'public': 'https://www.coinspot.com.au/pubapi',
                'private': 'https://www.coinspot.com.au/api'
            },
            'www': 'https://www.coinspot.com.au',
            'doc': 'https://www.coinspot.com.au/api'
        },
        'api': {
            'public': {
                'get': ['latest']
            },
            'private': {
                'post': ['orders', 'orders/history', 'my/coin/deposit', 'my/coin/send', 'quote/buy', 'quote/sell', 'my/balances', 'my/orders', 'my/buy', 'my/sell', 'my/buy/cancel', 'my/sell/cancel']
            }
        },
        'markets': {
            'BTC/AUD': { 'id': 'BTC', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD' },
            'LTC/AUD': { 'id': 'LTC', 'symbol': 'LTC/AUD', 'base': 'LTC', 'quote': 'AUD' },
            'DOGE/AUD': { 'id': 'DOGE', 'symbol': 'DOGE/AUD', 'base': 'DOGE', 'quote': 'AUD' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                response,
                result,
                balances,
                currencies,
                c,
                currency,
                uppercase,
                account,
                _this289 = this,
                _arguments274 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments274.length > 0 && _arguments274[0] !== undefined ? _arguments274[0] : {};
                return _this289.privatePostMyBalances();
            }).then(function (_resp) {
                response = _resp;
                result = { 'info': response };

                if ('balance' in response) {
                    balances = response['balance'];
                    currencies = Object.keys(balances);

                    for (c = 0; c < currencies.length; c++) {
                        currency = currencies[c];
                        uppercase = currency.toUpperCase();
                        account = {
                            'free': balances[currency],
                            'used': 0.0,
                            'total': balances[currency]
                        };

                        if (uppercase == 'DRK') {
                            uppercase = 'DASH';
                        }result[uppercase] = account;
                    }
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this290 = this,
                _arguments275 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments275.length > 1 && _arguments275[1] !== undefined ? _arguments275[1] : {};
                p = _this290.market(market);
                return _this290.privatePostOrders(_this290.extend({
                    'cointype': p['id']
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this290.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this290.iso8601(timestamp)
                };
                sides = { 'bids': 'buyorders', 'asks': 'sellorders' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['rate']);
                        amount = parseFloat(order['amount']);

                        result[key].push([price, amount]);
                    }
                }
                result['bids'] = _this290.sortBy(result['bids'], 0, true);
                result['asks'] = _this290.sortBy(result['asks'], 0);
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                id,
                ticker,
                timestamp,
                _this291 = this;

            return Promise.resolve().then(function () {
                return _this291.publicGetLatest();
            }).then(function (_resp) {
                response = _resp;
                id = _this291.marketId(market);

                id = id.toLowerCase();
                ticker = response['prices'][id];
                timestamp = _this291.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this291.iso8601(timestamp),
                    'high': undefined,
                    'low': undefined,
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': undefined,
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this292 = this,
                _arguments277 = arguments;

            params = _arguments277.length > 1 && _arguments277[1] !== undefined ? _arguments277[1] : {};

            return _this292.privatePostOrdersHistory(_this292.extend({
                'cointype': _this292.marketId(market)
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                _this293 = this,
                _arguments278 = arguments;

            price = _arguments278.length > 4 && _arguments278[4] !== undefined ? _arguments278[4] : undefined;
            params = _arguments278.length > 5 && _arguments278[5] !== undefined ? _arguments278[5] : {};
            method = 'privatePostMy' + _this293.capitalize(side);

            if (type == 'market') {
                throw new ExchangeError(_this293.id + ' allows limit orders only');
            }order = {
                'cointype': _this293.marketId(market),
                'amount': amount,
                'rate': price
            };

            return _this293[method](_this293.extend(order, params));
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                method,
                _this294 = this,
                _arguments279 = arguments;

            params = _arguments279.length > 1 && _arguments279[1] !== undefined ? _arguments279[1] : {};

            throw new ExchangeError(_this294.id + ' cancelOrder () is not fully implemented yet');
            method = 'privatePostMyBuy';

            return _this294[method]({ 'id': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                _this295 = this,
                _arguments280 = arguments;

            api = _arguments280.length > 1 && _arguments280[1] !== undefined ? _arguments280[1] : 'public';
            method = _arguments280.length > 2 && _arguments280[2] !== undefined ? _arguments280[2] : 'GET';
            params = _arguments280.length > 3 && _arguments280[3] !== undefined ? _arguments280[3] : {};
            headers = _arguments280.length > 4 && _arguments280[4] !== undefined ? _arguments280[4] : undefined;
            body = _arguments280.length > 5 && _arguments280[5] !== undefined ? _arguments280[5] : undefined;

            if (!_this295.apiKey) {
                throw new AuthenticationError(_this295.id + ' requires apiKey for all requests');
            }url = _this295.urls['api'][api] + '/' + path;

            if (api == 'private') {
                nonce = _this295.nonce();

                body = _this295.json(_this295.extend({ 'nonce': nonce }, params));
                headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': body.length,
                    'key': _this295.apiKey,
                    'sign': _this295.hmac(_this295.encode(body), _this295.encode(_this295.secret), 'sha512')
                };
            }
            return _this295.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var cryptopia = {

        'id': 'cryptopia',
        'name': 'Cryptopia',
        'rateLimit': 1500,
        'countries': 'NZ', // New Zealand
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/29484394-7b4ea6e2-84c6-11e7-83e5-1fccf4b2dc81.jpg',
            'api': 'https://www.cryptopia.co.nz/api',
            'www': 'https://www.cryptopia.co.nz',
            'doc': ['https://www.cryptopia.co.nz/Forum/Thread/255', 'https://www.cryptopia.co.nz/Forum/Thread/256']
        },
        'api': {
            'public': {
                'get': ['GetCurrencies', 'GetTradePairs', 'GetMarkets', 'GetMarkets/{id}', 'GetMarkets/{hours}', 'GetMarkets/{id}/{hours}', 'GetMarket/{id}', 'GetMarket/{id}/{hours}', 'GetMarketHistory/{id}', 'GetMarketHistory/{id}/{hours}', 'GetMarketOrders/{id}', 'GetMarketOrders/{id}/{count}', 'GetMarketOrderGroups/{ids}/{count}']
            },
            'private': {
                'post': ['CancelTrade', 'GetBalance', 'GetDepositAddress', 'GetOpenOrders', 'GetTradeHistory', 'GetTransactions', 'SubmitTip', 'SubmitTrade', 'SubmitTransfer', 'SubmitWithdraw']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var response,
                result,
                markets,
                i,
                market,
                id,
                symbol,
                _symbol$split7,
                _symbol$split8,
                base,
                quote,
                _this296 = this;

            return Promise.resolve().then(function () {
                return _this296.publicGetMarkets();
            }).then(function (_resp) {
                response = _resp;
                result = [];
                markets = response['Data'];

                for (i = 0; i < markets.length; i++) {
                    market = markets[i];
                    id = market['TradePairId'];
                    symbol = market['Label'];
                    _symbol$split7 = symbol.split('/');
                    _symbol$split8 = _slicedToArray(_symbol$split7, 2);
                    base = _symbol$split8[0];
                    quote = _symbol$split8[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this297 = this,
                _arguments282 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments282.length > 1 && _arguments282[1] !== undefined ? _arguments282[1] : {};
                return _this297.loadMarkets();
            }).then(function () {
                return _this297.publicGetMarketOrdersId(_this297.extend({
                    'id': _this297.marketId(market)
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['Data'];
                timestamp = _this297.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this297.iso8601(timestamp)
                };
                sides = { 'bids': 'Buy', 'asks': 'Sell' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['Price']);
                        amount = parseFloat(order['Total']);

                        result[key].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            return {
                'info': ticker,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['High']),
                'low': parseFloat(ticker['Low']),
                'bid': parseFloat(ticker['BidPrice']),
                'ask': parseFloat(ticker['AskPrice']),
                'vwap': undefined,
                'open': parseFloat(ticker['Open']),
                'close': parseFloat(ticker['Close']),
                'first': undefined,
                'last': parseFloat(ticker['LastPrice']),
                'change': parseFloat(ticker['Change']),
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['BaseVolume']),
                'quoteVolume': parseFloat(ticker['Volume'])
            };
        },
        fetchTicker: function fetchTicker(market) {
            var m,
                response,
                ticker,
                _this298 = this;

            return Promise.resolve().then(function () {
                return _this298.loadMarkets();
            }).then(function () {
                m = _this298.market(market);
                return _this298.publicGetMarketId({
                    'id': m['id']
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['Data'];

                return _this298.parseTicker(ticker, m);
            });
        },
        fetchTickers: function fetchTickers() {
            var response,
                result,
                tickers,
                i,
                ticker,
                id,
                market,
                symbol,
                _this299 = this;

            return Promise.resolve().then(function () {
                return _this299.loadMarkets();
            }).then(function () {
                return _this299.publicGetMarkets();
            }).then(function (_resp) {
                response = _resp;
                result = {};
                tickers = response['Data'];

                for (i = 0; i < tickers.length; i++) {
                    ticker = tickers[i];
                    id = ticker['TradePairId'];
                    market = _this299.markets_by_id[id];
                    symbol = market['symbol'];

                    result[symbol] = _this299.parseTicker(ticker, market);
                }
                return result;
            });
        },
        parseTrade: function parseTrade(trade, market) {
            var timestamp = trade['Timestamp'] * 1000;
            return {
                'id': undefined,
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['Type'].toLowerCase(),
                'price': trade['Price'],
                'amount': trade['Amount']
            };
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                m,
                response,
                trades,
                _this300 = this,
                _arguments285 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments285.length > 1 && _arguments285[1] !== undefined ? _arguments285[1] : {};
                return _this300.loadMarkets();
            }).then(function () {
                m = _this300.market(market);
                return _this300.publicGetMarketHistoryIdHours(_this300.extend({
                    'id': m['id'],
                    'hours': 24 // default
                }, params));
            }).then(function (_resp) {
                response = _resp;
                trades = response['Data'];

                return _this300.parseTrades(trades, m);
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                i,
                balance,
                currency,
                account,
                _this301 = this,
                _arguments286 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments286.length > 0 && _arguments286[0] !== undefined ? _arguments286[0] : {};
                return _this301.loadMarkets();
            }).then(function () {
                return _this301.privatePostGetBalance();
            }).then(function (_resp) {
                response = _resp;
                balances = response['Data'];
                result = { 'info': response };

                for (i = 0; i < balances.length; i++) {
                    balance = balances[i];
                    currency = balance['Symbol'];
                    account = {
                        'free': balance['Available'],
                        'used': 0.0,
                        'total': balance['Total']
                    };

                    account['used'] = account['total'] - account['free'];
                    result[currency] = account;
                }
                return result;
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this302 = this,
                _arguments287 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments287.length > 4 && _arguments287[4] !== undefined ? _arguments287[4] : undefined;
                params = _arguments287.length > 5 && _arguments287[5] !== undefined ? _arguments287[5] : {};
                return _this302.loadMarkets();
            }).then(function () {
                order = {
                    'Market': _this302.marketId(market),
                    'Type': _this302.capitalize(side),
                    'Rate': price,
                    'Amount': amount
                };
                return _this302.privatePostSubmitTrade(_this302.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['Data']['OrderId'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this303 = this;

            return Promise.resolve().then(function () {
                return _this303.loadMarkets();
            }).then(function () {
                return _this303.privatePostCancelTrade({
                    'Type': 'Trade',
                    'OrderId': id
                });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                _hash,
                secret,
                uri,
                lowercase,
                payload,
                signature,
                auth,
                response,
                _test12,
                _test13,
                _this304 = this,
                _arguments289 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments289.length > 1 && _arguments289[1] !== undefined ? _arguments289[1] : 'public';
                method = _arguments289.length > 2 && _arguments289[2] !== undefined ? _arguments289[2] : 'GET';
                params = _arguments289.length > 3 && _arguments289[3] !== undefined ? _arguments289[3] : {};
                headers = _arguments289.length > 4 && _arguments289[4] !== undefined ? _arguments289[4] : undefined;
                body = _arguments289.length > 5 && _arguments289[5] !== undefined ? _arguments289[5] : undefined;
                url = _this304.urls['api'] + '/' + _this304.implodeParams(path, params);
                query = _this304.omit(params, _this304.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this304.urlencode(query);
                    }
                } else {
                    nonce = _this304.nonce().toString();

                    body = _this304.json(query);
                    _hash = _this304.hash(_this304.encode(body), 'md5', 'base64');
                    secret = _this304.base64ToBinary(_this304.secret);
                    uri = _this304.encodeURIComponent(url);
                    lowercase = uri.toLowerCase();
                    payload = _this304.apiKey + method + lowercase + nonce + _this304.binaryToString(_hash);
                    signature = _this304.hmac(_this304.encode(payload), secret, 'sha256', 'base64');
                    auth = 'amx ' + _this304.apiKey + ':' + _this304.binaryToString(signature) + ':' + nonce;

                    headers = {
                        'Content-Type': 'application/json',
                        'Content-Length': body.length,
                        'Authorization': auth
                    };
                }
                return _this304.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test12 = response;
                _test13 = _test12 && 'Success' in response;

                if (_test13 && response['Success']) {
                    return response;
                } else {
                    throw new ExchangeError(_this304.id + ' ' + _this304.json(response));
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var dsx = {

        'id': 'dsx',
        'name': 'DSX',
        'countries': 'UK',
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27990275-1413158a-645a-11e7-931c-94717f7510e3.jpg',
            'api': {
                'mapi': 'https://dsx.uk/mapi', // market data
                'tapi': 'https://dsx.uk/tapi', // trading
                'dwapi': 'https://dsx.uk/dwapi' // deposit/withdraw
            },
            'www': 'https://dsx.uk',
            'doc': ['https://api.dsx.uk', 'https://dsx.uk/api_docs/public', 'https://dsx.uk/api_docs/private', '']
        },
        'api': {
            'mapi': { // market data (public)
                'get': ['barsFromMoment/{id}/{period}/{start}', // empty reply :\
                'depth/{id}', 'info', 'lastBars/{id}/{period}/{amount}', // period is (m, h or d)
                'periodBars/{id}/{period}/{start}/{end}', 'ticker/{id}', 'trades/{id}']
            },
            'tapi': { // trading (private)
                'post': ['getInfo', 'TransHistory', 'TradeHistory', 'OrderHistory', 'ActiveOrders', 'Trade', 'CancelOrder']
            },
            'dwapi': { // deposit / withdraw (private)
                'post': ['getCryptoDepositAddress', 'cryptoWithdraw', 'fiatWithdraw', 'getTransactionStatus', 'getTransactions']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var response,
                keys,
                result,
                p,
                id,
                market,
                base,
                quote,
                symbol,
                _this305 = this;

            return Promise.resolve().then(function () {
                return _this305.mapiGetInfo();
            }).then(function (_resp) {
                response = _resp;
                keys = Object.keys(response['pairs']);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    market = response['pairs'][id];
                    base = id.slice(0, 3);
                    quote = id.slice(3, 6);

                    base = base.toUpperCase();
                    quote = quote.toUpperCase();
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                currencies,
                c,
                currency,
                account,
                _this306 = this,
                _arguments291 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments291.length > 0 && _arguments291[0] !== undefined ? _arguments291[0] : {};
                return _this306.loadMarkets();
            }).then(function () {
                return _this306.tapiPostGetInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['return'];
                result = { 'info': balances };
                currencies = Object.keys(balances['total']);

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    account = {
                        'free': balances['funds'][currency],
                        'used': 0.0,
                        'total': balances['total'][currency]
                    };

                    account['used'] = account['total'] - account['free'];
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this307 = this,
                _arguments292 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments292.length > 1 && _arguments292[1] !== undefined ? _arguments292[1] : {};
                return _this307.loadMarkets();
            }).then(function () {
                p = _this307.market(market);
                return _this307.mapiGetDepthId(_this307.extend({
                    'id': p['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response[p['id']];
                timestamp = _this307.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this307.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order[0];
                        amount = order[1];

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                response,
                ticker,
                timestamp,
                _this308 = this;

            return Promise.resolve().then(function () {
                return _this308.loadMarkets();
            }).then(function () {
                p = _this308.market(market);
                return _this308.mapiGetTickerId({
                    'id': p['id']
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response[p['id']];
                timestamp = ticker['updated'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this308.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['avg']),
                    'baseVolume': parseFloat(ticker['vol']),
                    'quoteVolume': parseFloat(ticker['vol_cur']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this309 = this,
                _arguments294 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments294.length > 1 && _arguments294[1] !== undefined ? _arguments294[1] : {};
                return _this309.loadMarkets();
            }).then(function () {
                return _this309.mapiGetTradesId(_this309.extend({
                    'id': _this309.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this310 = this,
                _arguments295 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments295.length > 4 && _arguments295[4] !== undefined ? _arguments295[4] : undefined;
                params = _arguments295.length > 5 && _arguments295[5] !== undefined ? _arguments295[5] : {};
                return _this310.loadMarkets();
            }).then(function () {
                if (type == 'market') {
                    throw new ExchangeError(_this310.id + ' allows limit orders only');
                }order = {
                    'pair': _this310.marketId(market),
                    'type': side,
                    'rate': price,
                    'amount': amount
                };
                return _this310.tapiPostTrade(_this310.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['return']['orderId'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this311 = this;

            return Promise.resolve().then(function () {
                return _this311.loadMarkets();
            }).then(function () {
                return _this311.tapiPostCancelOrder({ 'orderId': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                _method,
                response,
                _test14,
                _this312 = this,
                _arguments297 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments297.length > 1 && _arguments297[1] !== undefined ? _arguments297[1] : 'mapi';
                method = _arguments297.length > 2 && _arguments297[2] !== undefined ? _arguments297[2] : 'GET';
                params = _arguments297.length > 3 && _arguments297[3] !== undefined ? _arguments297[3] : {};
                headers = _arguments297.length > 4 && _arguments297[4] !== undefined ? _arguments297[4] : undefined;
                body = _arguments297.length > 5 && _arguments297[5] !== undefined ? _arguments297[5] : undefined;
                url = _this312.urls['api'][api];

                if (api == 'mapi' || api == 'dwapi') {
                    url += '/' + _this312.implodeParams(path, params);
                }query = _this312.omit(params, _this312.extractParams(path));

                if (api == 'mapi') {
                    if (Object.keys(query).length) {
                        url += '?' + _this312.urlencode(query);
                    }
                } else {
                    nonce = _this312.nonce();
                    _method = path;

                    body = _this312.urlencode(_this312.extend({
                        'method': path,
                        'nonce': nonce
                    }, query));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length,
                        'Key': _this312.apiKey,
                        'Sign': _this312.hmac(_this312.encode(body), _this312.encode(_this312.secret), 'sha512', 'base64')
                    };
                }
                return _this312.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if (api == 'mapi') {
                    return response;
                } else {
                    _test14 = 'success' in response;

                    if (_test14 && response['success']) {
                        return response;
                    } else {
                        throw new ExchangeError(_this312.id + ' ' + _this312.json(response));
                    }
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var exmo = {

        'id': 'exmo',
        'name': 'EXMO',
        'countries': ['ES', 'RU'], // Spain, Russia
        'rateLimit': 1000, // once every 350 ms ≈ 180 requests per minute ≈ 3 requests per second
        'version': 'v1',
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766491-1b0ea956-5eda-11e7-9225-40d67b481b8d.jpg',
            'api': 'https://api.exmo.com',
            'www': 'https://exmo.me',
            'doc': ['https://exmo.me/ru/api_doc', 'https://github.com/exmo-dev/exmo_api_lib/tree/master/nodejs']
        },
        'api': {
            'public': {
                'get': ['currency', 'order_book', 'pair_settings', 'ticker', 'trades']
            },
            'private': {
                'post': ['user_info', 'order_create', 'order_cancel', 'user_open_orders', 'user_trades', 'user_cancelled_orders', 'order_trades', 'required_amount', 'deposit_address', 'withdraw_crypt', 'withdraw_get_txid', 'excode_create', 'excode_load', 'wallet_history']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                keys,
                result,
                p,
                id,
                market,
                symbol,
                _symbol$split9,
                _symbol$split10,
                base,
                quote,
                _this313 = this;

            return Promise.resolve().then(function () {
                return _this313.publicGetPairSettings();
            }).then(function (_resp) {
                markets = _resp;
                keys = Object.keys(markets);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    market = markets[id];
                    symbol = id.replace('_', '/');
                    _symbol$split9 = symbol.split('/');
                    _symbol$split10 = _slicedToArray(_symbol$split9, 2);
                    base = _symbol$split10[0];
                    quote = _symbol$split10[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                result,
                c,
                currency,
                account,
                _this314 = this,
                _arguments299 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments299.length > 0 && _arguments299[0] !== undefined ? _arguments299[0] : {};
                return _this314.loadMarkets();
            }).then(function () {
                return _this314.privatePostUserInfo();
            }).then(function (_resp) {
                response = _resp;
                result = { 'info': response };

                for (c = 0; c < _this314.currencies.length; c++) {
                    currency = _this314.currencies[c];
                    account = _this314.account();

                    if (currency in response['balances']) {
                        account['free'] = parseFloat(response['balances'][currency]);
                    }if (currency in response['reserved']) {
                        account['used'] = parseFloat(response['reserved'][currency]);
                    }account['total'] = _this314.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this315 = this,
                _arguments300 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments300.length > 1 && _arguments300[1] !== undefined ? _arguments300[1] : {};
                return _this315.loadMarkets();
            }).then(function () {
                p = _this315.market(market);
                return _this315.publicGetOrderBook(_this315.extend({
                    'pair': p['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response[p['id']];
                timestamp = _this315.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this315.iso8601(timestamp)
                };
                sides = { 'bids': 'bid', 'asks': 'ask' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[key].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = ticker['updated'] * 1000;
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['buy_price']),
                'ask': parseFloat(ticker['sell_price']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last_trade']),
                'change': undefined,
                'percentage': undefined,
                'average': parseFloat(ticker['avg']),
                'baseVolume': parseFloat(ticker['vol']),
                'quoteVolume': parseFloat(ticker['vol_curr']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var currency,
                response,
                result,
                ids,
                i,
                id,
                market,
                symbol,
                ticker,
                _this316 = this,
                _arguments301 = arguments;

            return Promise.resolve().then(function () {
                currency = _arguments301.length > 0 && _arguments301[0] !== undefined ? _arguments301[0] : 'USD';
                return _this316.loadMarkets();
            }).then(function () {
                return _this316.publicGetTicker();
            }).then(function (_resp) {
                response = _resp;
                result = {};
                ids = Object.keys(response);

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this316.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = response[id];

                    result[symbol] = _this316.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                p,
                _this317 = this;

            return Promise.resolve().then(function () {
                return _this317.loadMarkets();
            }).then(function () {
                return _this317.publicGetTicker();
            }).then(function (_resp) {
                response = _resp;
                p = _this317.market(market);

                return _this317.parseTicker(response[p['id']], p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this318 = this,
                _arguments303 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments303.length > 1 && _arguments303[1] !== undefined ? _arguments303[1] : {};
                return _this318.loadMarkets();
            }).then(function () {
                return _this318.publicGetTrades(_this318.extend({
                    'pair': _this318.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                prefix,
                order,
                response,
                _this319 = this,
                _arguments304 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments304.length > 4 && _arguments304[4] !== undefined ? _arguments304[4] : undefined;
                params = _arguments304.length > 5 && _arguments304[5] !== undefined ? _arguments304[5] : {};
                return _this319.loadMarkets();
            }).then(function () {
                prefix = '';

                if (type == 'market') {
                    prefix = 'market_';
                }order = {
                    'pair': _this319.marketId(market),
                    'quantity': amount,
                    'price': price || 0,
                    'type': prefix + side
                };
                return _this319.privatePostOrderCreate(_this319.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this320 = this;

            return Promise.resolve().then(function () {
                return _this320.loadMarkets();
            }).then(function () {
                return _this320.privatePostOrderCancel({ 'order_id': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                response,
                _test15,
                _this321 = this,
                _arguments306 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments306.length > 1 && _arguments306[1] !== undefined ? _arguments306[1] : 'public';
                method = _arguments306.length > 2 && _arguments306[2] !== undefined ? _arguments306[2] : 'GET';
                params = _arguments306.length > 3 && _arguments306[3] !== undefined ? _arguments306[3] : {};
                headers = _arguments306.length > 4 && _arguments306[4] !== undefined ? _arguments306[4] : undefined;
                body = _arguments306.length > 5 && _arguments306[5] !== undefined ? _arguments306[5] : undefined;
                url = _this321.urls['api'] + '/' + _this321.version + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this321.urlencode(params);
                    }
                } else {
                    nonce = _this321.nonce();

                    body = _this321.urlencode(_this321.extend({ 'nonce': nonce }, params));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length,
                        'Key': _this321.apiKey,
                        'Sign': _this321.hmac(_this321.encode(body), _this321.encode(_this321.secret), 'sha512')
                    };
                }
                return _this321.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test15 = 'result' in response;

                if (_test15 && response['result']) {
                    return response;
                } else {
                    if (_test15) {
                        throw new ExchangeError(_this321.id + ' ' + _this321.json(response));
                    }

                    return response;
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var flowbtc = {

        'id': 'flowbtc',
        'name': 'flowBTC',
        'countries': 'BR', // Brazil
        'version': 'v1',
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28162465-cd815d4c-67cf-11e7-8e57-438bea0523a2.jpg',
            'api': 'https://api.flowbtc.com:8400/ajax',
            'www': 'https://trader.flowbtc.com',
            'doc': 'http://www.flowbtc.com.br/api/'
        },
        'api': {
            'public': {
                'post': ['GetTicker', 'GetTrades', 'GetTradesByDate', 'GetOrderBook', 'GetProductPairs', 'GetProducts']
            },
            'private': {
                'post': ['CreateAccount', 'GetUserInfo', 'SetUserInfo', 'GetAccountInfo', 'GetAccountTrades', 'GetDepositAddresses', 'Withdraw', 'CreateOrder', 'ModifyOrder', 'CancelOrder', 'CancelAllOrders', 'GetAccountOpenOrders', 'GetOrderFee']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var response,
                markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this322 = this;

            return Promise.resolve().then(function () {
                return _this322.publicPostGetProductPairs();
            }).then(function (_resp) {
                response = _resp;
                markets = response['productPairs'];
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['name'];
                    base = market['product1Label'];
                    quote = market['product2Label'];
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                b,
                balance,
                currency,
                account,
                _this323 = this,
                _arguments308 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments308.length > 0 && _arguments308[0] !== undefined ? _arguments308[0] : {};
                return _this323.loadMarkets();
            }).then(function () {
                return _this323.privatePostGetAccountInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['currencies'];
                result = { 'info': response };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['name'];
                    account = {
                        'free': balance['balance'],
                        'used': balance['hold'],
                        'total': 0.0
                    };

                    account['total'] = _this323.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this324 = this,
                _arguments309 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments309.length > 1 && _arguments309[1] !== undefined ? _arguments309[1] : {};
                return _this324.loadMarkets();
            }).then(function () {
                p = _this324.market(market);
                return _this324.publicPostGetOrderBook(_this324.extend({
                    'productPair': p['id']
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this324.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this324.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['px']);
                        amount = parseFloat(order['qty']);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                timestamp,
                _this325 = this;

            return Promise.resolve().then(function () {
                return _this325.loadMarkets();
            }).then(function () {
                p = _this325.market(market);
                return _this325.publicPostGetTicker({
                    'productPair': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this325.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this325.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['volume24hr']),
                    'quoteVolume': parseFloat(ticker['volume24hrProduct2']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this326 = this,
                _arguments311 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments311.length > 1 && _arguments311[1] !== undefined ? _arguments311[1] : {};
                return _this326.loadMarkets();
            }).then(function () {
                return _this326.publicPostGetTrades(_this326.extend({
                    'ins': _this326.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                orderType,
                order,
                response,
                _this327 = this,
                _arguments312 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments312.length > 4 && _arguments312[4] !== undefined ? _arguments312[4] : undefined;
                params = _arguments312.length > 5 && _arguments312[5] !== undefined ? _arguments312[5] : {};
                return _this327.loadMarkets();
            }).then(function () {
                orderType = type == 'market' ? 1 : 0;
                order = {
                    'ins': _this327.marketId(market),
                    'side': side,
                    'orderType': orderType,
                    'qty': amount,
                    'px': price
                };
                return _this327.privatePostCreateOrder(_this327.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['serverOrderId']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this328 = this,
                _arguments313 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments313.length > 1 && _arguments313[1] !== undefined ? _arguments313[1] : {};
                return _this328.loadMarkets();
            }).then(function () {
                if ('ins' in params) {
                    return _this328.privatePostCancelOrder(_this328.extend({
                        'serverOrderId': id
                    }, params));
                } else {
                    throw new ExchangeError(_this328.id + ' requires `ins` symbol parameter for cancelling an order');
                }
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                auth,
                signature,
                response,
                _test16,
                _this329 = this,
                _arguments314 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments314.length > 1 && _arguments314[1] !== undefined ? _arguments314[1] : 'public';
                method = _arguments314.length > 2 && _arguments314[2] !== undefined ? _arguments314[2] : 'GET';
                params = _arguments314.length > 3 && _arguments314[3] !== undefined ? _arguments314[3] : {};
                headers = _arguments314.length > 4 && _arguments314[4] !== undefined ? _arguments314[4] : undefined;
                body = _arguments314.length > 5 && _arguments314[5] !== undefined ? _arguments314[5] : undefined;
                url = _this329.urls['api'] + '/' + _this329.version + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        body = _this329.json(params);
                    }
                } else {
                    if (!_this329.uid) {
                        throw new AuthenticationError(_this329.id + ' requires `' + _this329.id + '.uid` property for authentication');
                    }nonce = _this329.nonce();
                    auth = nonce.toString() + _this329.uid + _this329.apiKey;
                    signature = _this329.hmac(_this329.encode(auth), _this329.encode(_this329.secret));

                    body = _this329.json(_this329.extend({
                        'apiKey': _this329.apiKey,
                        'apiNonce': nonce,
                        'apiSig': signature.toUpperCase()
                    }, params));
                    headers = {
                        'Content-Type': 'application/json',
                        'Content-Length': body.length
                    };
                }
                return _this329.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test16 = 'isAccepted' in response;

                if (_test16 && response['isAccepted']) {
                    return response;
                } else {
                    throw new ExchangeError(_this329.id + ' ' + _this329.json(response));
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var foxbit = extend(blinktrade, {
        'id': 'foxbit',
        'name': 'FoxBit',
        'countries': 'BR',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27991413-11b40d42-647f-11e7-91ee-78ced874dd09.jpg',
            'api': {
                'public': 'https://api.blinktrade.com/api',
                'private': 'https://api.blinktrade.com/tapi'
            },
            'www': 'https://foxbit.exchange',
            'doc': 'https://blinktrade.com/docs'
        },
        'comment': 'Blinktrade API',
        'markets': {
            'BTC/BRL': { 'id': 'BTCBRL', 'symbol': 'BTC/BRL', 'base': 'BTC', 'quote': 'BRL', 'brokerId': 4, 'broker': 'FoxBit' }
        }
    });

    //-----------------------------------------------------------------------------

    var fyb = {

        'rateLimit': 1500,
        'api': {
            'public': {
                'get': ['ticker', 'tickerdetailed', 'orderbook', 'trades']
            },
            'private': {
                'post': ['test', 'getaccinfo', 'getpendingorders', 'getorderhistory', 'cancelpendingorder', 'placeorder', 'withdraw']
            }
        },

        fetchBalance: function fetchBalance() {
            var params,
                balance,
                btc,
                symbol,
                quote,
                lowercase,
                fiat,
                crypto,
                accounts,
                _this330 = this,
                _arguments315 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments315.length > 0 && _arguments315[0] !== undefined ? _arguments315[0] : {};
                return _this330.privatePostGetaccinfo();
            }).then(function (_resp) {
                balance = _resp;
                btc = parseFloat(balance['btcBal']);
                symbol = _this330.symbols[0];
                quote = _this330.markets[symbol]['quote'];
                lowercase = quote.toLowerCase() + 'Bal';
                fiat = parseFloat(balance[lowercase]);
                crypto = {
                    'free': btc,
                    'used': 0.0,
                    'total': btc
                };
                accounts = { 'BTC': crypto };

                accounts[quote] = {
                    'free': fiat,
                    'used': 0.0,
                    'total': fiat
                };
                accounts['info'] = balance;
                return accounts;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this331 = this,
                _arguments316 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments316.length > 1 && _arguments316[1] !== undefined ? _arguments316[1] : {};
                return _this331.publicGetOrderbook(params);
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this331.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this331.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                last,
                volume,
                _this332 = this;

            return Promise.resolve().then(function () {
                return _this332.publicGetTickerdetailed();
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this332.milliseconds();
                last = undefined;
                volume = undefined;

                if ('last' in ticker) {
                    last = parseFloat(ticker['last']);
                }if ('vol' in ticker) {
                    volume = parseFloat(ticker['vol']);
                }return {
                    'timestamp': timestamp,
                    'datetime': _this332.iso8601(timestamp),
                    'high': undefined,
                    'low': undefined,
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': last,
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': volume,
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this333 = this,
                _arguments318 = arguments;

            params = _arguments318.length > 1 && _arguments318[1] !== undefined ? _arguments318[1] : {};

            return _this333.publicGetTrades(params);
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                response,
                _this334 = this,
                _arguments319 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments319.length > 4 && _arguments319[4] !== undefined ? _arguments319[4] : undefined;
                params = _arguments319.length > 5 && _arguments319[5] !== undefined ? _arguments319[5] : {};
                return _this334.privatePostPlaceorder(_this334.extend({
                    'qty': amount,
                    'price': price,
                    'type': side[0].toUpperCase()
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['pending_oid']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this335 = this;

            return _this335.privatePostCancelpendingorder({ 'orderNo': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                response,
                _this336 = this,
                _arguments321 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments321.length > 1 && _arguments321[1] !== undefined ? _arguments321[1] : 'public';
                method = _arguments321.length > 2 && _arguments321[2] !== undefined ? _arguments321[2] : 'GET';
                params = _arguments321.length > 3 && _arguments321[3] !== undefined ? _arguments321[3] : {};
                headers = _arguments321.length > 4 && _arguments321[4] !== undefined ? _arguments321[4] : undefined;
                body = _arguments321.length > 5 && _arguments321[5] !== undefined ? _arguments321[5] : undefined;
                url = _this336.urls['api'] + '/' + path;

                if (api == 'public') {
                    url += '.json';
                } else {
                    nonce = _this336.nonce();

                    body = _this336.urlencode(_this336.extend({ 'timestamp': nonce }, params));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'key': _this336.apiKey,
                        'sig': _this336.hmac(_this336.encode(body), _this336.encode(_this336.secret), 'sha1')
                    };
                }
                return _this336.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if (api == 'private') {
                    if ('error' in response) {
                        if (response['error']) {
                            throw new ExchangeError(_this336.id + ' ' + _this336.json(response));
                        }
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var fybse = extend(fyb, {
        'id': 'fybse',
        'name': 'FYB-SE',
        'countries': 'SE', // Sweden
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766512-31019772-5edb-11e7-8241-2e675e6797f1.jpg',
            'api': 'https://www.fybse.se/api/SEK',
            'www': 'https://www.fybse.se',
            'doc': 'http://docs.fyb.apiary.io'
        },
        'markets': {
            'BTC/SEK': { 'id': 'SEK', 'symbol': 'BTC/SEK', 'base': 'BTC', 'quote': 'SEK' }
        }
    });

    //-----------------------------------------------------------------------------

    var fybsg = extend(fyb, {
        'id': 'fybsg',
        'name': 'FYB-SG',
        'countries': 'SG', // Singapore
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766513-3364d56a-5edb-11e7-9e6b-d5898bb89c81.jpg',
            'api': 'https://www.fybsg.com/api/SGD',
            'www': 'https://www.fybsg.com',
            'doc': 'http://docs.fyb.apiary.io'
        },
        'markets': {
            'BTC/SGD': { 'id': 'SGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD' }
        }
    });

    //-----------------------------------------------------------------------------

    var gatecoin = {

        'id': 'gatecoin',
        'name': 'Gatecoin',
        'rateLimit': 2000,
        'countries': 'HK', // Hong Kong
        'comment': 'a regulated/licensed exchange',
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28646817-508457f2-726c-11e7-9eeb-3528d2413a58.jpg',
            'api': 'https://api.gatecoin.com',
            'www': 'https://gatecoin.com',
            'doc': ['https://gatecoin.com/api', 'https://github.com/Gatecoin/RESTful-API-Implementation', 'https://api.gatecoin.com/swagger-ui/index.html']
        },
        'api': {
            'public': {
                'get': ['Public/ExchangeRate', // Get the exchange rates
                'Public/LiveTicker', // Get live ticker for all currency
                'Public/LiveTicker/{CurrencyPair}', // Get live ticker by currency
                'Public/LiveTickers', // Get live ticker for all currency
                'Public/MarketDepth/{CurrencyPair}', // Gets prices and market depth for the currency pair.
                'Public/NetworkStatistics/{DigiCurrency}', // Get the network status of a specific digital currency
                'Public/StatisticHistory/{DigiCurrency}/{Typeofdata}', // Get the historical data of a specific digital currency
                'Public/TickerHistory/{CurrencyPair}/{Timeframe}', // Get ticker history
                'Public/Transactions/{CurrencyPair}', // Gets recent transactions
                'Public/TransactionsHistory/{CurrencyPair}', // Gets all transactions
                'Reference/BusinessNatureList', // Get the business nature list.
                'Reference/Countries', // Get the country list.
                'Reference/Currencies', // Get the currency list.
                'Reference/CurrencyPairs', // Get the currency pair list.
                'Reference/CurrentStatusList', // Get the current status list.
                'Reference/IdentydocumentTypes', // Get the different types of identity documents possible.
                'Reference/IncomeRangeList', // Get the income range list.
                'Reference/IncomeSourceList', // Get the income source list.
                'Reference/VerificationLevelList', // Get the verif level list.
                'Stream/PublicChannel'],
                'post': ['Export/Transactions', // Request a export of all trades from based on currencypair, start date and end date
                'Ping', // Post a string, then get it back.
                'Public/Unsubscribe/{EmailCode}', // Lets the user unsubscribe from emails
                'RegisterUser']
            },
            'private': {
                'get': ['Account/CorporateData', // Get corporate account data
                'Account/DocumentAddress', // Check if residence proof uploaded
                'Account/DocumentCorporation', // Check if registered document uploaded
                'Account/DocumentID', // Check if ID document copy uploaded
                'Account/DocumentInformation', // Get Step3 Data
                'Account/Email', // Get user email
                'Account/FeeRate', // Get fee rate of logged in user
                'Account/Level', // Get verif level of logged in user
                'Account/PersonalInformation', // Get Step1 Data
                'Account/Phone', // Get user phone number
                'Account/Profile', // Get trader profile
                'Account/Questionnaire', // Fill the questionnaire
                'Account/Referral', // Get referral information
                'Account/ReferralCode', // Get the referral code of the logged in user
                'Account/ReferralNames', // Get names of referred traders
                'Account/ReferralReward', // Get referral reward information
                'Account/ReferredCode', // Get referral code
                'Account/ResidentInformation', // Get Step2 Data
                'Account/SecuritySettings', // Get verif details of logged in user
                'Account/User', // Get all user info
                'APIKey/APIKey', // Get API Key for logged in user
                'Auth/ConnectionHistory', // Gets connection history of logged in user
                'Balance/Balances', // Gets the available balance for each currency for the logged in account.
                'Balance/Balances/{Currency}', // Gets the available balance for s currency for the logged in account.
                'Balance/Deposits', // Get all account deposits, including wire and digital currency, of the logged in user
                'Balance/Withdrawals', // Get all account withdrawals, including wire and digital currency, of the logged in user
                'Bank/Accounts/{Currency}/{Location}', // Get internal bank account for deposit
                'Bank/Transactions', // Get all account transactions of the logged in user
                'Bank/UserAccounts', // Gets all the bank accounts related to the logged in user.
                'Bank/UserAccounts/{Currency}', // Gets all the bank accounts related to the logged in user.
                'ElectronicWallet/DepositWallets', // Gets all crypto currency addresses related deposits to the logged in user.
                'ElectronicWallet/DepositWallets/{DigiCurrency}', // Gets all crypto currency addresses related deposits to the logged in user by currency.
                'ElectronicWallet/Transactions', // Get all digital currency transactions of the logged in user
                'ElectronicWallet/Transactions/{DigiCurrency}', // Get all digital currency transactions of the logged in user
                'ElectronicWallet/UserWallets', // Gets all external digital currency addresses related to the logged in user.
                'ElectronicWallet/UserWallets/{DigiCurrency}', // Gets all external digital currency addresses related to the logged in user by currency.
                'Info/ReferenceCurrency', // Get user's reference currency
                'Info/ReferenceLanguage', // Get user's reference language
                'Notification/Messages', // Get from oldest unread + 3 read message to newest messages
                'Trade/Orders', // Gets open orders for the logged in trader.
                'Trade/Orders/{OrderID}', // Gets an order for the logged in trader.
                'Trade/StopOrders', // Gets all stop orders for the logged in trader. Max 1000 record.
                'Trade/StopOrdersHistory', // Gets all stop orders for the logged in trader. Max 1000 record.
                'Trade/Trades', // Gets all transactions of logged in user
                'Trade/UserTrades'],
                'post': ['Account/DocumentAddress', // Upload address proof document
                'Account/DocumentCorporation', // Upload registered document document
                'Account/DocumentID', // Upload ID document copy
                'Account/Email/RequestVerify', // Request for verification email
                'Account/Email/Verify', // Verification email
                'Account/GoogleAuth', // Enable google auth
                'Account/Level', // Request verif level of logged in user
                'Account/Questionnaire', // Fill the questionnaire
                'Account/Referral', // Post a referral email
                'APIKey/APIKey', // Create a new API key for logged in user
                'Auth/ChangePassword', // Change password.
                'Auth/ForgotPassword', // Request reset password
                'Auth/ForgotUserID', // Request user id
                'Auth/Login', // Trader session log in.
                'Auth/Logout', // Logout from the current session.
                'Auth/LogoutOtherSessions', // Logout other sessions.
                'Auth/ResetPassword', // Reset password
                'Bank/Transactions', // Request a transfer from the traders account of the logged in user. This is only available for bank account
                'Bank/UserAccounts', // Add an account the logged in user
                'ElectronicWallet/DepositWallets/{DigiCurrency}', // Add an digital currency addresses to the logged in user.
                'ElectronicWallet/Transactions/Deposits/{DigiCurrency}', // Get all internal digital currency transactions of the logged in user
                'ElectronicWallet/Transactions/Withdrawals/{DigiCurrency}', // Get all external digital currency transactions of the logged in user
                'ElectronicWallet/UserWallets/{DigiCurrency}', // Add an external digital currency addresses to the logged in user.
                'ElectronicWallet/Withdrawals/{DigiCurrency}', // Request a transfer from the traders account to an external address. This is only available for crypto currencies.
                'Notification/Messages', // Mark all as read
                'Notification/Messages/{ID}', // Mark as read
                'Trade/Orders', // Place an order at the exchange.
                'Trade/StopOrders'],
                'put': ['Account/CorporateData', // Update user company data for corporate account
                'Account/DocumentID', // Update ID document meta data
                'Account/DocumentInformation', // Update Step3 Data
                'Account/Email', // Update user email
                'Account/PersonalInformation', // Update Step1 Data
                'Account/Phone', // Update user phone number
                'Account/Questionnaire', // update the questionnaire
                'Account/ReferredCode', // Update referral code
                'Account/ResidentInformation', // Update Step2 Data
                'Account/SecuritySettings', // Update verif details of logged in user
                'Account/User', // Update all user info
                'Bank/UserAccounts', // Update the label of existing user bank accounnt
                'ElectronicWallet/DepositWallets/{DigiCurrency}/{AddressName}', // Update the name of an address
                'ElectronicWallet/UserWallets/{DigiCurrency}', // Update the name of an external address
                'Info/ReferenceCurrency', // User's reference currency
                'Info/ReferenceLanguage'],
                'delete': ['APIKey/APIKey/{PublicKey}', // Remove an API key
                'Bank/Transactions/{RequestID}', // Delete pending account withdraw of the logged in user
                'Bank/UserAccounts/{Currency}/{Label}', // Delete an account of the logged in user
                'ElectronicWallet/DepositWallets/{DigiCurrency}/{AddressName}', // Delete an digital currency addresses related to the logged in user.
                'ElectronicWallet/UserWallets/{DigiCurrency}/{AddressName}', // Delete an external digital currency addresses related to the logged in user.
                'Trade/Orders', // Cancels all existing order
                'Trade/Orders/{OrderID}', // Cancels an existing order
                'Trade/StopOrders', // Cancels all existing stop orders
                'Trade/StopOrders/{ID}']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var response,
                markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this337 = this;

            return Promise.resolve().then(function () {
                return _this337.publicGetPublicLiveTickers();
            }).then(function (_resp) {
                response = _resp;
                markets = response['tickers'];
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['currencyPair'];
                    base = id.slice(0, 3);
                    quote = id.slice(3, 6);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                b,
                balance,
                currency,
                account,
                _this338 = this,
                _arguments323 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments323.length > 0 && _arguments323[0] !== undefined ? _arguments323[0] : {};
                return _this338.loadMarkets();
            }).then(function () {
                return _this338.privateGetBalanceBalances();
            }).then(function (_resp) {
                response = _resp;
                balances = response['balances'];
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    account = {
                        'free': balance['availableBalance'],
                        'used': _this338.sum(balance['pendingIncoming'], balance['pendingOutgoing'], balance['openOrder']),
                        'total': balance['balance']
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this339 = this,
                _arguments324 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments324.length > 1 && _arguments324[1] !== undefined ? _arguments324[1] : {};
                return _this339.loadMarkets();
            }).then(function () {
                p = _this339.market(market);
                return _this339.publicGetPublicMarketDepthCurrencyPair(_this339.extend({
                    'CurrencyPair': p['id']
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this339.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this339.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['volume']);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = parseInt(ticker['createDateTime']) * 1000;
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': parseFloat(ticker['vwap']),
                'open': parseFloat(ticker['open']),
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['volume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var response,
                tickers,
                result,
                t,
                ticker,
                id,
                market,
                symbol,
                _this340 = this;

            return Promise.resolve().then(function () {
                return _this340.loadMarkets();
            }).then(function () {
                return _this340.publicGetPublicLiveTickers();
            }).then(function (_resp) {
                response = _resp;
                tickers = response['tickers'];
                result = {};

                for (t = 0; t < tickers.length; t++) {
                    ticker = tickers[t];
                    id = ticker['currencyPair'];
                    market = _this340.markets_by_id[id];
                    symbol = market['symbol'];

                    result[symbol] = _this340.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                response,
                ticker,
                _this341 = this;

            return Promise.resolve().then(function () {
                return _this341.loadMarkets();
            }).then(function () {
                p = _this341.market(market);
                return _this341.publicGetPublicLiveTickerCurrencyPair({
                    'CurrencyPair': p['id']
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];

                return _this341.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this342 = this,
                _arguments327 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments327.length > 1 && _arguments327[1] !== undefined ? _arguments327[1] : {};
                return _this342.loadMarkets();
            }).then(function () {
                return _this342.publicGetPublicTransactionsCurrencyPair(_this342.extend({
                    'CurrencyPair': _this342.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this343 = this,
                _arguments328 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments328.length > 4 && _arguments328[4] !== undefined ? _arguments328[4] : undefined;
                params = _arguments328.length > 5 && _arguments328[5] !== undefined ? _arguments328[5] : {};
                return _this343.loadMarkets();
            }).then(function () {
                order = {
                    'Code': _this343.marketId(market),
                    'Way': side == 'buy' ? 'Bid' : 'Ask',
                    'Amount': amount
                };

                if (type == 'limit') {
                    order['Price'] = price;
                }if (_this343.twofa) {
                    if ('ValidationCode' in params) {
                        order['ValidationCode'] = params['ValidationCode'];
                    } else {
                        throw new AuthenticationError(_this343.id + ' two-factor authentication requires a missing ValidationCode parameter');
                    }
                }
                return _this343.privatePostTradeOrders(_this343.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['clOrderId']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this344 = this;

            return Promise.resolve().then(function () {
                return _this344.loadMarkets();
            }).then(function () {
                return _this344.privateDeleteTradeOrdersOrderID({ 'OrderID': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                contentType,
                auth,
                signature,
                response,
                _test17,
                _test18,
                _this345 = this,
                _arguments330 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments330.length > 1 && _arguments330[1] !== undefined ? _arguments330[1] : 'public';
                method = _arguments330.length > 2 && _arguments330[2] !== undefined ? _arguments330[2] : 'GET';
                params = _arguments330.length > 3 && _arguments330[3] !== undefined ? _arguments330[3] : {};
                headers = _arguments330.length > 4 && _arguments330[4] !== undefined ? _arguments330[4] : undefined;
                body = _arguments330.length > 5 && _arguments330[5] !== undefined ? _arguments330[5] : undefined;
                url = _this345.urls['api'] + '/' + _this345.implodeParams(path, params);
                query = _this345.omit(params, _this345.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this345.urlencode(query);
                    }
                } else {
                    nonce = _this345.nonce();
                    contentType = method == 'GET' ? '' : 'application/json';
                    auth = method + url + contentType + nonce.toString();

                    auth = auth.toLowerCase();
                    signature = _this345.hmac(_this345.encode(auth), _this345.encode(_this345.secret), 'sha256', 'base64');

                    headers = {
                        'API_PUBLIC_KEY': _this345.apiKey,
                        'API_REQUEST_SIGNATURE': signature,
                        'API_REQUEST_DATE': nonce
                    };
                    if (method != 'GET') {
                        headers['Content-Type'] = contentType;
                        body = _this345.json(_this345.extend({ 'nonce': nonce }, params));
                    }
                }
                return _this345.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test17 = 'responseStatus' in response;
                _test18 = _test17 && 'message' in response['responseStatus'];

                if (_test18 && response['responseStatus']['message'] == 'OK') {
                    return response;
                } else {
                    throw new ExchangeError(_this345.id + ' ' + _this345.json(response));
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var gdax = {
        'id': 'gdax',
        'name': 'GDAX',
        'countries': 'US',
        'rateLimit': 1000,
        'urls': {
            'test': 'https://api-public.sandbox.gdax.com',
            'logo': 'https://user-images.githubusercontent.com/1294454/27766527-b1be41c6-5edb-11e7-95f6-5b496c469e2c.jpg',
            'api': 'https://api.gdax.com',
            'www': 'https://www.gdax.com',
            'doc': 'https://docs.gdax.com'
        },
        'api': {
            'public': {
                'get': ['currencies', 'products', 'products/{id}/book', 'products/{id}/candles', 'products/{id}/stats', 'products/{id}/ticker', 'products/{id}/trades', 'time']
            },
            'private': {
                'get': ['accounts', 'accounts/{id}', 'accounts/{id}/holds', 'accounts/{id}/ledger', 'coinbase-accounts', 'fills', 'funding', 'orders', 'orders/{id}', 'payment-methods', 'position', 'reports/{id}', 'users/self/trailing-volume'],
                'post': ['deposits/coinbase-account', 'deposits/payment-method', 'funding/repay', 'orders', 'position/close', 'profiles/margin-transfer', 'reports', 'withdrawals/coinbase', 'withdrawals/crypto', 'withdrawals/payment-method'],
                'delete': ['orders', 'orders/{id}']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this346 = this;

            return Promise.resolve().then(function () {
                return _this346.publicGetProducts();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['id'];
                    base = market['base_currency'];
                    quote = market['quote_currency'];
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                balances,
                result,
                b,
                balance,
                currency,
                account,
                _this347 = this,
                _arguments332 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments332.length > 0 && _arguments332[0] !== undefined ? _arguments332[0] : {};
                return _this347.loadMarkets();
            }).then(function () {
                return _this347.privateGetAccounts();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    account = {
                        'free': parseFloat(balance['available']),
                        'used': parseFloat(balance['hold']),
                        'total': parseFloat(balance['balance'])
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this348 = this,
                _arguments333 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments333.length > 1 && _arguments333[1] !== undefined ? _arguments333[1] : {};
                return _this348.loadMarkets();
            }).then(function () {
                return _this348.publicGetProductsIdBook(_this348.extend({
                    'id': _this348.marketId(market),
                    'level': 2 // 1 best bidask, 2 aggregated, 3 full
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this348.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this348.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                quote,
                timestamp,
                bid,
                ask,
                _this349 = this;

            return Promise.resolve().then(function () {
                return _this349.loadMarkets();
            }).then(function () {
                p = _this349.market(market);
                return _this349.publicGetProductsIdTicker({
                    'id': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;
                return _this349.publicGetProductsIdStats({
                    'id': p['id']
                });
            }).then(function (_resp) {
                quote = _resp;
                timestamp = _this349.parse8601(ticker['time']);
                bid = undefined;
                ask = undefined;

                if ('bid' in ticker) {
                    bid = parseFloat(ticker['bid']);
                }if ('ask' in ticker) {
                    ask = parseFloat(ticker['ask']);
                }return {
                    'timestamp': timestamp,
                    'datetime': _this349.iso8601(timestamp),
                    'high': parseFloat(quote['high']),
                    'low': parseFloat(quote['low']),
                    'bid': bid,
                    'ask': ask,
                    'vwap': undefined,
                    'open': parseFloat(quote['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(quote['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        parseTrade: function parseTrade(trade, market) {
            var timestamp = this.parse8601(['time']);
            var type = undefined;
            return {
                'id': trade['trade_id'].toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['side'],
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['size'])
            };
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this350 = this,
                _arguments335 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments335.length > 1 && _arguments335[1] !== undefined ? _arguments335[1] : {};
                return _this350.loadMarkets();
            }).then(function () {
                return _this350.publicGetProductsIdTrades(_this350.extend({
                    'id': _this350.marketId(market) // fixes issue #2
                }, params));
            });
        },
        parseOHLCV: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            return [ohlcv[0] * 1000, ohlcv[3], ohlcv[2], ohlcv[1], ohlcv[4], ohlcv[5]];
        },
        fetchOHLCV: function fetchOHLCV(symbol) {
            var timeframe,
                since,
                limit,
                market,
                response,
                _this351 = this,
                _arguments336 = arguments;

            return Promise.resolve().then(function () {
                timeframe = _arguments336.length > 1 && _arguments336[1] !== undefined ? _arguments336[1] : 60;
                since = _arguments336.length > 2 && _arguments336[2] !== undefined ? _arguments336[2] : undefined;
                limit = _arguments336.length > 3 && _arguments336[3] !== undefined ? _arguments336[3] : undefined;
                return _this351.loadMarkets();
            }).then(function () {
                market = _this351.market(symbol);
                return _this351.publicGetProductsIdCandles({
                    'id': market['id'],
                    'granularity': timeframe,
                    'start': since,
                    'end': limit
                });
            }).then(function (_resp) {
                response = _resp;

                return _this351.parseOHLCVs(response, market, timeframe, since, limit);
            });
        },
        fetchTime: function fetchTime() {
            var response,
                _this352 = this;

            response = _this352.publicGetTime();

            return _this352.parse8601(response['iso']);
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                oid,
                order,
                response,
                _this353 = this,
                _arguments338 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments338.length > 4 && _arguments338[4] !== undefined ? _arguments338[4] : undefined;
                params = _arguments338.length > 5 && _arguments338[5] !== undefined ? _arguments338[5] : {};
                return _this353.loadMarkets();
            }).then(function () {
                oid = _this353.nonce().toString();
                order = {
                    'product_id': _this353.marketId(market),
                    'side': side,
                    'size': amount,
                    'type': type
                };

                if (type == 'limit') {
                    order['price'] = price;
                }return _this353.privatePostOrders(_this353.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this354 = this;

            return Promise.resolve().then(function () {
                return _this354.loadMarkets();
            }).then(function () {
                return _this354.privateDeleteOrdersId({ 'id': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                request,
                url,
                query,
                nonce,
                what,
                secret,
                signature,
                response,
                _this355 = this,
                _arguments340 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments340.length > 1 && _arguments340[1] !== undefined ? _arguments340[1] : 'public';
                method = _arguments340.length > 2 && _arguments340[2] !== undefined ? _arguments340[2] : 'GET';
                params = _arguments340.length > 3 && _arguments340[3] !== undefined ? _arguments340[3] : {};
                headers = _arguments340.length > 4 && _arguments340[4] !== undefined ? _arguments340[4] : undefined;
                body = _arguments340.length > 5 && _arguments340[5] !== undefined ? _arguments340[5] : undefined;
                request = '/' + _this355.implodeParams(path, params);
                url = _this355.urls['api'] + request;
                query = _this355.omit(params, _this355.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this355.urlencode(query);
                    }
                } else {
                    if (!_this355.apiKey) {
                        throw new AuthenticationError(_this355.id + ' requires apiKey property for authentication and trading');
                    }if (!_this355.secret) {
                        throw new AuthenticationError(_this355.id + ' requires secret property for authentication and trading');
                    }if (!_this355.password) {
                        throw new AuthenticationError(_this355.id + ' requires password property for authentication and trading');
                    }nonce = _this355.nonce().toString();

                    if (Object.keys(query).length) {
                        body = _this355.json(query);
                    }what = nonce + method + request + (body || '');
                    secret = _this355.base64ToBinary(_this355.secret);
                    signature = _this355.hmac(_this355.encode(what), secret, 'sha256', 'base64');

                    headers = {
                        'CB-ACCESS-KEY': _this355.apiKey,
                        'CB-ACCESS-SIGN': _this355.decode(signature),
                        'CB-ACCESS-TIMESTAMP': nonce,
                        'CB-ACCESS-PASSPHRASE': _this355.password,
                        'Content-Type': 'application/json'
                    };
                }
                return _this355.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('message' in response) {
                    throw new ExchangeError(_this355.id + ' ' + _this355.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var gemini = {
        'id': 'gemini',
        'name': 'Gemini',
        'countries': 'US',
        'rateLimit': 1500, // 200 for private API
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27816857-ce7be644-6096-11e7-82d6-3c257263229c.jpg',
            'api': 'https://api.gemini.com',
            'www': 'https://gemini.com',
            'doc': 'https://docs.gemini.com/rest-api'
        },
        'api': {
            'public': {
                'get': ['symbols', 'pubticker/{symbol}', 'book/{symbol}', 'trades/{symbol}', 'auction/{symbol}', 'auction/{symbol}/history']
            },
            'private': {
                'post': ['order/new', 'order/cancel', 'order/cancel/session', 'order/cancel/all', 'order/status', 'orders', 'mytrades', 'tradevolume', 'balances', 'deposit/{currency}/newAddress', 'withdraw/{currency}', 'heartbeat']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                id,
                market,
                uppercase,
                base,
                quote,
                symbol,
                _this356 = this;

            return Promise.resolve().then(function () {
                return _this356.publicGetSymbols();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    id = markets[p];
                    market = id;
                    uppercase = market.toUpperCase();
                    base = uppercase.slice(0, 3);
                    quote = uppercase.slice(3, 6);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _timestamp4,
                _this357 = this,
                _arguments342 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments342.length > 1 && _arguments342[1] !== undefined ? _arguments342[1] : {};
                return _this357.loadMarkets();
            }).then(function () {
                return _this357.publicGetBookSymbol(_this357.extend({
                    'symbol': _this357.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this357.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this357.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['amount']);
                        _timestamp4 = parseInt(order['timestamp']) * 1000;

                        result[side].push([price, amount, _timestamp4]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                timestamp,
                baseVolume,
                quoteVolume,
                _this358 = this;

            return Promise.resolve().then(function () {
                return _this358.loadMarkets();
            }).then(function () {
                p = _this358.market(market);
                return _this358.publicGetPubtickerSymbol({
                    'symbol': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = ticker['volume']['timestamp'];
                baseVolume = p['base'];
                quoteVolume = p['quote'];

                return {
                    'timestamp': timestamp,
                    'datetime': _this358.iso8601(timestamp),
                    'high': undefined,
                    'low': undefined,
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['volume'][baseVolume]),
                    'quoteVolume': parseFloat(ticker['volume'][quoteVolume]),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this359 = this,
                _arguments344 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments344.length > 1 && _arguments344[1] !== undefined ? _arguments344[1] : {};
                return _this359.loadMarkets();
            }).then(function () {
                return _this359.publicGetTradesSymbol(_this359.extend({
                    'symbol': _this359.marketId(market)
                }, params));
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                balances,
                result,
                b,
                balance,
                currency,
                account,
                _this360 = this,
                _arguments345 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments345.length > 0 && _arguments345[0] !== undefined ? _arguments345[0] : {};
                return _this360.loadMarkets();
            }).then(function () {
                return _this360.privatePostBalances();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    account = {
                        'free': parseFloat(balance['available']),
                        'used': 0.0,
                        'total': parseFloat(balance['amount'])
                    };

                    account['used'] = account['total'] - account['free'];
                    result[currency] = account;
                }
                return result;
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this361 = this,
                _arguments346 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments346.length > 4 && _arguments346[4] !== undefined ? _arguments346[4] : undefined;
                params = _arguments346.length > 5 && _arguments346[5] !== undefined ? _arguments346[5] : {};
                return _this361.loadMarkets();
            }).then(function () {
                if (type == 'market') {
                    throw new ExchangeError(_this361.id + ' allows limit orders only');
                }order = {
                    'client_order_id': _this361.nonce(),
                    'symbol': _this361.marketId(market),
                    'amount': amount.toString(),
                    'price': price.toString(),
                    'side': side,
                    'type': 'exchange limit' // gemini allows limit orders only
                };
                return _this361.privatePostOrderNew(_this361.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['order_id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this362 = this;

            return Promise.resolve().then(function () {
                return _this362.loadMarkets();
            }).then(function () {
                return _this362.privatePostCancelOrder({ 'order_id': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                request,
                payload,
                signature,
                response,
                _this363 = this,
                _arguments348 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments348.length > 1 && _arguments348[1] !== undefined ? _arguments348[1] : 'public';
                method = _arguments348.length > 2 && _arguments348[2] !== undefined ? _arguments348[2] : 'GET';
                params = _arguments348.length > 3 && _arguments348[3] !== undefined ? _arguments348[3] : {};
                headers = _arguments348.length > 4 && _arguments348[4] !== undefined ? _arguments348[4] : undefined;
                body = _arguments348.length > 5 && _arguments348[5] !== undefined ? _arguments348[5] : undefined;
                url = '/' + _this363.version + '/' + _this363.implodeParams(path, params);
                query = _this363.omit(params, _this363.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this363.urlencode(query);
                    }
                } else {
                    nonce = _this363.nonce();
                    request = _this363.extend({
                        'request': url,
                        'nonce': nonce
                    }, query);
                    payload = _this363.json(request);

                    payload = _this363.stringToBase64(_this363.encode(payload));
                    signature = _this363.hmac(payload, _this363.encode(_this363.secret), 'sha384');

                    headers = {
                        'Content-Type': 'text/plain',
                        'Content-Length': 0,
                        'X-GEMINI-APIKEY': _this363.apiKey,
                        'X-GEMINI-PAYLOAD': payload,
                        'X-GEMINI-SIGNATURE': signature
                    };
                }
                url = _this363.urls['api'] + url;
                return _this363.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('result' in response) {
                    if (response['result'] == 'error') {
                        throw new ExchangeError(_this363.id + ' ' + _this363.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var hitbtc = {

        'id': 'hitbtc',
        'name': 'HitBTC',
        'countries': 'HK', // Hong Kong
        'rateLimit': 1500,
        'version': '1',
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766555-8eaec20e-5edc-11e7-9c5b-6dc69fc42f5e.jpg',
            'api': 'http://api.hitbtc.com',
            'www': 'https://hitbtc.com',
            'doc': ['https://hitbtc.com/api', 'http://hitbtc-com.github.io/hitbtc-api', 'http://jsfiddle.net/bmknight/RqbYB']
        },
        'api': {
            'public': {
                'get': ['{symbol}/orderbook', '{symbol}/ticker', '{symbol}/trades', '{symbol}/trades/recent', 'symbols', 'ticker', 'time,']
            },
            'trading': {
                'get': ['balance', 'orders/active', 'orders/recent', 'order', 'trades/by/order', 'trades'],
                'post': ['new_order', 'cancel_order', 'cancel_orders']
            },
            'payment': {
                'get': ['balance', 'address/{currency}', 'transactions', 'transactions/{transaction}'],
                'post': ['transfer_to_trading', 'transfer_to_main', 'address/{currency}', 'payout']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                lot,
                step,
                symbol,
                _this364 = this;

            return Promise.resolve().then(function () {
                return _this364.publicGetSymbols();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets['symbols'].length; p++) {
                    market = markets['symbols'][p];
                    id = market['symbol'];
                    base = market['commodity'];
                    quote = market['currency'];
                    lot = parseFloat(market['lot']);
                    step = parseFloat(market['step']);

                    base = _this364.commonCurrencyCode(base);
                    quote = _this364.commonCurrencyCode(quote);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'lot': lot,
                        'step': step,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                b,
                balance,
                currency,
                account,
                _this365 = this,
                _arguments350 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments350.length > 0 && _arguments350[0] !== undefined ? _arguments350[0] : {};
                return _this365.loadMarkets();
            }).then(function () {
                return _this365.tradingGetBalance();
            }).then(function (_resp) {
                response = _resp;
                balances = response['balance'];
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency_code'];
                    account = {
                        'free': parseFloat(balance['cash']),
                        'used': parseFloat(balance['reserved']),
                        'total': 0.0
                    };

                    account['total'] = _this365.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this366 = this,
                _arguments351 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments351.length > 1 && _arguments351[1] !== undefined ? _arguments351[1] : {};
                return _this366.loadMarkets();
            }).then(function () {
                return _this366.publicGetSymbolOrderbook(_this366.extend({
                    'symbol': _this366.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this366.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this366.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = ticker['timestamp'];
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': undefined,
                'open': parseFloat(ticker['open']),
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['volume']),
                'quoteVolume': parseFloat(ticker['volume_quote']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                ticker,
                _this367 = this;

            return Promise.resolve().then(function () {
                return _this367.loadMarkets();
            }).then(function () {
                return _this367.publicGetTicker();
            }).then(function (_resp) {
                tickers = _resp;
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this367.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = tickers[id];

                    result[symbol] = _this367.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this368 = this;

            return Promise.resolve().then(function () {
                return _this368.loadMarkets();
            }).then(function () {
                p = _this368.market(market);
                return _this368.publicGetSymbolTicker({
                    'symbol': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                if ('message' in ticker) {
                    throw new ExchangeError(_this368.id + ' ' + ticker['message']);
                }return _this368.parseTicker(ticker, p);
            });
        },
        parseTrade: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            return {
                'info': trade,
                'id': trade[0],
                'timestamp': trade[3],
                'datetime': this.iso8601(trade[3]),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade[4],
                'price': parseFloat(trade[1]),
                'amount': parseFloat(trade[2])
            };
        },
        fetchTrades: function fetchTrades(symbol) {
            var params,
                market,
                response,
                _this369 = this,
                _arguments354 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments354.length > 1 && _arguments354[1] !== undefined ? _arguments354[1] : {};
                return _this369.loadMarkets();
            }).then(function () {
                market = _this369.market(symbol);
                return _this369.publicGetSymbolTrades(_this369.extend({
                    'symbol': market['id'],
                    // 'from': 0,
                    // 'till': 100,
                    // 'by': 'ts', // or by trade_id
                    // 'sort': 'desc', // or asc
                    // 'start_index': 0,
                    // 'max_results': 1000,
                    // 'format_item': 'object',
                    // 'format_price': 'number',
                    // 'format_amount': 'number',
                    // 'format_tid': 'string',
                    // 'format_timestamp': 'millisecond',
                    // 'format_wrap': false,
                    'side': 'true'
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return _this369.parseTrades(response['trades'], market);
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                quantity,
                wholeLots,
                difference,
                clientOrderId,
                order,
                response,
                _this370 = this,
                _arguments355 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments355.length > 4 && _arguments355[4] !== undefined ? _arguments355[4] : undefined;
                params = _arguments355.length > 5 && _arguments355[5] !== undefined ? _arguments355[5] : {};
                return _this370.loadMarkets();
            }).then(function () {
                p = _this370.market(market);
                // check if amount can be evenly divided into lots
                // they want integer quantity in lot units

                quantity = parseFloat(amount) / p['lot'];
                wholeLots = Math.round(quantity);
                difference = quantity - wholeLots;

                if (Math.abs(difference) > p['step']) {
                    throw new ExchangeError(_this370.id + ' order amount should be evenly divisible by lot unit size of ' + p['lot'].toString());
                }clientOrderId = _this370.milliseconds();
                order = {
                    'clientOrderId': clientOrderId.toString(),
                    'symbol': p['id'],
                    'side': side,
                    'quantity': wholeLots.toString(), // quantity in integer lot units
                    'type': type
                };

                if (type == 'limit') {
                    order['price'] = '%.10f'.sprintf(price);
                }return _this370.tradingPostNewOrder(_this370.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['ExecutionReport']['clientOrderId']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this371 = this,
                _arguments356 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments356.length > 1 && _arguments356[1] !== undefined ? _arguments356[1] : {};
                return _this371.loadMarkets();
            }).then(function () {
                return _this371.tradingPostCancelOrder(_this371.extend({
                    'clientOrderId': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                auth,
                response,
                _this372 = this,
                _arguments357 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments357.length > 1 && _arguments357[1] !== undefined ? _arguments357[1] : 'public';
                method = _arguments357.length > 2 && _arguments357[2] !== undefined ? _arguments357[2] : 'GET';
                params = _arguments357.length > 3 && _arguments357[3] !== undefined ? _arguments357[3] : {};
                headers = _arguments357.length > 4 && _arguments357[4] !== undefined ? _arguments357[4] : undefined;
                body = _arguments357.length > 5 && _arguments357[5] !== undefined ? _arguments357[5] : undefined;
                url = '/' + 'api' + '/' + _this372.version + '/' + api + '/' + _this372.implodeParams(path, params);
                query = _this372.omit(params, _this372.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this372.urlencode(query);
                    }
                } else {
                    nonce = _this372.nonce();

                    query = _this372.extend({ 'nonce': nonce, 'apikey': _this372.apiKey }, query);
                    if (method == 'POST') {
                        if (Object.keys(query).length) {
                            body = _this372.urlencode(query);
                        }
                    }url += '?' + _this372.urlencode(query);
                    auth = url + (body || '');

                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Signature': _this372.hmac(_this372.encode(auth), _this372.encode(_this372.secret), 'sha512').toLowerCase()
                    };
                }
                url = _this372.urls['api'] + url;
                return _this372.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('code' in response) {
                    if ('ExecutionReport' in response) {
                        if (response['ExecutionReport']['orderRejectReason'] == 'orderExceedsLimit') {
                            throw new InsufficientFunds(_this372.id + ' ' + _this372.json(response));
                        }
                    }
                    throw new ExchangeError(_this372.id + ' ' + _this372.json(response));
                }
                return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var huobi = {

        'id': 'huobi',
        'name': 'Huobi',
        'countries': 'CN',
        'rateLimit': 2000,
        'version': 'v3',
        'hasFetchOHLCV': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766569-15aa7b9a-5edd-11e7-9e7f-44791f4ee49c.jpg',
            'api': 'http://api.huobi.com',
            'www': 'https://www.huobi.com',
            'doc': 'https://github.com/huobiapi/API_Docs_en/wiki'
        },
        'api': {
            'staticmarket': {
                'get': ['{id}_kline_{period}', 'ticker_{id}', 'depth_{id}', 'depth_{id}_{length}', 'detail_{id}']
            },
            'usdmarket': {
                'get': ['{id}_kline_{period}', 'ticker_{id}', 'depth_{id}', 'depth_{id}_{length}', 'detail_{id}']
            },
            'trade': {
                'post': ['get_account_info', 'get_orders', 'order_info', 'buy', 'sell', 'buy_market', 'sell_market', 'cancel_order', 'get_new_deal_orders', 'get_order_id_by_trade_id', 'withdraw_coin', 'cancel_withdraw_coin', 'get_withdraw_coin_result', 'transfer', 'loan', 'repayment', 'get_loan_available', 'get_loans']
            }
        },
        'markets': {
            'BTC/CNY': { 'id': 'btc', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY', 'type': 'staticmarket', 'coinType': 1 },
            'LTC/CNY': { 'id': 'ltc', 'symbol': 'LTC/CNY', 'base': 'LTC', 'quote': 'CNY', 'type': 'staticmarket', 'coinType': 2 },
            'BTC/USD': { 'id': 'btc', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD', 'type': 'usdmarket', 'coinType': 1 }
        },

        fetchBalance: function fetchBalance() {
            var params,
                balances,
                result,
                c,
                currency,
                lowercase,
                account,
                available,
                frozen,
                loan,
                _this373 = this,
                _arguments358 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments358.length > 0 && _arguments358[0] !== undefined ? _arguments358[0] : {};
                return _this373.tradePostGetAccountInfo();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (c = 0; c < _this373.currencies.length; c++) {
                    currency = _this373.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = _this373.account();
                    available = 'available_' + lowercase + '_display';
                    frozen = 'frozen_' + lowercase + '_display';
                    loan = 'loan_' + lowercase + '_display';

                    if (available in balances) {
                        account['free'] = parseFloat(balances[available]);
                    }if (frozen in balances) {
                        account['used'] = parseFloat(balances[frozen]);
                    }if (loan in balances) {
                        account['used'] = _this373.sum(account['used'], parseFloat(balances[loan]));
                    }account['total'] = _this373.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                method,
                orderbook,
                timestamp,
                result,
                _this374 = this,
                _arguments359 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments359.length > 1 && _arguments359[1] !== undefined ? _arguments359[1] : {};
                p = _this374.market(market);
                method = p['type'] + 'GetDepthId';
                return _this374[method](_this374.extend({ 'id': p['id'] }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this374.milliseconds();
                result = {
                    'bids': orderbook['bids'],
                    'asks': orderbook['asks'],
                    'timestamp': timestamp,
                    'datetime': _this374.iso8601(timestamp)
                };

                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                method,
                response,
                ticker,
                timestamp,
                _this375 = this;

            return Promise.resolve().then(function () {
                p = _this375.market(market);
                method = p['type'] + 'GetTickerId';
                return _this375[method]({ 'id': p['id'] });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];
                timestamp = parseInt(response['time']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this375.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(symbol) {
            var params,
                market,
                method,
                _this376 = this,
                _arguments361 = arguments;

            params = _arguments361.length > 1 && _arguments361[1] !== undefined ? _arguments361[1] : {};
            market = _this376.market(symbol);
            method = market['type'] + 'GetDetailId';

            return _this376[method](_this376.extend({ 'id': market['id'] }, params));
        },
        parseOHLCV: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            // not implemented yet
            return [ohlcv[0], ohlcv[1], ohlcv[2], ohlcv[3], ohlcv[4], ohlcv[6]];
        },
        fetchOHLCV: function fetchOHLCV(symbol) {
            var timeframe,
                since,
                limit,
                period,
                market,
                method,
                ohlcvs,
                _this377 = this,
                _arguments362 = arguments;

            return Promise.resolve().then(function () {
                timeframe = _arguments362.length > 1 && _arguments362[1] !== undefined ? _arguments362[1] : 60;
                since = _arguments362.length > 2 && _arguments362[2] !== undefined ? _arguments362[2] : undefined;
                limit = _arguments362.length > 3 && _arguments362[3] !== undefined ? _arguments362[3] : undefined;
                period = '001'; // 1 minute by default

                if (timeframe == 60) {
                    period = '001';
                } else {
                    if (timeframe == 300) {
                        period = '005'; // 5 minutes
                    } else {
                        if (timeframe == 900) {
                            period = '015'; // 15 minutes
                        } else {
                            if (timeframe == 1800) {
                                period = '030'; // 30 minutes
                            } else {
                                if (timeframe == 3600) {
                                    period = '060'; // 1 hour
                                } else {
                                    if (timeframe == 86400) {
                                        period = '100'; // 1 day
                                    } else {
                                        if (timeframe == 604800) {
                                            period = '200'; // 1 week
                                        } else {
                                            if (timeframe == 2592000) {
                                                period = '300'; // 1 month
                                            } else {
                                                if (timeframe == 31536000) {
                                                    period = '400'; // 1 year
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }market = _this377.market(symbol);
                method = market['type'] + 'GetIdKlinePeriod';
                return _this377[method]({
                    'id': market['id'],
                    'period': period
                });
            }).then(function (_resp) {
                ohlcvs = _resp;

                return ohlcvs;
                // return this.parseOHLCVs (market, ohlcvs, timeframe, since, limit);
            });
        },
        createOrder: function createOrder(symbol, type, side, amount) {
            var price,
                params,
                market,
                method,
                order,
                response,
                _this378 = this,
                _arguments363 = arguments;

            price = _arguments363.length > 4 && _arguments363[4] !== undefined ? _arguments363[4] : undefined;
            params = _arguments363.length > 5 && _arguments363[5] !== undefined ? _arguments363[5] : {};
            market = _this378.market(symbol);
            method = 'tradePost' + _this378.capitalize(side);
            order = {
                'coin_type': market['coinType'],
                'amount': amount,
                'market': market['quote'].toLowerCase()
            };

            if (type == 'limit') {
                order['price'] = price;
            } else {
                method += _this378.capitalize(type);
            }response = _this378[method](_this378.extend(order, params));

            return {
                'info': response,
                'id': response['id']
            };
        },
        cancelOrder: function cancelOrder(id) {
            var _this379 = this;

            return _this379.tradePostCancelOrder({ 'id': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                queryString,
                _query,
                response,
                _this380 = this,
                _arguments365 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments365.length > 1 && _arguments365[1] !== undefined ? _arguments365[1] : 'trade';
                method = _arguments365.length > 2 && _arguments365[2] !== undefined ? _arguments365[2] : 'GET';
                params = _arguments365.length > 3 && _arguments365[3] !== undefined ? _arguments365[3] : {};
                headers = _arguments365.length > 4 && _arguments365[4] !== undefined ? _arguments365[4] : undefined;
                body = _arguments365.length > 5 && _arguments365[5] !== undefined ? _arguments365[5] : undefined;
                url = _this380.urls['api'];

                if (api == 'trade') {
                    url += '/api' + _this380.version;
                    query = _this380.keysort(_this380.extend({
                        'method': path,
                        'access_key': _this380.apiKey,
                        'created': _this380.nonce()
                    }, params));
                    queryString = _this380.urlencode(_this380.omit(query, 'market'));
                    // secret key must be at the end of query to be signed

                    queryString += '&secret_key=' + _this380.secret;
                    query['sign'] = _this380.hash(_this380.encode(queryString));
                    body = _this380.urlencode(query);
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length
                    };
                } else {
                    url += '/' + api + '/' + _this380.implodeParams(path, params) + '_json.js';
                    _query = _this380.omit(params, _this380.extractParams(path));

                    if (Object.keys(_query).length) {
                        url += '?' + _this380.urlencode(_query);
                    }
                }
                return _this380.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('status' in response) {
                    if (response['status'] == 'error') {
                        throw new ExchangeError(_this380.id + ' ' + _this380.json(response));
                    }
                }if ('code' in response) {
                    throw new ExchangeError(_this380.id + ' ' + _this380.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var itbit = {

        'id': 'itbit',
        'name': 'itBit',
        'countries': 'US',
        'rateLimit': 2000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27822159-66153620-60ad-11e7-89e7-005f6d7f3de0.jpg',
            'api': 'https://api.itbit.com',
            'www': 'https://www.itbit.com',
            'doc': ['https://api.itbit.com/docs', 'https://www.itbit.com/api']
        },
        'api': {
            'public': {
                'get': ['markets/{symbol}/ticker', 'markets/{symbol}/order_book', 'markets/{symbol}/trades']
            },
            'private': {
                'get': ['wallets', 'wallets/{walletId}', 'wallets/{walletId}/balances/{currencyCode}', 'wallets/{walletId}/funding_history', 'wallets/{walletId}/trades', 'wallets/{walletId}/orders/{id}'],
                'post': ['wallet_transfers', 'wallets', 'wallets/{walletId}/cryptocurrency_deposits', 'wallets/{walletId}/cryptocurrency_withdrawals', 'wallets/{walletId}/orders', 'wire_withdrawal'],
                'delete': ['wallets/{walletId}/orders/{id}']
            }
        },
        'markets': {
            'BTC/USD': { 'id': 'XBTUSD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/SGD': { 'id': 'XBTSGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD' },
            'BTC/EUR': { 'id': 'XBTEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' }
        },

        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this381 = this,
                _arguments366 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments366.length > 1 && _arguments366[1] !== undefined ? _arguments366[1] : {};
                return _this381.publicGetMarketsSymbolOrderBook(_this381.extend({
                    'symbol': _this381.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this381.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this381.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                bid,
                ask,
                _this382 = this;

            return Promise.resolve().then(function () {
                return _this382.publicGetMarketsSymbolTicker({
                    'symbol': _this382.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this382.parse8601(ticker['serverTimeUTC']);
                bid = undefined;
                ask = undefined;

                if ('bid' in ticker) {
                    if (ticker['bid']) {
                        bid = parseFloat(ticker['bid']);
                    }
                }if ('ask' in ticker) {
                    if (ticker['ask']) {
                        ask = parseFloat(ticker['ask']);
                    }
                }return {
                    'timestamp': timestamp,
                    'datetime': _this382.iso8601(timestamp),
                    'high': parseFloat(ticker['high24h']),
                    'low': parseFloat(ticker['low24h']),
                    'bid': bid,
                    'ask': ask,
                    'vwap': parseFloat(ticker['vwap24h']),
                    'open': parseFloat(ticker['openToday']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['lastPrice']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume24h']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this383 = this,
                _arguments368 = arguments;

            params = _arguments368.length > 1 && _arguments368[1] !== undefined ? _arguments368[1] : {};

            return _this383.publicGetMarketsSymbolTrades(_this383.extend({
                'symbol': _this383.marketId(market)
            }, params));
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                b,
                balance,
                currency,
                account,
                _this384 = this,
                _arguments369 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments369.length > 0 && _arguments369[0] !== undefined ? _arguments369[0] : {};
                return _this384.privateGetBalances();
            }).then(function (_resp) {
                response = _resp;
                balances = response['balances'];
                result = { 'info': response };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    account = {
                        'free': parseFloat(balance['availableBalance']),
                        'used': 0.0,
                        'total': parseFloat(balance['totalBalance'])
                    };

                    account['used'] = account['total'] - account['free'];
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchWallets: function fetchWallets() {
            return this.privateGetWallets();
        },
        nonce: function nonce() {
            return this.milliseconds();
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                order,
                response,
                _this385 = this,
                _arguments370 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments370.length > 4 && _arguments370[4] !== undefined ? _arguments370[4] : undefined;
                params = _arguments370.length > 5 && _arguments370[5] !== undefined ? _arguments370[5] : {};

                if (type == 'market') {
                    throw new ExchangeError(_this385.id + ' allows limit orders only');
                }amount = amount.toString();
                price = price.toString();
                p = _this385.market(market);
                order = {
                    'side': side,
                    'type': type,
                    'currency': p['base'],
                    'amount': amount,
                    'display': amount,
                    'price': price,
                    'instrument': p['id']
                };
                return _this385.privatePostTradeAdd(_this385.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this386 = this,
                _arguments371 = arguments;

            params = _arguments371.length > 1 && _arguments371[1] !== undefined ? _arguments371[1] : {};

            return _this386.privateDeleteWalletsWalletIdOrdersId(_this386.extend({
                'id': id
            }, params));
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                timestamp,
                auth,
                message,
                _hash2,
                binhash,
                signature,
                response,
                _this387 = this,
                _arguments372 = arguments;

            api = _arguments372.length > 1 && _arguments372[1] !== undefined ? _arguments372[1] : 'public';
            method = _arguments372.length > 2 && _arguments372[2] !== undefined ? _arguments372[2] : 'GET';
            params = _arguments372.length > 3 && _arguments372[3] !== undefined ? _arguments372[3] : {};
            headers = _arguments372.length > 4 && _arguments372[4] !== undefined ? _arguments372[4] : undefined;
            body = _arguments372.length > 5 && _arguments372[5] !== undefined ? _arguments372[5] : undefined;
            url = _this387.urls['api'] + '/' + _this387.version + '/' + _this387.implodeParams(path, params);
            query = _this387.omit(params, _this387.extractParams(path));

            if (api == 'public') {
                if (Object.keys(query).length) {
                    url += '?' + _this387.urlencode(query);
                }
            } else {
                if (Object.keys(query).length) {
                    body = _this387.json(query);
                } else {
                    body = '';
                }nonce = _this387.nonce().toString();
                timestamp = nonce;
                auth = [method, url, body, nonce, timestamp];
                message = nonce + _this387.json(auth);
                _hash2 = _this387.hash(_this387.encode(message), 'sha256', 'binary');
                binhash = _this387.binaryConcat(url, _hash2);
                signature = _this387.hmac(binhash, _this387.encode(_this387.secret), 'sha512', 'base64');

                headers = {
                    'Authorization': self.apiKey + ':' + signature,
                    'Content-Type': 'application/json',
                    'X-Auth-Timestamp': timestamp,
                    'X-Auth-Nonce': nonce
                };
            }
            response = _this387.fetch(url, method, headers, body);

            if ('code' in response) {
                throw new ExchangeError(_this387.id + ' ' + _this387.json(response));
            }return response;
        }
    };

    //-----------------------------------------------------------------------------

    var jubi = {

        'id': 'jubi',
        'name': 'jubi.com',
        'countries': 'CN',
        'rateLimit': 1500,
        'version': 'v1',
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766581-9d397d9a-5edd-11e7-8fb9-5d8236c0e692.jpg',
            'api': 'https://www.jubi.com/api',
            'www': 'https://www.jubi.com',
            'doc': 'https://www.jubi.com/help/api.html'
        },
        'api': {
            'public': {
                'get': ['depth', 'orders', 'ticker', 'allticker']
            },
            'private': {
                'post': ['balance', 'trade_add', 'trade_cancel', 'trade_list', 'trade_view', 'wallet']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                keys,
                result,
                p,
                id,
                base,
                quote,
                symbol,
                _this388 = this;

            return Promise.resolve().then(function () {
                return _this388.publicGetAllticker();
            }).then(function (_resp) {
                markets = _resp;
                keys = Object.keys(markets);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    base = id.toUpperCase();
                    quote = 'CNY';
                    symbol = base + '/' + quote;

                    base = _this388.commonCurrencyCode(base);
                    quote = _this388.commonCurrencyCode(quote);
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': id
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                balances,
                result,
                c,
                currency,
                lowercase,
                account,
                free,
                used,
                _this389 = this,
                _arguments374 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments374.length > 0 && _arguments374[0] !== undefined ? _arguments374[0] : {};
                return _this389.loadMarkets();
            }).then(function () {
                return _this389.privatePostBalance();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (c = 0; c < _this389.currencies.length; c++) {
                    currency = _this389.currencies[c];
                    lowercase = currency.toLowerCase();

                    if (lowercase == 'dash') {
                        lowercase = 'drk';
                    }account = _this389.account();
                    free = lowercase + '_balance';
                    used = lowercase + '_lock';

                    if (free in balances) {
                        account['free'] = parseFloat(balances[free]);
                    }if (used in balances) {
                        account['used'] = parseFloat(balances[used]);
                    }account['total'] = _this389.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                _this390 = this,
                _arguments375 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments375.length > 1 && _arguments375[1] !== undefined ? _arguments375[1] : {};
                return _this390.loadMarkets();
            }).then(function () {
                return _this390.publicGetDepth(_this390.extend({
                    'coin': _this390.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this390.milliseconds();
                result = {
                    'bids': orderbook['bids'],
                    'asks': orderbook['asks'],
                    'timestamp': timestamp,
                    'datetime': _this390.iso8601(timestamp)
                };

                result['asks'] = _this390.sortBy(result['asks'], 0);
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['buy']),
                'ask': parseFloat(ticker['sell']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['vol']),
                'quoteVolume': parseFloat(ticker['volume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                ticker,
                _this391 = this;

            return Promise.resolve().then(function () {
                return _this391.loadMarkets();
            }).then(function () {
                return _this391.publicGetAllticker();
            }).then(function (_resp) {
                tickers = _resp;
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this391.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = tickers[id];

                    result[symbol] = _this391.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this392 = this;

            return Promise.resolve().then(function () {
                return _this392.loadMarkets();
            }).then(function () {
                p = _this392.market(market);
                return _this392.publicGetTicker({
                    'coin': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this392.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this393 = this,
                _arguments378 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments378.length > 1 && _arguments378[1] !== undefined ? _arguments378[1] : {};
                return _this393.loadMarkets();
            }).then(function () {
                return _this393.publicGetOrders(_this393.extend({
                    'coin': _this393.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                response,
                _this394 = this,
                _arguments379 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments379.length > 4 && _arguments379[4] !== undefined ? _arguments379[4] : undefined;
                params = _arguments379.length > 5 && _arguments379[5] !== undefined ? _arguments379[5] : {};
                return _this394.loadMarkets();
            }).then(function () {
                return _this394.privatePostTradeAdd(_this394.extend({
                    'amount': amount,
                    'price': price,
                    'type': side,
                    'coin': _this394.marketId(market)
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this395 = this,
                _arguments380 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments380.length > 1 && _arguments380[1] !== undefined ? _arguments380[1] : {};
                return _this395.loadMarkets();
            }).then(function () {
                return _this395.privateDeleteWalletsWalletIdOrdersId(_this395.extend({
                    'id': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                query,
                request,
                secret,
                response,
                _this396 = this,
                _arguments381 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments381.length > 1 && _arguments381[1] !== undefined ? _arguments381[1] : 'public';
                method = _arguments381.length > 2 && _arguments381[2] !== undefined ? _arguments381[2] : 'GET';
                params = _arguments381.length > 3 && _arguments381[3] !== undefined ? _arguments381[3] : {};
                headers = _arguments381.length > 4 && _arguments381[4] !== undefined ? _arguments381[4] : undefined;
                body = _arguments381.length > 5 && _arguments381[5] !== undefined ? _arguments381[5] : undefined;
                url = _this396.urls['api'] + '/' + _this396.version + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this396.urlencode(params);
                    }
                } else {
                    nonce = _this396.nonce().toString();
                    query = _this396.extend({
                        'key': _this396.apiKey,
                        'nonce': nonce
                    }, params);
                    request = _this396.urlencode(query);
                    secret = _this396.hash(_this396.encode(_this396.secret));

                    query['signature'] = _this396.hmac(_this396.encode(request), _this396.encode(secret));
                    body = _this396.urlencode(query);
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length
                    };
                }
                return _this396.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('result' in response) {
                    if (!response['result']) {
                        throw new ExchangeError(_this396.id + ' ' + _this396.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------
    // kraken is also owner of ex. Coinsetter / CaVirtEx / Clevercoin

    var kraken = {

        'id': 'kraken',
        'name': 'Kraken',
        'countries': 'US',
        'version': '0',
        'rateLimit': 1500,
        'hasFetchTickers': true,
        'hasFetchOHLCV': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766599-22709304-5ede-11e7-9de1-9f33732e1509.jpg',
            'api': 'https://api.kraken.com',
            'www': 'https://www.kraken.com',
            'doc': ['https://www.kraken.com/en-us/help/api', 'https://github.com/nothingisdead/npm-kraken-api']
        },
        'api': {
            'public': {
                'get': ['Assets', 'AssetPairs', 'Depth', 'OHLC', 'Spread', 'Ticker', 'Time', 'Trades']
            },
            'private': {
                'post': ['AddOrder', 'Balance', 'CancelOrder', 'ClosedOrders', 'DepositAddresses', 'DepositMethods', 'DepositStatus', 'Ledgers', 'OpenOrders', 'OpenPositions', 'QueryLedgers', 'QueryOrders', 'QueryTrades', 'TradeBalance', 'TradesHistory', 'TradeVolume', 'Withdraw', 'WithdrawCancel', 'WithdrawInfo', 'WithdrawStatus']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                keys,
                result,
                p,
                id,
                market,
                base,
                quote,
                darkpool,
                symbol,
                _this397 = this;

            return Promise.resolve().then(function () {
                return _this397.publicGetAssetPairs();
            }).then(function (_resp) {
                markets = _resp;
                keys = Object.keys(markets['result']);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    market = markets['result'][id];
                    base = market['base'];
                    quote = market['quote'];

                    if (base[0] == 'X' || base[0] == 'Z') {
                        base = base.slice(1);
                    }if (quote[0] == 'X' || quote[0] == 'Z') {
                        quote = quote.slice(1);
                    }base = _this397.commonCurrencyCode(base);
                    quote = _this397.commonCurrencyCode(quote);
                    darkpool = id.indexOf('.d') >= 0;
                    symbol = darkpool ? market['altname'] : base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'darkpool': darkpool,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                darkpool,
                p,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _timestamp5,
                _this398 = this,
                _arguments383 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments383.length > 1 && _arguments383[1] !== undefined ? _arguments383[1] : {};
                return _this398.loadMarkets();
            }).then(function () {
                darkpool = market.indexOf('.d') >= 0;

                if (darkpool) {
                    throw new ExchangeError(_this398.id + ' does not provide an order book for darkpool symbol ' + market);
                }p = _this398.market(market);
                return _this398.publicGetDepth(_this398.extend({
                    'pair': p['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['result'][p['id']];
                timestamp = _this398.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this398.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);
                        _timestamp5 = order[2] * 1000;

                        result[side].push([price, amount, _timestamp5]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['h'][1]),
                'low': parseFloat(ticker['l'][1]),
                'bid': parseFloat(ticker['b'][0]),
                'ask': parseFloat(ticker['a'][0]),
                'vwap': parseFloat(ticker['p'][1]),
                'open': parseFloat(ticker['o']),
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['c'][0]),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['v'][1]),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var pairs,
                s,
                symbol,
                market,
                filter,
                response,
                tickers,
                ids,
                result,
                i,
                id,
                _market,
                _symbol2,
                ticker,
                _this399 = this;

            return Promise.resolve().then(function () {
                return _this399.loadMarkets();
            }).then(function () {
                pairs = [];

                for (s = 0; s < _this399.symbols.length; s++) {
                    symbol = _this399.symbols[s];
                    market = _this399.markets[symbol];

                    if (!market['darkpool']) {
                        pairs.push(market['id']);
                    }
                }
                filter = pairs.join(',');
                return _this399.publicGetTicker({
                    'pair': filter
                });
            }).then(function (_resp) {
                response = _resp;
                tickers = response['result'];
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    _market = _this399.markets_by_id[id];
                    _symbol2 = _market['symbol'];
                    ticker = tickers[id];

                    result[_symbol2] = _this399.parseTicker(ticker, _market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var darkpool,
                p,
                response,
                ticker,
                _this400 = this;

            return Promise.resolve().then(function () {
                return _this400.loadMarkets();
            }).then(function () {
                darkpool = market.indexOf('.d') >= 0;

                if (darkpool) {
                    throw new ExchangeError(_this400.id + ' does not provide a ticker for darkpool symbol ' + market);
                }p = _this400.market(market);
                return _this400.publicGetTicker({
                    'pair': p['id']
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['result'][p['id']];

                return _this400.parseTicker(ticker, p);
            });
        },
        parseTrade: function parseTrade(trade, market) {
            var timestamp = parseInt(trade[2] * 1000);
            var side = trade[3] == 's' ? 'sell' : 'buy';
            var type = trade[4] == 'l' ? 'limit' : 'market';
            return {
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': type,
                'side': side,
                'price': parseFloat(trade[0]),
                'amount': parseFloat(trade[1])
            };
        },
        parseOHLCV: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            return [ohlcv[0] * 1000, parseFloat(ohlcv[1]), parseFloat(ohlcv[2]), parseFloat(ohlcv[3]), parseFloat(ohlcv[4]), parseFloat(ohlcv[6])];
        },
        fetchOHLCV: function fetchOHLCV(symbol) {
            var timeframe,
                since,
                limit,
                market,
                response,
                ohlcvs,
                _this401 = this,
                _arguments386 = arguments;

            return Promise.resolve().then(function () {
                timeframe = _arguments386.length > 1 && _arguments386[1] !== undefined ? _arguments386[1] : 60;
                since = _arguments386.length > 2 && _arguments386[2] !== undefined ? _arguments386[2] : undefined;
                limit = _arguments386.length > 3 && _arguments386[3] !== undefined ? _arguments386[3] : undefined;
                return _this401.loadMarkets();
            }).then(function () {
                market = _this401.market(symbol);
                return _this401.publicGetOHLC({
                    'pair': market['id'],
                    'interval': parseInt(timeframe / 60),
                    'since': since
                });
            }).then(function (_resp) {
                response = _resp;
                ohlcvs = response['result'][market['id']];

                return _this401.parseOHLCVs(ohlcvs, market, timeframe, since, limit);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                m,
                id,
                response,
                trades,
                _this402 = this,
                _arguments387 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments387.length > 1 && _arguments387[1] !== undefined ? _arguments387[1] : {};
                return _this402.loadMarkets();
            }).then(function () {
                m = _this402.market(market);
                id = m['id'];
                return _this402.publicGetTrades(_this402.extend({
                    'pair': id
                }, params));
            }).then(function (_resp) {
                response = _resp;
                trades = response['result'][id];

                return _this402.parseTrades(trades, m);
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                currencies,
                c,
                currency,
                code,
                balance,
                account,
                _this403 = this,
                _arguments388 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments388.length > 0 && _arguments388[0] !== undefined ? _arguments388[0] : {};
                return _this403.loadMarkets();
            }).then(function () {
                return _this403.privatePostBalance();
            }).then(function (_resp) {
                response = _resp;
                balances = response['result'];
                result = { 'info': balances };
                currencies = Object.keys(balances);

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    code = currency;
                    // X-ISO4217-A3 standard currency codes

                    if (code[0] == 'X') {
                        code = code.slice(1);
                    } else {
                        if (code[0] == 'Z') {
                            code = code.slice(1);
                        }
                    }code = _this403.commonCurrencyCode(code);
                    balance = parseFloat(balances[currency]);
                    account = {
                        'free': balance,
                        'used': 0.0,
                        'total': balance
                    };

                    result[code] = account;
                }
                return result;
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                length,
                id,
                _this404 = this,
                _arguments389 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments389.length > 4 && _arguments389[4] !== undefined ? _arguments389[4] : undefined;
                params = _arguments389.length > 5 && _arguments389[5] !== undefined ? _arguments389[5] : {};
                return _this404.loadMarkets();
            }).then(function () {
                order = {
                    'pair': _this404.marketId(market),
                    'type': side,
                    'ordertype': type,
                    'volume': amount
                };

                if (type == 'limit') {
                    order['price'] = price;
                }return _this404.privatePostAddOrder(_this404.extend(order, params));
            }).then(function (_resp) {
                response = _resp;
                length = response['result']['txid'].length;
                id = length > 1 ? response['result']['txid'] : response['result']['txid'][0];

                return {
                    'info': response,
                    'id': id
                };
            });
        },
        parseOrder: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var description = order['descr'];
            market = this.markets_by_id[description['pair']];
            var side = description['type'];
            var type = description['ordertype'];
            var symbol = market ? market['symbol'] : undefined;
            var timestamp = order['opentm'] * 1000;
            return {
                'id': order['refid'],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'status': order['status'],
                'symbol': symbol,
                'type': type,
                'side': side,
                'price': order['price'],
                'amount': order['vol']
                // 'trades': this.parseTrades (order['trades'], market),
            };
        },
        parseOrders: function parseOrders(orders) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var result = [];
            var ids = Object.keys(orders);
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var order = this.parseOrder(orders[id]);
            }
            return result;
        },
        fetchOrder: function fetchOrder(id) {
            var params,
                response,
                orders,
                order,
                _this405 = this,
                _arguments390 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments390.length > 1 && _arguments390[1] !== undefined ? _arguments390[1] : {};
                return _this405.loadMarkets();
            }).then(function () {
                return _this405.privatePostQueryOrders(_this405.extend({
                    'trades': true, // whether or not to include trades in output (optional.  default = false)
                    'txid': id // comma delimited list of transaction ids to query info about (20 maximum)
                    // 'userref': 'optional', // restrict results to given user reference id (optional)
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orders = response['result'];
                order = _this405.parseOrder(orders[id]);

                return _this405.extend({ 'info': response }, order);
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this406 = this;

            return Promise.resolve().then(function () {
                return _this406.loadMarkets();
            }).then(function () {
                return _this406.privatePostCancelOrder({ 'txid': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                auth,
                _hash3,
                binary,
                binhash,
                secret,
                signature,
                response,
                numErrors,
                _this407 = this,
                _arguments392 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments392.length > 1 && _arguments392[1] !== undefined ? _arguments392[1] : 'public';
                method = _arguments392.length > 2 && _arguments392[2] !== undefined ? _arguments392[2] : 'GET';
                params = _arguments392.length > 3 && _arguments392[3] !== undefined ? _arguments392[3] : {};
                headers = _arguments392.length > 4 && _arguments392[4] !== undefined ? _arguments392[4] : undefined;
                body = _arguments392.length > 5 && _arguments392[5] !== undefined ? _arguments392[5] : undefined;
                url = '/' + _this407.version + '/' + api + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this407.urlencode(params);
                    }
                } else {
                    nonce = _this407.nonce().toString();

                    body = _this407.urlencode(_this407.extend({ 'nonce': nonce }, params));
                    auth = _this407.encode(nonce + body);
                    _hash3 = _this407.hash(auth, 'sha256', 'binary');
                    binary = _this407.stringToBinary(_this407.encode(url));
                    binhash = _this407.binaryConcat(binary, _hash3);
                    secret = _this407.base64ToBinary(_this407.secret);
                    signature = _this407.hmac(binhash, secret, 'sha512', 'base64');

                    headers = {
                        'API-Key': _this407.apiKey,
                        'API-Sign': _this407.decode(signature),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    };
                }
                url = _this407.urls['api'] + url;
                return _this407.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    numErrors = response['error'].length;

                    if (numErrors) {
                        throw new ExchangeError(_this407.id + ' ' + _this407.json(response));
                    }
                }
                return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var lakebtc = {

        'id': 'lakebtc',
        'name': 'LakeBTC',
        'countries': 'US',
        'version': 'api_v2',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28074120-72b7c38a-6660-11e7-92d9-d9027502281d.jpg',
            'api': 'https://api.lakebtc.com',
            'www': 'https://www.lakebtc.com',
            'doc': ['https://www.lakebtc.com/s/api', 'https://www.lakebtc.com/s/api_v2']
        },
        'api': {
            'public': {
                'get': ['bcorderbook', 'bctrades', 'ticker']
            },
            'private': {
                'post': ['buyOrder', 'cancelOrders', 'getAccountInfo', 'getExternalAccounts', 'getOrders', 'getTrades', 'openOrders', 'sellOrder']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                keys,
                k,
                id,
                market,
                base,
                quote,
                symbol,
                _this408 = this;

            return Promise.resolve().then(function () {
                return _this408.publicGetTicker();
            }).then(function (_resp) {
                markets = _resp;
                result = [];
                keys = Object.keys(markets);

                for (k = 0; k < keys.length; k++) {
                    id = keys[k];
                    market = markets[id];
                    base = id.slice(0, 3);
                    quote = id.slice(3, 6);

                    base = base.toUpperCase();
                    quote = quote.toUpperCase();
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                currencies,
                c,
                currency,
                balance,
                account,
                _this409 = this,
                _arguments394 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments394.length > 0 && _arguments394[0] !== undefined ? _arguments394[0] : {};
                return _this409.loadMarkets();
            }).then(function () {
                return _this409.privatePostGetAccountInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['balance'];
                result = { 'info': response };
                currencies = Object.keys(balances);

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    balance = parseFloat(balances[currency]);
                    account = {
                        'free': balance,
                        'used': 0.0,
                        'total': balance
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this410 = this,
                _arguments395 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments395.length > 1 && _arguments395[1] !== undefined ? _arguments395[1] : {};
                return _this410.loadMarkets();
            }).then(function () {
                return _this410.publicGetBcorderbook(_this410.extend({
                    'symbol': _this410.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this410.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this410.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                tickers,
                ticker,
                timestamp,
                _this411 = this;

            return Promise.resolve().then(function () {
                return _this411.loadMarkets();
            }).then(function () {
                p = _this411.market(market);
                return _this411.publicGetTicker({
                    'symbol': p['id']
                });
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers[p['id']];
                timestamp = _this411.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this411.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this412 = this,
                _arguments397 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments397.length > 1 && _arguments397[1] !== undefined ? _arguments397[1] : {};
                return _this412.loadMarkets();
            }).then(function () {
                return _this412.publicGetBctrades(_this412.extend({
                    'symbol': _this412.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                marketId,
                order,
                response,
                _this413 = this,
                _arguments398 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments398.length > 4 && _arguments398[4] !== undefined ? _arguments398[4] : undefined;
                params = _arguments398.length > 5 && _arguments398[5] !== undefined ? _arguments398[5] : {};
                return _this413.loadMarkets();
            }).then(function () {
                if (type == 'market') {
                    throw new ExchangeError(_this413.id + ' allows limit orders only');
                }method = 'privatePost' + _this413.capitalize(side) + 'Order';
                marketId = _this413.marketId(market);
                order = {
                    'params': [price, amount, marketId]
                };
                return _this413[method](_this413.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this414 = this;

            return Promise.resolve().then(function () {
                return _this414.loadMarkets();
            }).then(function () {
                return _this414.privatePostCancelOrder({ 'params': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                query,
                signature,
                response,
                _this415 = this,
                _arguments400 = arguments;

            api = _arguments400.length > 1 && _arguments400[1] !== undefined ? _arguments400[1] : 'public';
            method = _arguments400.length > 2 && _arguments400[2] !== undefined ? _arguments400[2] : 'GET';
            params = _arguments400.length > 3 && _arguments400[3] !== undefined ? _arguments400[3] : {};
            headers = _arguments400.length > 4 && _arguments400[4] !== undefined ? _arguments400[4] : undefined;
            body = _arguments400.length > 5 && _arguments400[5] !== undefined ? _arguments400[5] : undefined;
            url = _this415.urls['api'] + '/' + _this415.version;

            if (api == 'public') {
                url += '/' + path;
                if (Object.keys(params).length) {
                    url += '?' + _this415.urlencode(params);
                }
            } else {
                nonce = _this415.nonce();

                if (Object.keys(params).length) {
                    params = params.join(',');
                } else {
                    params = '';
                }query = _this415.urlencode({
                    'tonce': nonce,
                    'accesskey': _this415.apiKey,
                    'requestmethod': method.toLowerCase(),
                    'id': nonce,
                    'method': path,
                    'params': params
                });

                body = _this415.json({
                    'method': path,
                    'params': params,
                    'id': nonce
                });
                signature = _this415.hmac(_this415.encode(query), _this415.secret, 'sha1', 'base64');

                headers = {
                    'Json-Rpc-Tonce': nonce,
                    'Authorization': "Basic " + _this415.apiKey + ':' + signature,
                    'Content-Length': body.length,
                    'Content-Type': 'application/json'
                };
            }
            response = _this415.fetch(url, method, headers, body);

            if ('error' in response) {
                throw new ExchangeError(_this415.id + ' ' + _this415.json(response));
            }return response;
        }
    };

    //-----------------------------------------------------------------------------

    var livecoin = {

        'id': 'livecoin',
        'name': 'LiveCoin',
        'countries': ['US', 'UK', 'RU'],
        'rateLimit': 1000,
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27980768-f22fc424-638a-11e7-89c9-6010a54ff9be.jpg',
            'api': 'https://api.livecoin.net',
            'www': 'https://www.livecoin.net',
            'doc': 'https://www.livecoin.net/api?lang=en'
        },
        'api': {
            'public': {
                'get': ['exchange/all/order_book', 'exchange/last_trades', 'exchange/maxbid_minask', 'exchange/order_book', 'exchange/restrictions', 'exchange/ticker', // omit params to get all tickers at once
                'info/coinInfo']
            },
            'private': {
                'get': ['exchange/client_orders', 'exchange/order', 'exchange/trades', 'exchange/commission', 'exchange/commissionCommonInfo', 'payment/balances', 'payment/balance', 'payment/get/address', 'payment/history/size', 'payment/history/transactions'],
                'post': ['exchange/buylimit', 'exchange/buymarket', 'exchange/cancellimit', 'exchange/selllimit', 'exchange/sellmarket', 'payment/out/capitalist', 'payment/out/card', 'payment/out/coin', 'payment/out/okpay', 'payment/out/payeer', 'payment/out/perfectmoney', 'payment/voucher/amount', 'payment/voucher/make', 'payment/voucher/redeem']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                symbol,
                _symbol$split11,
                _symbol$split12,
                base,
                quote,
                _this416 = this;

            return Promise.resolve().then(function () {
                return _this416.publicGetExchangeTicker();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['symbol'];
                    symbol = id;
                    _symbol$split11 = symbol.split('/');
                    _symbol$split12 = _slicedToArray(_symbol$split11, 2);
                    base = _symbol$split12[0];
                    quote = _symbol$split12[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                balances,
                result,
                b,
                balance,
                currency,
                account,
                _this417 = this,
                _arguments402 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments402.length > 0 && _arguments402[0] !== undefined ? _arguments402[0] : {};
                return _this417.loadMarkets();
            }).then(function () {
                return _this417.privateGetPaymentBalances();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (b = 0; b < _this417.currencies.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    account = undefined;

                    if (currency in result) {
                        account = result[currency];
                    } else {
                        account = _this417.account();
                    }if (balance['type'] == 'total') {
                        account['total'] = parseFloat(balance['value']);
                    }if (balance['type'] == 'available') {
                        account['free'] = parseFloat(balance['value']);
                    }if (balance['type'] == 'trade') {
                        account['used'] = parseFloat(balance['value']);
                    }result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this418 = this,
                _arguments403 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments403.length > 1 && _arguments403[1] !== undefined ? _arguments403[1] : {};
                return _this418.loadMarkets();
            }).then(function () {
                return _this418.publicGetExchangeOrderBook(_this418.extend({
                    'currencyPair': _this418.marketId(market),
                    'groupByPrice': 'false',
                    'depth': 100
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = orderbook['timestamp'];
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this418.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['best_bid']),
                'ask': parseFloat(ticker['best_ask']),
                'vwap': parseFloat(ticker['vwap']),
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['volume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var response,
                tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                ticker,
                _this419 = this;

            return Promise.resolve().then(function () {
                return _this419.loadMarkets();
            }).then(function () {
                return _this419.publicGetExchangeTicker();
            }).then(function (_resp) {
                response = _resp;
                tickers = _this419.indexBy(response, 'symbol');
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this419.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = tickers[id];

                    result[symbol] = _this419.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this420 = this;

            return Promise.resolve().then(function () {
                return _this420.loadMarkets();
            }).then(function () {
                p = _this420.market(market);
                return _this420.publicGetExchangeTicker({
                    'currencyPair': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this420.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this421 = this,
                _arguments406 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments406.length > 1 && _arguments406[1] !== undefined ? _arguments406[1] : {};
                return _this421.loadMarkets();
            }).then(function () {
                return _this421.publicGetExchangeLastTrades(_this421.extend({
                    'currencyPair': _this421.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                _this422 = this,
                _arguments407 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments407.length > 4 && _arguments407[4] !== undefined ? _arguments407[4] : undefined;
                params = _arguments407.length > 5 && _arguments407[5] !== undefined ? _arguments407[5] : {};
                return _this422.loadMarkets();
            }).then(function () {
                method = 'privatePostExchange' + _this422.capitalize(side) + type;
                order = {
                    'currencyPair': _this422.marketId(market),
                    'quantity': amount
                };

                if (type == 'limit') {
                    order['price'] = price;
                }return _this422[method](_this422.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this423 = this,
                _arguments408 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments408.length > 1 && _arguments408[1] !== undefined ? _arguments408[1] : {};
                return _this423.loadMarkets();
            }).then(function () {
                return _this423.privatePostExchangeCancellimit(_this423.extend({
                    'orderId': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                signature,
                response,
                _this424 = this,
                _arguments409 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments409.length > 1 && _arguments409[1] !== undefined ? _arguments409[1] : 'public';
                method = _arguments409.length > 2 && _arguments409[2] !== undefined ? _arguments409[2] : 'GET';
                params = _arguments409.length > 3 && _arguments409[3] !== undefined ? _arguments409[3] : {};
                headers = _arguments409.length > 4 && _arguments409[4] !== undefined ? _arguments409[4] : undefined;
                body = _arguments409.length > 5 && _arguments409[5] !== undefined ? _arguments409[5] : undefined;
                url = _this424.urls['api'] + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this424.urlencode(params);
                    }
                } else {
                    query = _this424.urlencode(_this424.keysort(params));

                    if (method == 'GET') {
                        if (query) {
                            url += '?' + query;
                        } else {
                            if (query) {
                                body = query;
                            }
                        }
                    }signature = _this424.hmac(_this424.encode(query), _this424.encode(_this424.secret), 'sha256');

                    headers = {
                        'Api-Key': _this424.apiKey,
                        'Sign': signature.toUpperCase(),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    };
                }
                return _this424.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('success' in response) {
                    if (!response['success']) {
                        throw new ExchangeError(_this424.id + ' ' + _this424.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var liqui = extend(btce, {
        'id': 'liqui',
        'name': 'Liqui',
        'countries': 'UA',
        'rateLimit': 1000,
        'version': '3',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27982022-75aea828-63a0-11e7-9511-ca584a8edd74.jpg',
            'api': {
                'public': 'https://api.liqui.io/api',
                'private': 'https://api.liqui.io/tapi'
            },
            'www': 'https://liqui.io',
            'doc': 'https://liqui.io/api'
        },

        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                signature,
                response,
                _this425 = this,
                _arguments410 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments410.length > 1 && _arguments410[1] !== undefined ? _arguments410[1] : 'public';
                method = _arguments410.length > 2 && _arguments410[2] !== undefined ? _arguments410[2] : 'GET';
                params = _arguments410.length > 3 && _arguments410[3] !== undefined ? _arguments410[3] : {};
                headers = _arguments410.length > 4 && _arguments410[4] !== undefined ? _arguments410[4] : undefined;
                body = _arguments410.length > 5 && _arguments410[5] !== undefined ? _arguments410[5] : undefined;
                url = _this425.urls['api'][api];
                query = _this425.omit(params, _this425.extractParams(path));

                if (api == 'public') {
                    url += '/' + _this425.version + '/' + _this425.implodeParams(path, params);
                    if (Object.keys(query).length) {
                        url += '?' + _this425.urlencode(query);
                    }
                } else {
                    nonce = _this425.nonce();

                    body = _this425.urlencode(_this425.extend({
                        'nonce': nonce,
                        'method': path
                    }, query));
                    signature = _this425.hmac(_this425.encode(body), _this425.encode(_this425.secret), 'sha512');

                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length.toString(),
                        'Key': _this425.apiKey,
                        'Sign': signature
                    };
                }
                return _this425.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('success' in response) {
                    if (!response['success']) {
                        throw new ExchangeError(_this425.id + ' ' + _this425.json(response));
                    }
                }return response;
            });
        }
    });

    //-----------------------------------------------------------------------------

    var luno = {

        'id': 'luno',
        'name': 'luno',
        'countries': ['GB', 'SG', 'ZA'],
        'rateLimit': 3000,
        'version': '1',
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766607-8c1a69d8-5ede-11e7-930c-540b5eb9be24.jpg',
            'api': 'https://api.mybitx.com/api',
            'www': 'https://www.luno.com',
            'doc': ['https://www.luno.com/en/api', 'https://npmjs.org/package/bitx', 'https://github.com/bausmeier/node-bitx']
        },
        'api': {
            'public': {
                'get': ['orderbook', 'ticker', 'tickers', 'trades']
            },
            'private': {
                'get': ['accounts/{id}/pending', 'accounts/{id}/transactions', 'balance', 'fee_info', 'funding_address', 'listorders', 'listtrades', 'orders/{id}', 'quotes/{id}', 'withdrawals', 'withdrawals/{id}'],
                'post': ['accounts', 'postorder', 'marketorder', 'stoporder', 'funding_address', 'withdrawals', 'send', 'quotes', 'oauth2/grant'],
                'put': ['quotes/{id}'],
                'delete': ['quotes/{id}', 'withdrawals/{id}']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this426 = this;

            return Promise.resolve().then(function () {
                return _this426.publicGetTickers();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets['tickers'].length; p++) {
                    market = markets['tickers'][p];
                    id = market['pair'];
                    base = id.slice(0, 3);
                    quote = id.slice(3, 6);

                    base = _this426.commonCurrencyCode(base);
                    quote = _this426.commonCurrencyCode(quote);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                b,
                balance,
                currency,
                reserved,
                unconfirmed,
                account,
                _this427 = this,
                _arguments412 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments412.length > 0 && _arguments412[0] !== undefined ? _arguments412[0] : {};
                return _this427.loadMarkets();
            }).then(function () {
                return _this427.privateGetBalance();
            }).then(function (_resp) {
                response = _resp;
                balances = response['balance'];
                result = { 'info': response };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = _this427.commonCurrencyCode(balance['asset']);
                    reserved = parseFloat(balance['reserved']);
                    unconfirmed = parseFloat(balance['unconfirmed']);
                    account = {
                        'free': parseFloat(balance['balance']),
                        'used': _this427.sum(reserved, unconfirmed),
                        'total': 0.0
                    };

                    account['total'] = _this427.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this428 = this,
                _arguments413 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments413.length > 1 && _arguments413[1] !== undefined ? _arguments413[1] : {};
                return _this428.loadMarkets();
            }).then(function () {
                return _this428.publicGetOrderbook(_this428.extend({
                    'pair': _this428.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = orderbook['timestamp'];
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this428.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['volume']);
                        // let timestamp = order[2] * 1000;

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = ticker['timestamp'];
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last_trade']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['rolling_24_hour_volume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var response,
                tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                ticker,
                _this429 = this;

            return Promise.resolve().then(function () {
                return _this429.loadMarkets();
            }).then(function () {
                return _this429.publicGetTickers();
            }).then(function (_resp) {
                response = _resp;
                tickers = _this429.indexBy(response['tickers'], 'pair');
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this429.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = tickers[id];

                    result[symbol] = _this429.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this430 = this;

            return Promise.resolve().then(function () {
                return _this430.loadMarkets();
            }).then(function () {
                p = _this430.market(market);
                return _this430.publicGetTicker({
                    'pair': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this430.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this431 = this,
                _arguments416 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments416.length > 1 && _arguments416[1] !== undefined ? _arguments416[1] : {};
                return _this431.loadMarkets();
            }).then(function () {
                return _this431.publicGetTrades(_this431.extend({
                    'pair': _this431.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                _this432 = this,
                _arguments417 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments417.length > 4 && _arguments417[4] !== undefined ? _arguments417[4] : undefined;
                params = _arguments417.length > 5 && _arguments417[5] !== undefined ? _arguments417[5] : {};
                return _this432.loadMarkets();
            }).then(function () {
                method = 'privatePost';
                order = { 'pair': _this432.marketId(market) };

                if (type == 'market') {
                    method += 'Marketorder';
                    order['type'] = side.toUpperCase();
                    if (side == 'buy') {
                        order['counter_volume'] = amount;
                    } else {
                        order['base_volume'] = amount;
                    }
                } else {
                    method += 'Order';
                    order['volume'] = amount;
                    order['price'] = price;
                    if (side == 'buy') {
                        order['type'] = 'BID';
                    } else {
                        order['type'] = 'ASK';
                    }
                }
                return _this432[method](_this432.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['order_id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this433 = this;

            return Promise.resolve().then(function () {
                return _this433.loadMarkets();
            }).then(function () {
                return _this433.privatePostStoporder({ 'order_id': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                auth,
                response,
                _this434 = this,
                _arguments419 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments419.length > 1 && _arguments419[1] !== undefined ? _arguments419[1] : 'public';
                method = _arguments419.length > 2 && _arguments419[2] !== undefined ? _arguments419[2] : 'GET';
                params = _arguments419.length > 3 && _arguments419[3] !== undefined ? _arguments419[3] : {};
                headers = _arguments419.length > 4 && _arguments419[4] !== undefined ? _arguments419[4] : undefined;
                body = _arguments419.length > 5 && _arguments419[5] !== undefined ? _arguments419[5] : undefined;
                url = _this434.urls['api'] + '/' + _this434.version + '/' + _this434.implodeParams(path, params);
                query = _this434.omit(params, _this434.extractParams(path));

                if (Object.keys(query).length) {
                    url += '?' + _this434.urlencode(query);
                }if (api == 'private') {
                    auth = _this434.encode(_this434.apiKey + ':' + _this434.secret);

                    auth = _this434.stringToBase64(auth);
                    headers = { 'Authorization': 'Basic ' + _this434.decode(auth) };
                }
                return _this434.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    throw new ExchangeError(_this434.id + ' ' + _this434.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var mercado = {

        'id': 'mercado',
        'name': 'Mercado Bitcoin',
        'countries': 'BR', // Brazil
        'rateLimit': 1000,
        'version': 'v3',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27837060-e7c58714-60ea-11e7-9192-f05e86adb83f.jpg',
            'api': {
                'public': 'https://www.mercadobitcoin.net/api',
                'private': 'https://www.mercadobitcoin.net/tapi'
            },
            'www': 'https://www.mercadobitcoin.com.br',
            'doc': ['https://www.mercadobitcoin.com.br/api-doc', 'https://www.mercadobitcoin.com.br/trade-api']
        },
        'api': {
            'public': {
                'get': [// last slash critical
                'orderbook/', 'orderbook_litecoin/', 'ticker/', 'ticker_litecoin/', 'trades/', 'trades_litecoin/', 'v2/ticker/', 'v2/ticker_litecoin/']
            },
            'private': {
                'post': ['cancel_order', 'get_account_info', 'get_order', 'get_withdrawal', 'list_system_messages', 'list_orders', 'list_orderbook', 'place_buy_order', 'place_sell_order', 'withdraw_coin']
            }
        },
        'markets': {
            'BTC/BRL': { 'id': 'BRLBTC', 'symbol': 'BTC/BRL', 'base': 'BTC', 'quote': 'BRL', 'suffix': '' },
            'LTC/BRL': { 'id': 'BRLLTC', 'symbol': 'LTC/BRL', 'base': 'LTC', 'quote': 'BRL', 'suffix': 'Litecoin' }
        },

        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                method,
                orderbook,
                timestamp,
                result,
                _this435 = this,
                _arguments420 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments420.length > 1 && _arguments420[1] !== undefined ? _arguments420[1] : {};
                p = _this435.market(market);
                method = 'publicGetOrderbook' + _this435.capitalize(p['suffix']);
                return _this435[method](params);
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this435.milliseconds();
                result = {
                    'bids': orderbook['bids'],
                    'asks': orderbook['asks'],
                    'timestamp': timestamp,
                    'datetime': _this435.iso8601(timestamp)
                };

                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                method,
                response,
                ticker,
                timestamp,
                _this436 = this;

            return Promise.resolve().then(function () {
                p = _this436.market(market);
                method = 'publicGetV2Ticker' + _this436.capitalize(p['suffix']);
                return _this436[method]();
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];
                timestamp = parseInt(ticker['date']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this436.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                p,
                method,
                _this437 = this,
                _arguments422 = arguments;

            params = _arguments422.length > 1 && _arguments422[1] !== undefined ? _arguments422[1] : {};
            p = _this437.market(market);
            method = 'publicGetTrades' + _this437.capitalize(p['suffix']);

            return _this437[method](params);
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                c,
                currency,
                lowercase,
                account,
                _this438 = this,
                _arguments423 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments423.length > 0 && _arguments423[0] !== undefined ? _arguments423[0] : {};
                return _this438.privatePostGetAccountInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['balance'];
                result = { 'info': response };

                for (c = 0; c < _this438.currencies.length; c++) {
                    currency = _this438.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = _this438.account();

                    if (lowercase in balances) {
                        account['free'] = parseFloat(balances[lowercase]['available']);
                        account['total'] = parseFloat(balances[lowercase]['total']);
                        account['used'] = account['total'] - account['free'];
                    }
                    result[currency] = account;
                }
                return result;
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                _this439 = this,
                _arguments424 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments424.length > 4 && _arguments424[4] !== undefined ? _arguments424[4] : undefined;
                params = _arguments424.length > 5 && _arguments424[5] !== undefined ? _arguments424[5] : {};

                if (type == 'market') {
                    throw new ExchangeError(_this439.id + ' allows limit orders only');
                }method = 'privatePostPlace' + _this439.capitalize(side) + 'Order';
                order = {
                    'coin_pair': _this439.marketId(market),
                    'quantity': amount,
                    'limit_price': price
                };
                return _this439[method](_this439.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['response_data']['order']['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this440 = this,
                _arguments425 = arguments;

            params = _arguments425.length > 1 && _arguments425[1] !== undefined ? _arguments425[1] : {};

            return _this440.privatePostCancelOrder(_this440.extend({
                'order_id': id
            }, params));
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                auth,
                response,
                _this441 = this,
                _arguments426 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments426.length > 1 && _arguments426[1] !== undefined ? _arguments426[1] : 'public';
                method = _arguments426.length > 2 && _arguments426[2] !== undefined ? _arguments426[2] : 'GET';
                params = _arguments426.length > 3 && _arguments426[3] !== undefined ? _arguments426[3] : {};
                headers = _arguments426.length > 4 && _arguments426[4] !== undefined ? _arguments426[4] : undefined;
                body = _arguments426.length > 5 && _arguments426[5] !== undefined ? _arguments426[5] : undefined;
                url = _this441.urls['api'][api] + '/';

                if (api == 'public') {
                    url += path;
                } else {
                    url += _this441.version + '/';
                    nonce = _this441.nonce();

                    body = _this441.urlencode(_this441.extend({
                        'tapi_method': path,
                        'tapi_nonce': nonce
                    }, params));
                    auth = '/tapi/' + _this441.version + '/' + '?' + body;

                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'TAPI-ID': _this441.apiKey,
                        'TAPI-MAC': _this441.hmac(_this441.encode(auth), _this441.secret, 'sha512')
                    };
                }
                return _this441.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error_message' in response) {
                    throw new ExchangeError(_this441.id + ' ' + _this441.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------
    // OKCoin
    // China
    // https://www.okcoin.com/
    // https://www.okcoin.com/rest_getStarted.html
    // https://github.com/OKCoin/websocket
    // https://www.npmjs.com/package/okcoin.com
    // https://www.okcoin.cn
    // https://www.okcoin.cn/rest_getStarted.html

    var okcoin = {

        'version': 'v1',
        'rateLimit': 1000, // up to 3000 requests per 5 minutes ≈ 600 requests per minute ≈ 10 requests per second ≈ 100 ms
        'api': {
            'public': {
                'get': ['depth', 'exchange_rate', 'future_depth', 'future_estimated_price', 'future_hold_amount', 'future_index', 'future_kline', 'future_price_limit', 'future_ticker', 'future_trades', 'kline', 'otcs', 'ticker', 'trades']
            },
            'private': {
                'post': ['account_records', 'batch_trade', 'borrow_money', 'borrow_order_info', 'borrows_info', 'cancel_borrow', 'cancel_order', 'cancel_otc_order', 'cancel_withdraw', 'future_batch_trade', 'future_cancel', 'future_devolve', 'future_explosive', 'future_order_info', 'future_orders_info', 'future_position', 'future_position_4fix', 'future_trade', 'future_trades_history', 'future_userinfo', 'future_userinfo_4fix', 'lend_depth', 'order_fee', 'order_history', 'order_info', 'orders_info', 'otc_order_history', 'otc_order_info', 'repayment', 'submit_otc_order', 'trade', 'trade_history', 'trade_otc_order', 'withdraw', 'withdraw_info', 'unrepayments_info', 'userinfo']
            }
        },

        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                _this442 = this,
                _arguments427 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments427.length > 1 && _arguments427[1] !== undefined ? _arguments427[1] : {};
                return _this442.publicGetDepth(_this442.extend({
                    'symbol': _this442.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this442.milliseconds();
                result = {
                    'bids': orderbook['bids'],
                    'asks': _this442.sortBy(orderbook['asks'], 0),
                    'timestamp': timestamp,
                    'datetime': _this442.iso8601(timestamp)
                };

                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = ticker['timestamp'];
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['buy']),
                'ask': parseFloat(ticker['sell']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['vol']),
                'info': ticker
            };
        },
        fetchTicker: function fetchTicker(market) {
            var m,
                response,
                timestamp,
                ticker,
                _this443 = this;

            return Promise.resolve().then(function () {
                m = _this443.market(market);
                return _this443.publicGetTicker({
                    'symbol': m['id']
                });
            }).then(function (_resp) {
                response = _resp;
                timestamp = parseInt(response['date']) * 1000;
                ticker = _this443.extend(response['ticker'], { 'timestamp': timestamp });

                return _this443.parseTicker(ticker, m);
            });
        },
        parseTrade: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'info': trade,
                'timestamp': trade['date_ms'],
                'datetime': this.iso8601(trade['date_ms']),
                'symbol': symbol,
                'id': trade['tid'],
                'order': undefined,
                'type': undefined,
                'side': trade['type'],
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['amount'])
            };
        },
        fetchTrades: function fetchTrades(symbol) {
            var params,
                market,
                response,
                _this444 = this,
                _arguments429 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments429.length > 1 && _arguments429[1] !== undefined ? _arguments429[1] : {};
                market = _this444.market(symbol);
                return _this444.publicGetTrades(_this444.extend({
                    'symbol': market['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return _this444.parseTrades(response, market);
            });
        },
        fetchOHLCV: function fetchOHLCV(symbol) {
            var timeframe,
                since,
                limit,
                params,
                market,
                t,
                timeframes,
                request,
                response,
                _this445 = this,
                _arguments430 = arguments;

            return Promise.resolve().then(function () {
                timeframe = _arguments430.length > 1 && _arguments430[1] !== undefined ? _arguments430[1] : 60;
                since = _arguments430.length > 2 && _arguments430[2] !== undefined ? _arguments430[2] : undefined;
                limit = _arguments430.length > 3 && _arguments430[3] !== undefined ? _arguments430[3] : 1440;
                params = _arguments430.length > 4 && _arguments430[4] !== undefined ? _arguments430[4] : {};
                market = _this445.market(symbol);
                t = timeframe.toString();
                timeframes = {
                    '60': '1min',
                    '180': '3min',
                    '300': '5min',
                    '900': '15min',
                    '1800': '30min',
                    '3600': '1hour',
                    '7200': '2hour',
                    '14400': '4hour',
                    '21600': '6hour',
                    '43200': '12hour',
                    '86400': '1day',
                    '259200': '3day',
                    '604800': '1week'
                };
                request = {
                    'symbol': market['id'],
                    'type': timeframes[t],
                    'size': parseInt(limit)
                };

                if (since) {
                    request['since'] = since;
                } else {
                    request['since'] = _this445.milliseconds() - 86400000; // last 24 hours
                }
                return _this445.publicGetKline(_this445.extend(request, params));
            }).then(function (_resp) {
                response = _resp;

                return _this445.parseOHLCVs(response, market, timeframe, since, limit);
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                c,
                currency,
                lowercase,
                account,
                _this446 = this,
                _arguments431 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments431.length > 0 && _arguments431[0] !== undefined ? _arguments431[0] : {};
                return _this446.privatePostUserinfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['info']['funds'];
                result = { 'info': response };

                for (c = 0; c < _this446.currencies.length; c++) {
                    currency = _this446.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = _this446.account();

                    if (lowercase in balances['free']) {
                        account['free'] = parseFloat(balances['free'][lowercase]);
                    }if (lowercase in balances['freezed']) {
                        account['used'] = parseFloat(balances['freezed'][lowercase]);
                    }account['total'] = _this446.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this447 = this,
                _arguments432 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments432.length > 4 && _arguments432[4] !== undefined ? _arguments432[4] : undefined;
                params = _arguments432.length > 5 && _arguments432[5] !== undefined ? _arguments432[5] : {};
                order = {
                    'symbol': _this447.marketId(market),
                    'type': side
                };

                if (type == 'limit') {
                    order['price'] = price;
                    order['amount'] = amount;
                } else {
                    if (side == 'buy') {
                        order['price'] = params;
                    } else {
                        order['amount'] = amount;
                    }
                    order['type'] += '_market';
                }
                return _this447.privatePostTrade(_this447.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this448 = this,
                _arguments433 = arguments;

            params = _arguments433.length > 1 && _arguments433[1] !== undefined ? _arguments433[1] : {};

            return _this448.privatePostCancelOrder(_this448.extend({
                'order_id': id
            }, params));
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                queryString,
                response,
                _this449 = this,
                _arguments434 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments434.length > 1 && _arguments434[1] !== undefined ? _arguments434[1] : 'public';
                method = _arguments434.length > 2 && _arguments434[2] !== undefined ? _arguments434[2] : 'GET';
                params = _arguments434.length > 3 && _arguments434[3] !== undefined ? _arguments434[3] : {};
                headers = _arguments434.length > 4 && _arguments434[4] !== undefined ? _arguments434[4] : undefined;
                body = _arguments434.length > 5 && _arguments434[5] !== undefined ? _arguments434[5] : undefined;
                url = '/' + 'api' + '/' + _this449.version + '/' + path + '.do';

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this449.urlencode(params);
                    }
                } else {
                    query = _this449.keysort(_this449.extend({
                        'api_key': _this449.apiKey
                    }, params));
                    // secret key must be at the end of query

                    queryString = _this449.urlencode(query) + '&secret_key=' + _this449.secret;

                    query['sign'] = _this449.hash(_this449.encode(queryString)).toUpperCase();
                    body = _this449.urlencode(query);
                    headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                }
                url = _this449.urls['api'] + url;
                return _this449.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('result' in response) {
                    if (!response['result']) {
                        throw new ExchangeError(_this449.id + ' ' + _this449.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var okcoincny = extend(okcoin, {
        'id': 'okcoincny',
        'name': 'OKCoin CNY',
        'countries': 'CN',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766792-8be9157a-5ee5-11e7-926c-6d69b8d3378d.jpg',
            'api': 'https://www.okcoin.cn',
            'www': 'https://www.okcoin.cn',
            'doc': 'https://www.okcoin.cn/rest_getStarted.html'
        },
        'markets': {
            'BTC/CNY': { 'id': 'btc_cny', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY' },
            'LTC/CNY': { 'id': 'ltc_cny', 'symbol': 'LTC/CNY', 'base': 'LTC', 'quote': 'CNY' }
        }
    });

    //-----------------------------------------------------------------------------

    var okcoinusd = extend(okcoin, {
        'id': 'okcoinusd',
        'name': 'OKCoin USD',
        'countries': ['CN', 'US'],
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766791-89ffb502-5ee5-11e7-8a5b-c5950b68ac65.jpg',
            'api': 'https://www.okcoin.com',
            'www': 'https://www.okcoin.com',
            'doc': ['https://www.okcoin.com/rest_getStarted.html', 'https://www.npmjs.com/package/okcoin.com']
        },
        'markets': {
            'BTC/USD': { 'id': 'btc_usd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'LTC/USD': { 'id': 'ltc_usd', 'symbol': 'LTC/USD', 'base': 'LTC', 'quote': 'USD' },
            'ETH/USD': { 'id': 'eth_usd', 'symbol': 'ETH/USD', 'base': 'ETH', 'quote': 'USD' },
            'ETC/USD': { 'id': 'etc_usd', 'symbol': 'ETC/USD', 'base': 'ETC', 'quote': 'USD' }
        }
    });

    //-----------------------------------------------------------------------------

    var okex = extend(okcoin, {
        'id': 'okex',
        'name': 'OKEX',
        'countries': ['CN', 'US'],
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/29562593-9038a9bc-8742-11e7-91cc-8201f845bfc1.jpg',
            'api': 'https://www.okex.com',
            'www': 'https://www.okex.com',
            'doc': 'https://www.okex.com/rest_getStarted.html'
        },
        'markets': {
            'BTC/USD': { 'id': 'btc_usd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'LTC/USD': { 'id': 'ltc_usd', 'symbol': 'LTC/USD', 'base': 'LTC', 'quote': 'USD' }
            // 'LTC/BTC': { 'id': 'ltc_btc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            // 'ETH/BTC': { 'id': 'eth_btc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' },
            // 'ETC/BTC': { 'id': 'etc_btc', 'symbol': 'ETC/BTC', 'base': 'ETC', 'quote': 'BTC' },
            // 'BCH/BTC': { 'id': 'bcc_btc', 'symbol': 'BCH/BTC', 'base': 'BCH', 'quote': 'BTC' },
        },

        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                _this450 = this,
                _arguments435 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments435.length > 1 && _arguments435[1] !== undefined ? _arguments435[1] : {};
                return _this450.publicGetFutureDepth(_this450.extend({
                    'symbol': _this450.marketId(market),
                    'contract_type': 'this_week' // next_week, quarter
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this450.milliseconds();
                result = {
                    'bids': orderbook['bids'],
                    'asks': _this450.sortBy(orderbook['asks'], 0),
                    'timestamp': timestamp,
                    'datetime': _this450.iso8601(timestamp)
                };

                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var params,
                m,
                response,
                timestamp,
                ticker,
                _this451 = this,
                _arguments436 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments436.length > 1 && _arguments436[1] !== undefined ? _arguments436[1] : {};
                m = _this451.market(market);
                return _this451.publicGetFutureTicker(_this451.extend({
                    'symbol': m['id'],
                    'contract_type': 'this_week' // next_week, quarter
                }, params));
            }).then(function (_resp) {
                response = _resp;
                timestamp = parseInt(response['date']) * 1000;
                ticker = _this451.extend(response['ticker'], { 'timestamp': timestamp });

                return _this451.parseTicker(ticker, m);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this452 = this,
                _arguments437 = arguments;

            params = _arguments437.length > 1 && _arguments437[1] !== undefined ? _arguments437[1] : {};

            return _this452.publicGetFutureTrades(_this452.extend({
                'symbol': _this452.marketId(market),
                'contract_type': 'this_week' // next_week, quarter
            }, params));
        },
        fetchOHLCV: function fetchOHLCV(symbol) {
            var timeframe,
                since,
                limit,
                market,
                response,
                _this453 = this,
                _arguments438 = arguments;

            return Promise.resolve().then(function () {
                timeframe = _arguments438.length > 1 && _arguments438[1] !== undefined ? _arguments438[1] : 60;
                since = _arguments438.length > 2 && _arguments438[2] !== undefined ? _arguments438[2] : undefined;
                limit = _arguments438.length > 3 && _arguments438[3] !== undefined ? _arguments438[3] : undefined;
                market = _this453.market(symbol);
                return _this453.publicGetFutureKline({
                    'symbol': market['id'],
                    'contract_type': 'this_week', // next_week, quarter
                    'type': '1min',
                    'since': since,
                    'size': parseInt(limit)
                });
            }).then(function (_resp) {
                response = _resp;

                return _this453.parseOHLCVs(market, response, timeframe, since, limit);
            });
        },
        createOrder: function createOrder(symbol, type, side, amount) {
            var price,
                params,
                orderType,
                order,
                response,
                _this454 = this,
                _arguments439 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments439.length > 4 && _arguments439[4] !== undefined ? _arguments439[4] : undefined;
                params = _arguments439.length > 5 && _arguments439[5] !== undefined ? _arguments439[5] : {};
                orderType = side == 'buy' ? '1' : '2';
                order = {
                    'symbol': _this454.marketId(symbol),
                    'type': orderType,
                    'contract_type': 'this_week', // next_week, quarter
                    'match_price': 0, // match best counter party price? 0 or 1, ignores price if 1
                    'lever_rate': 10, // leverage rate value: 10 or 20 (10 by default)
                    'price': price,
                    'amount': amount
                };
                return _this454.privatePostFutureTrade(_this454.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this455 = this,
                _arguments440 = arguments;

            params = _arguments440.length > 1 && _arguments440[1] !== undefined ? _arguments440[1] : {};

            return _this455.privatePostFutureCancel(_this455.extend({
                'order_id': id
            }, params));
        }
    });

    //-----------------------------------------------------------------------------

    var paymium = {

        'id': 'paymium',
        'name': 'Paymium',
        'countries': ['FR', 'EU'],
        'rateLimit': 2000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27790564-a945a9d4-5ff9-11e7-9d2d-b635763f2f24.jpg',
            'api': 'https://paymium.com/api',
            'www': 'https://www.paymium.com',
            'doc': ['https://github.com/Paymium/api-documentation', 'https://www.paymium.com/page/developers']
        },
        'api': {
            'public': {
                'get': ['countries', 'data/{id}/ticker', 'data/{id}/trades', 'data/{id}/depth', 'bitcoin_charts/{id}/trades', 'bitcoin_charts/{id}/depth']
            },
            'private': {
                'get': ['merchant/get_payment/{UUID}', 'user', 'user/addresses', 'user/addresses/{btc_address}', 'user/orders', 'user/orders/{UUID}', 'user/price_alerts'],
                'post': ['user/orders', 'user/addresses', 'user/payment_requests', 'user/price_alerts', 'merchant/create_payment'],
                'delete': ['user/orders/{UUID}/cancel', 'user/price_alerts/{id}']
            }
        },
        'markets': {
            'BTC/EUR': { 'id': 'eur', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                balances,
                result,
                c,
                currency,
                lowercase,
                account,
                balance,
                locked,
                _this456 = this,
                _arguments441 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments441.length > 0 && _arguments441[0] !== undefined ? _arguments441[0] : {};
                return _this456.privateGetUser();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (c = 0; c < _this456.currencies.length; c++) {
                    currency = _this456.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = _this456.account();
                    balance = 'balance_' + lowercase;
                    locked = 'locked_' + lowercase;

                    if (balance in balances) {
                        account['free'] = balances[balance];
                    }if (locked in balances) {
                        account['used'] = balances[locked];
                    }account['total'] = _this456.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _timestamp6,
                _this457 = this,
                _arguments442 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments442.length > 1 && _arguments442[1] !== undefined ? _arguments442[1] : {};
                return _this457.publicGetDataIdDepth(_this457.extend({
                    'id': _this457.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this457.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this457.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order['price'];
                        amount = order['amount'];
                        _timestamp6 = order['timestamp'] * 1000;

                        result[side].push([price, amount, _timestamp6]);
                    }
                }
                result['bids'] = _this457.sortBy(result['bids'], 0, true);
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this458 = this;

            return Promise.resolve().then(function () {
                return _this458.publicGetDataIdTicker({
                    'id': _this458.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = ticker['at'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this458.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['price']),
                    'change': undefined,
                    'percentage': parseFloat(ticker['variation']),
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this459 = this,
                _arguments444 = arguments;

            params = _arguments444.length > 1 && _arguments444[1] !== undefined ? _arguments444[1] : {};

            return _this459.publicGetDataIdTrades(_this459.extend({
                'id': _this459.marketId(market)
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this460 = this,
                _arguments445 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments445.length > 4 && _arguments445[4] !== undefined ? _arguments445[4] : undefined;
                params = _arguments445.length > 5 && _arguments445[5] !== undefined ? _arguments445[5] : {};
                order = {
                    'type': _this460.capitalize(type) + 'Order',
                    'currency': _this460.marketId(market),
                    'direction': side,
                    'amount': amount
                };

                if (type == 'market') {
                    order['price'] = price;
                }return _this460.privatePostUserOrders(_this460.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['uuid']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this461 = this,
                _arguments446 = arguments;

            params = _arguments446.length > 1 && _arguments446[1] !== undefined ? _arguments446[1] : {};

            return _this461.privatePostCancelOrder(_this461.extend({
                'orderNumber': id
            }, params));
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                auth,
                response,
                _this462 = this,
                _arguments447 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments447.length > 1 && _arguments447[1] !== undefined ? _arguments447[1] : 'public';
                method = _arguments447.length > 2 && _arguments447[2] !== undefined ? _arguments447[2] : 'GET';
                params = _arguments447.length > 3 && _arguments447[3] !== undefined ? _arguments447[3] : {};
                headers = _arguments447.length > 4 && _arguments447[4] !== undefined ? _arguments447[4] : undefined;
                body = _arguments447.length > 5 && _arguments447[5] !== undefined ? _arguments447[5] : undefined;
                url = _this462.urls['api'] + '/' + _this462.version + '/' + _this462.implodeParams(path, params);
                query = _this462.omit(params, _this462.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this462.urlencode(query);
                    }
                } else {
                    body = _this462.json(params);
                    nonce = _this462.nonce().toString();
                    auth = nonce + url + body;

                    headers = {
                        'Api-Key': _this462.apiKey,
                        'Api-Signature': _this462.hmac(_this462.encode(auth), _this462.secret),
                        'Api-Nonce': nonce,
                        'Content-Type': 'application/json'
                    };
                }
                return _this462.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('errors' in response) {
                    throw new ExchangeError(_this462.id + ' ' + _this462.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var poloniex = {

        'id': 'poloniex',
        'name': 'Poloniex',
        'countries': 'US',
        'rateLimit': 500, // 6 calls per second
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766817-e9456312-5ee6-11e7-9b3c-b628ca5626a5.jpg',
            'api': {
                'public': 'https://poloniex.com/public',
                'private': 'https://poloniex.com/tradingApi'
            },
            'www': 'https://poloniex.com',
            'doc': ['https://poloniex.com/support/api/', 'http://pastebin.com/dMX7mZE0']
        },
        'api': {
            'public': {
                'get': ['return24hVolume', 'returnChartData', 'returnCurrencies', 'returnLoanOrders', 'returnOrderBook', 'returnTicker', 'returnTradeHistory']
            },
            'private': {
                'post': ['buy', 'cancelLoanOffer', 'cancelOrder', 'closeMarginPosition', 'createLoanOffer', 'generateNewAddress', 'getMarginPosition', 'marginBuy', 'marginSell', 'moveOrder', 'returnActiveLoans', 'returnAvailableAccountBalances', 'returnBalances', 'returnCompleteBalances', 'returnDepositAddresses', 'returnDepositsWithdrawals', 'returnFeeInfo', 'returnLendingHistory', 'returnMarginAccountSummary', 'returnOpenLoanOffers', 'returnOpenOrders', 'returnOrderTrades', 'returnTradableBalances', 'returnTradeHistory', 'sell', 'toggleAutoRenew', 'transferBalance', 'withdraw']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                keys,
                result,
                p,
                id,
                market,
                _id$split7,
                _id$split8,
                quote,
                base,
                symbol,
                _this463 = this;

            return Promise.resolve().then(function () {
                return _this463.publicGetReturnTicker();
            }).then(function (_resp) {
                markets = _resp;
                keys = Object.keys(markets);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    market = markets[id];
                    _id$split7 = id.split('_');
                    _id$split8 = _slicedToArray(_id$split7, 2);
                    quote = _id$split8[0];
                    base = _id$split8[1];
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                balances,
                result,
                currencies,
                c,
                currency,
                balance,
                account,
                _this464 = this,
                _arguments449 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments449.length > 0 && _arguments449[0] !== undefined ? _arguments449[0] : {};
                return _this464.loadMarkets();
            }).then(function () {
                return _this464.privatePostReturnCompleteBalances({
                    'account': 'all'
                });
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };
                currencies = Object.keys(balances);

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    balance = balances[currency];
                    account = {
                        'free': parseFloat(balance['available']),
                        'used': parseFloat(balance['onOrders']),
                        'total': 0.0
                    };

                    account['total'] = _this464.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        parseBidAsk: function parseBidAsk(bidask) {
            var price = parseFloat(bidask[0]);
            var amount = parseFloat(bidask[1]);
            return [price, amount];
        },
        parseBidAsks: function parseBidAsks(bidasks) {
            var result = [];
            for (var i = 0; i < bidasks.length; i++) {
                result.push(this.parseBidAsk(bidasks[i]));
            }
            return result;
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                _this465 = this,
                _arguments450 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments450.length > 1 && _arguments450[1] !== undefined ? _arguments450[1] : {};
                return _this465.loadMarkets();
            }).then(function () {
                return _this465.publicGetReturnOrderBook(_this465.extend({
                    'currencyPair': _this465.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this465.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this465.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];

                    result[side] = _this465.parseBidAsks(orderbook[side]);
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high24hr']),
                'low': parseFloat(ticker['low24hr']),
                'bid': parseFloat(ticker['highestBid']),
                'ask': parseFloat(ticker['lowestAsk']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': parseFloat(ticker['percentChange']),
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['baseVolume']),
                'quoteVolume': parseFloat(ticker['quoteVolume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                ticker,
                _this466 = this;

            return Promise.resolve().then(function () {
                return _this466.loadMarkets();
            }).then(function () {
                return _this466.publicGetReturnTicker();
            }).then(function (_resp) {
                tickers = _resp;
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this466.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = tickers[id];

                    result[symbol] = _this466.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var m,
                tickers,
                ticker,
                _this467 = this;

            return Promise.resolve().then(function () {
                return _this467.loadMarkets();
            }).then(function () {
                m = _this467.market(market);
                return _this467.publicGetReturnTicker();
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers[m['id']];

                return _this467.parseTicker(ticker, m);
            });
        },
        parseTrade: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.parse8601(trade['date']);
            var id = undefined;
            var order = undefined;
            var symbol = undefined;
            if (market) {
                symbol = market['symbol'];
            } else if ('currencyPair' in trade) {
                var marketId = trade['currencyPair'];
                symbol = this.markets_by_id[marketId]['symbol'];
            }
            if ('tradeID' in trade) id = trade['tradeID'];
            if ('orderNumber' in trade) order = trade['orderNumber'];
            return {
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': symbol,
                'id': id,
                'order': order,
                'type': undefined,
                'side': trade['type'],
                'price': parseFloat(trade['rate']),
                'amount': parseFloat(trade['amount'])
            };
        },
        fetchTrades: function fetchTrades(symbol) {
            var params,
                market,
                trades,
                _this468 = this,
                _arguments453 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments453.length > 1 && _arguments453[1] !== undefined ? _arguments453[1] : {};
                return _this468.loadMarkets();
            }).then(function () {
                market = _this468.market(symbol);
                return _this468.publicGetReturnTradeHistory(_this468.extend({
                    'currencyPair': market['id'],
                    'end': _this468.seconds() // last 50000 trades by default
                }, params));
            }).then(function (_resp) {
                trades = _resp;

                return _this468.parseTrades(trades, market);
            });
        },
        fetchMyTrades: function fetchMyTrades() {
            var symbol,
                params,
                market,
                pair,
                request,
                response,
                result,
                ids,
                i,
                id,
                _market2,
                _symbol3,
                _this469 = this,
                _arguments454 = arguments;

            return Promise.resolve().then(function () {
                symbol = _arguments454.length > 0 && _arguments454[0] !== undefined ? _arguments454[0] : undefined;
                params = _arguments454.length > 1 && _arguments454[1] !== undefined ? _arguments454[1] : {};
                return _this469.loadMarkets();
            }).then(function () {
                market = undefined;

                if (symbol) {
                    market = _this469.market(symbol);
                }pair = market ? market['id'] : 'all';
                request = _this469.extend({
                    'currencyPair': pair,
                    'end': _this469.seconds() // last 50000 trades by default
                }, params);
                return _this469.privatePostReturnTradeHistory(request);
            }).then(function (_resp) {
                response = _resp;
                result = undefined;

                if (market) {
                    result = _this469.parseTrades(response, market);
                } else {
                    result = { 'info': response };
                    ids = Object.keys(response);

                    for (i = 0; i < ids.length; i++) {
                        id = ids[i];
                        _market2 = _this469.markets_by_id[id];
                        _symbol3 = _market2['symbol'];

                        result[_symbol3] = _this469.parseTrades(response[id], _market2);
                    }
                }
                return result;
            });
        },
        parseOrder: function parseOrder(order, market) {
            var trades = undefined;
            if ('resultingTrades' in order) trades = this.parseTrades(order['resultingTrades'], market);
            return {
                'info': order,
                'id': order['orderNumber'],
                'timestamp': order['timestamp'],
                'datetime': this.iso8601(order['timestamp']),
                'status': order['status'],
                'symbol': market['symbol'],
                'type': order['type'],
                'side': order['side'],
                'price': order['price'],
                'amount': order['amount'],
                'trades': trades
            };
        },
        fetchOpenOrders: function fetchOpenOrders() {
            var symbol,
                params,
                market,
                pair,
                response,
                result,
                orders,
                i,
                order,
                timestamp,
                extended,
                ids,
                _i,
                id,
                _orders,
                _market3,
                _symbol4,
                o,
                _order,
                _timestamp7,
                _extended,
                _this470 = this,
                _arguments455 = arguments;

            return Promise.resolve().then(function () {
                symbol = _arguments455.length > 0 && _arguments455[0] !== undefined ? _arguments455[0] : undefined;
                params = _arguments455.length > 1 && _arguments455[1] !== undefined ? _arguments455[1] : {};
                return _this470.loadMarkets();
            }).then(function () {
                market = undefined;

                if (symbol) {
                    market = _this470.market(symbol);
                }pair = market ? market['id'] : 'all';
                return _this470.privatePostReturnOpenOrders(_this470.extend({
                    'currencyPair': pair
                }));
            }).then(function (_resp) {
                response = _resp;
                result = [];

                if (market) {
                    orders = response;

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        timestamp = _this470.parse8601(order['date']);
                        extended = _this470.extend(order, {
                            'timestamp': timestamp,
                            'status': 'open',
                            'type': 'limit',
                            'side': order['type'],
                            'price': order['rate']
                        });

                        result.push(_this470.parseOrder(extended, market));
                    }
                } else {
                    ids = Object.keys(response);

                    for (_i = 0; _i < ids.length; _i++) {
                        id = ids[_i];
                        _orders = response[id];
                        _market3 = _this470.markets_by_id[id];
                        _symbol4 = _market3['symbol'];

                        for (o = 0; o < _orders.length; o++) {
                            _order = _orders[o];
                            _timestamp7 = _this470.parse8601(_order['date']);
                            _extended = _this470.extend(_order, {
                                'timestamp': _timestamp7,
                                'status': 'open',
                                'type': 'limit',
                                'side': _order['type'],
                                'price': _order['rate']
                            });

                            result.push(_this470.parseOrder(_extended, _market3));
                        }
                    }
                }
                return result;
            });
        },
        fetchOrderStatus: function fetchOrderStatus(id) {
            var market,
                orders,
                indexed,
                _this471 = this,
                _arguments456 = arguments;

            return Promise.resolve().then(function () {
                market = _arguments456.length > 1 && _arguments456[1] !== undefined ? _arguments456[1] : undefined;
                return _this471.loadMarkets();
            }).then(function () {
                return _this471.fetchOpenOrders(market);
            }).then(function (_resp) {
                orders = _resp;
                indexed = _this471.indexBy(orders, 'id');

                return id in indexed ? 'open' : 'closed';
            });
        },
        createOrder: function createOrder(symbol, type, side, amount) {
            var price,
                params,
                method,
                market,
                response,
                timestamp,
                order,
                id,
                _this472 = this,
                _arguments457 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments457.length > 4 && _arguments457[4] !== undefined ? _arguments457[4] : undefined;
                params = _arguments457.length > 5 && _arguments457[5] !== undefined ? _arguments457[5] : {};

                if (type == 'market') {
                    throw new ExchangeError(_this472.id + ' allows limit orders only');
                }return _this472.loadMarkets();
            }).then(function () {
                method = 'privatePost' + _this472.capitalize(side);
                market = _this472.market(symbol);
                return _this472[method](_this472.extend({
                    'currencyPair': market['id'],
                    'rate': price,
                    'amount': amount
                }, params));
            }).then(function (_resp) {
                response = _resp;
                timestamp = _this472.milliseconds();
                order = _this472.parseOrder(_this472.extend({
                    'timestamp': timestamp,
                    'status': 'open',
                    'type': type,
                    'side': side,
                    'price': price,
                    'amount': amount
                }, response), market);
                id = order['id'];

                _this472.orders[id] = order;
                return _this472.extend({ 'info': response }, order);
            });
        },
        fetchOrder: function fetchOrder(id) {
            var orders,
                index,
                _this473 = this;

            return Promise.resolve().then(function () {
                return _this473.loadMarkets();
            }).then(function () {
                return _this473.fetchOpenOrders();
            }).then(function (_resp) {
                orders = _resp;
                index = _this473.indexBy(orders, 'id');

                if (id in index) {
                    _this473.orders[id] = index[id];
                    return index[id];
                } else {
                    if (id in _this473.orders) {
                        _this473.orders[id]['status'] = 'closed';
                        return _this473.orders[id];
                    } else {
                        throw new ExchangeError(_this473.id + ' order ' + id + ' not found');
                    }
                }
            });
        },
        fetchOrderTrades: function fetchOrderTrades(id) {
            var params,
                trades,
                _this474 = this,
                _arguments459 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments459.length > 1 && _arguments459[1] !== undefined ? _arguments459[1] : {};
                return _this474.loadMarkets();
            }).then(function () {
                return _this474.privatePostReturnOrderTrades(_this474.extend({
                    'orderNumber': id
                }, params));
            }).then(function (_resp) {
                trades = _resp;

                return _this474.parseTrades(trades);
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this475 = this,
                _arguments460 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments460.length > 1 && _arguments460[1] !== undefined ? _arguments460[1] : {};
                return _this475.loadMarkets();
            }).then(function () {
                return _this475.privatePostCancelOrder(_this475.extend({
                    'orderNumber': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                response,
                error,
                failed,
                _this476 = this,
                _arguments461 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments461.length > 1 && _arguments461[1] !== undefined ? _arguments461[1] : 'public';
                method = _arguments461.length > 2 && _arguments461[2] !== undefined ? _arguments461[2] : 'GET';
                params = _arguments461.length > 3 && _arguments461[3] !== undefined ? _arguments461[3] : {};
                headers = _arguments461.length > 4 && _arguments461[4] !== undefined ? _arguments461[4] : undefined;
                body = _arguments461.length > 5 && _arguments461[5] !== undefined ? _arguments461[5] : undefined;
                url = _this476.urls['api'][api];
                query = _this476.extend({ 'command': path }, params);

                if (api == 'public') {
                    url += '?' + _this476.urlencode(query);
                } else {
                    query['nonce'] = _this476.nonce();
                    body = _this476.urlencode(query);
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Key': _this476.apiKey,
                        'Sign': _this476.hmac(_this476.encode(body), _this476.encode(_this476.secret), 'sha512')
                    };
                }
                return _this476.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    error = _this476.id + ' ' + _this476.json(response);
                    failed = response['error'].indexOf('Not enough') >= 0;

                    if (failed) {
                        throw new InsufficientFunds(error);
                    }throw new ExchangeError(error);
                }
                return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var quadrigacx = {

        'id': 'quadrigacx',
        'name': 'QuadrigaCX',
        'countries': 'CA',
        'rateLimit': 1000,
        'version': 'v2',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766825-98a6d0de-5ee7-11e7-9fa4-38e11a2c6f52.jpg',
            'api': 'https://api.quadrigacx.com',
            'www': 'https://www.quadrigacx.com',
            'doc': 'https://www.quadrigacx.com/api_info'
        },
        'api': {
            'public': {
                'get': ['order_book', 'ticker', 'transactions']
            },
            'private': {
                'post': ['balance', 'bitcoin_deposit_address', 'bitcoin_withdrawal', 'buy', 'cancel_order', 'ether_deposit_address', 'ether_withdrawal', 'lookup_order', 'open_orders', 'sell', 'user_transactions']
            }
        },
        'markets': {
            'BTC/CAD': { 'id': 'btc_cad', 'symbol': 'BTC/CAD', 'base': 'BTC', 'quote': 'CAD' },
            'BTC/USD': { 'id': 'btc_usd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'ETH/BTC': { 'id': 'eth_btc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' },
            'ETH/CAD': { 'id': 'eth_cad', 'symbol': 'ETH/CAD', 'base': 'ETH', 'quote': 'CAD' }
        },

        fetchBalance: function fetchBalance() {
            var params,
                balances,
                result,
                c,
                currency,
                lowercase,
                account,
                _this477 = this,
                _arguments462 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments462.length > 0 && _arguments462[0] !== undefined ? _arguments462[0] : {};
                return _this477.privatePostBalance();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (c = 0; c < _this477.currencies.length; c++) {
                    currency = _this477.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = {
                        'free': parseFloat(balances[lowercase + '_available']),
                        'used': parseFloat(balances[lowercase + '_reserved']),
                        'total': parseFloat(balances[lowercase + '_balance'])
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this478 = this,
                _arguments463 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments463.length > 1 && _arguments463[1] !== undefined ? _arguments463[1] : {};
                return _this478.publicGetOrderBook(_this478.extend({
                    'book': _this478.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = parseInt(orderbook['timestamp']) * 1000;
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this478.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this479 = this;

            return Promise.resolve().then(function () {
                return _this479.publicGetTicker({
                    'book': _this479.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = parseInt(ticker['timestamp']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this479.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this480 = this,
                _arguments465 = arguments;

            params = _arguments465.length > 1 && _arguments465[1] !== undefined ? _arguments465[1] : {};

            return _this480.publicGetTransactions(_this480.extend({
                'book': _this480.marketId(market)
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                _this481 = this,
                _arguments466 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments466.length > 4 && _arguments466[4] !== undefined ? _arguments466[4] : undefined;
                params = _arguments466.length > 5 && _arguments466[5] !== undefined ? _arguments466[5] : {};
                method = 'privatePost' + _this481.capitalize(side);
                order = {
                    'amount': amount,
                    'book': _this481.marketId(market)
                };

                if (type == 'limit') {
                    order['price'] = price;
                }return _this481[method](_this481.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this482 = this,
                _arguments467 = arguments;

            params = _arguments467.length > 1 && _arguments467[1] !== undefined ? _arguments467[1] : {};

            return _this482.privatePostCancelOrder(_this482.extend({
                'id': id
            }, params));
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                request,
                signature,
                query,
                response,
                _this483 = this,
                _arguments468 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments468.length > 1 && _arguments468[1] !== undefined ? _arguments468[1] : 'public';
                method = _arguments468.length > 2 && _arguments468[2] !== undefined ? _arguments468[2] : 'GET';
                params = _arguments468.length > 3 && _arguments468[3] !== undefined ? _arguments468[3] : {};
                headers = _arguments468.length > 4 && _arguments468[4] !== undefined ? _arguments468[4] : undefined;
                body = _arguments468.length > 5 && _arguments468[5] !== undefined ? _arguments468[5] : undefined;
                url = _this483.urls['api'] + '/' + _this483.version + '/' + path;

                if (api == 'public') {
                    url += '?' + _this483.urlencode(params);
                } else {
                    if (!_this483.uid) {
                        throw new AuthenticationError(_this483.id + ' requires `' + _this483.id + '.uid` property for authentication');
                    }nonce = _this483.nonce();
                    request = [nonce.toString(), _this483.uid, _this483.apiKey].join('');
                    signature = _this483.hmac(_this483.encode(request), _this483.encode(_this483.secret));
                    query = _this483.extend({
                        'key': _this483.apiKey,
                        'nonce': nonce,
                        'signature': signature
                    }, params);

                    body = _this483.json(query);
                    headers = {
                        'Content-Type': 'application/json',
                        'Content-Length': body.length
                    };
                }
                return _this483.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    throw new ExchangeError(_this483.id + ' ' + _this483.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var quoine = {

        'id': 'quoine',
        'name': 'QUOINE',
        'countries': ['JP', 'SG', 'VN'],
        'version': '2',
        'rateLimit': 1000,
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766844-9615a4e8-5ee8-11e7-8814-fcd004db8cdd.jpg',
            'api': 'https://api.quoine.com',
            'www': 'https://www.quoine.com',
            'doc': 'https://developers.quoine.com'
        },
        'api': {
            'public': {
                'get': ['products', 'products/{id}', 'products/{id}/price_levels', 'executions', 'ir_ladders/{currency}']
            },
            'private': {
                'get': ['accounts/balance', 'crypto_accounts', 'executions/me', 'fiat_accounts', 'loan_bids', 'loans', 'orders', 'orders/{id}', 'orders/{id}/trades', 'trades', 'trades/{id}/loans', 'trading_accounts', 'trading_accounts/{id}'],
                'post': ['fiat_accounts', 'loan_bids', 'orders'],
                'put': ['loan_bids/{id}/close', 'loans/{id}', 'orders/{id}', 'orders/{id}/cancel', 'trades/{id}', 'trades/{id}/close', 'trades/close_all', 'trading_accounts/{id}']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this484 = this;

            return Promise.resolve().then(function () {
                return _this484.publicGetProducts();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['id'];
                    base = market['base_currency'];
                    quote = market['quoted_currency'];
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                balances,
                result,
                b,
                balance,
                currency,
                total,
                account,
                _this485 = this,
                _arguments470 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments470.length > 0 && _arguments470[0] !== undefined ? _arguments470[0] : {};
                return _this485.loadMarkets();
            }).then(function () {
                return _this485.privateGetAccountsBalance();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    total = parseFloat(balance['balance']);
                    account = {
                        'free': total,
                        'used': 0.0,
                        'total': total
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this486 = this,
                _arguments471 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments471.length > 1 && _arguments471[1] !== undefined ? _arguments471[1] : {};
                return _this486.loadMarkets();
            }).then(function () {
                return _this486.publicGetProductsIdPriceLevels(_this486.extend({
                    'id': _this486.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this486.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this486.iso8601(timestamp)
                };
                sides = { 'bids': 'buy_price_levels', 'asks': 'sell_price_levels' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[key].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            var last = undefined;
            if ('last_traded_price' in ticker) {
                if (ticker['last_traded_price']) {
                    var length = ticker['last_traded_price'].length;
                    if (length > 0) last = parseFloat(ticker['last_traded_price']);
                }
            }
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high_market_ask']),
                'low': parseFloat(ticker['low_market_bid']),
                'bid': parseFloat(ticker['market_bid']),
                'ask': parseFloat(ticker['market_ask']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': last,
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['volume_24h']),
                'quoteVolume': undefined,
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                result,
                t,
                ticker,
                base,
                quote,
                symbol,
                market,
                _this487 = this;

            return Promise.resolve().then(function () {
                return _this487.loadMarkets();
            }).then(function () {
                return _this487.publicGetProducts();
            }).then(function (_resp) {
                tickers = _resp;
                result = {};

                for (t = 0; t < tickers.length; t++) {
                    ticker = tickers[t];
                    base = ticker['base_currency'];
                    quote = ticker['quoted_currency'];
                    symbol = base + '/' + quote;
                    market = _this487.markets[symbol];

                    result[symbol] = _this487.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this488 = this;

            return Promise.resolve().then(function () {
                return _this488.loadMarkets();
            }).then(function () {
                p = _this488.market(market);
                return _this488.publicGetProductsId({
                    'id': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this488.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this489 = this,
                _arguments474 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments474.length > 1 && _arguments474[1] !== undefined ? _arguments474[1] : {};
                return _this489.loadMarkets();
            }).then(function () {
                return _this489.publicGetExecutions(_this489.extend({
                    'product_id': _this489.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this490 = this,
                _arguments475 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments475.length > 4 && _arguments475[4] !== undefined ? _arguments475[4] : undefined;
                params = _arguments475.length > 5 && _arguments475[5] !== undefined ? _arguments475[5] : {};
                return _this490.loadMarkets();
            }).then(function () {
                order = {
                    'order_type': type,
                    'product_id': _this490.marketId(market),
                    'side': side,
                    'quantity': amount
                };

                if (type == 'limit') {
                    order['price'] = price;
                }return _this490.privatePostOrders(_this490.extend({
                    'order': order
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this491 = this,
                _arguments476 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments476.length > 1 && _arguments476[1] !== undefined ? _arguments476[1] : {};
                return _this491.loadMarkets();
            }).then(function () {
                return _this491.privatePutOrdersIdCancel(_this491.extend({
                    'id': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                request,
                response,
                _this492 = this,
                _arguments477 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments477.length > 1 && _arguments477[1] !== undefined ? _arguments477[1] : 'public';
                method = _arguments477.length > 2 && _arguments477[2] !== undefined ? _arguments477[2] : 'GET';
                params = _arguments477.length > 3 && _arguments477[3] !== undefined ? _arguments477[3] : {};
                headers = _arguments477.length > 4 && _arguments477[4] !== undefined ? _arguments477[4] : undefined;
                body = _arguments477.length > 5 && _arguments477[5] !== undefined ? _arguments477[5] : undefined;
                url = '/' + _this492.implodeParams(path, params);
                query = _this492.omit(params, _this492.extractParams(path));

                headers = {
                    'X-Quoine-API-Version': _this492.version,
                    'Content-Type': 'application/json'
                };
                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this492.urlencode(query);
                    }
                } else {
                    nonce = _this492.nonce();
                    request = {
                        'path': url,
                        'nonce': nonce,
                        'token_id': _this492.apiKey,
                        'iat': Math.floor(nonce / 1000) // issued at
                    };

                    if (Object.keys(query).length) {
                        body = _this492.json(query);
                    }headers['X-Quoine-Auth'] = _this492.jwt(request, _this492.secret);
                }
                return _this492.fetch(_this492.urls['api'] + url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('message' in response) {
                    throw new ExchangeError(_this492.id + ' ' + _this492.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var southxchange = {

        'id': 'southxchange',
        'name': 'SouthXchange',
        'countries': 'AR', // Argentina
        'rateLimit': 1000,
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27838912-4f94ec8a-60f6-11e7-9e5d-bbf9bd50a559.jpg',
            'api': 'https://www.southxchange.com/api',
            'www': 'https://www.southxchange.com',
            'doc': 'https://www.southxchange.com/Home/Api'
        },
        'api': {
            'public': {
                'get': ['markets', 'price/{symbol}', 'prices', 'book/{symbol}', 'trades/{symbol}']
            },
            'private': {
                'post': ['cancelMarketOrders', 'cancelOrder', 'generatenewaddress', 'listOrders', 'listBalances', 'placeOrder', 'withdraw']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                base,
                quote,
                symbol,
                id,
                _this493 = this;

            return Promise.resolve().then(function () {
                return _this493.publicGetMarkets();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    base = market[0];
                    quote = market[1];
                    symbol = base + '/' + quote;
                    id = symbol;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                balances,
                result,
                b,
                balance,
                currency,
                uppercase,
                free,
                used,
                total,
                account,
                _this494 = this,
                _arguments479 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments479.length > 0 && _arguments479[0] !== undefined ? _arguments479[0] : {};
                return _this494.loadMarkets();
            }).then(function () {
                return _this494.privatePostListBalances();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['Currency'];
                    uppercase = currency.uppercase;
                    free = parseFloat(balance['Available']);
                    used = parseFloat(balance['Unconfirmed']);
                    total = _this494.sum(free, used);
                    account = {
                        'free': free,
                        'used': used,
                        'total': total
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this495 = this,
                _arguments480 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments480.length > 1 && _arguments480[1] !== undefined ? _arguments480[1] : {};
                return _this495.loadMarkets();
            }).then(function () {
                return _this495.publicGetBookSymbol(_this495.extend({
                    'symbol': _this495.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this495.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this495.iso8601(timestamp)
                };
                sides = { 'bids': 'BuyOrders', 'asks': 'SellOrders' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['Price']);
                        amount = parseFloat(order['Amount']);

                        result[key].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            var bid = undefined;
            var ask = undefined;
            if ('Bid' in ticker) if (ticker['Bid']) bid = parseFloat(ticker['Bid']);
            if ('Ask' in ticker) if (ticker['Ask']) ask = parseFloat(ticker['Ask']);
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': bid,
                'ask': ask,
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['Last']),
                'change': parseFloat(ticker['Variation24Hr']),
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['Volume24Hr']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var response,
                tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                ticker,
                _this496 = this;

            return Promise.resolve().then(function () {
                return _this496.loadMarkets();
            }).then(function () {
                return _this496.publicGetPrices();
            }).then(function (_resp) {
                response = _resp;
                tickers = _this496.indexBy(response, 'Market');
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this496.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = tickers[id];

                    result[symbol] = _this496.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this497 = this;

            return Promise.resolve().then(function () {
                return _this497.loadMarkets();
            }).then(function () {
                p = _this497.market(market);
                return _this497.publicGetPriceSymbol({
                    'symbol': _this497.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this497.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this498 = this,
                _arguments483 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments483.length > 1 && _arguments483[1] !== undefined ? _arguments483[1] : {};
                return _this498.loadMarkets();
            }).then(function () {
                return _this498.publicGetTradesSymbol(_this498.extend({
                    'symbol': _this498.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                order,
                response,
                _this499 = this,
                _arguments484 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments484.length > 4 && _arguments484[4] !== undefined ? _arguments484[4] : undefined;
                params = _arguments484.length > 5 && _arguments484[5] !== undefined ? _arguments484[5] : {};
                return _this499.loadMarkets();
            }).then(function () {
                p = _this499.market(market);
                order = {
                    'listingCurrency': p['base'],
                    'referenceCurrency': p['quote'],
                    'type': side,
                    'amount': amount
                };

                if (type == 'limit') {
                    order['limitPrice'] = price;
                }return _this499.privatePostPlaceOrder(_this499.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response.toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this500 = this,
                _arguments485 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments485.length > 1 && _arguments485[1] !== undefined ? _arguments485[1] : {};
                return _this500.loadMarkets();
            }).then(function () {
                return _this500.privatePostCancelOrder(_this500.extend({
                    'orderCode': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                response,
                _this501 = this,
                _arguments486 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments486.length > 1 && _arguments486[1] !== undefined ? _arguments486[1] : 'public';
                method = _arguments486.length > 2 && _arguments486[2] !== undefined ? _arguments486[2] : 'GET';
                params = _arguments486.length > 3 && _arguments486[3] !== undefined ? _arguments486[3] : {};
                headers = _arguments486.length > 4 && _arguments486[4] !== undefined ? _arguments486[4] : undefined;
                body = _arguments486.length > 5 && _arguments486[5] !== undefined ? _arguments486[5] : undefined;
                url = _this501.urls['api'] + '/' + _this501.implodeParams(path, params);
                query = _this501.omit(params, _this501.extractParams(path));

                if (api == 'private') {
                    nonce = _this501.nonce();

                    query = _this501.extend({
                        'key': _this501.apiKey,
                        'nonce': nonce
                    }, query);
                    body = _this501.json(query);
                    headers = {
                        'Content-Type': 'application/json',
                        'Hash': _this501.hmac(_this501.encode(body), _this501.encode(_this501.secret), 'sha512')
                    };
                }
                return _this501.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                // if (!response)
                //     throw new ExchangeError (this.id + ' ' + this.json (response));

                return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var surbitcoin = extend(blinktrade, {
        'id': 'surbitcoin',
        'name': 'SurBitcoin',
        'countries': 'VE',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27991511-f0a50194-6481-11e7-99b5-8f02932424cc.jpg',
            'api': {
                'public': 'https://api.blinktrade.com/api',
                'private': 'https://api.blinktrade.com/tapi'
            },
            'www': 'https://surbitcoin.com',
            'doc': 'https://blinktrade.com/docs'
        },
        'comment': 'Blinktrade API',
        'markets': {
            'BTC/VEF': { 'id': 'BTCVEF', 'symbol': 'BTC/VEF', 'base': 'BTC', 'quote': 'VEF', 'brokerId': 1, 'broker': 'SurBitcoin' }
        }
    });

    //-----------------------------------------------------------------------------

    var therock = {

        'id': 'therock',
        'name': 'TheRockTrading',
        'countries': 'MT',
        'rateLimit': 1000,
        'version': 'v1',
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766869-75057fa2-5ee9-11e7-9a6f-13e641fa4707.jpg',
            'api': 'https://api.therocktrading.com',
            'www': 'https://therocktrading.com',
            'doc': ['https://api.therocktrading.com/doc/v1/index.html', 'https://api.therocktrading.com/doc/']
        },
        'api': {
            'public': {
                'get': ['funds/{id}/orderbook', 'funds/{id}/ticker', 'funds/{id}/trades', 'funds/tickers']
            },
            'private': {
                'get': ['balances', 'balances/{id}', 'discounts', 'discounts/{id}', 'funds', 'funds/{id}', 'funds/{id}/trades', 'funds/{fund_id}/orders', 'funds/{fund_id}/orders/{id}', 'funds/{fund_id}/position_balances', 'funds/{fund_id}/positions', 'funds/{fund_id}/positions/{id}', 'transactions', 'transactions/{id}', 'withdraw_limits/{id}', 'withdraw_limits'],
                'post': ['atms/withdraw', 'funds/{fund_id}/orders'],
                'delete': ['funds/{fund_id}/orders/{id}', 'funds/{fund_id}/orders/remove_all']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this502 = this;

            return Promise.resolve().then(function () {
                return _this502.publicGetFundsTickers();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets['tickers'].length; p++) {
                    market = markets['tickers'][p];
                    id = market['fund_id'];
                    base = id.slice(0, 3);
                    quote = id.slice(3, 6);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                b,
                balance,
                currency,
                free,
                total,
                used,
                account,
                _this503 = this,
                _arguments488 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments488.length > 0 && _arguments488[0] !== undefined ? _arguments488[0] : {};
                return _this503.loadMarkets();
            }).then(function () {
                return _this503.privateGetBalances();
            }).then(function (_resp) {
                response = _resp;
                balances = response['balances'];
                result = { 'info': response };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    free = balance['trading_balance'];
                    total = balance['balance'];
                    used = total - free;
                    account = {
                        'free': free,
                        'used': used,
                        'total': total
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this504 = this,
                _arguments489 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments489.length > 1 && _arguments489[1] !== undefined ? _arguments489[1] : {};
                return _this504.loadMarkets();
            }).then(function () {
                return _this504.publicGetFundsIdOrderbook(_this504.extend({
                    'id': _this504.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this504.parse8601(orderbook['date']);
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this504.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['amount']);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.parse8601(ticker['date']);
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': undefined,
                'open': parseFloat(ticker['open']),
                'close': parseFloat(ticker['close']),
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['volume_traded']),
                'quoteVolume': parseFloat(ticker['volume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var response,
                tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                ticker,
                _this505 = this;

            return Promise.resolve().then(function () {
                return _this505.loadMarkets();
            }).then(function () {
                return _this505.publicGetFundsTickers();
            }).then(function (_resp) {
                response = _resp;
                tickers = _this505.indexBy(response['tickers'], 'fund_id');
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this505.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = tickers[id];

                    result[symbol] = _this505.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this506 = this;

            return Promise.resolve().then(function () {
                return _this506.loadMarkets();
            }).then(function () {
                p = _this506.market(market);
                return _this506.publicGetFundsIdTicker({
                    'id': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this506.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this507 = this,
                _arguments492 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments492.length > 1 && _arguments492[1] !== undefined ? _arguments492[1] : {};
                return _this507.loadMarkets();
            }).then(function () {
                return _this507.publicGetFundsIdTrades(_this507.extend({
                    'id': _this507.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                response,
                _this508 = this,
                _arguments493 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments493.length > 4 && _arguments493[4] !== undefined ? _arguments493[4] : undefined;
                params = _arguments493.length > 5 && _arguments493[5] !== undefined ? _arguments493[5] : {};
                return _this508.loadMarkets();
            }).then(function () {
                if (type == 'market') {
                    throw new ExchangeError(_this508.id + ' allows limit orders only');
                }return _this508.privatePostFundsFundIdOrders(_this508.extend({
                    'fund_id': _this508.marketId(market),
                    'side': side,
                    'amount': amount,
                    'price': price
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this509 = this,
                _arguments494 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments494.length > 1 && _arguments494[1] !== undefined ? _arguments494[1] : {};
                return _this509.loadMarkets();
            }).then(function () {
                return _this509.privateDeleteFundsFundIdOrdersId(_this509.extend({
                    'id': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                auth,
                response,
                _this510 = this,
                _arguments495 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments495.length > 1 && _arguments495[1] !== undefined ? _arguments495[1] : 'public';
                method = _arguments495.length > 2 && _arguments495[2] !== undefined ? _arguments495[2] : 'GET';
                params = _arguments495.length > 3 && _arguments495[3] !== undefined ? _arguments495[3] : {};
                headers = _arguments495.length > 4 && _arguments495[4] !== undefined ? _arguments495[4] : undefined;
                body = _arguments495.length > 5 && _arguments495[5] !== undefined ? _arguments495[5] : undefined;
                url = _this510.urls['api'] + '/' + _this510.version + '/' + _this510.implodeParams(path, params);
                query = _this510.omit(params, _this510.extractParams(path));

                if (api == 'private') {
                    nonce = _this510.nonce().toString();
                    auth = nonce + url;

                    headers = {
                        'X-TRT-KEY': _this510.apiKey,
                        'X-TRT-NONCE': nonce,
                        'X-TRT-SIGN': _this510.hmac(_this510.encode(auth), _this510.encode(_this510.secret), 'sha512')
                    };
                    if (Object.keys(query).length) {
                        body = _this510.json(query);
                        headers['Content-Type'] = 'application/json';
                    }
                }
                return _this510.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('errors' in response) {
                    throw new ExchangeError(_this510.id + ' ' + _this510.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var urdubit = extend(blinktrade, {
        'id': 'urdubit',
        'name': 'UrduBit',
        'countries': 'PK',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27991453-156bf3ae-6480-11e7-82eb-7295fe1b5bb4.jpg',
            'api': {
                'public': 'https://api.blinktrade.com/api',
                'private': 'https://api.blinktrade.com/tapi'
            },
            'www': 'https://urdubit.com',
            'doc': 'https://blinktrade.com/docs'
        },
        'comment': 'Blinktrade API',
        'markets': {
            'BTC/PKR': { 'id': 'BTCPKR', 'symbol': 'BTC/PKR', 'base': 'BTC', 'quote': 'PKR', 'brokerId': 8, 'broker': 'UrduBit' }
        }
    });

    //-----------------------------------------------------------------------------

    var vaultoro = {

        'id': 'vaultoro',
        'name': 'Vaultoro',
        'countries': 'CH',
        'rateLimit': 1000,
        'version': '1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766880-f205e870-5ee9-11e7-8fe2-0d5b15880752.jpg',
            'api': 'https://api.vaultoro.com',
            'www': 'https://www.vaultoro.com',
            'doc': 'https://api.vaultoro.com'
        },
        'api': {
            'public': {
                'get': ['bidandask', 'buyorders', 'latest', 'latesttrades', 'markets', 'orderbook', 'sellorders', 'transactions/day', 'transactions/hour', 'transactions/month']
            },
            'private': {
                'get': ['balance', 'mytrades', 'orders'],
                'post': ['buy/{symbol}/{type}', 'cancel/{id}', 'sell/{symbol}/{type}', 'withdraw']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var result,
                markets,
                market,
                base,
                quote,
                symbol,
                baseId,
                quoteId,
                id,
                _this511 = this;

            return Promise.resolve().then(function () {
                result = [];
                return _this511.publicGetMarkets();
            }).then(function (_resp) {
                markets = _resp;
                market = markets['data'];
                base = market['BaseCurrency'];
                quote = market['MarketCurrency'];
                symbol = base + '/' + quote;
                baseId = base;
                quoteId = quote;
                id = market['MarketName'];

                result.push({
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'baseId': baseId,
                    'quoteId': quoteId,
                    'info': market
                });
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                b,
                balance,
                currency,
                uppercase,
                free,
                used,
                total,
                account,
                _this512 = this,
                _arguments497 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments497.length > 0 && _arguments497[0] !== undefined ? _arguments497[0] : {};
                return _this512.loadMarkets();
            }).then(function () {
                return _this512.privateGetBalance();
            }).then(function (_resp) {
                response = _resp;
                balances = response['data'];
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency_code'];
                    uppercase = currency.toUpperCase();
                    free = balance['cash'];
                    used = balance['reserved'];
                    total = _this512.sum(free, used);
                    account = {
                        'free': free,
                        'used': used,
                        'total': total
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this513 = this,
                _arguments498 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments498.length > 1 && _arguments498[1] !== undefined ? _arguments498[1] : {};
                return _this513.loadMarkets();
            }).then(function () {
                return _this513.publicGetOrderbook(params);
            }).then(function (_resp) {
                response = _resp;
                orderbook = {
                    'bids': response['data'][0]['b'],
                    'asks': response['data'][1]['s']
                };
                timestamp = _this513.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this513.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order['Gold_Price'];
                        amount = order['Gold_Amount'];

                        result[side].push([price, amount]);
                    }
                }
                result['bids'] = _this513.sortBy(result['bids'], 0, true);
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var quote,
                bidsLength,
                bid,
                ask,
                response,
                ticker,
                timestamp,
                _this514 = this;

            return Promise.resolve().then(function () {
                return _this514.loadMarkets();
            }).then(function () {
                return _this514.publicGetBidandask();
            }).then(function (_resp) {
                quote = _resp;
                bidsLength = quote['bids'].length;
                bid = quote['bids'][bidsLength - 1];
                ask = quote['asks'][0];
                return _this514.publicGetMarkets();
            }).then(function (_resp) {
                response = _resp;
                ticker = response['data'];
                timestamp = _this514.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this514.iso8601(timestamp),
                    'high': parseFloat(ticker['24hHigh']),
                    'low': parseFloat(ticker['24hLow']),
                    'bid': bid[0],
                    'ask': ask[0],
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['LastPrice']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['24hVolume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this515 = this,
                _arguments500 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments500.length > 1 && _arguments500[1] !== undefined ? _arguments500[1] : {};
                return _this515.loadMarkets();
            }).then(function () {
                return _this515.publicGetTransactionsDay(params);
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                method,
                response,
                _this516 = this,
                _arguments501 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments501.length > 4 && _arguments501[4] !== undefined ? _arguments501[4] : undefined;
                params = _arguments501.length > 5 && _arguments501[5] !== undefined ? _arguments501[5] : {};
                return _this516.loadMarkets();
            }).then(function () {
                p = _this516.market(market);
                method = 'privatePost' + _this516.capitalize(side) + 'SymbolType';
                return _this516[method](_this516.extend({
                    'symbol': p['quoteId'].toLowerCase(),
                    'type': type,
                    'gld': amount,
                    'price': price || 1
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['data']['Order_ID']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this517 = this,
                _arguments502 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments502.length > 1 && _arguments502[1] !== undefined ? _arguments502[1] : {};
                return _this517.loadMarkets();
            }).then(function () {
                return _this517.privatePostCancelId(_this517.extend({
                    'id': id
                }, params));
            });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/';
            if (api == 'public') {
                url += path;
            } else {
                var nonce = this.nonce();
                url += this.version + '/' + this.implodeParams(path, params);
                var query = this.extend({
                    'nonce': nonce,
                    'apikey': this.apiKey
                }, this.omit(params, this.extractParams(path)));
                url += '?' + this.urlencode(query);
                headers = {
                    'Content-Type': 'application/json',
                    'X-Signature': this.hmac(this.encode(url), this.encode(this.secret))
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var vbtc = extend(blinktrade, {
        'id': 'vbtc',
        'name': 'VBTC',
        'countries': 'VN',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27991481-1f53d1d8-6481-11e7-884e-21d17e7939db.jpg',
            'api': {
                'public': 'https://api.blinktrade.com/api',
                'private': 'https://api.blinktrade.com/tapi'
            },
            'www': 'https://vbtc.exchange',
            'doc': 'https://blinktrade.com/docs'
        },
        'comment': 'Blinktrade API',
        'markets': {
            'BTC/VND': { 'id': 'BTCVND', 'symbol': 'BTC/VND', 'base': 'BTC', 'quote': 'VND', 'brokerId': 3, 'broker': 'VBTC' }
        }
    });

    //-----------------------------------------------------------------------------

    var virwox = {

        'id': 'virwox',
        'name': 'VirWoX',
        'countries': 'AT',
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766894-6da9d360-5eea-11e7-90aa-41f2711b7405.jpg',
            'api': {
                'public': 'http://api.virwox.com/api/json.php',
                'private': 'https://www.virwox.com/api/trading.php'
            },
            'www': 'https://www.virwox.com',
            'doc': 'https://www.virwox.com/developers.php'
        },
        'api': {
            'public': {
                'get': ['getInstruments', 'getBestPrices', 'getMarketDepth', 'estimateMarketOrder', 'getTradedPriceVolume', 'getRawTradeData', 'getStatistics', 'getTerminalList', 'getGridList', 'getGridStatistics'],
                'post': ['getInstruments', 'getBestPrices', 'getMarketDepth', 'estimateMarketOrder', 'getTradedPriceVolume', 'getRawTradeData', 'getStatistics', 'getTerminalList', 'getGridList', 'getGridStatistics']
            },
            'private': {
                'get': ['cancelOrder', 'getBalances', 'getCommissionDiscount', 'getOrders', 'getTransactions', 'placeOrder'],
                'post': ['cancelOrder', 'getBalances', 'getCommissionDiscount', 'getOrders', 'getTransactions', 'placeOrder']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                keys,
                result,
                p,
                market,
                id,
                symbol,
                base,
                quote,
                _this518 = this;

            return Promise.resolve().then(function () {
                return _this518.publicGetInstruments();
            }).then(function (_resp) {
                markets = _resp;
                keys = Object.keys(markets['result']);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    market = markets['result'][keys[p]];
                    id = market['instrumentID'];
                    symbol = market['symbol'];
                    base = market['longCurrency'];
                    quote = market['shortCurrency'];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                b,
                balance,
                currency,
                total,
                account,
                _this519 = this,
                _arguments504 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments504.length > 0 && _arguments504[0] !== undefined ? _arguments504[0] : {};
                return _this519.loadMarkets();
            }).then(function () {
                return _this519.privatePostGetBalances();
            }).then(function (_resp) {
                response = _resp;
                balances = response['result']['accountList'];
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    total = balance['balance'];
                    account = {
                        'free': total,
                        'used': 0.0,
                        'total': total
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchBestPrices: function fetchBestPrices(symbol) {
            var _this520 = this;

            return Promise.resolve().then(function () {
                return _this520.loadMarkets();
            }).then(function () {
                return _this520.publicPostGetBestPrices({
                    'symbols': [symbol]
                });
            });
        },
        fetchOrderBook: function fetchOrderBook(symbol) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this521 = this,
                _arguments506 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments506.length > 1 && _arguments506[1] !== undefined ? _arguments506[1] : {};
                return _this521.loadMarkets();
            }).then(function () {
                return _this521.publicPostGetMarketDepth(_this521.extend({
                    'symbols': [symbol],
                    'buyDepth': 100,
                    'sellDepth': 100
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['result'][0];
                timestamp = _this521.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this521.iso8601(timestamp)
                };
                sides = { 'bids': 'buy', 'asks': 'sell' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['volume']);

                        result[key].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(symbol) {
            var end,
                start,
                response,
                tickers,
                keys,
                length,
                lastKey,
                ticker,
                timestamp,
                _this522 = this;

            return Promise.resolve().then(function () {
                return _this522.loadMarkets();
            }).then(function () {
                end = _this522.milliseconds();
                start = end - 86400000;
                return _this522.publicGetTradedPriceVolume({
                    'instrument': symbol,
                    'endDate': _this522.yyyymmddhhmmss(end),
                    'startDate': _this522.yyyymmddhhmmss(start),
                    'HLOC': 1
                });
            }).then(function (_resp) {
                response = _resp;
                tickers = response['result']['priceVolumeList'];
                keys = Object.keys(tickers);
                length = keys.length;
                lastKey = keys[length - 1];
                ticker = tickers[lastKey];
                timestamp = _this522.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this522.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': undefined,
                    'ask': undefined,
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': parseFloat(ticker['close']),
                    'first': undefined,
                    'last': undefined,
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['longVolume']),
                    'quoteVolume': parseFloat(ticker['shortVolume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this523 = this,
                _arguments508 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments508.length > 1 && _arguments508[1] !== undefined ? _arguments508[1] : {};
                return _this523.loadMarkets();
            }).then(function () {
                return _this523.publicGetRawTradeData(_this523.extend({
                    'instrument': market,
                    'timespan': 3600
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this524 = this,
                _arguments509 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments509.length > 4 && _arguments509[4] !== undefined ? _arguments509[4] : undefined;
                params = _arguments509.length > 5 && _arguments509[5] !== undefined ? _arguments509[5] : {};
                return _this524.loadMarkets();
            }).then(function () {
                order = {
                    'instrument': _this524.symbol(market),
                    'orderType': side.toUpperCase(),
                    'amount': amount
                };

                if (type == 'limit') {
                    order['price'] = price;
                }return _this524.privatePostPlaceOrder(_this524.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['orderID'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this525 = this,
                _arguments510 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments510.length > 1 && _arguments510[1] !== undefined ? _arguments510[1] : {};
                return _this525.loadMarkets();
            }).then(function () {
                return _this525.privatePostCancelOrder(_this525.extend({
                    'orderID': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                auth,
                nonce,
                response,
                _this526 = this,
                _arguments511 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments511.length > 1 && _arguments511[1] !== undefined ? _arguments511[1] : 'public';
                method = _arguments511.length > 2 && _arguments511[2] !== undefined ? _arguments511[2] : 'GET';
                params = _arguments511.length > 3 && _arguments511[3] !== undefined ? _arguments511[3] : {};
                headers = _arguments511.length > 4 && _arguments511[4] !== undefined ? _arguments511[4] : undefined;
                body = _arguments511.length > 5 && _arguments511[5] !== undefined ? _arguments511[5] : undefined;
                url = _this526.urls['api'][api];
                auth = {};

                if (api == 'private') {
                    auth['key'] = _this526.apiKey;
                    auth['user'] = _this526.login;
                    auth['pass'] = _this526.password;
                }
                nonce = _this526.nonce();

                if (method == 'GET') {
                    url += '?' + _this526.urlencode(_this526.extend({
                        'method': path,
                        'id': nonce
                    }, auth, params));
                } else {
                    headers = { 'Content-Type': 'application/json' };
                    body = _this526.json({
                        'method': path,
                        'params': _this526.extend(auth, params),
                        'id': nonce
                    });
                }
                return _this526.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    if (response['error']) {
                        throw new ExchangeError(_this526.id + ' ' + _this526.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var xbtce = {

        'id': 'xbtce',
        'name': 'xBTCe',
        'countries': 'RU',
        'rateLimit': 2000, // responses are cached every 2 seconds
        'version': 'v1',
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28059414-e235970c-662c-11e7-8c3a-08e31f78684b.jpg',
            'api': 'https://cryptottlivewebapi.xbtce.net:8443/api',
            'www': 'https://www.xbtce.com',
            'doc': ['https://www.xbtce.com/tradeapi', 'https://support.xbtce.info/Knowledgebase/Article/View/52/25/xbtce-exchange-api']
        },
        'api': {
            'public': {
                'get': ['currency', 'currency/{filter}', 'level2', 'level2/{filter}', 'quotehistory/{symbol}/{periodicity}/bars/ask', 'quotehistory/{symbol}/{periodicity}/bars/bid', 'quotehistory/{symbol}/level2', 'quotehistory/{symbol}/ticks', 'symbol', 'symbol/{filter}', 'tick', 'tick/{filter}', 'ticker', 'ticker/{filter}', 'tradesession']
            },
            'private': {
                'get': ['tradeserverinfo', 'tradesession', 'currency', 'currency/{filter}', 'level2', 'level2/{filter}', 'symbol', 'symbol/{filter}', 'tick', 'tick/{filter}', 'account', 'asset', 'asset/{id}', 'position', 'position/{id}', 'trade', 'trade/{id}', 'quotehistory/{symbol}/{periodicity}/bars/ask', 'quotehistory/{symbol}/{periodicity}/bars/ask/info', 'quotehistory/{symbol}/{periodicity}/bars/bid', 'quotehistory/{symbol}/{periodicity}/bars/bid/info', 'quotehistory/{symbol}/level2', 'quotehistory/{symbol}/level2/info', 'quotehistory/{symbol}/periodicities', 'quotehistory/{symbol}/ticks', 'quotehistory/{symbol}/ticks/info', 'quotehistory/cache/{symbol}/{periodicity}/bars/ask', 'quotehistory/cache/{symbol}/{periodicity}/bars/bid', 'quotehistory/cache/{symbol}/level2', 'quotehistory/cache/{symbol}/ticks', 'quotehistory/symbols', 'quotehistory/version'],
                'post': ['trade', 'tradehistory'],
                'put': ['trade'],
                'delete': ['trade']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this527 = this;

            return Promise.resolve().then(function () {
                return _this527.privateGetSymbol();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['Symbol'];
                    base = market['MarginCurrency'];
                    quote = market['ProfitCurrency'];

                    if (base == 'DSH') {
                        base = 'DASH';
                    }symbol = base + '/' + quote;

                    symbol = market['IsTradeAllowed'] ? symbol : id;
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                balances,
                result,
                b,
                balance,
                currency,
                uppercase,
                total,
                account,
                _this528 = this,
                _arguments513 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments513.length > 0 && _arguments513[0] !== undefined ? _arguments513[0] : {};
                return _this528.loadMarkets();
            }).then(function () {
                return _this528.privateGetAsset();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['Currency'];
                    uppercase = currency.toUpperCase();
                    // xbtce names DASH incorrectly as DSH

                    if (uppercase == 'DSH') {
                        uppercase = 'DASH';
                    }total = balance['balance'];
                    account = {
                        'free': balance['FreeAmount'],
                        'used': balance['LockedAmount'],
                        'total': balance['Amount']
                    };

                    result[uppercase] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                Side,
                orders,
                i,
                order,
                price,
                amount,
                _this529 = this,
                _arguments514 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments514.length > 1 && _arguments514[1] !== undefined ? _arguments514[1] : {};
                return _this529.loadMarkets();
            }).then(function () {
                p = _this529.market(market);
                return _this529.privateGetLevel2Filter(_this529.extend({
                    'filter': p['id']
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;

                orderbook = orderbook[0];
                timestamp = orderbook['Timestamp'];
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this529.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    Side = _this529.capitalize(side);
                    orders = orderbook[Side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['Price']);
                        amount = parseFloat(order['Volume']);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = 0;
            var last = undefined;
            if ('LastBuyTimestamp' in ticker) if (timestamp < ticker['LastBuyTimestamp']) {
                timestamp = ticker['LastBuyTimestamp'];
                last = ticker['LastBuyPrice'];
            }
            if ('LastSellTimestamp' in ticker) if (timestamp < ticker['LastSellTimestamp']) {
                timestamp = ticker['LastSellTimestamp'];
                last = ticker['LastSellPrice'];
            }
            if (!timestamp) timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': ticker['DailyBestBuyPrice'],
                'low': ticker['DailyBestSellPrice'],
                'bid': ticker['BestBid'],
                'ask': ticker['BestAsk'],
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': last,
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': ticker['DailyTradedTotalVolume'],
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                base,
                quote,
                ticker,
                _this530 = this;

            return Promise.resolve().then(function () {
                return _this530.loadMarkets();
            }).then(function () {
                return _this530.publicGetTicker();
            }).then(function (_resp) {
                tickers = _resp;

                tickers = _this530.indexBy(tickers, 'Symbol');
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = undefined;
                    symbol = undefined;

                    if (id in _this530.markets_by_id) {
                        market = _this530.markets_by_id[id];
                        symbol = market['symbol'];
                    } else {
                        base = id.slice(0, 3);
                        quote = id.slice(3, 6);

                        if (base == 'DSH') {
                            base = 'DASH';
                        }if (quote == 'DSH') {
                            quote = 'DASH';
                        }symbol = base + '/' + quote;
                    }
                    ticker = tickers[id];

                    result[symbol] = _this530.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                tickers,
                length,
                ticker,
                _this531 = this;

            return Promise.resolve().then(function () {
                return _this531.loadMarkets();
            }).then(function () {
                p = _this531.market(market);
                return _this531.publicGetTickerFilter({
                    'filter': p['id']
                });
            }).then(function (_resp) {
                tickers = _resp;
                length = tickers.length;

                if (length < 1) {
                    throw new ExchangeError(_this531.id + ' fetchTicker returned empty response, xBTCe public API error');
                }tickers = _this531.indexBy(tickers, 'Symbol');
                ticker = tickers[p['id']];

                return _this531.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this532 = this,
                _arguments517 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments517.length > 1 && _arguments517[1] !== undefined ? _arguments517[1] : {};
                return _this532.loadMarkets();
            }).then(function () {
                // no method for trades?
                return _this532.privateGetTrade(params);
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                response,
                _this533 = this,
                _arguments518 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments518.length > 4 && _arguments518[4] !== undefined ? _arguments518[4] : undefined;
                params = _arguments518.length > 5 && _arguments518[5] !== undefined ? _arguments518[5] : {};
                return _this533.loadMarkets();
            }).then(function () {
                if (type == 'market') {
                    throw new ExchangeError(_this533.id + ' allows limit orders only');
                }return _this533.tapiPostTrade(_this533.extend({
                    'pair': _this533.marketId(market),
                    'type': side,
                    'amount': amount,
                    'rate': price
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['Id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this534 = this,
                _arguments519 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments519.length > 1 && _arguments519[1] !== undefined ? _arguments519[1] : {};
                return _this534.loadMarkets();
            }).then(function () {
                return _this534.privateDeleteTrade(_this534.extend({
                    'Type': 'Cancel',
                    'Id': id
                }, params));
            });
        },
        nonce: function nonce() {
            return this.milliseconds();
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'api';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            if (!this.apiKey) throw new AuthenticationError(this.id + ' requires apiKey for all requests, their public API is always busy');
            if (!this.uid) throw new AuthenticationError(this.id + ' requires uid property for authentication and trading');
            var url = this.urls['api'] + '/' + this.version;
            if (api == 'public') url += '/' + api;
            url += '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                headers = { 'Accept-Encoding': 'gzip, deflate' };
                var nonce = this.nonce().toString();
                if (method == 'POST') {
                    if (Object.keys(query).length) {
                        headers['Content-Type'] = 'application/json';
                        body = this.json(query);
                    } else url += '?' + this.urlencode(query);
                }
                var auth = nonce + this.uid + this.apiKey + method + url;
                if (body) auth += body;
                var signature = this.hmac(this.encode(auth), this.encode(this.secret), 'sha256', 'base64');
                var credentials = this.uid + ':' + this.apiKey + ':' + nonce + ':' + this.binaryToString(signature);
                headers['Authorization'] = 'HMAC ' + credentials;
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var yobit = {

        'id': 'yobit',
        'name': 'YoBit',
        'countries': 'RU',
        'rateLimit': 2000, // responses are cached every 2 seconds
        'version': '3',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766910-cdcbfdae-5eea-11e7-9859-03fea873272d.jpg',
            'api': 'https://yobit.net',
            'www': 'https://www.yobit.net',
            'doc': 'https://www.yobit.net/en/api/'
        },
        'api': {
            'api': {
                'get': ['depth/{pairs}', 'info', 'ticker/{pairs}', 'trades/{pairs}']
            },
            'tapi': {
                'post': ['ActiveOrders', 'CancelOrder', 'GetDepositAddress', 'getInfo', 'OrderInfo', 'Trade', 'TradeHistory', 'WithdrawCoinsToAddress']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                keys,
                result,
                p,
                id,
                market,
                symbol,
                _symbol$split13,
                _symbol$split14,
                base,
                quote,
                _this535 = this;

            return Promise.resolve().then(function () {
                return _this535.apiGetInfo();
            }).then(function (_resp) {
                markets = _resp;
                keys = Object.keys(markets['pairs']);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    market = markets['pairs'][id];
                    symbol = id.toUpperCase().replace('_', '/');
                    _symbol$split13 = symbol.split('/');
                    _symbol$split14 = _slicedToArray(_symbol$split13, 2);
                    base = _symbol$split14[0];
                    quote = _symbol$split14[1];

                    base = _this535.commonCurrencyCode(base);
                    quote = _this535.commonCurrencyCode(quote);
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                c,
                currency,
                lowercase,
                account,
                _this536 = this,
                _arguments521 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments521.length > 0 && _arguments521[0] !== undefined ? _arguments521[0] : {};
                return _this536.loadMarkets();
            }).then(function () {
                return _this536.tapiPostGetInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['return'];
                result = { 'info': balances };

                for (c = 0; c < _this536.currencies.length; c++) {
                    currency = _this536.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = _this536.account();

                    if ('funds' in balances) {
                        if (lowercase in balances['funds']) {
                            account['free'] = balances['funds'][lowercase];
                        }
                    }if ('funds_incl_orders' in balances) {
                        if (lowercase in balances['funds_incl_orders']) {
                            account['total'] = balances['funds_incl_orders'][lowercase];
                        }
                    }if (account['total'] && account['free']) {
                        account['used'] = account['total'] - account['free'];
                    }result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                response,
                orderbook,
                timestamp,
                bids,
                asks,
                result,
                _this537 = this,
                _arguments522 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments522.length > 1 && _arguments522[1] !== undefined ? _arguments522[1] : {};
                return _this537.loadMarkets();
            }).then(function () {
                p = _this537.market(market);
                return _this537.apiGetDepthPairs(_this537.extend({
                    'pairs': p['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response[p['id']];
                timestamp = _this537.milliseconds();
                bids = 'bids' in orderbook ? orderbook['bids'] : [];
                asks = 'asks' in orderbook ? orderbook['asks'] : [];
                result = {
                    'bids': bids,
                    'asks': asks,
                    'timestamp': timestamp,
                    'datetime': _this537.iso8601(timestamp)
                };

                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                tickers,
                ticker,
                timestamp,
                _this538 = this;

            return Promise.resolve().then(function () {
                return _this538.loadMarkets();
            }).then(function () {
                p = _this538.market(market);
                return _this538.apiGetTickerPairs({
                    'pairs': p['id']
                });
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers[p['id']];
                timestamp = ticker['updated'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this538.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['avg']),
                    'baseVolume': parseFloat(ticker['vol_cur']),
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this539 = this,
                _arguments524 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments524.length > 1 && _arguments524[1] !== undefined ? _arguments524[1] : {};
                return _this539.loadMarkets();
            }).then(function () {
                return _this539.apiGetTradesPairs(_this539.extend({
                    'pairs': _this539.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                rate,
                response,
                _this540 = this,
                _arguments525 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments525.length > 4 && _arguments525[4] !== undefined ? _arguments525[4] : undefined;
                params = _arguments525.length > 5 && _arguments525[5] !== undefined ? _arguments525[5] : {};
                return _this540.loadMarkets();
            }).then(function () {
                if (type == 'market') {
                    throw new ExchangeError(_this540.id + ' allows limit orders only');
                }rate = price.toString();
                return _this540.tapiPostTrade(_this540.extend({
                    'pair': _this540.marketId(market),
                    'type': side,
                    'amount': amount,
                    'rate': '%.8f'.sprintf(price)
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['return']['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this541 = this,
                _arguments526 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments526.length > 1 && _arguments526[1] !== undefined ? _arguments526[1] : {};
                return _this541.loadMarkets();
            }).then(function () {
                return _this541.tapiPostCancelOrder(_this541.extend({
                    'order_id': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                _query2,
                response,
                _this542 = this,
                _arguments527 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments527.length > 1 && _arguments527[1] !== undefined ? _arguments527[1] : 'api';
                method = _arguments527.length > 2 && _arguments527[2] !== undefined ? _arguments527[2] : 'GET';
                params = _arguments527.length > 3 && _arguments527[3] !== undefined ? _arguments527[3] : {};
                headers = _arguments527.length > 4 && _arguments527[4] !== undefined ? _arguments527[4] : undefined;
                body = _arguments527.length > 5 && _arguments527[5] !== undefined ? _arguments527[5] : undefined;
                url = _this542.urls['api'] + '/' + api;

                if (api == 'api') {
                    url += '/' + _this542.version + '/' + _this542.implodeParams(path, params);
                    query = _this542.omit(params, _this542.extractParams(path));

                    if (Object.keys(query).length) {
                        url += '?' + _this542.urlencode(query);
                    }
                } else {
                    nonce = _this542.nonce();
                    _query2 = _this542.extend({ 'method': path, 'nonce': nonce }, params);

                    body = _this542.urlencode(_query2);
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'key': _this542.apiKey,
                        'sign': _this542.hmac(_this542.encode(body), _this542.encode(_this542.secret), 'sha512')
                    };
                }
                return _this542.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    throw new ExchangeError(_this542.id + ' ' + _this542.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var yunbi = {

        'id': 'yunbi',
        'name': 'YUNBI',
        'countries': 'CN',
        'rateLimit': 1000,
        'version': 'v2',
        'hasFetchTickers': true,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28570548-4d646c40-7147-11e7-9cf6-839b93e6d622.jpg',
            'api': 'https://yunbi.com',
            'www': 'https://yunbi.com',
            'doc': ['https://yunbi.com/documents/api/guide', 'https://yunbi.com/swagger/']
        },
        'api': {
            'public': {
                'get': ['tickers', 'tickers/{market}', 'markets', 'order_book', 'k', 'depth', 'trades', 'k_with_pending_trades', 'timestamp', 'addresses/{address}', 'partners/orders/{id}/trades']
            },
            'private': {
                'get': ['deposits', 'members/me', 'deposit', 'deposit_address', 'order', 'orders', 'trades/my'],
                'post': ['order/delete', 'orders', 'orders/multi', 'orders/clear']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                symbol,
                _symbol$split15,
                _symbol$split16,
                base,
                quote,
                _this543 = this;

            return Promise.resolve().then(function () {
                return _this543.publicGetMarkets();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['id'];
                    symbol = market['name'];
                    _symbol$split15 = symbol.split('/');
                    _symbol$split16 = _slicedToArray(_symbol$split15, 2);
                    base = _symbol$split16[0];
                    quote = _symbol$split16[1];

                    base = _this543.commonCurrencyCode(base);
                    quote = _this543.commonCurrencyCode(quote);
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                b,
                balance,
                currency,
                uppercase,
                account,
                _this544 = this,
                _arguments529 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments529.length > 0 && _arguments529[0] !== undefined ? _arguments529[0] : {};
                return _this544.loadMarkets();
            }).then(function () {
                return _this544.privateGetMembersMe();
            }).then(function (_resp) {
                response = _resp;
                balances = response['accounts'];
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    uppercase = currency.toUpperCase();
                    account = {
                        'free': parseFloat(balance['balance']),
                        'used': parseFloat(balance['locked']),
                        'total': 0.0
                    };

                    account['total'] = _this544.sum(account['free'], account['used']);
                    result[uppercase] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this545 = this,
                _arguments530 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments530.length > 1 && _arguments530[1] !== undefined ? _arguments530[1] : {};
                return _this545.loadMarkets();
            }).then(function () {
                p = _this545.market(market);
                return _this545.publicGetDepth(_this545.extend({
                    'market': p['id'],
                    'limit': 300
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = orderbook['timestamp'] * 1000;
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this545.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                result['bids'] = _this545.sortBy(result['bids'], 0, true);
                result['asks'] = _this545.sortBy(result['asks'], 0);
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = ticker['at'] * 1000;
            ticker = ticker['ticker'];
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['buy']),
                'ask': parseFloat(ticker['sell']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['vol']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                base,
                quote,
                _symbol5,
                ticker,
                _this546 = this;

            return Promise.resolve().then(function () {
                return _this546.loadMarkets();
            }).then(function () {
                return _this546.publicGetTickers();
            }).then(function (_resp) {
                tickers = _resp;
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = undefined;
                    symbol = id;

                    if (id in _this546.markets_by_id) {
                        market = _this546.markets_by_id[id];
                        symbol = market['symbol'];
                    } else {
                        base = id.slice(0, 3);
                        quote = id.slice(3, 6);

                        base = base.toUpperCase();
                        quote = quote.toUpperCase();
                        base = _this546.commonCurrencyCode(base);
                        quote = _this546.commonCurrencyCode(quote);
                        _symbol5 = base + '/' + quote;
                    }
                    ticker = tickers[id];

                    result[symbol] = _this546.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                response,
                _this547 = this;

            return Promise.resolve().then(function () {
                return _this547.loadMarkets();
            }).then(function () {
                p = _this547.market(market);
                return _this547.publicGetTickersMarket({
                    'market': p['id']
                });
            }).then(function (_resp) {
                response = _resp;

                return _this547.parseTicker(response, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                m,
                _this548 = this,
                _arguments533 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments533.length > 1 && _arguments533[1] !== undefined ? _arguments533[1] : {};
                return _this548.loadMarkets();
            }).then(function () {
                m = _this548.market(market);

                return _this548.publicGetTrades(_this548.extend({
                    'market': m['id']
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this549 = this,
                _arguments534 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments534.length > 4 && _arguments534[4] !== undefined ? _arguments534[4] : undefined;
                params = _arguments534.length > 5 && _arguments534[5] !== undefined ? _arguments534[5] : {};
                return _this549.loadMarkets();
            }).then(function () {
                order = {
                    'market': _this549.marketId(market),
                    'side': side,
                    'volume': amount.toString(),
                    'ord_type': type
                };

                if (type == 'limit') {
                    order['price'] = price.toString();
                }
                return _this549.privatePostOrders(_this549.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this550 = this;

            return Promise.resolve().then(function () {
                return _this550.loadMarkets();
            }).then(function () {
                return _this550.privatePostOrderDelete({ 'id': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                request,
                query,
                url,
                nonce,
                _query3,
                auth,
                signature,
                suffix,
                response,
                _this551 = this,
                _arguments536 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments536.length > 1 && _arguments536[1] !== undefined ? _arguments536[1] : 'public';
                method = _arguments536.length > 2 && _arguments536[2] !== undefined ? _arguments536[2] : 'GET';
                params = _arguments536.length > 3 && _arguments536[3] !== undefined ? _arguments536[3] : {};
                headers = _arguments536.length > 4 && _arguments536[4] !== undefined ? _arguments536[4] : undefined;
                body = _arguments536.length > 5 && _arguments536[5] !== undefined ? _arguments536[5] : undefined;
                request = '/api/' + _this551.version + '/' + _this551.implodeParams(path, params) + '.json';
                query = _this551.omit(params, _this551.extractParams(path));
                url = _this551.urls['api'] + request;

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this551.urlencode(query);
                    }
                } else {
                    nonce = _this551.nonce().toString();
                    _query3 = _this551.urlencode(_this551.keysort(_this551.extend({
                        'access_key': _this551.apiKey,
                        'tonce': nonce
                    }, params)));
                    auth = method + '|' + request + '|' + _query3;
                    signature = _this551.hmac(_this551.encode(auth), _this551.encode(_this551.secret));
                    suffix = _query3 + '&signature=' + signature;

                    if (method == 'GET') {
                        url += '?' + suffix;
                    } else {
                        body = suffix;
                        headers = {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Content-Length': body.length
                        };
                    }
                }
                return _this551.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    throw new ExchangeError(_this551.id + ' ' + _this551.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var zaif = {

        'id': 'zaif',
        'name': 'Zaif',
        'countries': 'JP',
        'rateLimit': 2000,
        'version': '1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766927-39ca2ada-5eeb-11e7-972f-1b4199518ca6.jpg',
            'api': 'https://api.zaif.jp',
            'www': 'https://zaif.jp',
            'doc': ['http://techbureau-api-document.readthedocs.io/ja/latest/index.html', 'https://corp.zaif.jp/api-docs', 'https://corp.zaif.jp/api-docs/api_links', 'https://www.npmjs.com/package/zaif.jp', 'https://github.com/you21979/node-zaif']
        },
        'api': {
            'public': {
                'get': ['depth/{pair}', 'currencies/{pair}', 'currencies/all', 'currency_pairs/{pair}', 'currency_pairs/all', 'last_price/{pair}', 'ticker/{pair}', 'trades/{pair}']
            },
            'private': {
                'post': ['active_orders', 'cancel_order', 'deposit_history', 'get_id_info', 'get_info', 'get_info2', 'get_personal_info', 'trade', 'trade_history', 'withdraw', 'withdraw_history']
            },
            'ecapi': {
                'post': ['createInvoice', 'getInvoice', 'getInvoiceIdsByOrderNumber', 'cancelInvoice']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                symbol,
                _symbol$split17,
                _symbol$split18,
                base,
                quote,
                _this552 = this;

            return Promise.resolve().then(function () {
                return _this552.publicGetCurrencyPairsAll();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['currency_pair'];
                    symbol = market['name'];
                    _symbol$split17 = symbol.split('/');
                    _symbol$split18 = _slicedToArray(_symbol$split17, 2);
                    base = _symbol$split18[0];
                    quote = _symbol$split18[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var params,
                response,
                balances,
                result,
                currencies,
                c,
                currency,
                balance,
                uppercase,
                account,
                _this553 = this,
                _arguments538 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments538.length > 0 && _arguments538[0] !== undefined ? _arguments538[0] : {};
                return _this553.loadMarkets();
            }).then(function () {
                return _this553.privatePostGetInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['return'];
                result = { 'info': balances };
                currencies = Object.keys(balances['funds']);

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    balance = balances['funds'][currency];
                    uppercase = currency.toUpperCase();
                    account = {
                        'free': balance,
                        'used': 0.0,
                        'total': balance
                    };

                    if ('deposit' in balances) {
                        if (currency in balances['deposit']) {
                            account['total'] = balances['deposit'][currency];
                            account['used'] = account['total'] - account['free'];
                        }
                    }
                    result[uppercase] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                _this554 = this,
                _arguments539 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments539.length > 1 && _arguments539[1] !== undefined ? _arguments539[1] : {};
                return _this554.loadMarkets();
            }).then(function () {
                return _this554.publicGetDepthPair(_this554.extend({
                    'pair': _this554.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this554.milliseconds();
                result = {
                    'bids': orderbook['bids'],
                    'asks': orderbook['asks'],
                    'timestamp': timestamp,
                    'datetime': _this554.iso8601(timestamp)
                };

                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this555 = this;

            return Promise.resolve().then(function () {
                return _this555.loadMarkets();
            }).then(function () {
                return _this555.publicGetTickerPair({
                    'pair': _this555.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this555.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this555.iso8601(timestamp),
                    'high': ticker['high'],
                    'low': ticker['low'],
                    'bid': ticker['bid'],
                    'ask': ticker['ask'],
                    'vwap': ticker['vwap'],
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': ticker['last'],
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': ticker['volume'],
                    'info': ticker
                };
            });
        },
        parseTrade: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var side = trade['trade_type'] == 'bid' ? 'buy' : 'sell';
            var timestamp = trade['date'] * 1000;
            var id = undefined;
            if ('id' in trade) {
                id = trade['id'];
            } else if ('tid' in trade) {
                id = trade['tid'];
            }
            if (!market) market = this.markets_by_id[trade['currency_pair']];
            return {
                'id': id.toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': side,
                'price': trade['price'],
                'amount': trade['amount']
            };
        },
        fetchTrades: function fetchTrades(symbol) {
            var params,
                market,
                response,
                _this556 = this,
                _arguments541 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments541.length > 1 && _arguments541[1] !== undefined ? _arguments541[1] : {};
                return _this556.loadMarkets();
            }).then(function () {
                market = _this556.market(symbol);
                return _this556.publicGetTradesPair(_this556.extend({
                    'pair': market['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return _this556.parseTrades(response, market);
            });
        },
        createOrder: function createOrder(symbol, type, side, amount) {
            var price,
                params,
                response,
                _this557 = this,
                _arguments542 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments542.length > 4 && _arguments542[4] !== undefined ? _arguments542[4] : undefined;
                params = _arguments542.length > 5 && _arguments542[5] !== undefined ? _arguments542[5] : {};
                return _this557.loadMarkets();
            }).then(function () {
                if (type == 'market') {
                    throw new ExchangeError(_this557.id + ' allows limit orders only');
                }return _this557.privatePostTrade(_this557.extend({
                    'currency_pair': _this557.marketId(symbol),
                    'action': side == 'buy' ? 'bid' : 'ask',
                    'amount': amount,
                    'price': price
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['return']['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this558 = this,
                _arguments543 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments543.length > 1 && _arguments543[1] !== undefined ? _arguments543[1] : {};
                return _this558.loadMarkets();
            }).then(function () {
                return _this558.privatePostCancelOrder(_this558.extend({
                    'order_id': id
                }, params));
            });
        },
        parseOrder: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var side = order['action'] == 'bid' ? 'buy' : 'sell';
            var timestamp = parseInt(order['timestamp']) * 1000;
            if (!market) market = this.markets_by_id[order['currency_pair']];
            return {
                'id': order['id'].toString(),
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'status': 'open',
                'symbol': market['symbol'],
                'type': 'limit',
                'side': side,
                'price': order['price'],
                'amount': order['amount'],
                'trades': undefined
            };
        },
        parseOrders: function parseOrders(orders) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var ids = Object.keys(orders);
            var result = [];
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var order = orders[id];
                var extended = this.extend(order, { 'id': id });
                result.push(this.parseOrder(extended, market));
            }
            return result;
        },
        fetchOpenOrders: function fetchOpenOrders() {
            var symbol,
                params,
                market,
                request,
                response,
                _this559 = this,
                _arguments544 = arguments;

            return Promise.resolve().then(function () {
                symbol = _arguments544.length > 0 && _arguments544[0] !== undefined ? _arguments544[0] : undefined;
                params = _arguments544.length > 1 && _arguments544[1] !== undefined ? _arguments544[1] : {};
                market = undefined;
                // let request = {
                //     'is_token': false,
                //     'is_token_both': false,
                // };

                request = {};

                if (symbol) {
                    market = _this559.market(symbol);
                    request['currency_pair'] = market['id'];
                }
                return _this559.privatePostActiveOrders(_this559.extend(request, params));
            }).then(function (_resp) {
                response = _resp;

                return _this559.parseOrders(response['return'], market);
            });
        },
        fetchClosedOrders: function fetchClosedOrders() {
            var symbol,
                params,
                market,
                request,
                response,
                _this560 = this,
                _arguments545 = arguments;

            return Promise.resolve().then(function () {
                symbol = _arguments545.length > 0 && _arguments545[0] !== undefined ? _arguments545[0] : undefined;
                params = _arguments545.length > 1 && _arguments545[1] !== undefined ? _arguments545[1] : {};
                market = undefined;
                // let request = {
                //     'from': 0,
                //     'count': 1000,
                //     'from_id': 0,
                //     'end_id': 1000,
                //     'order': 'DESC',
                //     'since': 1503821051,
                //     'end': 1503821051,
                //     'is_token': false,
                // };

                request = {};

                if (symbol) {
                    market = _this560.market(symbol);
                    request['currency_pair'] = market['id'];
                }
                return _this560.privatePostTradeHistory(_this560.extend(request, params));
            }).then(function (_resp) {
                response = _resp;

                return _this560.parseOrders(response['return'], market);
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                response,
                _this561 = this,
                _arguments546 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments546.length > 1 && _arguments546[1] !== undefined ? _arguments546[1] : 'api';
                method = _arguments546.length > 2 && _arguments546[2] !== undefined ? _arguments546[2] : 'GET';
                params = _arguments546.length > 3 && _arguments546[3] !== undefined ? _arguments546[3] : {};
                headers = _arguments546.length > 4 && _arguments546[4] !== undefined ? _arguments546[4] : undefined;
                body = _arguments546.length > 5 && _arguments546[5] !== undefined ? _arguments546[5] : undefined;
                url = _this561.urls['api'] + '/';

                if (api == 'public') {
                    url += 'api/' + _this561.version + '/' + _this561.implodeParams(path, params);
                } else {
                    url += api == 'ecapi' ? 'ecapi' : 'tapi';
                    nonce = _this561.nonce();

                    body = _this561.urlencode(_this561.extend({
                        'method': path,
                        'nonce': nonce
                    }, params));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length,
                        'Key': _this561.apiKey,
                        'Sign': _this561.hmac(_this561.encode(body), _this561.encode(_this561.secret), 'sha512')
                    };
                }
                return _this561.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    throw new ExchangeError(_this561.id + ' ' + response['error']);
                }if ('success' in response) {
                    if (!response['success']) {
                        throw new ExchangeError(_this561.id + ' ' + _this561.json(response));
                    }
                }return response;
            });
        }
    };

    //=============================================================================

    var exchanges = {

        '_1broker': _1broker,
        '_1btcxe': _1btcxe,
        'anxpro': anxpro,
        'binance': binance,
        'bit2c': bit2c,
        'bitbay': bitbay,
        'bitbays': bitbays,
        'bitcoincoid': bitcoincoid,
        'bitfinex': bitfinex,
        'bitflyer': bitflyer,
        'bitlish': bitlish,
        'bitmarket': bitmarket,
        'bitmex': bitmex,
        'bitso': bitso,
        'bitstamp': bitstamp,
        'bittrex': bittrex,
        'bl3p': bl3p,
        'btcchina': btcchina,
        'btce': btce,
        'btcexchange': btcexchange,
        'btcmarkets': btcmarkets,
        'btctradeua': btctradeua,
        'btcturk': btcturk,
        'btcx': btcx,
        'bter': bter,
        'bxinth': bxinth,
        'ccex': ccex,
        'cex': cex,
        'chbtc': chbtc,
        'chilebit': chilebit,
        'coincheck': coincheck,
        'coinfloor': coinfloor,
        'coingi': coingi,
        'coinmarketcap': coinmarketcap,
        'coinmate': coinmate,
        'coinsecure': coinsecure,
        'coinspot': coinspot,
        'cryptopia': cryptopia,
        'dsx': dsx,
        'exmo': exmo,
        'flowbtc': flowbtc,
        'foxbit': foxbit,
        'fybse': fybse,
        'fybsg': fybsg,
        'gatecoin': gatecoin,
        'gdax': gdax,
        'gemini': gemini,
        'hitbtc': hitbtc,
        'huobi': huobi,
        'itbit': itbit,
        'jubi': jubi,
        'kraken': kraken,
        'lakebtc': lakebtc,
        'livecoin': livecoin,
        'liqui': liqui,
        'luno': luno,
        'mercado': mercado,
        'okcoincny': okcoincny,
        'okcoinusd': okcoinusd,
        'okex': okex,
        'paymium': paymium,
        'poloniex': poloniex,
        'quadrigacx': quadrigacx,
        'quoine': quoine,
        'southxchange': southxchange,
        'surbitcoin': surbitcoin,
        'therock': therock,
        'urdubit': urdubit,
        'vaultoro': vaultoro,
        'vbtc': vbtc,
        'virwox': virwox,
        'xbtce': xbtce,
        'yobit': yobit,
        'yunbi': yunbi,
        'zaif': zaif
    };

    var defineAllExchanges = function defineAllExchanges(exchanges) {
        var result = {};

        var _loop3 = function _loop3(id) {
            result[id] = function (params) {
                return new Exchange(extend(exchanges[id], params));
            };
        };

        for (var id in exchanges) {
            _loop3(id);
        }result.exchanges = Object.keys(exchanges);
        return result;
    };

    //-----------------------------------------------------------------------------

    var ccxt = Object.assign(defineAllExchanges(exchanges), {

        version: version,

        // exceptions

        CCXTError: CCXTError,
        ExchangeError: ExchangeError,
        NotSupported: NotSupported,
        AuthenticationError: AuthenticationError,
        InsufficientFunds: InsufficientFunds,
        NetworkError: NetworkError,
        DDoSProtection: DDoSProtection,
        RequestTimeout: RequestTimeout,
        ExchangeNotAvailable: ExchangeNotAvailable,

        // common utility functions

        sleep: sleep,
        timeout: timeout,
        capitalize: capitalize,
        keysort: keysort,
        extend: extend,
        omit: omit,
        indexBy: indexBy,
        sortBy: sortBy,
        flatten: flatten,
        unique: unique,
        pluck: pluck,
        urlencode: urlencode,
        sum: sum,
        decimal: decimal,

        // underscore aliases

        index_by: indexBy,
        sort_by: sortBy,

        // crypto functions

        binaryConcat: binaryConcat,
        stringToBinary: stringToBinary,
        binaryToString: binaryToString,
        stringToBase64: stringToBase64,
        utf16ToBase64: utf16ToBase64,
        base64ToBinary: base64ToBinary,
        base64ToString: base64ToString,
        urlencodeBase64: urlencodeBase64,
        hash: hash,
        hmac: hmac,
        jwt: jwt

    });

    //-----------------------------------------------------------------------------

    if (isCommonJS) {

        module.exports = ccxt;
    } else {

        window.ccxt = ccxt;
    }

    //-----------------------------------------------------------------------------
})(); // end of namespace
