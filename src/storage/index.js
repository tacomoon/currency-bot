'use strict'

const store = {}
const currencies = ['USD', 'EUR', 'CZK', 'RUB']

function convert(from, to) {
  return from.rate / to.rate
}

function save(currency, rate, timestamp) {
  const rates = store[currency] || []
  rates.push({ rate, timestamp })

  store[currency] = rates
    .filter(({ timestamp: ts }) => timestamp - ts <= 60 * 60 * 24)
}

function average(currency) {
  const rates = store[currency] || []

  const sum = rates
    .map(rate => rate.rate)
    .reduce((rate1, rate2) => rate1 + rate2, 0)

  return sum / rates.length || 0
}

module.exports = {
  currencies, save, convert, average
}