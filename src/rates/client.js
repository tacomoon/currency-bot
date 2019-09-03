'use strict'

const axios = require('axios')
const { currencies, cache } = require('../cache')
const CLIENT_TOKEN = process.env.EXCHANGE_CLIENT_TOKEN || ''

async function pullRates() {
  const { timestamp, rates } = await _getRates()
  if (!timestamp || !rates) return

  for (let i = 0; i < currencies.length; i++) {
    const currency = currencies[i]
    const rate = rates[currency]

    cache.saveRate(currency, rate, timestamp)
  }
}

function _getRates() {
  console.log('Getting rates update')

  return axios.get(`https://openexchangerates.org/api/latest.json?app_id=${CLIENT_TOKEN}`)
    .then(response => {
      console.log(`Received rates: ${JSON.stringify(response.data)}`)
      return response.data
    })
    .catch((err) => {
      console.log(err)
      return {}
    })
}

module.exports = {
  pullRates
}