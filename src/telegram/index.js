'use strict'

const cron = require('node-cron')
const axios = require('axios')

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN

let offset = 0
let subscribers = []

cron.schedule('0 */1 * * * *', async () => {
  console.log('Scheduling pull messages')

  const updates = await getUpdates()
    .filter(({ update_id }) => update_id > offset)

  if (updates.length === 0) {
    return
  }

  console.log(`Handling updates: ${JSON.stringify(updates)}`)
  updates.map(({ message, update_id }) => {
    handleMessage(message)
    offset = update_id
  })
}, {})

function getSubscribers() {
  return subscribers
}

function getUpdates() {
  return axios.get(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${offset}`)
    .then(response => response.data.result)
}

function sendMessage(chat, message) {
  axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${chat}&text=${message}`)
    .then(() => console.log(`Sent message to chat ${chat}:\n${message}`))
}

function handleMessage({ text, chat }) {
  switch (text) {
    case '/subscribe':
      console.log(`Handling subscribe command for chat ${chat.id}`)

      subscribers.push(chat.id)
      sendMessage(chat.id, 'Successfully subscribed')
      break

    case '/unsubscribe':
      console.log(`Handling unsubscribe command for chat ${chat.id}`)

      subscribers.filter(sub => sub === chat.id)
      sendMessage(chat.id, 'Successfully unsubscribed')
      break

    default:
      console.log(`Unknown command from chat ${chat.id}: ${text}`)
      break
  }
}

module.exports = {
  sendMessage, getSubscribers
}