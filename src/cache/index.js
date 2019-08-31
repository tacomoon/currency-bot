'use strict'

const fs = require('fs')
const path = require('path')

const currencies = ['USD', 'EUR', 'CZK', 'RUB']
const cacheRoot = path.join(__dirname, '../../.cache')

function read(path) {
  try {
    return require(path)
  } catch (ex) {
    if (ex.code === 'MODULE_NOT_FOUND') {
      return {}
    }

    throw ex
  }
}

class Cache {
  constructor() {
    console.log('Creating cache')
    this.path = path.join(cacheRoot, 'state.json')

    if (!fs.existsSync(cacheRoot)) {
      fs.mkdirSync(cacheRoot)
    }

    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, '{}')
    }
  }

  getRates(currency) {
    const state = read(this.path)

    return state['currencies'][currency]
  }

  saveRate(currency, rate, timestamp) {
    console.log(`Saving ${currency}, rate: ${rate}, timestamp: ${timestamp}`)

    const state = read(this.path)
    if (!state['currencies']) {
      state['currencies'] = {}
    }
    if (!state['currencies'][currency]) {
      state['currencies'][currency] = []
    }

    state['currencies'][currency].push({ rate, timestamp })

    fs.writeFileSync(this.path, JSON.stringify(state, null, 2))
  }
}

module.exports = {
  currencies,
  cache: new Cache()
}