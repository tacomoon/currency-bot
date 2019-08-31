'use strict'

const cron = require('node-cron')
const axios = require('axios')

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN

let messageOffset = 0
let subscribers = []

cron.schedule('0 */1 * * * *', async () => {
  console.log(`Scheduling pull messages`)

  const updates = await getUpdates()
  if (updates.length === 0) {
    return
  }

  console.log(`Handling updates: ${JSON.stringify(updates)}`)
  updates.slice(1)
    .map(update => {
      handleMessage(update.message)
      messageOffset = update.update_id
    })
}, {})

function getUpdates() {
  return axios.get(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${messageOffset}`)
    .then(response => response.data.result)
}

function sendMessage(chat, message) {
  axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${chat}&text=${message}`)
    .then(() => console.log(`Sent message to chat ${chat}:\n${message}`))
}

function handleMessage(message) {
  switch (message.text) {
    case '/subscribe':
      console.log(`Handling subscribe command for chat ${message.chat.id}`)

      subscribers.push(message.chat.id)
      sendMessage(message.chat.id, 'Successfully subscribed')
      break

    case '/unsubscribe':
      console.log(`Handling unsubscribe command for chat ${message.chat.id}`)

      subscribers.filter(sub => sub === message.chat.id)
      sendMessage(message.chat.id, 'Successfully unsubscribed')
      break

    default:
      console.log(`Unknown command from chat ${message.chat.id}`)

      sendMessage(message.chat.id, `Unknown command: ${message.text}`)
      break
  }
}