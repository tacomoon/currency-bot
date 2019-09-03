'use strict'

const fs = require('fs')
const path = require('path')

const RUB = 'RUB'
const currencies = ['USD', 'EUR', 'CZK', RUB]

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

function write(path, state) {
  fs.writeFileSync(path, JSON.stringify(state, null, 2))
}

class Cache {
  constructor() {
    console.log('Creating cache')
    this.path = path.join(cacheRoot, 'state.json')

    if (!fs.existsSync(cacheRoot)) {
      fs.mkdirSync(cacheRoot)
    }

    if (!fs.existsSync(this.path)) {
      write(this.path, { offset: 0, subscribers: [], currencies: {} })
    }
  }

  getOffset() {
    const state = read(this.path)
    return state.offset
  }

  updateOffset(offset) {
    console.log(`Updating offset: ${offset}`)

    const state = read(this.path)
    if (!state.offset) {
      state.offset = 0
    }

    state.offset = offset
    write(this.path, state)
  }

  getSubscribers() {
    const state = read(this.path)
    return state.subscribers
  }

  saveSubscriber(subscriber) {
    console.log(`Saving subscriber: ${subscriber}`)

    const state = read(this.path)
    if (!state.subscribers) {
      state.subscribers = []
    }

    state.subscribers.push(subscriber)
    write(this.path, state)
  }

  removeSubscriber(subscriber) {
    console.log(`Removing subscriber: ${subscriber}`)

    const state = read(this.path)
    if (!state.subscribers) {
      return
    }

    state.subscribers.filter(sub => sub === subscriber)
    write(this.path, state)
  }

  getRates(currency) {
    const state = read(this.path)
    return state.currencies[currency]
  }

  saveRate(currency, rate, timestamp) {
    console.log(`Saving ${currency}, rate: ${rate}, timestamp: ${timestamp}`)

    const state = read(this.path)
    if (!state.currencies) {
      state.currencies = {}
    }
    if (!state.currencies[currency]) {
      state.currencies[currency] = []
    }

    state.currencies[currency].push({ rate, timestamp })
    write(this.path, state)
  }
}

module.exports = {
  RUB, currencies, cache: new Cache()
}