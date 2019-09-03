'use strict'

const { cache, currencies, rub } = require('./cache')
const { pullMessages, sendMessage } = require('./telegram')
const { pullRates, findRate, findLatestRate, findMinimumRate, findMaximumRate } = require('./rates')

const cron = require('node-cron')
const express = require('express')
const PORT = process.env.PORT || 3000

const app = new express()

// Pull currency rates every hour
cron.schedule('0 0 * * * *', async () => pullRates(), {})
// Pull messages from telegram every minute
cron.schedule('0 */1 * * * *', async () => pullMessages(), {})

cron.schedule('0 0 9 * * *', () => {
  console.log('Scheduling report')

  cache.getSubscribers()
    .forEach(subscriber => sendMessage(subscriber, buildReport(rub)))

}, {})

app.get('/', (request, response) => {
  const report = buildReport(rub)

  response.send(report)
})

app.listen(PORT, () => {
  console.log('Listening on port 3000')

  pullRates()
})

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