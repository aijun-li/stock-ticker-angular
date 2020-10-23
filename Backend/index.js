const express = require('express')
const app = express()
const fetch = require('node-fetch')
const path = require('path')
const cors = require('cors')

app.use(cors())
app.use(express.static(path.join(__dirname, 'static')))

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

// Route for retrieving meta info
app.get('/api/details/meta/:ticker', async (req, res) => {
  let metaRes = await fetch(
    `${TIINGO_BASE}/tiingo/daily/${req.params.ticker}?token=${TIINGO_TOKEN}`
  )
  let metaInfo = await metaRes.json()
  res.send(metaInfo)
})

// Route for retrieving latest prices
app.get('/api/details/latest/:ticker', async (req, res) => {
  let latestRes = await fetch(`${TIINGO_BASE}/iex/${req.params.ticker}?token=${TIINGO_TOKEN}`)
  let latestInfo = await latestRes.json()
  res.send(latestInfo)
})

// Route for retrieving historical prices
app.get('/api/details/prices/:ticker/:startDate/:freq', async (req, res) => {
  let pricesRes = await fetch(
    `${TIINGO_BASE}/iex/${req.params.ticker}/prices?startDate=${req.params.startDate}&resampleFreq=${req.params.freq}&token=${TIINGO_TOKEN}&columns=open,high,low,close,volume`
  )
  let pricesInfo = await pricesRes.json()
  res.send(pricesInfo)
})

// Route for retrieving top news
app.get('/api/news/:ticker', async (req, res) => {
  let newsRes = await fetch(`${NEWS_BASE}/everything?q=${req.params.ticker}&apiKey=${NEWS_TOKEN}`)
  let newsInfo = await newsRes.json()
  res.send(
    newsInfo.articles
      .filter(
        item =>
          item.url &&
          item.title &&
          item.description &&
          item.source &&
          item.urlToImage &&
          item.publishedAt
      )
      .slice(0, 20)
      .map(item => ({
        url: item.url,
        title: item.title,
        desc: item.description,
        source: item.source.name,
        img: item.urlToImage,
        date: item.publishedAt
      }))
  )
})

// Route for spa
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'))
})

app.listen(3000, () => {
  console.log('Start listening!')
})
