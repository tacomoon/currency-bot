'use strict'

const { cache, currencies, rub } = require('./cache')
const { sendMessage } = require('./telegram')
const { findRate, latestRate, minimumRate, maximumRate } = require('./rates')

const cron = require('node-cron')
const axios = require('axios')
const express = require('express')


const PORT = process.env.PORT || 3000
const RATES_TOKEN = process.env.RATES_TOKEN

const app = new express()

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

  const curs = currencies.filter(({ currency }) => currency !== base)

  for (let i = 0; i < curs.length; i++) {
    const currency = curs[i]

    const latest = latestRate(currency)
    const minimum = minimumRate(currency)
    const maximum = maximumRate(currency)

    report[currency] = {
      latest: latest.rate,
      minimum: minimum.rate,
      maximum: maximum.rate
    }
  }

  return JSON.stringify(report, null, 2)
}