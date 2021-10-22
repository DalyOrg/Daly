const express = require('express')
const { toHttp } = require('./common/toHttp')
const { HelloWorld } = require('./controllers/HelloWorldController')
const app = express()
const port = 3000

app.get('/', toHttp(HelloWorld));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})