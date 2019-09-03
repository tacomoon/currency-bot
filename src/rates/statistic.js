'use strict'

const { cache } = require('../cache')

function findRate(currency, timestamp) {
  const rates = cache.getRates(currency)
  if (!rates || rates.length === 0) return 1

  return rates.find(rate => rate.timestamp === timestamp)
}

function findLatestRate(currency) {
  const rates = cache.getRates(currency)
  if (!rates || rates.length === 0) return undefined

  const sorted = rates
    .sort((rate1, rate2) => rate1.timestamp - rate2.timestamp)

  return sorted[0]
}

function findMinimumRate(currency) {
  const actual = _listActualRates(currency)
  if (!actual || actual.length === 0) return undefined

  return actual.reduce((rate1, rate2) => rate1.rate < rate2.rate ? rate1 : rate2)
}

function findMaximumRate(currency) {
  const actual = _listActualRates(currency)
  if (!actual || actual.length === 0) return undefined

  return actual.reduce((rate1, rate2) => rate1.rate > rate2.rate ? rate1 : rate2)
}

function _listActualRates(currency) {
  const latest = findLatestRate(currency)
  if (!latest) return undefined

  const rates = cache.getRates(currency)
  if (!rates || rates.length === 0) return undefined

  return rates.filter(rate => latest.timestamp - rate.timestamp <= 86400)
}

module.exports = {
  findRate, findLatestRate, findMinimumRate, findMaximumRate
}