'use strict'

const cron = require('node-cron')
const express = require('express')
const { cache, RUB } = require('./cache')
const { pullRates } = require('./rates')
const { buildReport } = require('./report')
const { pullMessages, sendMessage } = require('./telegram')

const PORT = process.env.PORT || 3000

// Pull currency rates every hour
cron.schedule('0 0 * * * *', async () => pullRates(), {})
// Pull messages from telegram every minute
cron.schedule('0 */1 * * * *', async () => pullMessages(), {})
// Build and send report at 9 AM every day
cron.schedule('0 0 9 * * *', () => {
  console.log('Scheduling report')

  cache.getSubscribers()
    .forEach(subscriber => sendMessage(subscriber, buildReport(RUB)))

}, {})

const app = new express()
app.get('/', (request, response) => {
  const report = buildReport(RUB)
  response.send(report)
})

app.listen(PORT, () => {
  console.log('Listening on port 3000')

  pullRates()
})