require('replay').mode = 'record'

var optimus = require('./')

var symbol = process.argv[2]
if (!symbol) {
  console.error('Please provide symbol')
  process.exit(1)
}

optimus({symbol}, function (err, data) {
  if (err) return console.error(err)

  console.dir(data)
})
