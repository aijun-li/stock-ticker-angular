const express = require('express')
const app = express()
const fetch = require('node-fetch')

const TIINGO_TOKEN = 'ded10bb46330604d17568c0c6bc1319a67c1e400'
const TIINGO_BASE = 'https://api.tiingo.com'
const NEWS_TOKEN = '597f84a7826648f5b8b1c586945b7e26'
const NEWS_BASE = 'https://newsapi.org/v2'

// Route for autocomplete
app.get('/api/suggestions/:ticker', async (req, res) => {
  let response = await fetch(
    `${TIINGO_BASE}/tiingo/utilities/search/${req.params.ticker}?token=${TIINGO_TOKEN}`
  )
  let suggestions = await response.json()
  suggestions = suggestions
    .filter(sug => sug.name && sug.ticker)
    .slice(0, 10)
    .map(sug => ({
      ticker: sug.ticker,
      name: sug.name
    }))
  res.send(suggestions)
})

app.listen(3000, () => {
  console.log('Start listening!')
})
