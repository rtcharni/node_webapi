var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json());

Room = require('./models/room');
Item = require('./models/item');
User = require('./models/user');

//Connect to mogoose
mongoose.connect('mongodb://localhost/shopping', { useNewUrlParser: true });
var db = mongoose.connection;

app.get('/', (req, res) => {
    res.send('Please go to /api/rooms')
});

app.get('/api/rooms', (req, res) => {
    Room.getRooms((err, rooms) => {
        if (err) {
            throw err;
        }
        res.json(rooms);
    });
});

app.post('/api/rooms', (req, res) => {
    var room = {
        name: req.body.name,
        items: []

    }
    Room.addRoom(room, (err, room) => {
        if (err) {
            throw err;
        }
        res.json(room);
    });
});

app.get('/api/items', (req, res) => {
    Item.getItems((err, items) => {
        if (err) {
            throw err;
        }
        res.json(items);
    });
});

app.get('/api/items/:_id', (req, res) => {
    Item.getItemById(req.params._id, (err, item) => {
        if (err) {
            throw err;
        }
        res.json(item);
    });
});


app.post('/api/users', (req, res) => {
    const user = {
        name: req.body.name,
        rooms: []
    }
    User.addUser(user, (err, newUser) => {
        if (err) {
            throw err;
        }
        res.json(newUser);
    });
});

app.listen(3000);
console.log('Running!');