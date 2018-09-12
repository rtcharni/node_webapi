var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var handleResponse = require('./utils/response-handler');
var addRoomtoUserMiddleware = require('./models/user').addRoomtoUserMiddleware;
var getUserMiddleware = require('./models/user').getUserMiddleware;
var getUserByName = require('./models/user').getUserByName;
var getRoomByName = require('./models/room').getRoomByName;
var getRoomByNameMiddleware = require('./models/room').getRoomByNameMiddleware;
var getItemsFromRoom = require('./models/room').getItemsFromRoom;
var addUser = require('./models/user').addUser;
var getItems = require('./models/item').getItems;
var jwt = require('jsonwebtoken');

app.use(cors());
app.use(bodyParser.json());

Room = require('./models/room');
Item = require('./models/item');
User = require('./models/user').User;

//Connect to mogoose
mongoose.connect('mongodb://localhost/shopping', { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
var db = mongoose.connection;

//Token Implementation
app.post('/api/login', (req, res) => {
    //Test User
    let user = {
        id: 1,
        username: 'Roman',
        email: 'roman@jotain.com'
    }
    //Generate Token
    jwt.sign({ user }, 'Salaisuus', {expiresIn: '15m'}, (err, token) => {
        res.send({
            token: token
        })

    })
})

//Token format: Authorization: Bearer <token>
const verifyToken = (req, res, next) => {
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        //Split at the space
        const bearer = bearerHeader.split(' ');
        //Get Token
        const bearerToken = bearer[1];
        //Set the Token
        req.token = bearerToken;
        //Next middleware
        next();
    } else {
        //Forbidden
        res.send({ message: 'Forbidden' });
    }
}


app.get('/', (req, res) => {
    res.send('This is secret path, you will be tracked and hunted, pray and RUN!!');
});

app.get('/api/rooms/:roomname', (req, res) => {
    Room.getRoomByName(req.params.roomname, (err, room) => {
        if (err) {res.json(err)}
        else {res.json(room)}
    })
})

//Get all Rooms //Verify otettu POIS!
app.get('/api/rooms', (req, res) => {
    // jwt.verify(req.token, 'Salaisuus', (err, authdata) => {

    //     if (err) res.send({ message: `Error, ${err}` })
    //     else {
    //         Room.getRooms((err, rooms) => {
    //             if (err) {
    //                 res.send(err);
    //             }
    //             res.json({authdata:authdata, rooms:rooms});
    //         });
    //     }
    // });
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
        ready: req.body.ready
    }
    Room.addItemToRoom(req.params.roomname, newItem, {}, (err, data) => {
        res.json(data);
    })
});

app.put('/api/rooms/:roomname/items/:id', (req, res) => {
    const updatedItem = {
        _id: req.params.id,
        name: req.body.name,
        room: req.params.roomname,
        brand: req.body.brand,
        qty: req.body.qty,
        unit: req.body.unit,
        ready: req.body.ready
    }
    // updateItemInRoom(req.params.id, updatedItem, (err, done) => {
    //     if (err) {res.send(err)}
    //     else {res.json(done)}
    // })

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
            res.send({ Not_Found: req.params.roomname })
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
            res.send({ User_Not_Found: req.params.username })
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
    res.send({ Task: 'Completed' });
    //handleResponse()
})


app.listen(3000);
console.log('Running! on port ' + 3000);