'use strict'

const { store } = require('./store')
const { currencies, convert, average } = require('./rates')
const { getSubscribers, sendMessage } = require('./telegram')

const cron = require('node-cron')
const axios = require('axios')
const express = require('express')


const app = new express()
const RATES_TOKEN = process.env.RATES_TOKEN

cron.schedule('0 0 * * * *', () => {
    console.log('Scheduling rates update')

    requestRates()
  }, {}
)

// TODO [EG]: 9 am
cron.schedule('0 0 17 * * *', () => {
  console.log('Scheduling report')

  getSubscribers()
    .forEach(subscriber => sendMessage(subscriber, buildReport()))

}, {})

app.get('/', (request, response) => {
  const report = buildReport()

  response.send(report)
})

app.listen(3000, () => {
  console.log('Listening on port 3000')

  requestRates()
})

function buildReport() {
  const report = {}

  for (let i = 0; i < currencies.length; i++) {
    const currency = currencies[i]
    report[currency] = average(currency)
  }

  return JSON.stringify(report)
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

        store.saveRate(currency, rate, timestamp)
      }
    })
}