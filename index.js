var request = require('request')
var cheerio = require('cheerio')

module.exports = function (opts, cb) {
  var {symbol} = opts
  var url = getUrl({symbol})
  request(url, function (err, res, body) {
    if (err) return cb(err)

    var $ = cheerio.load(body)

    var dates = getDates($)
    var date = dates.shift()

    var calls = getOptions({type: 'call', date}, $)
    var puts = getOptions({type: 'put', date}, $)

    console.log('puts', puts)


    // console.log(body.length)
  })
}

function getOptions (opts, $) {
  var type = opts.type
  var expiresAt = opts.date
  var expirationDate = new Date(1000 * expiresAt).toISOString().slice(0, 10)

  var columns = [
    'contractName', 'lastTradeDate', 'strike', 'lastPrice', 'bid', 'ask',
    'change', 'changePercent', 'volume', 'openInterest', 'impliedVolatility'
  ]

  var calls = []

  $(`.${type}s tr`).each(function (i, tr) {
    var row = {}
    $(this).find('td').each(function (j, td) {
      var col = columns[j]
      row[col] = $(td).text()
    })

    if (row.contractName) {
      row.type = type
      row.expirationDate = expirationDate
      row.expiresAt = expiresAt
      calls.push(row)
    }
  })

  return calls
}

function getDates ($) {
  var dates = []
  $('select option').each(function (i, el) {
    dates.push($(this).val())
  })
  return dates
}

function getUrl (opts) {
  var {symbol} = opts
  return `https://finance.yahoo.com/quote/${symbol}/options?p=${symbol}&straddle=false`
}
