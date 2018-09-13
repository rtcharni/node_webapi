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
module.exports.getRooms = (callback) => {
    Room.find(callback);
}

//Get Room by Name MIDDLEWARE
module.exports.getRoomByNameMiddleware = (req, res, next) => {
    Room.find({name: req.params.roomname}, (err, docs) => {
        if (err) {
            handleResponse(err)
        } else if (!docs.length) {
            //send 204 empty res
        } else {
            res.locals.room = docs[0];
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
            callback(err);
        }
        if (foundRoom.length === 0) {
            Room.create(room, callback);
        } else {
            callback({Room_Already_Exist: foundRoom[0].name})
        }
    })    
}

//Add Item to Room
module.exports.addItemToRoom = (roomName, item, callback) => {
    Room.findOneAndUpdate({name: roomName}, {$push: {items:item}}, {new: true}, (err, room) => {
        if (err) {
            callback(err);
        } else {
            callback(err,room)
        }
    });
}

module.exports.updateItem = (item, callback) => {
    // Item.findByIdAndUpdate(item._id, { $set: { name: item.name } }, {new: true}, callback);
    // Item.findByIdAndUpdate(item._id, item, {new: true}, callback);
    // Item.update({_id: item._id}, { $set: { name: item.name } }, callback);
    Room.findOneAndUpdate({name: item.room, "items._id": item._id  }, { $set: { "items.$": item } }, {new: true}, callback);
}

module.exports.deleteItem = (item, callback) => {
    Room.findOneAndUpdate({name: item.room }, { $pull: { items: { _id: item._id } } }, {new: true}, callback);
}
