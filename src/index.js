'use strict'

require('./telegram')
const cron = require('node-cron')
const axios = require('axios')
const express = require('express')
const { currencies, save, convert, average } = require('./storage')

const app = new express()
const RATES_TOKEN = process.env.RATES_TOKEN

cron.schedule('0 0 * * * *', () => requestRates(), {})

app.get('/', (request, response) => {
  const result = {}

  for (let i = 0; i < currencies.length; i++) {
    const currency = currencies[i]
    result[currency] = average(currency)
  }

  response.send(JSON.stringify(result))
})

app.listen(3000, () => {
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

        save(currency, rate, timestamp)
      }
    })
}