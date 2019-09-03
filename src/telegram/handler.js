'use strict'

const { cache } = require('../cache')
const { getUpdates, sendMessage } = require('./client')

function pullMessages() {
  console.log('Pulling messages from telegram')

  const updates = getUpdates()
    .filter(update => update.update_id > cache.getOffset())

  if (updates.length === 0) return

  console.log(`Handling updates: ${JSON.stringify(updates)}`)
  for (let i = 0; i < updates.length; i++) {
    const { update_id, message } = updates[i]
    _handleMessage(message)
    cache.updateOffset(update_id)
  }
}

function _handleMessage(message) {
  const { text, chat } = message
  console.log(`Handling command for chat ${chat.id}: ${text}`)

  switch (text) {
    case '/subscribe':
      console.log(`Handling subscribe command for chat ${chat.id}`)

      cache.saveSubscriber(chat.id)
      sendMessage(chat.id, 'Successfully subscribed')
      break

    case '/unsubscribe':
      console.log(`Handling unsubscribe command for chat ${chat.id}`)

      cache.removeSubscriber(chat.id)
      sendMessage(chat.id, 'Successfully unsubscribed')
      break

    default:
      console.log(`Unknown command from chat ${chat.id}: ${text}`)
      break
  }
}

module.exports = {
  pullMessages
}