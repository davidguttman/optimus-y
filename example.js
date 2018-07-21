require('replay').mode = 'record'

var ss = require('serialize-stream')
var pump = require('pump')
var intoStream = require('into-stream').obj

var optimus = require('./')

var symbol = process.argv[2]
if (!symbol) {
  console.error('Please provide symbol')
  process.exit(1)
}

optimus({symbol}, function (err, data) {
  if (err) return console.error(err)

  var headers = [
    'type',
    'expirationDate',
    'strike',
    'lastPrice',
    'bid',
    'ask',
    'change',
    'changePercent',
    'volume',
    'openInterest',
    'impliedVolatility',
    'lastTradeDate',
    'contractName'
  ]

  pump(intoStream(data), ss('csv', {headers}), process.stdout, function (err) {
    if (err) return console.error(err)
  })
})
