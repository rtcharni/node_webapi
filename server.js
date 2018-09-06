var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var handleResponse = require('./utils/response-handler');
var addRoomtoUser = require('./models/user').addRoomtoUser;
var getUser = require('./models/user').getUser;
var getRoomByName = require('./models/room').getRoomByName;

app.use(bodyParser.json());

Room = require('./models/room');
Item = require('./models/item');
User = require('./models/user');

//Connect to mogoose
mongoose.connect('mongodb://localhost/shopping', { useNewUrlParser: true });
mongoose.set('useFindAndModify',false);

var db = mongoose.connection;

app.get('/', (req, res) => {
    res.send('Please go to /api/rooms')
});

//Get all Rooms
app.get('/api/rooms', (req, res) => {
    Room.getRooms((err, rooms) => {
        if (err) {
            throw err;
        }
        res.json(rooms);
    });
});

//New Room
app.post('/api/rooms', (req, res) => {
    var room = {
        name: req.body.name,
        items: []
    }
    Room.addRoom(room, (err, newRoom) => {
        if (err) {
            //Here when room already exist
            res.json(err);
        } else {
            res.json(newRoom);
        }
    });
});

//Item to room
app.post('/api/rooms/:_roomname/items', (req, res) => {
    const newItem = {
        name: req.body.name,
        room: req.params._roomname,
        brand: req.body.brand,
        qty: req.body.qty,
        unit: req.body.unit,
    }
    Room.addItemToRoom(req.params._roomname, newItem, {}, (err, data) => {
        res.json(data);
    })
});

//Add item to Room
app.post('/api/items', (req, res) => {
    const newItem = {
        name: req.body.name,
        room: req.body.roomname,
        brand: req.body.brand,
        qty: req.body.qty,
        unit: req.body.unit,
    }
    Room.addItemToRoom(req.body.roomname, newItem, {}, (err, data) => {
        res.json(data);
    })
})

//Get all Items
app.get('/api/items', (req, res) => {
    Item.getItems((err, items) => {
        if (err) {
            throw err;
        }
        res.json(items);
    });
});

//Add new User
app.post('/api/users', (req, res) => {
    const user = {
        name: req.body.name,
        rooms: []
    }
    User.addUser(user, (err, newUser) => {
        if (err) {
            //handleResponse({}) MATS
            //Here when user already exist
            res.json(err);
        } else {
            res.json(newUser);
        }
    });
});

//Add User to Room
app.post('/api/rooms/:roomname/users/:username', getRoomByName, getUser, addRoomtoUser, (req, res) => {
    res.send({Task: 'Competed'});
    //handleResponse()
})


app.listen(3000);
console.log('Running! on port ' + 3000);