'use strict'

const axios = require('axios')
const CLIENT_TOKEN = process.env.TELEGRAM_CLIENT_TOKEN | ''

function getUpdates() {
  return axios.get(`https://api.telegram.org/bot${CLIENT_TOKEN}/getUpdates?offset=${cache.getOffset()}`)
    .then(response => response.data.result)
    .catch(() => [])
}

function sendMessage(chat, message) {
  axios.post(`https://api.telegram.org/bot${CLIENT_TOKEN}/sendMessage?chat_id=${chat}&text=${message}`)
    .then(() => console.log(`Sent message to chat ${chat}:\n${message}`))
    .catch(err => console.log(err))
}

module.exports = {
  getUpdates, sendMessage
}