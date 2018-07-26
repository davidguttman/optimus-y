# Optimus Y

Pulls options data from Yahoo Finance.

Usage:

```js

optimus({symbol}, function (err, data) {
  console.log(data)
  // [
  //   { contractName: 'FB180727C00155000',
  //     lastTradeDate: '2018-07-19 12:05PM EDT',
  //     strike: '155.00',
  //     lastPrice: '53.94',
  //     bid: '54.15',
  //     ask: '56.00',
  //     change: '0.00',
  //     changePercent: '-',
  //     volume: '1',
  //     openInterest: '3',
  //     impliedVolatility: '100.98%',
  //     type: 'call',
  //     expirationDate: '2018-07-27',
  //     expiresAt: '1532649600' },
  //     ...
  // ]
})
```
