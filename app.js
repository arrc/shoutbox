"use strict"
require("dotenv").config({path: ".env"})

// Modules
const express = require("express")
const app = express()
const server = require("http").createServer(app)
const io = require("socket.io")(server)
const path = require("path")
const consolidate = require("consolidate")
const swig = require("swig")
const bodyParser = require("body-parser")

// Express config
app.set("showStackError", true)
app.engine("html", consolidate.swig)
app.set("view engine", "html")
app.set("views", path.resolve("server/views"))
app.use('/static', express.static(__dirname + '/dist'));
app.use('/vendor', express.static(__dirname + '/client/vendor'))

// Home / Index page
app.get('/', (req, res, next) => {
	res.render('index', { title: ">>> Shoutbox <<<" })
})

// Start
server.listen(4000, () => {
	console.log('listing on port *:4000')
})

// Socket stuff!
io.on('connection', (client) => {
    console.log('Client connected...');
    
    client.on('client:msg', (data) => {
        console.log('message received on server', data)
    })
})