const express = require('express'); // import express package
const app = express(); // create http application
const restRouter = require('./routes/rest');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');

const path = require('path');

var http = require('http');
var socketIO = require('socket.io');
var io = socketIO();
var editorSocketService = require('./services/editorSocketService')(io);
mongoose.connect('mongodb://yutianz:zyt930615@ds145304.mlab.com:45304/1805', {useNewUrlParser: true});

// response for GET request when url matches '/'
// send 'Hello world from express' to client no matter what the
//request is
app.get('/', (req, res) => {
   res.send('Hello world from express！');
});

app.use(express.static(path.join(__dirname, '../public')));
//express.static middle. make the server to serve static fileReplacements
//__dirname: current path where the file is located
app.use('/api/v1', restRouter);
// launch application, listen on port 3000

app.use((req, res) => {
  res.sendFile('index.html', {root: path.join(__dirname, '../public')});
})

 const server = http.createServer(app);
 io.attach(server);
 server.listen(3000);
 server.on('listening', () => {
   console.log('App is listening to port 3000! Selina!')
 })
// app.listen(3000, () => {
//   console.log('我爱沙怡霄！');
// });
