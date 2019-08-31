'use strict'

const { currencies, cache } = require('../cache')

function convert(from, to) {
  return from.rate / to.rate
}

function average(currency) {
  const rates = cache.getRates(currency) || []

  const sum = rates.map(({ rate }) => rate)
    .reduce((rate1, rate2) => rate1 + rate2, 0)

  return sum / rates.length || 0
}

module.exports = {
  currencies, convert, average
}