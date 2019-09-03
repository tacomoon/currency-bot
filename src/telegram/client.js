'use strict'

const axios = require('axios')
const CLIENT_TOKEN = process.env.TELEGRAM_CLIENT_TOKEN | ''

function getUpdates() {
  const offset = cache.getOffset()
  console.log(`Getting messages from telegram with offset: ${offset}`)

  return axios.get(`https://api.telegram.org/bot${CLIENT_TOKEN}/getUpdates?offset=${offset}`)
    .then(response => response.data.result)
    .catch(err => {
      console.log(err.message)
      return []
    })
}

function sendMessage(chat, message) {
  console.log(`Sending message to chat ${chat}: ${message}`)

  axios.post(`https://api.telegram.org/bot${CLIENT_TOKEN}/sendMessage?chat_id=${chat}&text=${message}`)
    .then(() => console.log(`Sent message to chat ${chat}`))
    .catch(err => console.log(err.message))
}

module.exports = {
  getUpdates, sendMessage
}