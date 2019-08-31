'use strict'

const fs = require('fs')

class Store {
  constructor(path) {
    console.log('Creating store')
    this.path = path
  }

  getState(key) {
    const state = require(this.path)

    return key ? state[key] : state
  }

  saveState(key, value) {
    console.log(`Updating store, key: ${key}, value: ${value}`)

    const state = this.getState()
    state[key] = value

    fs.writeFile(this.path, JSON.stringify(state))
  }
}

module.exports = {
  store: new Store('store/state.json')
}