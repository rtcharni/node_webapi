var mongoose = require('mongoose');
var item = require('./item').itemSchema;
// var item = require('mongoose').model('Item', itemSchema).schema;
//var itemSchema = require('mongoose').model('Item',item.schema);

//Schema
var roomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items:
        [item]
    ,
    create_date: {
        type: Date,
        default: Date.now
    }
});

var Room = mongoose.model('Room', roomSchema);
module.exports.roomSchema = roomSchema;

// Get Rooms
module.exports.getRooms = (callback, limit) => {
    Room.find(callback).limit(limit);
}

//Get Room by Name LOCALS
module.exports.getRoomByName = (req, res, next) => {
    console.log('jotain')
    Room.find({name: req.params.roomname}, (err, docs) => {
        console.log(err)
        if (err) {
            handleResponse(err)
        } else {
            res.locals.room = docs;
            console.log(typeof docs)
            console.log(docs)
            next();
        }
    })
    // get room from db
    // when done, add room object to res.locals
    // call next middleware
}

//Get One Roomname
const getRoomByName =  (name, callback) => {
    Room.find({name: name}, callback);
}
module.exports.getRoomByName = getRoomByName;

//Get Items from Room
module.exports.getItemsFromRoom = (roomname, callback) => {
    Room.find({name: roomname}, callback);
}

// Add Room
module.exports.addRoom = (room, callback) => {
    getRoomByName(room.name, (err, foundRoom) => {
        if (err) {
            throw err;
        }
        if (foundRoom.length === 0) {
            Room.create(room, callback);
        } else {
            callback({

            });
        }
    })    
}

//Update Item to Room, Tarviiko?? Vai addItem ja assign to Room??
module.exports.addItemToRoom = (roomName, item, options, callback) => {
    Room.findOneAndUpdate({name: roomName}, {$push: {items:item}}, (err, room) => {
        if (err) {
            callback(err);
        } else {
            callback(err,room)
        }
    });
}
