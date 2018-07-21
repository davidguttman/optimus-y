var map = require('map-async')
var flatten = require('flatten')
var request = require('request')
var cheerio = require('cheerio')

module.exports = function fetchOptions (opts, cb) {
  var {symbol, date} = opts

  var url = getUrl({symbol, date})
  request(url, function (err, res, body) {
    if (err) return cb(err)

    var $ = cheerio.load(body)

    var dates = []

    if (!date) {
      dates = getDates($)
      date = dates.shift()
    }

    var calls = parseOptions({type: 'call', date}, $)
    var puts = parseOptions({type: 'put', date}, $)

    var dateOpts = dates.map(function (d) {
      return {symbol, date: d}
    })

    map(dateOpts, fetchOptions, function (err, grouped) {
      if (err) return cb(err)

      cb(null, flatten([calls, puts, grouped]))
    })
  })
}

function parseOptions (opts, $) {
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
  var {symbol, date} = opts
  var url = `https://finance.yahoo.com/quote/${symbol}/options?p=${symbol}&straddle=false`
  if (date) url += `&${date}`
  return url
}
