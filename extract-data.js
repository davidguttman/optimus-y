var _ = require('lodash')

module.exports = function extractData (html) {
  var dataLine = html.split('\n').filter(l => l.match('root.App.main = {'))[0]

  var root = {App: {main: {}}}
  eval(dataLine) // eslint-disable-line
  var data = _.get(root, 'App.main')
  var stores = _.get(data, 'context.dispatcher.stores')

  var quote = _.get(stores, 'QuoteSummaryStore')
  var options = _.get(stores, 'OptionContractsStore')

  return {quote, options}
}
