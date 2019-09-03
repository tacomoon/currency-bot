'use strict'

const { sendMessage } = require('./client')
const { pullMessages } = require('./handler')

module.exports = {
  pullMessages, sendMessage
}