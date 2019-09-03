'use strict'

const { pullRates } = require('./client')
const { findRate, findLatestRate, findMinimumRate, findMaximumRate } = require('./statistic')

module.exports = {
  pullRates, findRate, findLatestRate, findMinimumRate, findMaximumRate
}