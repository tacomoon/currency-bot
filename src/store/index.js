'use strict'

const fs = require('fs')

const currencies = ['USD', 'EUR', 'CZK', 'RUB']

class Store {
  constructor(path) {
    console.log('Creating store')
    this.path = path
  }

  getRates(currency) {
    const state = require(this.path)

    return state['currencies'][currency]
  }

  saveRate(currency, rate, timestamp) {
    const state = require(this.path)
    state['currencies'][currency].push({ rate, timestamp })

    fs.writeFile(this.path, JSON.stringify(state))
  }
}

module.exports = {
  currencies,
  store: new Store('store/state.json')
}