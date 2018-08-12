var map = require('map-async')
var request = require('request')

var extractData = require('./extract-data')

module.exports = function fetchOptions ({symbol}, cb) {
  var url = getUrl({symbol})
  request(url, function (err, res, body) {
    if (err) return cb(err)

    var {quote, options} = extractData(body)

    var dates = options.meta.expirationDates
    dates.shift()

    var {calls, puts} = options.contracts

    var dateOpts = dates.map(function (d) {
      return {symbol, date: d}
    })

    map(dateOpts, fetchDate, function (err, grouped) {
      if (err) return cb(err)

      var output = {quote, calls, puts}
      grouped.forEach(function (group) {
        group.calls.forEach(function (c) { output.calls.push(c) })
        group.puts.forEach(function (c) { output.puts.push(c) })
      })

      cb(null, output)
    })
  })
}

function fetchDate ({symbol, date}, cb) {
  var url = getUrl({symbol, date})
  request(url, function (err, res, body) {
    if (err) return cb(err)

    var {options} = extractData(body)
    var {calls, puts} = options.contracts

    cb(null, {calls, puts})
  })
}

function getUrl (opts) {
  var {symbol, date} = opts
  var url = `https://finance.yahoo.com/quote/${symbol}/options?p=${symbol}&straddle=false`
  if (date) url += `&date=${date}`
  return url
}
