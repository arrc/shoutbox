"use strict"
require("dotenv").config({path: ".env"})

const express          = require("express")
const app              = express()
const server = require("http").createServer(app)
const io = require("socket.io")(server)
const path             = require("path")
const consolidate      = require("consolidate")
const swig             = require("swig")
const bodyParser       = require("body-parser")
const mongoose = require("mongoose");
const shortid = require('shortid');

mongoose.Promise = require("bluebird")
require("./server/mongoose.js")

const messageSchema = mongoose.Schema({
	message: { type: String, required: true},
	username: { type: String },
	createdAt: { type: Date, default: Date.now}
});

const Message = mongoose.model('Message', messageSchema);

app.set("showStackError", true)
app.engine("html", consolidate.swig)
app.set("view engine", "html")
app.set("views", path.resolve("server/views"))
app.use('/static', express.static(__dirname + '/dist'));
app.use('/vendor', express.static(__dirname + '/client/vendor'))

app.get('/', (req, res, next) => {
	res.render('index', { title: ">>> Shoutbox <<<" })
})

server.listen(4000, () => {
	console.log('listing on port *:4000')
})

io.on('connection', (client) => {
	console.log('Client connected...');
	client['username'] = shortid.generate();

	Message.find({}).sort('createdAt').limit(30).exec((err, docs) => {
		if(err) return client.emit('server:error', { code: 400, message: 'Server error.' })
		client.emit('server:msgHistory', docs);
	});

	client.on('client:msg', function(data) {
		Message.create({ message: data, username: client.username }, function(err, messageDoc){
			if (err) return client.emit('server:error', { code: 400, message: 'message not sent, please try again.' })
			io.emit('server:msg', messageDoc);
		})
	})
})