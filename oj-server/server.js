const express = require('express'); // import express package
const app = express(); // create http application
const restRouter = require('./routes/rest');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');

const path = require('path');

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
  res.sendFile('index.html', { root:path.join(__dirname, '../public')});
})

app.listen(3000, () => {
  console.log('我爱沙怡霄！');
});
