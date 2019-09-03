'use strict'

const { currencies } = require('../cache')
const { findRate, findLatestRate, findMinimumRate, findMaximumRate } = require('../rates')

function buildReport(base) {
  const report = {}

  const curs = currencies.filter(currency => currency !== base)

  for (let i = 0; i < curs.length; i++) {
    const currency = curs[i]

    const latest = findLatestRate(currency)
    const latestBase = findRate(base, latest.timestamp)

    const minimum = findMinimumRate(currency)
    const minimumBase = findRate(base, minimum.timestamp)

    const maximum = findMaximumRate(currency)
    const maximumBase = findRate(base, maximum.timestamp)

    report[currency] = {
      latest: Math.round(100 * latestBase.rate / latest.rate) / 100,
      minimum: Math.round(100 * minimumBase.rate / minimum.rate) / 100,
      maximum: Math.round(100 * maximumBase.rate / maximum.rate) / 100,
    }
  }

  const latest = findLatestRate(base)
  const date = new Date(latest.timestamp * 1000)
  const rates = JSON.stringify(report, null, 2)

  return `Report for ${date}\n${rates}`
}

module.exports = {
  buildReport
}