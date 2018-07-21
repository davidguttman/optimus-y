require('replay')
// .mode = 'record'

var optimus = require('./')

optimus({symbol: 'AAPL'}, function (err, data) {
  if (err) return console.error(err)

  console.log('data', data)
})
