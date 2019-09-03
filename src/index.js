'use strict'

const { cache, currencies, rub } = require('./cache')
const { pullMessages, sendMessage } = require('./telegram')
const { findRate, latestRate, minimumRate, maximumRate } = require('./rates')

const cron = require('node-cron')
const axios = require('axios')
const express = require('express')


const PORT = process.env.PORT || 3000
const RATES_TOKEN = process.env.RATES_TOKEN

const app = new express()

// Pull messages from telegram every minute
cron.schedule('0 */1 * * * *', () => pullMessages(), {})
// Pull currency rates every hour
cron.schedule('0 0 * * * *', () => {
    console.log('Scheduling rates update')

    requestRates()
  }, {}
)

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

  requestRates()
})

function requestRates() {
  axios.get(`https://openexchangerates.org/api/latest.json?app_id=${RATES_TOKEN}`)
    .then((response) => {
      const body = response.data
      console.log('Received data:\n' + JSON.stringify(body))

      const timestamp = body.timestamp
      for (let i = 0; i < currencies.length; i++) {
        const currency = currencies[i]
        const rate = body.rates[currency]

        cache.saveRate(currency, rate, timestamp)
      }
    })
}

function buildReport(base) {
  const report = {}

  const curs = currencies.filter(currency => currency !== base)

  for (let i = 0; i < curs.length; i++) {
    const currency = curs[i]

    const latest = latestRate(currency)
    const latestBase = findRate(base, latest.timestamp)

    const minimum = minimumRate(currency)
    const minimumBase = findRate(base, minimum.timestamp)

    const maximum = maximumRate(currency)
    const maximumBase = findRate(base, maximum.timestamp)

    report[currency] = {
      latest: Math.round(100 * latestBase.rate / latest.rate) / 100,
      minimum: Math.round(100 * minimumBase.rate / minimum.rate) / 100,
      maximum: Math.round(100 * maximumBase.rate / maximum.rate) / 100,
    }
  }

  const latest = latestRate(base)
  const date = new Date(latest.timestamp * 1000)
  const rates = JSON.stringify(report, null, 2)

  return `Report for ${date}\n${rates}`
}