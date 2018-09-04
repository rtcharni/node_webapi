var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to mogoose
mongoose.connect('mongodb://localhost/shopping', {useNewUrlParser : true});
var db = mongoose.connection;

app.get('/', (req, res) => {
    res.send('Hello world!!')
});

app.listen(3000);
console.log('Running!');