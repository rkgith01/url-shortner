require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const originalUrl= []
const shortUrl = []

app.post('/api/shorturl', function(req, res) {
  const url = req.body.url
  const getIndex = originalUrl.indexOf(url)
  // console.log({getIndex})
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  let checkValue1 = url.includes("https://")
  let checkValue2 = url.includes("http://")
  if(!checkValue1 && !checkValue2){
    let error = {
      "error": "invalid url"
    }
    res.json(error)
  }

  if(getIndex < 0) {
    originalUrl.push(url)
    shortUrl.push(shortUrl.length)
    const items = {
      "original_url": url,
      "short_url": shortUrl.length - 1
    }
    return res.json(items)
  }

  const mainItems = {
    "original_url": url,
    "short_url": shortUrl[getIndex]
  }
  console.log(url)
 return res.json(mainItems)
})


app.get('/api/shorturl/:shortUrl', function(req, res) {
  const newUrl = req.params.shortUrl
  const getnewIndex = shortUrl.indexOf(Number(newUrl))

  if(getnewIndex < 0) {
    return res.json({
      "error": "No short url found"
    })
  }
  return res.redirect(originalUrl[getnewIndex])
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

