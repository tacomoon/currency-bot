'use strict'

const { cache } = require('./cache')
const { sendMessage } = require('./telegram')
const { currencies, average } = require('./rates')

const cron = require('node-cron')
const axios = require('axios')
const express = require('express')


const app = new express()
const PORT = process.env.PORT || 3000
const RATES_TOKEN = process.env.RATES_TOKEN

cron.schedule('0 0 * * * *', () => {
    console.log('Scheduling rates update')

    requestRates()
  }, {}
)

cron.schedule('0 0 9 * * *', () => {
  console.log('Scheduling report')

  cache.getSubscribers()
    .forEach(subscriber => sendMessage(subscriber, buildReport()))

}, {})

app.get('/', (request, response) => {
  const report = buildReport()

  response.send(report)
})

app.listen(PORT, () => {
  console.log('Listening on port 3000')

  requestRates()
})

function buildReport() {
  const report = {}

  for (let i = 0; i < currencies.length; i++) {
    const currency = currencies[i]
    report[currency] = average(currency)
  }

  return JSON.stringify(report, null, 2)
}

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