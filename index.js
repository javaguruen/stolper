const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const port = process.env.PORT || 3000
const app = express()
app.use(serveStatic(__dirname + "/dist"));
app.listen(port)
