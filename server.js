var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var handleResponse = require('./utils/response-handler');
var addRoomtoUserMiddleware = require('./models/user').addRoomtoUserMiddleware;
var getUserMiddleware = require('./models/user').getUserMiddleware;
var getUserByName = require('./models/user').getUserByName;
var getRoomByName = require('./models/room').getRoomByName;
var getRoomByNameMiddleware = require('./models/room').getRoomByNameMiddleware;
var getItemsFromRoom = require('./models/room').getItemsFromRoom;
var addUser = require('./models/user').addUser;
var getItems = require('./models/item').getItems;
app.use(bodyParser.json());

Room = require('./models/room');
Item = require('./models/item');
User = require('./models/user').User;

//Connect to mogoose
mongoose.connect('mongodb://localhost/shopping', { useNewUrlParser: true });
mongoose.set('useFindAndModify',false);

var db = mongoose.connection;

app.get('/',)

app.get('/', (req, res) => {
    res.send('This is secret path, you will be tracked and hunted, pray and RUN!!');
});

//Get all Rooms
app.get('/api/rooms', (req, res) => {
    Room.getRooms((err, rooms) => {
        if (err) {
            res.send(err);
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
app.post('/api/rooms/:roomname/items', (req, res) => {
    const newItem = {
        name: req.body.name,
        room: req.params.roomname,
        brand: req.body.brand,
        qty: req.body.qty,
        unit: req.body.unit,
    }
    Room.addItemToRoom(req.params.roomname, newItem, {}, (err, data) => {
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
    getItems((err, items) => {
        if (err) {
            res.send(err)
        } else {
            res.json(items);
        }
    });
});

//Get all Items from Room
app.get('/api/rooms/:roomname/items', (req, res) => {
    getItemsFromRoom(req.params.roomname, (err, items) => {
        if (err) {
            handleResponse(err);
        } else if (items.length === 0) {
            res.send({Not_Found: req.params.roomname})
        } else {
            res.json(items[0]);
        }
    })
})  

//Get one User
app.get('/api/users/:username', (req, res, next) => {
    getUserByName(req.params.username, (err, doc) => {
        if (err) {
            handleResponse(err);
        } else if (doc.length === 0) {
            res.send({User_Not_Found: req.params.username})
        } else {
            res.json(doc[0]);
        }
    })
})

//Add new User
app.post('/api/users', (req, res) => {
    const user = {
        name: req.body.name,
        rooms: []
    }
    addUser(user, (err, newUser) => {
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
app.post('/api/rooms/:roomname/users/:username', getRoomByNameMiddleware, getUserMiddleware, addRoomtoUserMiddleware, (req, res) => {
    res.send({Task: 'Completed'});
    //handleResponse()
})


app.listen(3000);
console.log('Running! on port ' + 3000);